'use client';

import { TestResult } from '../types/test-types';

/**
 * Send test results to Google Sheets using a simple, direct approach
 *
 * @param result The test result to send
 * @returns Promise with success status and message
 */
export async function sendResultToGoogleSheet(
  result: TestResult
): Promise<{ success: boolean; message: string }> {
  try {
    // Store the result in localStorage as a backup
    localStorage.setItem('testResults', JSON.stringify(result));
    console.log('Test result saved to localStorage as backup');

    // Get the Google Sheet URL from environment variables
    const GOOGLE_SHEET_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL ||
      'https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec';

    console.log('Sending data to Google Sheet URL:', GOOGLE_SHEET_URL);

    // Format the data for the Google Sheet
    const formattedData: Record<string, any> = {
      userId: result.userId,
      timestamp: new Date().toISOString(),
      fullName: result.fullName || 'Anonymous',
      email: result.email || 'No email provided',
      dominantGift: result.dominantGift,
      secondaryGift: result.secondaryGift,
    };

    // Add the column scores
    if (result.columnScores) {
      Object.entries(result.columnScores).forEach(([column, score]) => {
        formattedData[`score_${column}`] = score;
      });
    }

    // Create a simple form and submit it directly
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = GOOGLE_SHEET_URL;
    form.target = '_blank'; // Open in a new tab to avoid navigation

    // Add each field to the form
    Object.entries(formattedData).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });

    // Add the form to the document body
    document.body.appendChild(form);

    // Submit the form
    console.log('Submitting form to Google Sheets...');
    form.submit();

    // Remove the form after submission
    setTimeout(() => {
      if (document.body.contains(form)) {
        document.body.removeChild(form);
      }
    }, 1000);

    return {
      success: true,
      message: 'Results submitted to Google Sheet'
    };
  } catch (error) {
    console.error('Error sending results to Google Sheet:', error);
    return {
      success: false,
      message: 'Failed to submit results to Google Sheet: ' + (error as Error).message
    };
  }
}
