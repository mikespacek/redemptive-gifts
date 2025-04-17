// Direct Convex configuration
// This file provides a direct configuration for the Convex URL
// to ensure it's available even if environment variables fail

export const CONVEX_URL = "https://jmcepmahvxhizfkxhfrb.convex.cloud";

// Function to get the Convex URL from various sources
export function getConvexUrl() {
  // First try environment variable
  if (typeof process !== 'undefined' && 
      process.env && 
      process.env.NEXT_PUBLIC_CONVEX_URL) {
    return process.env.NEXT_PUBLIC_CONVEX_URL;
  }
  
  // Then try window.__NEXT_DATA__ (Netlify might inject it here)
  if (typeof window !== 'undefined') {
    try {
      // @ts-ignore - TypeScript doesn't know about __NEXT_DATA__
      const nextData = window.__NEXT_DATA__;
      if (nextData && 
          nextData.props && 
          nextData.props.pageProps && 
          nextData.props.pageProps.convexUrl) {
        return nextData.props.pageProps.convexUrl;
      }
    } catch (e) {
      console.error('Error accessing window.__NEXT_DATA__:', e);
    }
  }
  
  // Finally, use the hardcoded URL
  return CONVEX_URL;
}
