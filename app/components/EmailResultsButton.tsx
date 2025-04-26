'use client';

import { useState } from 'react';
import { TestResult } from '../types/test-types';
import { sendDirectEmailJS } from '../lib/direct-emailjs';

interface EmailResultsButtonProps {
  result: TestResult;
}

export default function EmailResultsButton({ result }: EmailResultsButtonProps) {
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmailToUser = async () => {
    if (!result.email || !result.email.includes('@')) {
      setError('No valid email address provided');
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      console.log('Sending email to user:', result.email);
      const emailResult = await sendDirectEmailJS(result);
      
      if (emailResult.success) {
        setEmailSent(true);
        console.log('Email sent successfully to user');
      } else {
        setError(`Failed to send email: ${emailResult.message}`);
        console.error('Failed to send email:', emailResult.message);
      }
    } catch (err) {
      setError(`Error sending email: ${err instanceof Error ? err.message : String(err)}`);
      console.error('Error sending email:', err);
    } finally {
      setIsSending(false);
    }
  };

  if (emailSent) {
    return (
      <div className="mt-6 text-center">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Your results have been emailed to {result.email}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 text-center">
      <button
        onClick={sendEmailToUser}
        disabled={isSending}
        className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {isSending ? 'Sending...' : 'Email Me My Results'}
      </button>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
    </div>
  );
}
