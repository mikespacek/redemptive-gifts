"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import PageLayout from '../components/PageLayout';
import ResultsChart from '../components/ResultsChart';
import GiftSummary from '../components/GiftSummary';
import Link from 'next/link';
import { getUserId } from '../lib/userId';
import { GiftType } from '../lib/gift-descriptions';

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultId = searchParams.get('resultId');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const id = getUserId();
    setUserId(id);
  }, []);

  // Get the result by ID if available
  const resultById = resultId 
    ? useQuery(api.results.getById, { resultId })
    : null;

  // Otherwise get the most recent result for the user
  const mostRecentResult = !resultId && userId
    ? useQuery(api.results.getMostRecentByUser, { userId })
    : null;

  // Use resultById if available, otherwise use mostRecentResult
  const result = resultById || mostRecentResult;

  // If no result is found, show a message
  if (!result) {
    return (
      <PageLayout>
        <div className="container-custom py-12">
          <div className="text-center">
            <h1>No Results Found</h1>
            <p className="mt-4">
              We couldn't find any test results. Please take the test first.
            </p>
            <Link href="/test" className="btn-primary mt-8 inline-block">
              Take the Test
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Extract data from the result
  const { scores, dominantGift, secondaryGift } = result;

  return (
    <PageLayout>
      <div className="container-custom py-12">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1>Your Redemptive Gifts Results</h1>
            <p className="text-xl text-gray-600 mt-4">
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

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/test" className="btn-secondary">
              Retake Test
            </Link>
            <button 
              onClick={() => {
                // Share URL functionality - would use navigator.share in a real app
                alert('Sharing your results link: ' + window.location.href);
              }}
              className="btn-primary"
            >
              Share Results
            </button>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
} 