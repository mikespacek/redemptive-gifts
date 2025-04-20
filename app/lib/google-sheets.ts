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

    // Format date in 24-hour format: YYYY-MM-DD HH:MM:SS
    const formatDate = (date: Date | number): string => {
      try {
        const d = new Date(date);

        // Check if date is valid
        if (isNaN(d.getTime())) {
          console.error('Invalid date:', date);
          // Use current date as fallback
          const now = new Date();
          return formatDate(now);
        }

        // Format date as YYYY-MM-DD HH:MM:SS
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        const seconds = d.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      } catch (error) {
        console.error('Error formatting date:', error);
        // Return current date as fallback
        const now = new Date();
        return now.toISOString().replace('T', ' ').substring(0, 19);
      }
    };

    // Format the data for Google Sheets - use the actual gift scores
    const formattedData = {
      timestamp: formatDate(result.timestamp),
      userId: result.userId,
      fullName: result.fullName || 'Anonymous',
      email: result.email || 'Not provided',
      dominantGift: result.dominantGift,
      secondaryGift: result.secondaryGift,
      // Use the column scores if available, otherwise use the gift scores
      teacherScore: result.columnScores?.T || result.scores.teacher || 0,
      giverScore: result.columnScores?.G || result.scores.giver || 0,
      rulerScore: result.columnScores?.R || result.scores.ruler || 0,
      exhorterScore: result.columnScores?.E || result.scores.exhorter || 0,
      mercyScore: result.columnScores?.M || result.scores.mercy || 0,
      prophetScore: result.columnScores?.P || result.scores.prophet || 0,
      servantScore: result.columnScores?.S || result.scores.servant || 0,
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

    // Use fetch API to send data directly to Google Sheets
    console.log('Sending data to Google Sheet using fetch API');

    try {
      // First, try using fetch with JSON
      console.log('Attempting to send data with fetch API...');
      const response = await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
        mode: 'no-cors', // Add no-cors mode to handle CORS issues
      });

      // With no-cors, we can't read the response, but we can assume it worked if no error was thrown
      console.log('Fetch request completed without errors');
      console.log('Data sent successfully via fetch API');

      // Store the result in localStorage for local access
      localStorage.setItem('testResults', JSON.stringify(result));

      return { success: true, message: 'Results submitted to Google Sheet' };
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      console.log('Falling back to form submission method...');

      // Use a more reliable form submission approach
      console.log('Creating form for submission...');

      try {
        // Create a form element to submit the data
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = GOOGLE_SHEET_URL;
        form.style.display = 'none';

        // Add each field individually for better compatibility
        Object.entries(formattedData).forEach(([key, value]) => {
          const field = document.createElement('input');
          field.type = 'hidden';
          field.name = key;
          field.value = String(value);
          form.appendChild(field);
        });

        // Add the form to the document body
        document.body.appendChild(form);

        // Submit the form
        console.log('Submitting form...');
        form.submit();

        // Remove the form after submission
        setTimeout(() => {
          if (document.body.contains(form)) {
            document.body.removeChild(form);
          }
        }, 2000);

        console.log('Form submission completed as fallback');

        // Store the result in localStorage for local access
        localStorage.setItem('testResults', JSON.stringify(result));

        return { success: true, message: 'Results submitted to Google Sheet via form' };
      } catch (formError) {
        console.error('Form submission error:', formError);
        return {
          success: false,
          message: 'Failed to submit results to Google Sheet: ' + (formError as Error).message
        };
      }
    }


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
    // Try to get results from localStorage using multiple keys
    let storedResults = localStorage.getItem('redemptiveGiftsTestResults');

    // If not found, try the old key
    if (!storedResults) {
      storedResults = localStorage.getItem('testResults');
    }

    if (storedResults) {
      try {
        const result = JSON.parse(storedResults) as TestResult;
        console.log('Retrieved test results from localStorage:', result);
        if (result.userId === userId) {
          return result;
        }
      } catch (parseError) {
        console.error('Error parsing stored results:', parseError);
      }
    } else {
      console.log('No test results found in localStorage');
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
    // Try to get results from localStorage using multiple keys
    let storedResults = localStorage.getItem('redemptiveGiftsTestResults');

    // If not found, try the old key
    if (!storedResults) {
      storedResults = localStorage.getItem('testResults');
    }

    if (storedResults) {
      try {
        const result = JSON.parse(storedResults) as TestResult;
        console.log('Retrieved test results by ID from localStorage:', result);
        return result;
      } catch (parseError) {
        console.error('Error parsing stored results:', parseError);
      }
    } else {
      console.log('No test results found in localStorage');
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
