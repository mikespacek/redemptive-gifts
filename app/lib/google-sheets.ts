/**
 * Google Sheets Database API
 *
 * This module provides functions for interacting with Google Sheets as a database
 * for the Redemptive Gifts Test application.
 */

import { GiftType } from '../data/redemptiveGiftsQuestions';

// Define the test result interface
export interface TestResult {
  userId: string;
  scores: Record<GiftType, number>;
  dominantGift: GiftType;
  secondaryGift: GiftType;
  timestamp: number;
  fullName?: string;
  email?: string;
  firstName?: string;
  columnScores?: {
    T: number; // Teacher (Column 1)
    G: number; // Giver (Column 2)
    R: number; // Ruler (Column 3)
    E: number; // Exhorter (Column 4)
    M: number; // Mercy (Column 5)
    P: number; // Prophet (Column 6)
    S: number; // Servant (Column 7)
  };
}

// Define the question interface
export interface Question {
  id: number;
  text: string;
  giftType: GiftType;
}

/**
 * Send test results to Google Sheets
 *
 * @param result The test result to send
 * @returns A promise that resolves when the data is sent
 */
export async function sendResultToGoogleSheet(result: TestResult): Promise<{ success: boolean; message: string }> {
  try {
    // Get the Google Sheet URL from environment variables
    const GOOGLE_SHEET_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL ||
      'https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec';

    console.log('Sending data to Google Sheet URL:', GOOGLE_SHEET_URL);

    // Format the data for Google Sheets - use the actual gift scores
    const formattedData = {
      timestamp: new Date(result.timestamp).toISOString(),
      userId: result.userId,
      fullName: result.fullName || 'Anonymous',
      email: result.email || 'Not provided',
      dominantGift: result.dominantGift,
      secondaryGift: result.secondaryGift,
      // Use the actual gift scores that match what's shown on the results page
      teacherScore: result.scores.teacher || 0,
      giverScore: result.scores.giver || 0,
      rulerScore: result.scores.ruler || 0,
      exhorterScore: result.scores.exhorter || 0,
      mercyScore: result.scores.mercy || 0,
      prophetScore: result.scores.prophet || 0,
      servantScore: result.scores.servant || 0,
    };

    // Log both sets of scores for debugging
    console.log('Gift scores being sent to Google Sheet:', {
      teacher: result.scores.teacher,
      giver: result.scores.giver,
      ruler: result.scores.ruler,
      exhorter: result.scores.exhorter,
      mercy: result.scores.mercy,
      prophet: result.scores.prophet,
      servant: result.scores.servant
    });

    if (result.columnScores) {
      console.log('Column scores (not being used):', {
        T: result.columnScores.T,
        G: result.columnScores.G,
        R: result.columnScores.R,
        E: result.columnScores.E,
        M: result.columnScores.M,
        P: result.columnScores.P,
        S: result.columnScores.S
      });
    }

    console.log('Formatted data for Google Sheet:', formattedData);

    // Use form submission approach which is more reliable for Google Sheets
    console.log('Sending data to Google Sheet using form submission');

    // Create a hidden iframe for submission
    const iframe = document.createElement('iframe');
    iframe.name = 'hidden_iframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Create a form element to submit the data
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = GOOGLE_SHEET_URL;
    form.target = 'hidden_iframe'; // Target the hidden iframe

    // Create a hidden input field for the data
    const hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = 'data';
    hiddenField.value = JSON.stringify(formattedData);

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
    }, 1000);

    console.log('Form submission completed');

    // Store the result in localStorage for local access
    localStorage.setItem('testResults', JSON.stringify(result));

    return { success: true, message: 'Results submitted to Google Sheet' };
  } catch (error) {
    console.error('Error sending results to Google Sheet:', error);
    return {
      success: false,
      message: 'Failed to submit results to Google Sheet: ' + (error as Error).message
    };
  }
}

/**
 * Get all test results for a user
 *
 * @param userId The user ID to get results for
 * @returns The user's test results, or null if none exist
 */
export function getResultsByUser(userId: string): TestResult | null {
  try {
    // For now, we're just using localStorage
    const storedResults = localStorage.getItem('testResults');
    if (storedResults) {
      const result = JSON.parse(storedResults) as TestResult;
      if (result.userId === userId) {
        return result;
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting results for user:', error);
    return null;
  }
}

/**
 * Get a test result by ID
 *
 * @param resultId The result ID to get
 * @returns The test result, or null if it doesn't exist
 */
export function getResultById(resultId: string): TestResult | null {
  try {
    // For now, we're just using localStorage
    const storedResults = localStorage.getItem('testResults');
    if (storedResults) {
      return JSON.parse(storedResults) as TestResult;
    }
    return null;
  } catch (error) {
    console.error('Error getting result by ID:', error);
    return null;
  }
}

/**
 * Get the most recent test result for a user
 *
 * @param userId The user ID to get the most recent result for
 * @returns The user's most recent test result, or null if none exist
 */
export function getMostRecentResultByUser(userId: string): TestResult | null {
  return getResultsByUser(userId);
}

/**
 * Test the Google Sheets connection
 *
 * @returns A promise that resolves with the test result
 */
export async function testGoogleSheetsConnection(): Promise<{ success: boolean; message: string }> {
  try {
    // Get the Google Sheet URL from environment variables
    const GOOGLE_SHEET_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL ||
      'https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec';

    console.log('Testing Google Sheets connection to URL:', GOOGLE_SHEET_URL);

    // Try using JSONP approach with a dynamic script tag
    return new Promise((resolve) => {
      // Create a unique callback name
      const callbackName = 'googleSheetsCallback_' + Math.random().toString(36).substring(2, 15);

      // Add the callback to the window object
      (window as any)[callbackName] = (data: any) => {
        // Clean up
        document.body.removeChild(script);
        delete (window as any)[callbackName];

        console.log('Received response via JSONP:', data);
        resolve({
          success: true,
          message: 'Successfully connected to Google Sheet via JSONP'
        });
      };

      // Create a script element
      const script = document.createElement('script');

      // Add a timestamp to prevent caching
      const timestamp = new Date().getTime();
      script.src = `${GOOGLE_SHEET_URL}?callback=${callbackName}&_=${timestamp}`;

      // Handle errors
      script.onerror = () => {
        // Clean up
        document.body.removeChild(script);
        delete (window as any)[callbackName];

        console.error('JSONP request failed');
        resolve({
          success: false,
          message: 'Failed to connect to Google Sheet via JSONP'
        });
      };

      // Set a timeout
      const timeoutId = setTimeout(() => {
        // Check if the script is still in the DOM
        if (document.body.contains(script)) {
          // Clean up
          document.body.removeChild(script);
          delete (window as any)[callbackName];

          console.error('JSONP request timed out');
          resolve({
            success: false,
            message: 'Connection to Google Sheet timed out'
          });
        }
      }, 10000); // 10 second timeout

      // Add the script to the page
      document.body.appendChild(script);

      console.log('JSONP request sent to Google Sheet');
    });
  } catch (error) {
    console.error('Error testing Google Sheets connection:', error);
    return {
      success: false,
      message: 'Failed to connect to Google Sheet: ' + (error as Error).message
    };
  }
}
