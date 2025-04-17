"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useEffect, useState } from "react";

// Import the direct Convex configuration
import { CONVEX_URL, getConvexUrl } from './convex-config';

// Hardcoded Convex URL as a fallback (for backward compatibility)
const FALLBACK_CONVEX_URL = CONVEX_URL;

// Get the Convex URL
const convexUrl = getConvexUrl();

// Log the Convex URL for debugging
console.log("Convex URL being used:", convexUrl);

// Create the client outside of the component to avoid recreation on renders
let convex: ConvexReactClient;

// Only create the client in the browser environment
let convexInitialized = false;
if (typeof window !== 'undefined') {
  try {
    // Create the client with a more robust approach
    convex = new ConvexReactClient(convexUrl);
    convexInitialized = true;
    console.log("Convex client created successfully with URL:", convexUrl);
  } catch (error) {
    console.error("Error creating Convex client:", error);
    // Try with the hardcoded URL as a last resort
    try {
      convex = new ConvexReactClient(FALLBACK_CONVEX_URL);
      convexInitialized = true;
      console.log("Convex client created with fallback URL:", FALLBACK_CONVEX_URL);
    } catch (fallbackError) {
      console.error("Error creating Convex client with fallback URL:", fallbackError);
    }
  }
}

export function Providers({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Check if Convex is properly initialized
    if (!convexInitialized || !convex) {
      console.error("Convex client not initialized");
      setError("Connection error. The database client could not be initialized. Please refresh the page or try again later.");
      return;
    }

    let isUnmounted = false;
    let statusChangeUnsubscribe: (() => void) | null = null;

    // Function to set up the connection status listener
    const setupConnectionListener = () => {
      try {
        // Add a connection status listener
        statusChangeUnsubscribe = convex.onStatusChange((status) => {
          // Don't update state if the component is unmounted
          if (isUnmounted) return;

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
      } catch (error) {
        console.error("Error setting up connection status listener:", error);
        if (!isUnmounted) {
          setError("Error monitoring connection status. Please refresh the page.");
        }
      }
    };

    // Set up the connection listener
    setupConnectionListener();

    // Clean up function
    return () => {
      isUnmounted = true;
      if (statusChangeUnsubscribe) {
        try {
          statusChangeUnsubscribe();
        } catch (error) {
          console.error("Error unsubscribing from status changes:", error);
        }
      }
    };
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

  // Create a fallback client if needed
  if (!convexInitialized || !convex) {
    try {
      convex = new ConvexReactClient(FALLBACK_CONVEX_URL);
      convexInitialized = true;
      console.log("Created last-resort Convex client in render");
    } catch (error) {
      console.error("Failed to create last-resort Convex client:", error);
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Critical Connection Error</h2>
            <p className="text-gray-700 mb-4">Unable to connect to the database service. Please try again later.</p>
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
  }

  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}