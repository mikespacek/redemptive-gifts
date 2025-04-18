"use client";

import { useState } from 'react';
import { testEmailJSConfig } from '../lib/emailjs';
import PageLayout from '../components/PageLayout';

export default function TestEmailPage() {
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestEmail = async () => {
    setIsLoading(true);
    try {
      console.log('Starting EmailJS test...');
      const result = await testEmailJSConfig();
      console.log('EmailJS test result:', result);
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
        <h1 className="text-2xl font-bold mb-6">Test EmailJS Configuration</h1>
        
        <div className="mb-6">
          <p className="mb-4">
            This page allows you to test if EmailJS is properly configured. 
            Click the button below to send a test email to the admin address.
          </p>
          
          <button
            onClick={handleTestEmail}
            disabled={isLoading}
            className="bg-[#181818] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#333] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Sending Test Email...' : 'Send Test Email'}
          </button>
        </div>
        
        {testResult && (
          <div className={`p-4 rounded-xl ${testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <h2 className="font-bold mb-2">{testResult.success ? 'Success!' : 'Error'}</h2>
            <p>{testResult.message}</p>
          </div>
        )}
        
        <div className="mt-8 p-4 bg-gray-100 rounded-xl">
          <h2 className="font-bold mb-2">EmailJS Configuration</h2>
          <p>Check your .env.local file to ensure these values are set correctly:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>NEXT_PUBLIC_EMAILJS_SERVICE_ID: {process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ? '✅ Configured' : '❌ Missing'}</li>
            <li>NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: {process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ? '✅ Configured' : '❌ Missing'}</li>
            <li>NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: {process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ? '✅ Configured' : '❌ Missing'}</li>
            <li>NEXT_PUBLIC_ADMIN_EMAIL: {process.env.NEXT_PUBLIC_ADMIN_EMAIL ? '✅ Configured' : '❌ Missing'}</li>
          </ul>
          <p className="mt-4 text-sm text-gray-600">
            Current values (first few characters):<br />
            Service ID: {process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ? process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID.substring(0, 8) + '...' : 'Not set'}<br />
            Template ID: {process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ? process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID.substring(0, 8) + '...' : 'Not set'}<br />
            Public Key: {process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ? process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY.substring(0, 8) + '...' : 'Not set'}<br />
            Admin Email: {process.env.NEXT_PUBLIC_ADMIN_EMAIL ? process.env.NEXT_PUBLIC_ADMIN_EMAIL.substring(0, 8) + '...' : 'Not set'}
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
