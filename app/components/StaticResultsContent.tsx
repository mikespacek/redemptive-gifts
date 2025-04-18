"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import PageLayout from './PageLayout';
import ResultsChart from './ResultsChart';
import { giftDescriptions, GiftType } from '../lib/gift-descriptions';
import { getUserInfo } from '../lib/userId';
import { TestResult, getResultById, getMostRecentResultByUser } from '../lib/google-sheets';

// Using TestResult interface from google-sheets.ts

export default function StaticResultsContent() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      try {
        // Get the result ID from the URL if available
        const resultId = searchParams?.get('id');
        const userId = searchParams?.get('userId') || localStorage.getItem('userId');

        let loadedResult = null;

        // Try to get results by ID first
        if (resultId) {
          loadedResult = getResultById(resultId);
        }

        // If no result by ID, try to get by user ID
        if (!loadedResult && userId) {
          loadedResult = getMostRecentResultByUser(userId);
        }

        if (loadedResult) {
          setResult(loadedResult);
        } else {
          // If no results in localStorage, create sample results
          const userInfo = getUserInfo();

          // Create sample results with varied scores
          const sampleResult: TestResult = {
            userId: userInfo?.userId || 'anonymous',
            scores: {
              prophet: 42,
              servant: 28,
              teacher: 35,
              exhorter: 52,
              giver: 21,
              ruler: 38,
              mercy: 45
            },
            dominantGift: 'exhorter',
            secondaryGift: 'mercy',
            timestamp: Date.now(),
            fullName: userInfo?.fullName || 'Anonymous User',
            email: userInfo?.email || '',
            firstName: userInfo?.firstName || 'Friend',
            // Add column scores for the results sheet format
            columnScores: {
              T: 35, // Teacher (Column 1)
              G: 21, // Giver (Column 2)
              R: 38, // Ruler (Column 3)
              E: 52, // Exhorter (Column 4)
              M: 45, // Mercy (Column 5)
              P: 42, // Prophet (Column 6)
              S: 28  // Servant (Column 7)
            }
          };

          setResult(sampleResult);
        }
      } catch (err) {
        console.error('Error loading results:', err);
        setError('Failed to load your results. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }, 800);
  }, []);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-12 max-w-6xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black mb-4">Analyzing Your Results</h1>
            <p className="text-gray-600 mb-8">Please wait while we process your answers...</p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-12 max-w-6xl">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Results</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!result) {
    return (
      <PageLayout>
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-12 max-w-6xl">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Results Not Found</h2>
            <p className="text-gray-700 mb-6">
              We couldn't find your test results. You may need to take the test first.
            </p>
            <a
              href="/test"
              className="block w-full text-center bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Take the Test
            </a>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Format date
  const resultDate = new Date(result.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Get gift descriptions
  const dominantGiftInfo = giftDescriptions[result.dominantGift];
  const secondaryGiftInfo = giftDescriptions[result.secondaryGift];

  return (
    <PageLayout>
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-12 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-black mb-4">
            Your Design Results
          </h1>
          <p className="text-gray-600">
            {result.firstName ? `Hello ${result.firstName}! Here` : 'Here'} are your test results from {resultDate}
          </p>
        </motion.div>

        {/* Chart Section - Full Width at Top */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <div className="max-w-xl mx-auto">
            <ResultsChart scores={result.scores} />
          </div>
        </motion.div>

        {/* Results Summary - Full Width Below Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-bold mb-6">Your Dominant Gifts</h2>

          {/* Dominant Gift */}
          <div className="mb-8">
            <div className="flex items-center mb-3">
              <div className={`w-12 h-12 rounded-full ${dominantGiftInfo.color} flex items-center justify-center text-white text-2xl mr-4`}>
                {dominantGiftInfo.emoji}
              </div>
              <div>
                <h3 className="text-lg font-bold">{dominantGiftInfo.name}</h3>
                <p className="text-sm text-gray-600">{dominantGiftInfo.title}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{dominantGiftInfo.description}</p>
            <div>
              <h4 className="font-semibold mb-2">Key Strengths:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {dominantGiftInfo.strengths.map((strength, index) => (
                  <li key={index} className="text-gray-700">{strength}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Secondary Gift */}
          <div>
            <h3 className="text-lg font-bold mb-3">Secondary Gift: {secondaryGiftInfo.name}</h3>
            <p className="text-gray-700 mb-4">{secondaryGiftInfo.summary}</p>
          </div>
        </motion.div>

        {/* Detailed Primary Gift Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-bold mb-6">Detailed Description of Your Primary Gift: {dominantGiftInfo.name}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Principle:</h3>
              <p className="text-gray-700 mb-4">{dominantGiftInfo.principle}</p>

              <h3 className="text-lg font-semibold mb-2 text-gray-800">Mature Gift:</h3>
              <p className="text-gray-700 mb-4">{dominantGiftInfo.matureGift}</p>

              <h3 className="text-lg font-semibold mb-2 text-gray-800">Carnal Gift:</h3>
              <p className="text-gray-700 mb-4">{dominantGiftInfo.carnalGift}</p>

              <h3 className="text-lg font-semibold mb-2 text-gray-800">Battlefield:</h3>
              <p className="text-gray-700 mb-4">{dominantGiftInfo.battlefield}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Legitimacy Lie:</h3>
              <p className="text-gray-700 mb-4">{dominantGiftInfo.legitimacyLie}</p>

              <h3 className="text-lg font-semibold mb-2 text-gray-800">Biblical Example:</h3>
              <p className="text-gray-700 mb-4">{dominantGiftInfo.biblicalExample}</p>

              <h3 className="text-lg font-semibold mb-2 text-gray-800">Birthright:</h3>
              <p className="text-gray-700 mb-4">{dominantGiftInfo.birthright}</p>

              <h3 className="text-lg font-semibold mb-2 text-gray-800">Creation Day:</h3>
              <p className="text-gray-700">{dominantGiftInfo.creationDay}</p>

              <h3 className="text-lg font-semibold mb-2 text-gray-800">Tabernacle Item:</h3>
              <p className="text-gray-700">{dominantGiftInfo.tabernacleItem}</p>
            </div>
          </div>
        </motion.div>

        {/* Removed the Gift Scores Breakdown with colored cards */}

        {/* Results Sheet Format */}
        {result.columnScores && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-8 bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold mb-6">Your Gift Scores</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border px-4 py-2 text-center">T<br/>(Teacher)</th>
                    <th className="border px-4 py-2 text-center">G<br/>(Giver)</th>
                    <th className="border px-4 py-2 text-center">R<br/>(Ruler)</th>
                    <th className="border px-4 py-2 text-center">E<br/>(Exhorter)</th>
                    <th className="border px-4 py-2 text-center">M<br/>(Mercy)</th>
                    <th className="border px-4 py-2 text-center">P<br/>(Prophet)</th>
                    <th className="border px-4 py-2 text-center">S<br/>(Servant)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2 text-center font-bold">{result.columnScores.T}</td>
                    <td className="border px-4 py-2 text-center font-bold">{result.columnScores.G}</td>
                    <td className="border px-4 py-2 text-center font-bold">{result.columnScores.R}</td>
                    <td className="border px-4 py-2 text-center font-bold">{result.columnScores.E}</td>
                    <td className="border px-4 py-2 text-center font-bold">{result.columnScores.M}</td>
                    <td className="border px-4 py-2 text-center font-bold">{result.columnScores.P}</td>
                    <td className="border px-4 py-2 text-center font-bold">{result.columnScores.S}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-gray-600">Your highest score indicates your redemptive gift.</p>
          </motion.div>
        )}



        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <a
            href="/"
            className="inline-block bg-black text-white py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Return to Home
          </a>
        </motion.div>
      </div>
    </PageLayout>
  );
}
