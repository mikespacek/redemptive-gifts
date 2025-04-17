// Direct Convex configuration
// This file provides a direct configuration for the Convex URL
// to ensure it's available even if environment variables fail

// Primary Convex URL
export const CONVEX_URL = "https://jmcepmahvxhizfkxhfrb.convex.cloud";

// Backup URLs in case the primary one fails
export const BACKUP_CONVEX_URLS = [
  "https://jmcepmahvxhizfkxhfrb.convex.cloud", // Same as primary for redundancy
  "https://jmcepmahvxhizfkxhfrb.us-east-2.convex.site" // Alternative format
];

// Function to get the Convex URL from various sources
export function getConvexUrl() {
  // First try environment variable
  if (typeof process !== 'undefined' &&
      process.env &&
      process.env.NEXT_PUBLIC_CONVEX_URL) {
    console.log('Using Convex URL from environment variable:', process.env.NEXT_PUBLIC_CONVEX_URL);
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
        console.log('Using Convex URL from __NEXT_DATA__:', nextData.props.pageProps.convexUrl);
        return nextData.props.pageProps.convexUrl;
      }
    } catch (e) {
      console.error('Error accessing window.__NEXT_DATA__:', e);
    }

    // Try to get from localStorage if previously saved
    try {
      const savedUrl = localStorage.getItem('convex_url');
      if (savedUrl) {
        console.log('Using Convex URL from localStorage:', savedUrl);
        return savedUrl;
      }
    } catch (e) {
      console.error('Error accessing localStorage:', e);
    }
  }

  // Finally, use the hardcoded URL
  console.log('Using hardcoded Convex URL:', CONVEX_URL);

  // Save to localStorage for future use
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('convex_url', CONVEX_URL);
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }

  return CONVEX_URL;
}

// Function to try connecting with multiple URLs
export async function tryConnectWithUrls() {
  // First try the primary URL
  const primaryUrl = getConvexUrl();

  // Return an array of URLs to try in order
  return [primaryUrl, ...BACKUP_CONVEX_URLS];
}
