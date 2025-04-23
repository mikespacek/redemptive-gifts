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
 * Send test results to Google Sheets with retry logic and enhanced error handling
 *
 * @param result The test result to send
 * @param maxRetries Maximum number of retry attempts (default: 3)
 * @returns A promise that resolves when the data is sent
 */
export async function sendResultToGoogleSheet(
  result: TestResult,
  maxRetries: number = 3
): Promise<{ success: boolean; message: string }> {
  // Store a backup of the result in localStorage for recovery purposes
  try {
    localStorage.setItem('lastTestResult', JSON.stringify(result));
    localStorage.setItem('pendingGoogleSheetsSubmission', JSON.stringify({
      result,
      timestamp: Date.now(),
      attempts: 0
    }));
    console.log('Test result saved to localStorage as backup');
  } catch (storageError) {
    console.warn('Could not save test result to localStorage:', storageError);
  }

  // Implement retry logic
  let currentRetry = 0;
  let lastError = null;

  while (currentRetry <= maxRetries) {
    try {
      // Get the Google Sheet URL from environment variables
      const GOOGLE_SHEET_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL ||
        'https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec';

      console.log(`Sending data to Google Sheet URL (attempt ${currentRetry + 1}/${maxRetries + 1}):`, GOOGLE_SHEET_URL);

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

    // Skip fetch API attempt and go straight to form submission which is more reliable
    console.log('Using form submission method for Google Sheets...');

    // Create a Promise to handle the form submission with a timeout
    return new Promise((resolve) => {
      try {
        // Create a unique ID for this submission attempt
        const submissionId = `submission-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        // Create a hidden iframe for form target
        const iframeId = `google-sheets-iframe-${submissionId}`;
        let iframe = document.createElement('iframe');
        iframe.id = iframeId;
        iframe.name = iframeId;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        // Create a form element to submit the data
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = GOOGLE_SHEET_URL;
        form.target = iframeId; // Target the hidden iframe
        form.style.display = 'none';
        form.id = `google-sheets-form-${submissionId}`;

        // Add a submission ID to track this specific submission
        const submissionIdField = document.createElement('input');
        submissionIdField.type = 'hidden';
        submissionIdField.name = 'submissionId';
        submissionIdField.value = submissionId;
        form.appendChild(submissionIdField);

        // Create a single hidden input with all data as JSON
        const jsonField = document.createElement('input');
        jsonField.type = 'hidden';
        jsonField.name = 'data';
        jsonField.value = JSON.stringify(formattedData);
        form.appendChild(jsonField);

        // Also add each field individually as a fallback
        Object.entries(formattedData).forEach(([key, value]) => {
          const field = document.createElement('input');
          field.type = 'hidden';
          field.name = key;
          field.value = String(value);
          form.appendChild(field);
        });

        // Add the form to the document body
        document.body.appendChild(form);

        // Set a timeout to consider the submission successful after 5 seconds
        // This is because we can't directly detect success with the iframe approach
        const timeoutId = setTimeout(() => {
          console.log(`Form submission ${submissionId} considered successful (timeout)`);

          // Update the pending submission in localStorage to mark it as successful
          try {
            localStorage.removeItem('pendingGoogleSheetsSubmission');
          } catch (e) {
            console.warn('Could not remove pending submission from localStorage:', e);
          }

          // Clean up the form and iframe
          cleanupFormAndIframe();

          // Resolve the promise as successful
          resolve({
            success: true,
            message: `Results submitted to Google Sheet (submission ID: ${submissionId})`
          });
        }, 5000);

        // Function to clean up the form and iframe
        const cleanupFormAndIframe = () => {
          try {
            // Remove the form if it still exists
            const formElement = document.getElementById(`google-sheets-form-${submissionId}`);
            if (formElement && document.body.contains(formElement)) {
              document.body.removeChild(formElement);
            }

            // Remove the iframe if it still exists
            const iframeElement = document.getElementById(iframeId);
            if (iframeElement && document.body.contains(iframeElement)) {
              document.body.removeChild(iframeElement);
            }
          } catch (cleanupError) {
            console.warn('Error cleaning up form or iframe:', cleanupError);
          }
        };

        // Submit the form
        console.log(`Submitting form to Google Sheets (submission ID: ${submissionId})...`);
        form.submit();

        // Store the result in localStorage for local access
        localStorage.setItem('testResults', JSON.stringify(result));

        // We don't resolve here because we're waiting for the timeout
        // The promise will be resolved by the timeout handler
      } catch (formError) {
        console.error('Form submission error:', formError);

        // If this is not the last retry, throw the error to trigger another retry
        if (currentRetry < maxRetries) {
          throw formError;
        }

        // Otherwise, resolve with failure
        resolve({
          success: false,
          message: 'Error submitting to Google Sheet: ' + (formError as Error).message
        });
      }
    });

    // If we get here, there was an error in the current attempt
    lastError = error;
    console.error(`Error in Google Sheets submission attempt ${currentRetry + 1}/${maxRetries + 1}:`, error);

    // Increment retry counter
    currentRetry++;

    // If we have retries left, wait before trying again
    if (currentRetry <= maxRetries) {
      // Exponential backoff: wait longer for each retry
      const waitTime = Math.min(1000 * Math.pow(2, currentRetry), 10000); // Max 10 seconds
      console.log(`Retrying in ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
    // If we've exhausted all retries and still failed
    console.error(`Failed to submit to Google Sheets after ${maxRetries + 1} attempts`);

    // Store the failed submission for potential recovery later
    try {
      const pendingSubmission = JSON.parse(localStorage.getItem('pendingGoogleSheetsSubmission') || '{}');
      pendingSubmission.attempts = (pendingSubmission.attempts || 0) + 1;
      pendingSubmission.lastAttempt = Date.now();
      pendingSubmission.lastError = lastError ? (lastError as Error).message : 'Unknown error';
      localStorage.setItem('pendingGoogleSheetsSubmission', JSON.stringify(pendingSubmission));
    } catch (e) {
      console.warn('Could not update pending submission in localStorage:', e);
    }

    return {
      success: false,
      message: `Failed to submit results to Google Sheet after ${maxRetries + 1} attempts: ${lastError ? (lastError as Error).message : 'Unknown error'}`
    };
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
 * Retry any pending Google Sheets submissions that failed previously
 * This should be called when the app initializes
 */
export async function retryPendingGoogleSheetsSubmissions(): Promise<void> {
  if (typeof window === 'undefined') return; // Skip during SSR

  try {
    // Check if there's a pending submission
    const pendingSubmissionStr = localStorage.getItem('pendingGoogleSheetsSubmission');
    if (!pendingSubmissionStr) return;

    const pendingSubmission = JSON.parse(pendingSubmissionStr);

    // Only retry if the submission is less than 24 hours old
    const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours
    const now = Date.now();
    const submissionTime = pendingSubmission.timestamp || 0;

    if (now - submissionTime > MAX_AGE_MS) {
      console.log('Pending submission is too old, removing it');
      localStorage.removeItem('pendingGoogleSheetsSubmission');
      return;
    }

    // Only retry if we haven't tried too many times already
    const MAX_ATTEMPTS = 5;
    if ((pendingSubmission.attempts || 0) >= MAX_ATTEMPTS) {
      console.log(`Pending submission has been attempted ${pendingSubmission.attempts} times, giving up`);
      return;
    }

    console.log('Found pending Google Sheets submission, retrying...');

    // Retry the submission
    const result = await sendResultToGoogleSheet(pendingSubmission.result);

    if (result.success) {
      console.log('Successfully retried pending Google Sheets submission');
      localStorage.removeItem('pendingGoogleSheetsSubmission');
    } else {
      console.warn('Failed to retry pending Google Sheets submission:', result.message);
    }
  } catch (error) {
    console.error('Error retrying pending Google Sheets submission:', error);
  }
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
