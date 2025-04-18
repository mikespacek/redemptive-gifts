/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use static export for Netlify
  output: 'export',

  // Enable trailing slashes for better compatibility
  trailingSlash: true,

  // Disable strict mode for now to avoid double rendering in development
  reactStrictMode: false,

  // Configure images for static export
  images: {
    unoptimized: true,
  },

  // Enable source maps in production
  productionBrowserSourceMaps: true,

  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable TypeScript checking during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Environment variables
  env: {
    // Google Sheets is now the primary database
    NEXT_PUBLIC_GOOGLE_SHEET_URL: process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL,
    NEXT_PUBLIC_ADMIN_EMAIL: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'mikespacek@unionhouston.com'
  },
};

module.exports = nextConfig;
