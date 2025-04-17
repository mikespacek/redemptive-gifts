/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  // Ensure Tailwind CSS is properly configured
  eslint: {
    // Ignore ESLint errors during production build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during production build
    ignoreBuildErrors: true,
  },
  // Output configuration
  output: 'standalone',
  // Handle environment variable for the Convex URL
  env: {
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL || 'https://example.convex.cloud',
  },
  // Experimental options
  experimental: {
    // Ensure all pages are server components by default
    appDocumentPreloading: false
  },
  // These are now top-level options in Next.js 13+
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,
  // Disable image optimization during build
  images: {
    disableStaticImages: true,
    unoptimized: true
  },
  // Disables linting during builds
  onDemandEntries: {
    // Disable on demand entries
    maxInactiveAge: 0
  }
};

export default nextConfig;
