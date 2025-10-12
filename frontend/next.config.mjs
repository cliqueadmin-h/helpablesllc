/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.azurewebsites.net',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'helpablesllc-production.up.railway.app',
        pathname: '/uploads/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/revalidate',
        destination: '/api/revalidate/route',
      },
    ];
  },
};

export default nextConfig;
