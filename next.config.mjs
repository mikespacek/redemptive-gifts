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
};

export default nextConfig;
