/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'your-vercel-app.vercel.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  experimental: {
    serverActions: true,
  },
};

// Ensure database URL is set for production
if (process.env.NODE_ENV === 'production') {
  if (!process.env.DATABASE_URL) {
    console.warn('Warning: DATABASE_URL is not set in production');
  }
}

module.exports = nextConfig;
