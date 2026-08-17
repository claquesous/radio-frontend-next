// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

/**
 * Reads a required environment variable, failing fast with an actionable
 * message. Nothing environment specific is committed here — every deploy
 * target supplies its own values.
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} is not set. Deploys need it to know which host serves ` +
        `/api and /streams (e.g. ${name}=radio.example.com sst deploy).`
    );
  }
  return value;
}

export default $config({
  app(input) {
    return {
      name: "claqradio-frontend",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          // Falls back to the usual AWS SDK resolution (AWS_REGION,
          // AWS_PROFILE, ~/.aws/config) when unset.
          region: process.env.AWS_REGION as aws.Region | undefined,
        },
      },
    };
  },
  async run() {
    // Host running the Rails backend and Icecast, fronted by nginx.
    const originDomain = required("RADIO_ORIGIN_DOMAIN");
    const backendPath =
      process.env.RADIO_BACKEND_PATH ?? `https://${originDomain}/api`;

    // Public host for the site itself. Optional: without it the deploy is
    // reachable only at the generated *.cloudfront.net name. It must never be
    // the same host as RADIO_ORIGIN_DOMAIN — the /api and /streams behaviors
    // below point at that name, so a shared value makes CloudFront its own
    // origin and the two behaviors loop.
    const siteDomain = process.env.RADIO_SITE_DOMAIN;

    // ACM certificate ARN, us-east-1. Set this when the domain's DNS is hosted
    // somewhere SST cannot write records: SST then skips record creation and
    // the DNS entries are added by hand. Leave unset for a Route53-hosted
    // domain and SST requests the certificate and writes the records itself.
    const siteCertArn = process.env.RADIO_SITE_CERT_ARN;

    if (siteDomain && siteDomain === originDomain) {
      throw new Error(
        `RADIO_SITE_DOMAIN and RADIO_ORIGIN_DOMAIN are both ${siteDomain}. ` +
          `The origin must be a separate host (e.g. origin.${siteDomain}), ` +
          `or CloudFront will fetch /api and /streams from itself.`
      );
    }

    const radioOrigin = {
      domainName: originDomain,
      originId: "radio-origin",
      customOriginConfig: {
        httpPort: 80,
        httpsPort: 443,
        originSslProtocols: ["TLSv1.2"],
        originProtocolPolicy: "https-only",
      },
    };

    // CloudFront's AWS-managed policies, resolved by name instead of pasted in
    // as UUIDs. The IDs are the same in every account and region, so either
    // works — but a name states which policy is meant, and a typo fails at
    // deploy time rather than silently attaching the wrong policy.
    // `id` is optional on both lookup results (every argument to them is), so
    // it is narrowed here — a managed policy queried by name always has one,
    // and a name that matches nothing fails the lookup outright.
    const cachingDisabledId = aws.cloudfront
      .getCachePolicyOutput({ name: "Managed-CachingDisabled" })
      .apply((policy) => policy.id!);
    const allViewerExceptHostId = aws.cloudfront
      .getOriginRequestPolicyOutput({ name: "Managed-AllViewerExceptHostHeader" })
      .apply((policy) => policy.id!);

    const site = new sst.aws.Nextjs("ClaqRadioFrontend", {
      ...(siteDomain
        ? {
            domain: {
              name: siteDomain,
              // Both names on one distribution. `redirects` would stand up a
              // second distribution, which needs a DNS record SST cannot write
              // when dns is false — an alias keeps it to one record per name.
              aliases: [`www.${siteDomain}`],
              ...(siteCertArn
                ? { cert: siteCertArn, dns: false as const }
                : { dns: sst.aws.dns() }),
            },
          }
        : {}),
      environment: {
        RADIO_BACKEND_PATH: backendPath,
        // Tracks the build, not the deploy target: `sst dev` runs the real Next
        // dev server, while every stage we deploy ships a `next build` artifact.
        // Deriving this from $app.stage instead would be wrong — a stage named
        // "dev" still gets a production build, and shipping NODE_ENV=development
        // to Lambda 502s the server function. Lambda does not set NODE_ENV and
        // OpenNext never assigns it, so React's index.js takes its development
        // branch and requires cjs/react.development.js, which Next.js tracing
        // (correctly) does not bundle — MODULE_NOT_FOUND at cold start.
        NODE_ENV: $dev ? "development" : "production",
      },
      transform: {
        cdn: (options) => {
          options.origins = $resolve(options.origins).apply((val) => [
            ...val,
            radioOrigin,
          ]);

          options.orderedCacheBehaviors = $resolve(
            options.orderedCacheBehaviors || []
          ).apply((val) => [
            // /api/* → Rails backend (all methods, no caching)
            {
              pathPattern: "/api/*",
              targetOriginId: radioOrigin.originId,
              viewerProtocolPolicy: "redirect-to-https",
              allowedMethods: [
                "DELETE",
                "GET",
                "HEAD",
                "OPTIONS",
                "PATCH",
                "POST",
                "PUT",
              ],
              cachedMethods: ["GET", "HEAD"],
              forwardedValues: {
                queryString: true,
                headers: ["Authorization", "Content-Type", "Origin"],
                cookies: { forward: "all" },
              },
              compress: true,
              defaultTtl: 0,
              maxTtl: 0,
              minTtl: 0,
            },
            // /streams/* → Icecast (no caching, no compression for audio).
            //
            // Managed policies rather than legacy `forwardedValues`. The player
            // sends `Icy-MetaData: 1`, and Icecast only returns `icy-metaint`
            // and interleaves ICY metadata into the audio when it sees that
            // header — so it has to survive the hop to the origin. The legacy
            // `headers: ["*"]` did not deliver it: cookies still arrived (they
            // travel via their own `forward: "all"`, which is why nginx's
            // auth_request kept passing), but the audio came back with no
            // metadata in it at all and `onMetadata` never fired.
            //
            // AllViewerExceptHostHeader, not AllViewer: it forwards every
            // viewer header, cookie and query string but leaves Host set to the
            // origin's own name, which is what nginx's server_name matches.
            {
              pathPattern: "/streams/*",
              targetOriginId: radioOrigin.originId,
              viewerProtocolPolicy: "redirect-to-https",
              allowedMethods: ["GET", "HEAD", "OPTIONS"],
              cachedMethods: ["GET", "HEAD"],
              cachePolicyId: cachingDisabledId,
              originRequestPolicyId: allViewerExceptHostId,
              compress: false,
            },
            ...val,
          ]);
        },
      },
    });

    return {
      url: site.url,
      // The distribution's own *.cloudfront.net name. Always reachable, and the
      // target the DNS records point at when they are maintained by hand.
      // Undefined only if the site is ever put behind a shared Router.
      distribution: site.nodes.cdn?.nodes.distribution.domainName,
    };
  },
});
