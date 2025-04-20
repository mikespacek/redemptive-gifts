"use client";

import { Suspense, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import PageLayout from '../components/PageLayout';
import ErrorBoundary from '../components/ErrorBoundary';
import Link from 'next/link';

// Dynamically import the static test content component with no SSR and add error handling
const StaticTestContentDynamic = dynamic(
  () => import('../components/StaticTestContent').catch(err => {
    console.error('Error loading StaticTestContent:', err);
    // Return a minimal component that won't crash
    return () => <TestErrorFallback error={err} />;
  }),
  { ssr: false }
);

// Error fallback component
function TestErrorFallback({ error }: { error: Error }) {
  return (
    <PageLayout>
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-12 max-w-6xl">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-700 mb-6">
            We're sorry, but there was an error loading the test. Please try again or return to the home page.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#181818] text-white font-medium rounded-xl hover:bg-[#181818]/90 transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-xl hover:bg-gray-300 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

// Loading component for suspense fallback
function TestLoader() {
  return (
    <PageLayout>
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-12 max-w-6xl">
        <div className="max-w-md mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded-lg w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-800 rounded-lg w-full mb-2"></div>
            <div className="h-4 bg-gray-800 rounded-lg w-5/6 mx-auto mb-10"></div>

            <div className="flex justify-between items-center mb-3">
              <div className="h-5 bg-gray-800 rounded-lg w-1/4"></div>
              <div className="h-6 bg-gray-700 rounded-full w-20 border border-gray-600"></div>
            </div>
            <div className="h-3 bg-gray-800 rounded-full mb-8 border border-gray-700"></div>

            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 border border-gray-200">
              <div className="h-6 bg-gray-100 rounded-full w-1/4 mb-6 border border-gray-200"></div>
              <div className="h-6 bg-gray-200 rounded-lg w-full mb-8"></div>
              <div className="grid grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded-xl border border-gray-200"></div>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-10 text-gray-400 font-medium">Loading test questions...</p>
        </div>
      </div>
    </PageLayout>
  );
}

// Simple test page component with error handling
function TestPageContent() {
  // Add client-side error handling
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Add error handling for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setErrorMessage(event.reason?.message || 'An unknown error occurred');
      setHasError(true);
      // Prevent the error from propagating
      event.preventDefault();
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (hasError) {
    return <TestErrorFallback error={new Error(errorMessage)} />;
  }

  return (
    <Suspense fallback={<TestLoader />}>
      <StaticTestContentDynamic />
    </Suspense>
  );
}

// Export the test page with error boundary
export default function TestPage() {
  return (
    <ErrorBoundary>
      <TestPageContent />
    </ErrorBoundary>
  );
}