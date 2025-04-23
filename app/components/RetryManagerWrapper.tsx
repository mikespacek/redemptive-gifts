'use client';

import dynamic from 'next/dynamic';

// Dynamically import the RetryManager component with no SSR
// This ensures it only runs on the client side
const RetryManager = dynamic(
  () => import('./RetryManager'),
  { ssr: false }
);

/**
 * RetryManagerWrapper component
 * 
 * This component wraps the RetryManager to ensure it only runs on the client side.
 * It should be included in the app's layout or main component.
 */
export default function RetryManagerWrapper() {
  return <RetryManager />;
}
