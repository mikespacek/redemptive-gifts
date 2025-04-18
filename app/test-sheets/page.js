"use client";

import { useState } from 'react';
import { testGoogleSheetsConnection } from '../lib/google-sheets';
import PageLayout from '../components/PageLayout';

export default function TestGoogleSheetsPage() {
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      console.log('Starting Google Sheets connection test...');
      const result = await testGoogleSheetsConnection();
      console.log('Google Sheets test result:', result);
      setTestResult(result);
    } catch (error) {
      console.error('Caught error in test page:', error);
      setTestResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : JSON.stringify(error)}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Test Google Sheets Connection</h1>
        
        <div className="mb-6">
          <p className="mb-4">
            This page allows you to test if the Google Sheets integration is properly configured. 
            Click the button below to test the connection.
          </p>
          
          <button
            onClick={handleTestConnection}
            disabled={isLoading}
            className="bg-[#181818] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#333] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Testing Connection...' : 'Test Google Sheets Connection'}
          </button>
        </div>
        
        {testResult && (
          <div className={`p-4 rounded-xl ${testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <h2 className="font-bold mb-2">{testResult.success ? 'Success!' : 'Error'}</h2>
            <p>{testResult.message}</p>
          </div>
        )}
        
        <div className="mt-8 p-4 bg-gray-100 rounded-xl">
          <h2 className="font-bold mb-2">Google Sheets Configuration</h2>
          <p>Check your .env.local file to ensure these values are set correctly:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>NEXT_PUBLIC_GOOGLE_SHEET_URL: {process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL ? '✅ Configured' : '❌ Missing'}</li>
          </ul>
          <p className="mt-4 text-sm text-gray-600">
            Current value (first few characters):<br />
            Google Sheet URL: {process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL ? process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL.substring(0, 40) + '...' : 'Not set'}
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
