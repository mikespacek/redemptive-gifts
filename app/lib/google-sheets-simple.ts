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
      // Use the exact field names that the Google Apps Script is expecting
      formattedData.score_T = result.columnScores.T;
      formattedData.score_G = result.columnScores.G;
      formattedData.score_R = result.columnScores.R;
      formattedData.score_E = result.columnScores.E;
      formattedData.score_M = result.columnScores.M;
      formattedData.score_P = result.columnScores.P;
      formattedData.score_S = result.columnScores.S;

      // Log the scores for debugging
      console.log('Sending scores to Google Sheets:', {
        score_T: formattedData.score_T,
        score_G: formattedData.score_G,
        score_R: formattedData.score_R,
        score_E: formattedData.score_E,
        score_M: formattedData.score_M,
        score_P: formattedData.score_P,
        score_S: formattedData.score_S
      });
    }

    // Use fetch API for more reliable submission
    try {
      console.log('Sending data to Google Sheets via fetch');

      // Create form data for the request
      const formData = new FormData();
      Object.entries(formattedData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      // Send the request
      const response = await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors', // Important for CORS issues
        body: formData
      });

      console.log('Google Sheets fetch completed');
      return {
        success: true,
        message: 'Results submitted to Google Sheet'
      };
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);

      // Fallback to form submission if fetch fails
      console.log('Falling back to form submission');

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
        message: 'Results submitted to Google Sheet via form fallback'
      };
    }
  } catch (error) {
    console.error('Error sending results to Google Sheet:', error);
    return {
      success: false,
      message: 'Failed to submit results to Google Sheet: ' + (error as Error).message
    };
  }
}
