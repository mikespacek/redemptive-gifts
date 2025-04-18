'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to the console
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <p className="text-gray-700 mb-4">
          We're sorry, but there was an error loading this page. Please try again.
        </p>
        <div className="mt-6 space-y-3">
          <button
            onClick={() => reset()}
            className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors"
          >
            Try again
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
