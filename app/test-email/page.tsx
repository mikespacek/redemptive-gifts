"use client";

import { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { sendResultsEmailJS } from '../lib/emailjs';
import { sendEmailDirect } from '../lib/emailjs-direct';

export default function TestEmailPage() {
  const [result, setResult] = useState<string>('');
  const [isSending, setIsSending] = useState(false);

  // Test data
  const testData = {
    userId: 'test-user-' + Date.now(),
    scores: {
      prophet: 25,
      servant: 20,
      teacher: 30,
      exhorter: 15,
      giver: 10,
      ruler: 35,
      mercy: 40
    },
    dominantGift: 'mercy',
    secondaryGift: 'ruler',
    timestamp: Date.now(),
    fullName: 'Test User',
    email: 'test@example.com',
    firstName: 'Test',
    columnScores: {
      T: 30, // Teacher
      G: 10, // Giver
      R: 35, // Ruler
      E: 15, // Exhorter
      M: 40, // Mercy
      P: 25, // Prophet
      S: 20  // Servant
    }
  };

  const sendTestEmail = async () => {
    setIsSending(true);
    setResult('Sending test email...');

    try {
      // Try both methods in parallel
      const emailPromises = [
        // Original method
        sendResultsEmailJS(testData).catch(error => {
          console.error('Original EmailJS method failed:', error);
          return { success: false, message: 'Original method failed: ' + error.message };
        }),
        
        // Direct method
        sendEmailDirect(testData).catch(error => {
          console.error('Direct EmailJS method failed:', error);
          return { success: false, message: 'Direct method failed: ' + error.message };
        })
      ];
      
      // Wait for both to complete
      const [originalResult, directResult] = await Promise.all(emailPromises);
      
      setResult(
        `Original method: ${originalResult.success ? 'SUCCESS' : 'FAILED'}\n` +
        `Message: ${originalResult.message}\n\n` +
        `Direct method: ${directResult.success ? 'SUCCESS' : 'FAILED'}\n` +
        `Message: ${directResult.message}\n\n` +
        `Overall: ${originalResult.success || directResult.success ? 'At least one method succeeded' : 'Both methods failed'}`
      );
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Test Email Functionality</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <p className="mb-4">
            This page allows you to test the email functionality by sending a test email to the admin email address
            configured in your environment variables.
          </p>
          
          <button 
            onClick={sendTestEmail}
            disabled={isSending}
            className="bg-[#181818] text-white px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {isSending ? 'Sending...' : 'Send Test Email'}
          </button>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Result:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60 whitespace-pre-wrap">
              {result || 'No test run yet'}
            </pre>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Email Configuration</h2>
          <p className="mb-2">
            <strong>Service ID:</strong> {process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'Not configured'}
          </p>
          <p className="mb-2">
            <strong>Template ID:</strong> {process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'Not configured'}
          </p>
          <p className="mb-2">
            <strong>Public Key:</strong> {process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ? 'Configured (hidden)' : 'Not configured'}
          </p>
          <p>
            <strong>Admin Email:</strong> {process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'Not configured'}
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
