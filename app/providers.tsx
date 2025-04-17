"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useEffect, useState } from "react";

// Create a Convex client using the URL from the environment
// Only create the client if the URL is available (preventing build errors)
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || 'https://example.convex.cloud';

// Log the Convex URL for debugging
console.log("Convex URL:", convexUrl);

// Create the client outside of the component to avoid recreation on renders
let convex: ConvexReactClient;

// Only create the client in the browser environment
if (typeof window !== 'undefined') {
  convex = new ConvexReactClient(convexUrl);
}

export function Providers({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Convex is properly initialized
    if (!convex) {
      setError("Convex client not initialized. Please check your environment variables.");
      return;
    }

    // Add a connection status listener
    const unsubscribe = convex.onStatusChange((status) => {
      console.log("Convex connection status:", status);
      setIsConnected(status === "connected");

      if (status === "error") {
        setError("Error connecting to Convex. Please check your network connection and try again.");
      } else if (status === "disconnected") {
        setError("Disconnected from Convex. Attempting to reconnect...");
      } else if (status === "connected") {
        setError(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Show an error message if there's a connection issue
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Connection Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <p className="text-gray-600 text-sm">If this issue persists, please contact support.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}