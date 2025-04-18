"use client";

import { useState } from 'react';
import PageLayout from './PageLayout';
import { motion } from 'framer-motion';

// Admin content component with client-side logic
export default function AdminContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simple static authentication for demo purposes
    if (username === 'admin' && password === 'password') {
      setIsAuthenticated(true);
    } else {
      setError('Invalid username or password');
    }
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
                className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container-custom py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Logout
            </button>
          </div>

          <motion.div
            className="mb-12 bg-white p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-6">Static Demo</h2>

            <div className="mb-8">
              <h3 className="text-lg font-medium">This is a static demo of the admin dashboard.</h3>
              <p className="mt-4 text-gray-600">
                In the full version, this dashboard would display test statistics and results from the database.
                For this static demo, we're showing a simplified version without database connectivity.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-6">Configuration</h2>

            <div className="overflow-x-auto">
              <p className="mb-4">To set up the full version with database connectivity:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Configure Convex database connection</li>
                <li>Set up authentication</li>
                <li>Deploy with server-side rendering enabled</li>
              </ol>
            </div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
}
