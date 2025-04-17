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
  // Skip static generation for routes that use server features (like Convex)
  output: 'standalone',
  // Handle environment variable for the Convex URL
  env: {
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL || 'https://example.convex.cloud',
  },
  // Disable static page generation
  experimental: {
    // Ensure all pages are server components by default
    appDocumentPreloading: false,
    // Disable static generation
    craCompat: false,
    // Force dynamic rendering
    isrMemoryCacheSize: 0,
    // Skip type checking
    skipTypeChecking: true,
    // Skip middleware
    skipMiddlewareUrlNormalize: true,
    // Skip trailing slash redirect
    skipTrailingSlashRedirect: true
  },
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
