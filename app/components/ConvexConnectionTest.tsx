"use client";

import { useState, useEffect } from 'react';
import { ConvexReactClient } from 'convex/react';

export default function ConvexConnectionTest() {
  const [status, setStatus] = useState<string>('Testing connection...');
  const [details, setDetails] = useState<string>('');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Try to connect to Convex directly
    const testConnection = async () => {
      try {
        // Try with the environment variable URL
        const envUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
        setDetails(`Testing URL: ${envUrl || 'Not available'}`);

        if (envUrl) {
          const client = new ConvexReactClient(envUrl);
          let unsubscribe: (() => void) | null = null;

          try {
            unsubscribe = client.onStatusChange((connectionStatus) => {
              setStatus(`Connection status: ${connectionStatus}`);
              if (connectionStatus === 'connected') {
                setDetails(prev => `${prev}\nSuccessfully connected to Convex!`);
                // Hide after success
                setTimeout(() => setIsVisible(false), 3000);
              }
            });

            // Wait a bit to see if we connect
            await new Promise(resolve => setTimeout(resolve, 5000));

            if (unsubscribe) {
              unsubscribe();
            }
          } catch (error) {
            setStatus('Error setting up connection listener');
            setDetails(prev => `${prev}\nError: ${error instanceof Error ? error.message : String(error)}`);
          }
        } else {
          // Try with a hardcoded URL
          const hardcodedUrl = 'https://frugal-blackbird-138.convex.cloud';
          setDetails(prev => `${prev}\nFalling back to hardcoded URL: ${hardcodedUrl}`);

          const client = new ConvexReactClient(hardcodedUrl);
          let unsubscribe: (() => void) | null = null;

          try {
            unsubscribe = client.onStatusChange((connectionStatus) => {
              setStatus(`Fallback connection status: ${connectionStatus}`);
              if (connectionStatus === 'connected') {
                setDetails(prev => `${prev}\nSuccessfully connected to fallback Convex URL!`);
                // Hide after success
                setTimeout(() => setIsVisible(false), 3000);
              }
            });

            // Wait a bit to see if we connect
            await new Promise(resolve => setTimeout(resolve, 5000));

            if (unsubscribe) {
              unsubscribe();
            }
          } catch (error) {
            setStatus('Error setting up fallback connection');
            setDetails(prev => `${prev}\nFallback error: ${error instanceof Error ? error.message : String(error)}`);
          }
        }
      } catch (error) {
        setStatus('Connection test failed');
        setDetails(prev => `${prev}\nFatal error: ${error instanceof Error ? error.message : String(error)}`);
      }
    };

    testConnection();

    return () => {
      // Cleanup if needed
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-md border border-gray-200 text-xs font-mono z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Convex Connection Test</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      <div className="mb-1 font-semibold">{status}</div>
      <pre className="whitespace-pre-wrap text-gray-600 text-xs">{details}</pre>
    </div>
  );
}
