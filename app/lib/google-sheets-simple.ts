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

    // Use fetch API to send data directly to Google Sheets
    console.log('Sending data to Google Sheets via fetch:', formattedData);

    // Create URL-encoded form data
    const formData = new URLSearchParams();
    Object.entries(formattedData).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    try {
      // Make the fetch request
      console.log('Sending fetch request to:', GOOGLE_SHEET_URL);
      const response = await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors', // This is important for CORS issues
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      console.log('Fetch response received:', response);

      // Since we're using no-cors mode, we can't actually read the response
      // But we can check if the request was sent successfully
      if (response) {
        console.log('Google Sheets request sent successfully');
      }
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      throw new Error('Failed to send data to Google Sheets: ' +
                     (fetchError instanceof Error ? fetchError.message : String(fetchError)));
    }

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
