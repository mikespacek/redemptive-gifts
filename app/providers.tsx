"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useEffect, useState } from "react";

// Import the direct Convex configuration
import { CONVEX_URL, BACKUP_CONVEX_URLS, getConvexUrl, tryConnectWithUrls } from './convex-config';

// Create the client outside of the component to avoid recreation on renders
let convex: ConvexReactClient | null = null;
let convexInitialized = false;
let connectionAttempts = 0;
let currentUrlIndex = 0;

// Get all possible URLs to try
const allUrls = [getConvexUrl(), ...BACKUP_CONVEX_URLS];

// Function to initialize the Convex client with retry logic
const initializeConvexClient = () => {
  if (typeof window === 'undefined') return;
  if (convexInitialized && convex) return;

  // Get the next URL to try
  const urlToTry = allUrls[currentUrlIndex];
  console.log(`Attempt ${connectionAttempts + 1}: Trying to connect with URL: ${urlToTry}`);

  try {
    // Create the client
    convex = new ConvexReactClient(urlToTry);
    convexInitialized = true;
    console.log("Convex client created successfully with URL:", urlToTry);

    // Save the successful URL to localStorage
    try {
      localStorage.setItem('convex_url', urlToTry);
    } catch (e) {
      console.error('Error saving successful URL to localStorage:', e);
    }
  } catch (error) {
    console.error(`Error creating Convex client with URL ${urlToTry}:`, error);
    connectionAttempts++;
    currentUrlIndex = (currentUrlIndex + 1) % allUrls.length;

    // Try the next URL if we haven't exceeded max attempts
    if (connectionAttempts < allUrls.length * 2) {
      console.log(`Will try next URL: ${allUrls[currentUrlIndex]}`);
      setTimeout(initializeConvexClient, 1000); // Wait 1 second before trying again
    } else {
      console.error("Exceeded maximum connection attempts. Unable to initialize Convex client.");
    }
  }
};

// Initialize the client if in browser environment
if (typeof window !== 'undefined') {
  initializeConvexClient();
}

export function Providers({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') {
      return;
    }

    let isUnmounted = false;
    let statusChangeUnsubscribe: (() => void) | null = null;
    let retryCount = 0;
    const maxRetries = 5;
    let retryTimeout: NodeJS.Timeout | null = null;

    // Function to set up the connection status listener
    const setupConnectionListener = () => {
      // If the component is unmounted, don't proceed
      if (isUnmounted) return;

      // Check if Convex is properly initialized
      if (!convexInitialized || !convex) {
        console.error("Convex client not initialized");
        setError("Connection error. The database client could not be initialized. Please refresh the page or try again later.");

        // Try to initialize the client again
        if (retryCount < maxRetries) {
          console.log(`Retrying client initialization (${retryCount + 1}/${maxRetries})...`);
          retryCount++;
          retryTimeout = setTimeout(() => {
            initializeConvexClient();
            setupConnectionListener();
          }, 2000 * retryCount); // Exponential backoff
        }
        return;
      }

      try {
        // Add a connection status listener
        statusChangeUnsubscribe = convex.onStatusChange((status) => {
          // Don't update state if the component is unmounted
          if (isUnmounted) return;

          console.log("Convex connection status:", status);
          setIsConnected(status === "connected");

          if (status === "error") {
            setError("Error connecting to the database. Please check your network connection and try again.");
            // Try to reconnect with a different URL if we have retries left
            if (retryCount < maxRetries) {
              console.log(`Connection error. Retrying with different URL (${retryCount + 1}/${maxRetries})...`);
              retryCount++;
              currentUrlIndex = (currentUrlIndex + 1) % allUrls.length;

              // Clean up current connection
              if (statusChangeUnsubscribe) {
                try {
                  statusChangeUnsubscribe();
                  statusChangeUnsubscribe = null;
                } catch (e) {
                  console.error("Error unsubscribing from status changes:", e);
                }
              }

              // Try to initialize with a new URL
              convexInitialized = false;
              convex = null;
              retryTimeout = setTimeout(() => {
                initializeConvexClient();
                setupConnectionListener();
              }, 2000 * retryCount); // Exponential backoff
            }
          } else if (status === "disconnected") {
            setError("Disconnected from the database. Attempting to reconnect...");
          } else if (status === "connected") {
            setError(null);
            retryCount = 0; // Reset retry count on successful connection
          }
        });
      } catch (error) {
        console.error("Error setting up connection status listener:", error);
        if (!isUnmounted) {
          setError("Error monitoring connection status. Please refresh the page.");

          // Try again if we have retries left
          if (retryCount < maxRetries) {
            console.log(`Error setting up listener. Retrying (${retryCount + 1}/${maxRetries})...`);
            retryCount++;
            retryTimeout = setTimeout(setupConnectionListener, 2000 * retryCount);
          }
        }
      }
    };

    // Set up the connection listener
    setupConnectionListener();

    // Clean up function
    return () => {
      isUnmounted = true;

      // Clear any pending retries
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }

      // Unsubscribe from status changes
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
    // Get the current URL being used
    const currentUrl = allUrls[currentUrlIndex];

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Connection Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <div className="bg-gray-50 p-3 rounded-md mb-4">
            <p className="text-gray-600 text-sm font-semibold mb-1">Technical details:</p>
            <p className="text-gray-600 text-sm mb-1">Current URL: {currentUrl}</p>
            <p className="text-gray-600 text-sm mb-1">Connection attempts: {connectionAttempts}</p>
            <p className="text-gray-600 text-sm">Client initialized: {convexInitialized ? 'Yes' : 'No'}</p>
          </div>
          <p className="text-gray-600 text-sm">If this issue persists, please contact support.</p>
          <div className="mt-6 space-y-3">
            <button
              onClick={() => {
                // Reset connection state and try again
                convexInitialized = false;
                convex = null;
                connectionAttempts = 0;
                currentUrlIndex = 0;
                initializeConvexClient();
                window.location.reload();
              }}
              className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors"
            >
              Retry Connection
            </button>
            <button
              onClick={() => {
                // Try with the next URL
                convexInitialized = false;
                convex = null;
                currentUrlIndex = (currentUrlIndex + 1) % allUrls.length;
                initializeConvexClient();
                window.location.reload();
              }}
              className="w-full bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
            >
              Try Alternative URL
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
    // Try all URLs as a last resort
    for (let i = 0; i < allUrls.length; i++) {
      try {
        const lastResortUrl = allUrls[i];
        console.log(`Last resort attempt ${i+1}/${allUrls.length} with URL: ${lastResortUrl}`);
        convex = new ConvexReactClient(lastResortUrl);
        convexInitialized = true;
        console.log("Created last-resort Convex client in render with URL:", lastResortUrl);
        break; // Exit the loop if successful
      } catch (error) {
        console.error(`Failed to create last-resort Convex client with URL ${allUrls[i]}:`, error);
        // Continue to the next URL
      }
    }

    // If all attempts failed, show critical error
    if (!convexInitialized || !convex) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Critical Connection Error</h2>
            <p className="text-gray-700 mb-4">Unable to connect to the database service. Please try again later.</p>
            <div className="bg-gray-50 p-3 rounded-md mb-4">
              <p className="text-gray-600 text-sm font-semibold mb-1">Technical details:</p>
              <p className="text-gray-600 text-sm mb-1">Tried URLs: {allUrls.join(', ')}</p>
              <p className="text-gray-600 text-sm mb-1">Connection attempts: {connectionAttempts}</p>
            </div>
            <div className="mt-6 space-y-3">
              <button
                onClick={() => {
                  // Reset everything and try again
                  localStorage.removeItem('convex_url'); // Clear any saved URL
                  window.location.reload();
                }}
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