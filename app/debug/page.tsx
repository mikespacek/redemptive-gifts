"use client";

import { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { sendResultToGoogleSheet } from '../lib/google-sheets';
import { sendResultsEmailJS } from '../lib/emailjs';

export default function DebugPage() {
  const [googleSheetsResult, setGoogleSheetsResult] = useState<string>('');
  const [emailJSResult, setEmailJSResult] = useState<string>('');
  const [isTestingGoogleSheets, setIsTestingGoogleSheets] = useState(false);
  const [isTestingEmailJS, setIsTestingEmailJS] = useState(false);
  const [envVars, setEnvVars] = useState<Record<string, string>>({});

  // Test data for both services
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

  // Test Google Sheets integration
  const testGoogleSheets = async () => {
    setIsTestingGoogleSheets(true);
    setGoogleSheetsResult('Testing Google Sheets integration...');
    
    try {
      // Log environment variables
      const googleSheetUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL;
      setEnvVars(prev => ({ 
        ...prev, 
        NEXT_PUBLIC_GOOGLE_SHEET_URL: googleSheetUrl || 'Not set' 
      }));
      
      // Direct form submission approach
      const formData = new FormData();
      formData.append('data', JSON.stringify(testData));
      
      // Add individual fields
      Object.entries(testData).forEach(([key, value]) => {
        if (typeof value !== 'object') {
          formData.append(key, String(value));
        }
      });
      
      // Add timestamp in the format the Google Script expects
      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      formData.append('timestamp', formattedDate);
      
      // Create a hidden iframe
      const iframeId = 'debug-google-sheets-iframe';
      let iframe = document.getElementById(iframeId) as HTMLIFrameElement;
      
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = iframeId;
        iframe.name = iframeId;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
      }
      
      // Create and submit form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = googleSheetUrl || '';
      form.target = iframeId;
      form.enctype = 'multipart/form-data';
      
      // Add form data
      for (const [key, value] of formData.entries()) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      }
      
      document.body.appendChild(form);
      form.submit();
      
      // Also try the library function
      const result = await sendResultToGoogleSheet(testData);
      
      setGoogleSheetsResult(
        `Direct form submission completed.\n\n` +
        `Library function result: ${JSON.stringify(result, null, 2)}`
      );
    } catch (error) {
      setGoogleSheetsResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsTestingGoogleSheets(false);
    }
  };

  // Test EmailJS integration
  const testEmailJS = async () => {
    setIsTestingEmailJS(true);
    setEmailJSResult('Testing EmailJS integration...');
    
    try {
      // Log environment variables
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      
      setEnvVars(prev => ({ 
        ...prev, 
        NEXT_PUBLIC_EMAILJS_SERVICE_ID: serviceId || 'Not set',
        NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: templateId || 'Not set',
        NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: publicKey ? 'Set (hidden)' : 'Not set',
        NEXT_PUBLIC_ADMIN_EMAIL: adminEmail || 'Not set'
      }));
      
      // Try the library function
      const result = await sendResultsEmailJS(testData);
      
      setEmailJSResult(`EmailJS result: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setEmailJSResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsTestingEmailJS(false);
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Integration Debug Page</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Environment Variables</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-40">
            {JSON.stringify(envVars, null, 2)}
          </pre>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Google Sheets Test */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Google Sheets Integration</h2>
            <button 
              onClick={testGoogleSheets}
              disabled={isTestingGoogleSheets}
              className="bg-[#181818] text-white px-4 py-2 rounded disabled:opacity-50 mb-4"
            >
              {isTestingGoogleSheets ? 'Testing...' : 'Test Google Sheets'}
            </button>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Result:</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60 whitespace-pre-wrap">
                {googleSheetsResult || 'No test run yet'}
              </pre>
            </div>
          </div>
          
          {/* EmailJS Test */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">EmailJS Integration</h2>
            <button 
              onClick={testEmailJS}
              disabled={isTestingEmailJS}
              className="bg-[#181818] text-white px-4 py-2 rounded disabled:opacity-50 mb-4"
            >
              {isTestingEmailJS ? 'Testing...' : 'Test EmailJS'}
            </button>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Result:</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60 whitespace-pre-wrap">
                {emailJSResult || 'No test run yet'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
