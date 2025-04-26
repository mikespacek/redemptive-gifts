'use client';

import { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { sendResultsEmailJS } from '../lib/emailjs-simple';

export default function TestUserEmailPage() {
  const [name, setName] = useState('Test User');
  const [email, setEmail] = useState('');
  const [emailResult, setEmailResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // Add a log message
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Test EmailJS integration
  const testUserEmail = async () => {
    setIsLoading(true);
    setEmailResult('');
    addLog('Testing EmailJS user email integration...');

    try {
      // Create a test result object
      const testResult = {
        userId: 'test-' + Date.now(),
        scores: {
          prophet: 25,
          servant: 30,
          teacher: 35,
          exhorter: 40,
          giver: 45,
          ruler: 50,
          mercy: 55
        },
        dominantGift: 'mercy',
        secondaryGift: 'ruler',
        timestamp: Date.now(),
        fullName: name,
        email: email,
        firstName: name.split(' ')[0],
        columnScores: {
          T: 35, // Teacher
          G: 45, // Giver
          R: 50, // Ruler
          E: 40, // Exhorter
          M: 55, // Mercy
          P: 25, // Prophet
          S: 30  // Servant
        }
      };

      addLog('Sending test email to user...');
      
      // Override console.log to capture logs
      const originalConsoleLog = console.log;
      const originalConsoleError = console.error;
      
      console.log = (...args) => {
        originalConsoleLog(...args);
        addLog('LOG: ' + args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' '));
      };
      
      console.error = (...args) => {
        originalConsoleError(...args);
        addLog('ERROR: ' + args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' '));
      };

      // Send email
      const result = await sendResultsEmailJS(testResult);
      
      // Restore console functions
      console.log = originalConsoleLog;
      console.error = originalConsoleError;

      addLog(`EmailJS result: ${result.success ? 'Success' : 'Failed'}`);
      setEmailResult(JSON.stringify(result, null, 2));
    } catch (error) {
      addLog(`Error testing EmailJS: ${error instanceof Error ? error.message : String(error)}`);
      setEmailResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">User Email Testing</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Test Configuration</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Full Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">EmailJS User Email Test</h2>
          <button
            onClick={testUserEmail}
            disabled={isLoading}
            className="w-full bg-black text-white py-2 rounded mb-4 hover:bg-gray-800 transition-colors"
          >
            {isLoading ? 'Testing...' : 'Test User Email'}
          </button>
          
          {emailResult && (
            <div className="mt-4">
              <h3 className="font-bold mb-2">Result:</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60 text-sm">
                {emailResult}
              </pre>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Debug Logs</h2>
          <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {logs.length === 0 ? (
              <p className="text-gray-500">No logs yet. Run a test to see logs.</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="text-sm mb-1 font-mono">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
