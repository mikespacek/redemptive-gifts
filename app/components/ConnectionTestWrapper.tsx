"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import the connection test component with no SSR
const ConvexConnectionTest = dynamic(
  () => import('./ConvexConnectionTest'),
  { ssr: false }
);

export default function ConnectionTestWrapper() {
  const [isDevMode, setIsDevMode] = useState(false);
  
  useEffect(() => {
    // Check if we're in development mode
    setIsDevMode(process.env.NODE_ENV !== 'production');
  }, []);
  
  // Only render in development mode
  if (!isDevMode) {
    return null;
  }
  
  return <ConvexConnectionTest />;
}
