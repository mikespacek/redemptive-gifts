"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

// Create a Convex client using the URL from the environment
// Only create the client if the URL is available (preventing build errors)
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || 'https://example.convex.cloud';
const convex = new ConvexReactClient(convexUrl);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
} 