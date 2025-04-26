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
        console.log('Attempting to load test results...');

        // Check if localStorage is available
        if (typeof window !== 'undefined' && window.localStorage) {
          console.log('localStorage is available');

          // Log all localStorage keys for debugging
          const keys = Object.keys(localStorage);
          console.log('All localStorage keys:', keys);

          // Check for test results directly
          const directResults = localStorage.getItem('redemptiveGiftsTestResults') || localStorage.getItem('testResults');
          console.log('Direct test results from localStorage:', directResults ? 'Found' : 'Not found');
        } else {
          console.error('localStorage is not available');
        }

        // Get the result ID from the URL if available
        const resultId = searchParams?.get('id');
        const userId = searchParams?.get('userId') || localStorage.getItem('userId') || localStorage.getItem('redemptiveGiftsUserId');

        console.log('Result ID from URL:', resultId);
        console.log('User ID:', userId);

        let loadedResult = null;

        // Try to get results by ID first
        if (resultId) {
          console.log('Trying to get results by ID:', resultId);
          loadedResult = getResultById(resultId);
          console.log('Results by ID:', loadedResult ? 'Found' : 'Not found');
        }

        // If no result by ID, try to get by user ID
        if (!loadedResult && userId) {
          console.log('Trying to get results by user ID:', userId);
          loadedResult = getMostRecentResultByUser(userId);
          console.log('Results by user ID:', loadedResult ? 'Found' : 'Not found');
        }

        // Try one more direct approach if no results found yet
        if (!loadedResult) {
          console.log('Trying direct approach to get test results...');
          try {
            const directResults = localStorage.getItem('redemptiveGiftsTestResults') || localStorage.getItem('testResults');
            if (directResults) {
              loadedResult = JSON.parse(directResults) as TestResult;
              console.log('Found test results directly from localStorage');
            }
          } catch (parseError) {
            console.error('Error parsing direct results:', parseError);
          }
        }

        if (loadedResult) {
          // Use the actual test results from localStorage
          setResult(loadedResult);
          console.log('Loaded actual test results:', loadedResult);

          // Admin email is already sent during test completion
          // No need to send it again here
          console.log('Admin email already sent during test completion');
        } else {
          // If no results in localStorage, redirect to the test page
          console.log('No test results found, redirecting to test page');
          setError('No test results found. Please take the test first.');
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

        {/* Results Sheet Format - Sorted from highest to lowest */}
        {result.columnScores && (() => {
          // Create an array of gift objects with their scores and labels
          const giftScores = [
            { key: 'T', label: 'Teacher', score: result.columnScores.T },
            { key: 'G', label: 'Giver', score: result.columnScores.G },
            { key: 'R', label: 'Ruler', score: result.columnScores.R },
            { key: 'E', label: 'Exhorter', score: result.columnScores.E },
            { key: 'M', label: 'Mercy', score: result.columnScores.M },
            { key: 'P', label: 'Prophet', score: result.columnScores.P },
            { key: 'S', label: 'Servant', score: result.columnScores.S }
          ];

          // Sort the array by score in descending order
          const sortedGifts = [...giftScores].sort((a, b) => b.score - a.score);

          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-8 bg-white rounded-xl shadow-md p-6"
            >
              <h2 className="text-xl font-bold mb-6">Your Gift Scores (Highest to Lowest)</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr>
                      {sortedGifts.map(gift => (
                        <th key={gift.key} className="border px-4 py-2 text-center">
                          {gift.key}<br/>({gift.label})
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {sortedGifts.map(gift => (
                        <td key={gift.key} className="border px-4 py-2 text-center font-bold">
                          {gift.score}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-gray-600">Your highest score indicates your redemptive gift.</p>
            </motion.div>
          );
        })()
        }





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
