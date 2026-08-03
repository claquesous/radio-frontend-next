This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Deploying with SST

`sst.config.ts` deploys this app to Lambda/CloudFront and adds the host running
the backend and streaming as a second CloudFront origin, so `/api/*` and
`/streams/*` are served same-origin.

No host names or account details are committed. Supply them per deploy target,
either in the environment or by copying `.env.example` to `.env` /
`.env.<stage>`, which SST loads automatically and `.gitignore` excludes:

| Variable | Required | Purpose |
|---|---|---|
| `RADIO_ORIGIN_DOMAIN` | yes | Host serving `/api` and `/streams`, e.g. `origin.example.com` |
| `RADIO_SITE_DOMAIN` | no | Public host for the site. Unset means the deploy is reachable only at its generated `*.cloudfront.net` name |
| `RADIO_SITE_CERT_ARN` | no | ACM certificate ARN, us-east-1. Set when DNS is hosted outside Route53 (see below) |
| `RADIO_BACKEND_PATH` | no | Server-side API base for the Next.js app. Defaults to `https://$RADIO_ORIGIN_DOMAIN/api` |
| `AWS_REGION` | no | Deploy region. Falls back to the usual AWS SDK resolution (`AWS_PROFILE`, `~/.aws/config`) |

```bash
npx sst deploy --stage production
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
