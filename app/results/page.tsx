"use client";

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import PageLayout from '../components/PageLayout';

// Dynamically import the static results content component with no SSR
const StaticResultsContentDynamic = dynamic(
  () => import('../components/StaticResultsContent'),
  { ssr: false }
);

// Loading component for Suspense fallback
function ResultsLoader() {
  return (
    <PageLayout>
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-12 max-w-6xl">
        <div className="text-center">
          <h1 className="text-black">Loading Results...</h1>
          <div className="mt-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

// Wrap the results page with Suspense
export default function ResultsPage() {
  return (
    <Suspense fallback={<ResultsLoader />}>
      <StaticResultsContentDynamic />
    </Suspense>
  );
}