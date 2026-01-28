/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Temporarily disabled for development
  // basePath: '/sale', // Disabled for local dev - enable for production deployment
  // assetPrefix: '/sale/', // Disabled for local dev - enable for production deployment
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

module.exports = nextConfig;
