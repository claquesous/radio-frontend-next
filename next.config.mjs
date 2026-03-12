/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['icecast-metadata-player'],
  async rewrites() {
    const backendUrl = process.env.RADIO_BACKEND_PATH || 'http://localhost:3000'
    const icecastUrl = process.env.ICECAST_URL || 'http://localhost:8000'
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
      {
        source: '/streams/:path*',
        destination: `${icecastUrl}/:path*`,
      },
    ]
  },
};

export default nextConfig;
