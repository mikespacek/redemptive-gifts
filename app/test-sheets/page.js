"use client";

import { useState, useEffect } from 'react';
import { testGoogleSheetsConnection } from '../lib/google-sheets';
import PageLayout from '../components/PageLayout';

export default function TestGoogleSheetsPage() {
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scriptUrl, setScriptUrl] = useState('');

  // Get the Google Sheet URL from environment variables when the component mounts
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL || '';
    setScriptUrl(url);
  }, []);

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      console.log('Starting Google Sheets connection test...');

      // Create a unique callback name
      const callbackName = 'googleSheetsCallback_' + Math.random().toString(36).substring(2, 15);

      // Create a promise that will be resolved when the JSONP callback is called
      const jsonpPromise = new Promise((resolve, reject) => {
        // Add the callback to the window object
        window[callbackName] = (data) => {
          // Clean up
          document.body.removeChild(script);
          delete window[callbackName];
          clearTimeout(timeoutId);

          console.log('Received response via JSONP:', data);
          resolve({
            success: true,
            message: 'Successfully connected to Google Sheet via JSONP',
            data: data
          });
        };

        // Create a script element
        const script = document.createElement('script');

        // Add a timestamp to prevent caching
        const timestamp = new Date().getTime();
        script.src = `${scriptUrl}?callback=${callbackName}&_=${timestamp}`;

        // Handle errors
        script.onerror = () => {
          // Clean up
          document.body.removeChild(script);
          delete window[callbackName];
          clearTimeout(timeoutId);

          console.error('JSONP request failed');
          reject(new Error('Failed to connect to Google Sheet via JSONP'));
        };

        // Set a timeout
        const timeoutId = setTimeout(() => {
          // Check if the script is still in the DOM
          if (document.body.contains(script)) {
            // Clean up
            document.body.removeChild(script);
            delete window[callbackName];

            console.error('JSONP request timed out');
            reject(new Error('Connection to Google Sheet timed out'));
          }
        }, 10000); // 10 second timeout

        // Add the script to the page
        document.body.appendChild(script);

        console.log('JSONP request sent to Google Sheet:', scriptUrl);
      });

      // Wait for the JSONP request to complete
      const result = await jsonpPromise;
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

  const handleTestFormSubmission = () => {
    setIsLoading(true);
    try {
      console.log('Testing form submission to Google Sheet...');

      // Create a hidden iframe for submission
      const iframe = document.createElement('iframe');
      iframe.name = 'hidden_iframe';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      // Create a form element to submit the data
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = scriptUrl;
      form.target = 'hidden_iframe'; // Target the hidden iframe

      // Create test data
      const testData = {
        timestamp: new Date().toISOString(),
        userId: 'test-user-' + Math.random().toString(36).substring(2, 8),
        fullName: 'Test User',
        email: 'test@example.com',
        dominantGift: 'teacher',
        secondaryGift: 'prophet',
        teacherScore: 85,
        giverScore: 70,
        rulerScore: 65,
        exhorterScore: 60,
        mercyScore: 55,
        prophetScore: 75,
        servantScore: 50
      };

      // Create a hidden input field for the data
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = 'data';
      hiddenField.value = JSON.stringify(testData);

      // Add the field to the form
      form.appendChild(hiddenField);

      // Add the form to the document body
      document.body.appendChild(form);

      // Submit the form
      form.submit();

      // Remove the form from the document after a short delay
      setTimeout(() => {
        document.body.removeChild(form);
        document.body.removeChild(iframe);

        setTestResult({
          success: true,
          message: 'Form submitted successfully! Check your Google Sheet to see if the test data was added.',
          data: testData
        });

        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Caught error in form submission:', error);
      setTestResult({
        success: false,
        message: `Error submitting form: ${error instanceof Error ? error.message : JSON.stringify(error)}`
      });
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
            You can test both the JSONP connection and form submission.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleTestConnection}
              disabled={isLoading}
              className="bg-[#181818] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#333] transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Testing Connection...' : 'Test JSONP Connection'}
            </button>

            <button
              onClick={handleTestFormSubmission}
              disabled={isLoading}
              className="bg-[#F3762F] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#e06a27] transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Submitting Form...' : 'Test Form Submission'}
            </button>
          </div>
        </div>

        {testResult && (
          <div className={`p-4 rounded-xl ${testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <h2 className="font-bold mb-2">{testResult.success ? 'Success!' : 'Error'}</h2>
            <p>{testResult.message}</p>
            {testResult.data && (
              <div className="mt-4 p-3 bg-white rounded border border-gray-200 overflow-auto max-h-60">
                <pre className="text-xs">{JSON.stringify(testResult.data, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 p-4 bg-gray-100 rounded-xl">
          <h2 className="font-bold mb-2">Google Sheets Configuration</h2>
          <p>Check your .env.local file to ensure these values are set correctly:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>NEXT_PUBLIC_GOOGLE_SHEET_URL: {process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL ? '✅ Configured' : '❌ Missing'}</li>
          </ul>
          <p className="mt-4 text-sm text-gray-600">
            Current value:<br />
            Google Sheet URL: {scriptUrl || 'Not set'}
          </p>

          <div className="mt-4 p-3 bg-white rounded border border-gray-200">
            <h3 className="font-bold text-sm mb-2">Troubleshooting Tips:</h3>
            <ul className="list-disc ml-6 text-sm">
              <li>Make sure your Google Apps Script is deployed as a web app with <strong>"Anyone"</strong> access.</li>
              <li>Check that your Google Apps Script includes proper JSONP support (callback parameter handling).</li>
              <li>Try using the standalone test page: <code>google-sheets-test.html</code></li>
              <li>Check browser console for detailed error messages.</li>
            </ul>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
