"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useEffect, useState } from "react";

// Hardcoded Convex URL as a fallback
const FALLBACK_CONVEX_URL = 'https://jmcepmahvxhizfkxhfrb.convex.cloud';

// Get Convex URL from environment or use fallback
const getConvexUrl = () => {
  // Check for environment variable
  if (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_CONVEX_URL) {
    return process.env.NEXT_PUBLIC_CONVEX_URL;
  }

  // Check for window.__NEXT_DATA__.props.pageProps.convexUrl (Netlify might inject it here)
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

  // Use fallback URL
  return FALLBACK_CONVEX_URL;
};

// Get the Convex URL
const convexUrl = getConvexUrl();

// Log the Convex URL for debugging
console.log("Convex URL being used:", convexUrl);

// Create the client outside of the component to avoid recreation on renders
let convex: ConvexReactClient;

// Only create the client in the browser environment
if (typeof window !== 'undefined') {
  try {
    convex = new ConvexReactClient(convexUrl);
    console.log("Convex client created successfully");
  } catch (error) {
    console.error("Error creating Convex client:", error);
  }
}

export function Providers({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Convex is properly initialized
    if (!convex) {
      console.error("Convex client not initialized");
      setError("Connection error. The database client could not be initialized. Please refresh the page or try again later.");
      return;
    }

    // Add a connection status listener
    try {
      const unsubscribe = convex.onStatusChange((status) => {
        console.log("Convex connection status:", status);
        setIsConnected(status === "connected");

        if (status === "error") {
          setError("Error connecting to the database. Please check your network connection and try again.");
        } else if (status === "disconnected") {
          setError("Disconnected from the database. Attempting to reconnect...");
        } else if (status === "connected") {
          setError(null);
        }
      });

      return () => {
        try {
          unsubscribe();
        } catch (error) {
          console.error("Error unsubscribing from status changes:", error);
        }
      };
    } catch (error) {
      console.error("Error setting up connection status listener:", error);
      setError("Error monitoring connection status. Please refresh the page.");
      return () => {};
    }
  }, []);

  // Show an error message if there's a connection issue
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Connection Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <p className="text-gray-600 text-sm mb-4">Technical details: Using Convex URL: {convexUrl}</p>
          <p className="text-gray-600 text-sm">If this issue persists, please contact support.</p>
          <div className="mt-6 space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors"
            >
              Retry Connection
            </button>
            <a
              href="/"
              className="block w-full text-center bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
            >
              Return to Home Page
            </a>
          </div>
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