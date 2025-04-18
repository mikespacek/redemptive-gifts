"use client";

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import PageLayout from '../components/PageLayout';

// Dynamically import the static test content component with no SSR
const StaticTestContentDynamic = dynamic(
  () => import('../components/StaticTestContent'),
  { ssr: false }
);

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

// Export the test page with suspense
export default function TestPage() {
  return (
    <Suspense fallback={<TestLoader />}>
      <StaticTestContentDynamic />
    </Suspense>
  );
}