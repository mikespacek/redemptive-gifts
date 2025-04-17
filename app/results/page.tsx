"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import PageLayout from '../components/PageLayout';
import ResultsChart from '../components/ResultsChart';
import GiftSummary from '../components/GiftSummary';
import Link from 'next/link';
import { getUserId } from '../lib/userId';
import { GiftType } from '../lib/gift-descriptions';

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

// Component for displaying "No Results Found" message
function NoResultsFound() {
  return (
    <PageLayout>
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-12 max-w-6xl">
        <div className="text-center">
          <h1 className="text-black">No Results Found</h1>
          <p className="mt-4">
            We couldn't find any test results. Please take the test first.
          </p>
          <Link href="/test" className="btn-secondary mt-8 inline-block">
            Take the Test
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}

// Main results component
function ResultsContent() {
  const searchParams = useSearchParams();
  const resultId = searchParams?.get('resultId');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const id = getUserId();
    setUserId(id);
  }, []);

  // Always call hooks in the same order
  const resultByIdQuery = useQuery(api.results.getById, { resultId: resultId || "" });
  const resultByUserQuery = useQuery(api.results.getMostRecentByUser, { userId: userId || "" });

  // Then conditionally use the results
  const resultById = resultId ? resultByIdQuery : null;
  const resultByUser = !resultId && userId ? resultByUserQuery : null;

  // Use the appropriate result
  const result = resultById || resultByUser;

  // Show loading state if we're still fetching
  if (!result) {
    // If we have a userId but no result, try to fetch results again after a short delay
    if (userId && !resultId) {
      // This helps with race conditions where the result might not be immediately available
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      return <ResultsLoader />;
    }
    return <NoResultsFound />;
  }

  // Extract data from the result
  const { scores, dominantGift, secondaryGift } = result;

  return (
    <PageLayout>
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-12 max-w-6xl">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-black">
              {result.firstName ? `${result.firstName}'s` : 'Your'} Redemptive Gifts Results
            </h1>
            <p className="text-xl text-gray-400 mt-4">
              Based on your responses, we've identified your primary and secondary gifts.
            </p>

          </div>

          <div className="mb-12">
            <ResultsChart scores={scores as Record<GiftType, number>} />
          </div>

          <div className="space-y-8">
            <GiftSummary giftType={dominantGift as GiftType} isPrimary={true} />
            <GiftSummary giftType={secondaryGift as GiftType} isPrimary={false} />
          </div>

          <div className="mt-12 flex justify-center">
            <Link href="/test" className="btn-secondary">
              Retake Test
            </Link>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}

// Wrap the results page with Suspense
export default function ResultsPage() {
  return (
    <Suspense fallback={<ResultsLoader />}>
      <ResultsContent />
    </Suspense>
  );
}