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

    // Add the column scores with the correct field names expected by the Google Apps Script
    if (result.columnScores) {
      // Map column letters to the full field names expected by the Google Apps Script
      formattedData.teacherScore = result.columnScores.T;
      formattedData.giverScore = result.columnScores.G;
      formattedData.rulerScore = result.columnScores.R;
      formattedData.exhorterScore = result.columnScores.E;
      formattedData.mercyScore = result.columnScores.M;
      formattedData.prophetScore = result.columnScores.P;
      formattedData.servantScore = result.columnScores.S;

      // Log the scores for debugging
      console.log('Sending scores to Google Sheets:', {
        teacherScore: formattedData.teacherScore,
        giverScore: formattedData.giverScore,
        rulerScore: formattedData.rulerScore,
        exhorterScore: formattedData.exhorterScore,
        mercyScore: formattedData.mercyScore,
        prophetScore: formattedData.prophetScore,
        servantScore: formattedData.servantScore
      });
    }

    // Create a simple form and submit it directly
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = GOOGLE_SHEET_URL;

    // Create a hidden iframe for submission
    const iframe = document.createElement('iframe');
    iframe.name = 'hidden_iframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Target the hidden iframe to avoid page navigation
    form.target = 'hidden_iframe';

    // Add a single data field with JSON to the form
    // This is more compatible with the Google Apps Script
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'data';
    input.value = JSON.stringify(formattedData);
    form.appendChild(input);

    // Log the data being sent
    console.log('Sending data to Google Sheets:', formattedData);

    // Add the form to the document body
    document.body.appendChild(form);

    // Submit the form
    console.log('Submitting form to Google Sheets...');
    form.submit();

    // Remove the form and iframe after submission
    setTimeout(() => {
      if (document.body.contains(form)) {
        document.body.removeChild(form);
      }
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
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
