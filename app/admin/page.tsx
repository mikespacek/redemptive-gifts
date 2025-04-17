"use client";

import { useState, Suspense } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import PageLayout from '../components/PageLayout';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { GiftType, giftDescriptions } from '../lib/gift-descriptions';

// Define Result type
interface Result {
  _id: string;
  userId: string;
  submissionId: string;
  dominantGift: string;
  secondaryGift: string;
  timestamp: number;
  scores: Record<GiftType, number>;
}

// Admin content component with client-side logic
function AdminContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Authentication mutation
  const authenticate = useMutation(api.admin.authenticate);

  // Get statistics and submissions if authenticated
  const statistics = isAuthenticated ? useQuery(api.results.getStatistics) : null;
  const allResults = isAuthenticated ? useQuery(api.results.getAllForAdmin) : null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const result = await authenticate({ username, password });
      if (result.success) {
        setIsAuthenticated(true);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
      console.error(err);
    }
  };

  // Format timestamp to readable date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!isAuthenticated) {
    return (
      <PageLayout>
        <div className="container-custom py-12">
          <div className="max-w-md mx-auto card">
            <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
            
            <form onSubmit={handleLogin}>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full btn-primary"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Prepare chart data for gift distribution
  const chartData = {
    labels: Object.keys(statistics?.dominantGiftCounts || {}).map(
      (gift) => giftDescriptions[gift as GiftType].name
    ),
    datasets: [
      {
        label: 'Dominant Gifts',
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',   // red - prophet
          'rgba(59, 130, 246, 0.7)',  // blue - servant
          'rgba(34, 197, 94, 0.7)',   // green - teacher
          'rgba(234, 179, 8, 0.7)',   // yellow - exhorter
          'rgba(168, 85, 247, 0.7)',  // purple - giver
          'rgba(249, 115, 22, 0.7)',  // orange - ruler
          'rgba(236, 72, 153, 0.7)',  // pink - mercy
        ],
        data: statistics ? Object.values(statistics.dominantGiftCounts) : [],
      },
    ],
  };

  return (
    <PageLayout>
      <div className="container-custom py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1>Admin Dashboard</h1>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="btn-secondary"
            >
              Logout
            </button>
          </div>

          {statistics && (
            <motion.div
              className="mb-12 card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="mb-6">Test Statistics</h2>
              
              <div className="mb-8">
                <h3>Total Submissions: {statistics.totalResults}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="mb-4">Dominant Gift Distribution</h3>
                  <div className="h-80">
                    <Bar 
                      data={chartData}
                      options={{
                        indexAxis: 'y',
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        scales: {
                          x: {
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="mb-4">Gift Breakdown</h3>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Gift</th>
                        <th className="text-center py-2">Dominant</th>
                        <th className="text-center py-2">Secondary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(statistics.dominantGiftCounts).map((gift) => (
                        <tr key={gift} className="border-b">
                          <td className="py-2 font-medium">{giftDescriptions[gift as GiftType].name}</td>
                          <td className="text-center py-2">{statistics.dominantGiftCounts[gift]}</td>
                          <td className="text-center py-2">{statistics.secondaryGiftCounts[gift]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {allResults && (
            <motion.div
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h2 className="mb-6">Recent Test Results</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left border-b">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">User ID</th>
                      <th className="py-3 px-4">Dominant Gift</th>
                      <th className="py-3 px-4">Secondary Gift</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allResults.map((result: Result) => (
                      <tr key={result._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{formatDate(result.timestamp)}</td>
                        <td className="py-3 px-4">
                          <span className="text-xs font-mono bg-gray-100 p-1 rounded">
                            {result.userId.substring(0, 8)}...
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium gift-${result.dominantGift}`}>
                            {giftDescriptions[result.dominantGift as GiftType].name}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium gift-${result.secondaryGift}`}>
                            {giftDescriptions[result.secondaryGift as GiftType].name}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

// Loading component for suspense fallback
function AdminLoader() {
  return (
    <PageLayout>
      <div className="container-custom py-12">
        <div className="text-center">
          <h1>Loading Admin Dashboard...</h1>
          <div className="mt-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

// Export the admin page with suspense
export default function AdminPage() {
  return (
    <Suspense fallback={<AdminLoader />}>
      <AdminContent />
    </Suspense>
  );
} 