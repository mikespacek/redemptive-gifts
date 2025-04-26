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
      'https://script.google.com/macros/s/AKfycbyBcBmJFHVcyZ6xHZr1X0vcYrB5B7cxTKNPTliR4kkYj0vTvrIUr88I-IszJ49Y2FbD/exec';

    console.log('Sending data to Google Sheet URL:', GOOGLE_SHEET_URL);

    // Format the data for the Google Sheet - use the exact field names expected by the Google Apps Script
    const formattedData: Record<string, any> = {
      userId: result.userId,
      timestamp: new Date().toISOString(),
      fullName: result.fullName || 'Anonymous',
      email: result.email || 'No email provided',
      dominantGift: result.dominantGift,
      secondaryGift: result.secondaryGift,
    };

    // Add the column scores with the EXACT field names expected by the Google Apps Script
    if (result.columnScores) {
      // Try multiple field name formats to ensure compatibility
      // Format 1: Using teacherScore, giverScore, etc.
      formattedData.teacherScore = result.columnScores.T;
      formattedData.giverScore = result.columnScores.G;
      formattedData.rulerScore = result.columnScores.R;
      formattedData.exhorterScore = result.columnScores.E;
      formattedData.mercyScore = result.columnScores.M;
      formattedData.prophetScore = result.columnScores.P;
      formattedData.servantScore = result.columnScores.S;

      // Format 2: Using score_T, score_G, etc.
      formattedData.score_T = result.columnScores.T;
      formattedData.score_G = result.columnScores.G;
      formattedData.score_R = result.columnScores.R;
      formattedData.score_E = result.columnScores.E;
      formattedData.score_M = result.columnScores.M;
      formattedData.score_P = result.columnScores.P;
      formattedData.score_S = result.columnScores.S;

      // Format 3: Using T, G, R, etc. directly
      formattedData.T = result.columnScores.T;
      formattedData.G = result.columnScores.G;
      formattedData.R = result.columnScores.R;
      formattedData.E = result.columnScores.E;
      formattedData.M = result.columnScores.M;
      formattedData.P = result.columnScores.P;
      formattedData.S = result.columnScores.S;

      // Log the scores for debugging
      console.log('Sending scores to Google Sheets (multiple formats):', {
        // Format 1
        teacherScore: formattedData.teacherScore,
        giverScore: formattedData.giverScore,
        rulerScore: formattedData.rulerScore,
        exhorterScore: formattedData.exhorterScore,
        mercyScore: formattedData.mercyScore,
        prophetScore: formattedData.prophetScore,
        servantScore: formattedData.servantScore,

        // Format 2
        score_T: formattedData.score_T,
        score_G: formattedData.score_G,
        score_R: formattedData.score_R,
        score_E: formattedData.score_E,
        score_M: formattedData.score_M,
        score_P: formattedData.score_P,
        score_S: formattedData.score_S,

        // Format 3
        T: formattedData.T,
        G: formattedData.G,
        R: formattedData.R,
        E: formattedData.E,
        M: formattedData.M,
        P: formattedData.P,
        S: formattedData.S
      });
    }

    // Use direct form submission which is more reliable for Google Apps Script
    console.log('Using direct form submission to Google Sheets');

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

    // Add each field to the form
    Object.entries(formattedData).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });

    // Add a single data field with JSON to the form as a backup
    // This is more compatible with some Google Apps Script implementations
    const jsonInput = document.createElement('input');
    jsonInput.type = 'hidden';
    jsonInput.name = 'data';
    jsonInput.value = JSON.stringify(formattedData);
    form.appendChild(jsonInput);

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
