/**
 * Email service for sending test results using EmailJS
 *
 * This module uses EmailJS (https://www.emailjs.com/) to send emails.
 * No domain validation required, works directly from the browser.
 */

import emailjs from '@emailjs/browser';
import { TestResult } from './google-sheets';
import { giftDescriptions } from './gift-descriptions';

// EmailJS configuration
// You'll need to sign up at emailjs.com and get these values
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'default_service';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_default';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'mike@unionhouston.com';

/**
 * Send test results via email to the admin using EmailJS
 *
 * @param result The test result to send
 * @returns A promise that resolves when the email is sent
 */
/**
 * Test EmailJS configuration
 * This function can be called to test if EmailJS is properly configured
 */
export async function testEmailJSConfig(): Promise<{ success: boolean; message: string }> {
  try {
    console.log('Testing EmailJS configuration...');

    // Log the actual configuration values for debugging
    console.log('EmailJS Configuration Details:', {
      serviceId: EMAILJS_SERVICE_ID,
      templateId: EMAILJS_TEMPLATE_ID,
      publicKey: EMAILJS_PUBLIC_KEY ? EMAILJS_PUBLIC_KEY.substring(0, 4) + '...' : undefined,
      adminEmail: ADMIN_EMAIL
    });

    // Validate configuration
    if (!EMAILJS_SERVICE_ID) {
      throw new Error('EmailJS Service ID is not configured');
    }

    if (!EMAILJS_TEMPLATE_ID) {
      throw new Error('EmailJS Template ID is not configured');
    }

    if (!EMAILJS_PUBLIC_KEY) {
      throw new Error('EmailJS Public Key is not configured');
    }

    if (!ADMIN_EMAIL) {
      throw new Error('Admin Email is not configured');
    }

    // Initialize EmailJS
    console.log('Initializing EmailJS...');
    emailjs.init(EMAILJS_PUBLIC_KEY);

    // Get the application URL from environment or use a default
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://your-design.unionhouston.com';

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

    // Format the date for display
    const testDate = formatDate(new Date());

    // Prepare template parameters
    const templateParams = {
      // Basic info
      to_email: ADMIN_EMAIL,
      from_name: 'Your Design',
      subject: 'EmailJS Test - Configuration Check',
      user_name: 'Test User',
      user_email: 'test@example.com',
      test_date: testDate,
      app_url: appUrl,

      // Gift results
      dominant_gift: 'Prophet',
      secondary_gift: 'Teacher',
      all_scores: 'Prophet: 42, Teacher: 35, Exhorter: 30, Mercy: 28, Ruler: 25, Giver: 20, Servant: 18',
      message: 'This is a test email to verify EmailJS configuration',

      // Column scores for the table
      column_t: 35,
      column_g: 20,
      column_r: 25,
      column_e: 30,
      column_m: 28,
      column_p: 42,
      column_s: 18,

      // Gift profile details
      principle: 'Test Principle - Design is the foundation of all creation',
      summary: 'Test Summary - This is a sample summary of the gift description that would appear in the results',
      strengths: '• Ability to see root causes\n• Strong sense of justice\n• Passionate about truth',
      challenges: '• Can be overly critical\n• May struggle with patience\n• Sometimes too direct',
      mature_gift: 'Test Mature Gift - When mature, this gift brings clarity and wisdom to situations',
      carnal_gift: 'Test Carnal Gift - When immature, this gift can manifest as judgment and criticism',
      battlefield: 'Test Battlefield - The primary area of spiritual warfare is the mind',
      legitimacy_lie: 'Test Legitimacy Lie - I am only valuable when I am right',
      biblical_example: 'Test Biblical Example - Elijah demonstrated this gift through his confrontation of evil',
      birthright: 'Test Birthright - The ability to bring transformation through truth'
    };

    console.log('Sending test email with params:', {
      ...templateParams,
      // Don't log the full HTML content for cleaner logs
      strengths: '(HTML content)',
      challenges: '(HTML content)'
    });

    // Send a test email
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('EmailJS Test SUCCESS:', response);
    return { success: true, message: "Test email sent successfully to " + ADMIN_EMAIL };
  } catch (error) {
    console.error('EmailJS Test ERROR:', error);

    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    } else {
      console.error('Unknown error type:', typeof error);
    }

    let errorMessage = "Failed to send test email";

    if (error instanceof Error) {
      errorMessage += ": " + error.message;
    } else if (typeof error === 'object' && error !== null) {
      try {
        errorMessage += ": " + JSON.stringify(error);
      } catch (e) {
        errorMessage += ": [Object cannot be stringified]";
      }
    } else {
      errorMessage += ": " + String(error);
    }

    return {
      success: false,
      message: errorMessage
    };
  }
}

/**
 * Send test results via email to the admin using EmailJS with enhanced reliability
 *
 * @param result The test result to send
 * @param maxRetries Maximum number of retry attempts (default: 3)
 * @returns A promise that resolves with success status and message
 */
export async function sendResultsEmailJS(
  result: TestResult,
  maxRetries: number = 3
): Promise<{ success: boolean; message: string }> {
  console.log('EmailJS function called with result:', {
    fullName: result.fullName,
    email: result.email,
    dominantGift: result.dominantGift,
    secondaryGift: result.secondaryGift,
    timestamp: result.timestamp
  });

  // Store a backup of the result in localStorage for recovery purposes
  try {
    localStorage.setItem('lastEmailJSResult', JSON.stringify(result));
    localStorage.setItem('pendingEmailJSSubmission', JSON.stringify({
      result,
      timestamp: Date.now(),
      attempts: 0
    }));
    console.log('Test result saved to localStorage as backup for EmailJS');
  } catch (storageError) {
    console.warn('Could not save test result to localStorage for EmailJS:', storageError);
  }

  // Implement retry logic
  let currentRetry = 0;
  let lastError = null;

  while (currentRetry <= maxRetries) {
    try {
    // Format the scores for email
    let formattedScores = '';

    // If we have column scores, use those for the formatted display
    if (result.columnScores) {
      formattedScores = `
        Teacher (T): ${result.columnScores.T}
        Giver (G): ${result.columnScores.G}
        Ruler (R): ${result.columnScores.R}
        Exhorter (E): ${result.columnScores.E}
        Mercy (M): ${result.columnScores.M}
        Prophet (P): ${result.columnScores.P}
        Servant (S): ${result.columnScores.S}
      `;
    } else if (result.scores) {
      // Otherwise use the regular scores object
      formattedScores = Object.entries(result.scores)
        .map(([gift, score]) => `${gift.charAt(0).toUpperCase() + gift.slice(1)}: ${score}`)
        .join(", ");
    }

    // Get the dominant gift type and prepare gift profile data
    const dominantGiftType = result.dominantGift as keyof typeof giftDescriptions;

    // Format strengths and challenges as plain text with bullet points
    const strengths = giftDescriptions[dominantGiftType].strengths
      .map(s => `• ${s}`)
      .join('\n');

    const challenges = giftDescriptions[dominantGiftType].challenges
      .map(c => `• ${c}`)
      .join('\n');

    // Get the application URL from environment or use a default
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://your-design.unionhouston.com';

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

    // Format the date for display
    const testDate = formatDate(result.timestamp);

    // Capitalize gift names
    const capitalizedDominantGift = result.dominantGift.charAt(0).toUpperCase() + result.dominantGift.slice(1);
    const capitalizedSecondaryGift = result.secondaryGift.charAt(0).toUpperCase() + result.secondaryGift.slice(1);

    // Use full name for personalization
    const userName = result.fullName || 'Friend';

    // Prepare template parameters
    const templateParams = {
      // Basic info
      to_email: ADMIN_EMAIL,
      from_name: 'Your Design',
      subject: `Your Design Test Result - ${result.fullName || 'Anonymous User'}`,
      user_name: userName,
      user_email: result.email || 'Not provided',
      test_date: testDate,
      app_url: appUrl,

      // Gift results
      dominant_gift: capitalizedDominantGift,
      secondary_gift: capitalizedSecondaryGift,
      all_scores: formattedScores,

      // Column scores for the table
      column_t: result.columnScores?.T || 0,
      column_g: result.columnScores?.G || 0,
      column_r: result.columnScores?.R || 0,
      column_e: result.columnScores?.E || 0,
      column_m: result.columnScores?.M || 0,
      column_p: result.columnScores?.P || 0,
      column_s: result.columnScores?.S || 0,

      // Gift profile details
      principle: giftDescriptions[dominantGiftType].principle || 'Not available',
      summary: giftDescriptions[dominantGiftType].summary || 'Not available',
      strengths: strengths,
      challenges: challenges,
      mature_gift: giftDescriptions[dominantGiftType].matureGift || 'Not available',
      carnal_gift: giftDescriptions[dominantGiftType].carnalGift || 'Not available',
      battlefield: giftDescriptions[dominantGiftType].battlefield || 'Not available',
      legitimacy_lie: giftDescriptions[dominantGiftType].legitimacyLie || 'Not available',
      biblical_example: giftDescriptions[dominantGiftType].biblicalExample || 'Not available',
      birthright: giftDescriptions[dominantGiftType].birthright || 'Not available',

      // Legacy message field for compatibility
      message: `
        Dominant Gift: ${capitalizedDominantGift}
        Secondary Gift: ${capitalizedSecondaryGift}

        All Scores:
        ${formattedScores}
      `
    };

    console.log('Sending email with EmailJS:', {
      serviceId: EMAILJS_SERVICE_ID,
      templateId: EMAILJS_TEMPLATE_ID,
      publicKey: EMAILJS_PUBLIC_KEY ? 'Configured' : 'Not configured',
      templateParams: {
        ...templateParams,
        // Don't log the full HTML content for cleaner logs
        strengths: '(HTML content)',
        challenges: '(HTML content)'
      }
    });

    // Initialize EmailJS with your public key
    console.log('Initializing EmailJS with public key...');
    try {
      // Check if EmailJS is already initialized
      if (typeof (emailjs as any)._initialized === 'undefined' || !(emailjs as any)._initialized) {
        emailjs.init(EMAILJS_PUBLIC_KEY);
        console.log('EmailJS initialized successfully');
      } else {
        console.log('EmailJS already initialized');
      }
    } catch (initError) {
      console.error('Error initializing EmailJS:', initError);
      throw new Error(`EmailJS initialization failed: ${initError instanceof Error ? initError.message : String(initError)}`);
    }

    // Send the email with retry logic
    let retries = 2;
    let response;

    while (retries >= 0) {
      try {
        response = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams
        );
        break; // Success, exit the loop
      } catch (sendError) {
        if (retries > 0) {
          console.log(`EmailJS send failed, retrying... (${retries} attempts left)`);
          retries--;
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          // No more retries, rethrow the error
          throw sendError;
        }
      }
    }

      console.log('EmailJS SUCCESS:', response);

      // Remove the pending submission from localStorage
      try {
        localStorage.removeItem('pendingEmailJSSubmission');
      } catch (e) {
        console.warn('Could not remove pending EmailJS submission from localStorage:', e);
      }

      return { success: true, message: "Email sent successfully" };
    } catch (error) {
      // If we get here, there was an error in the current attempt
      lastError = error;
      console.error(`Error in EmailJS submission attempt ${currentRetry + 1}/${maxRetries + 1}:`, error);

      // More detailed error logging
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      } else {
        console.error('Unknown error type:', typeof error);
      }

      // Check if EmailJS configuration is valid
      console.error('EmailJS Configuration Check:', {
        serviceId: EMAILJS_SERVICE_ID,
        templateId: EMAILJS_TEMPLATE_ID,
        publicKey: EMAILJS_PUBLIC_KEY ? EMAILJS_PUBLIC_KEY.substring(0, 4) + '...' : undefined,
        adminEmail: ADMIN_EMAIL
      });

      // Increment retry counter
      currentRetry++;

      // If we have retries left, wait before trying again
      if (currentRetry <= maxRetries) {
        // Exponential backoff: wait longer for each retry
        const waitTime = Math.min(1000 * Math.pow(2, currentRetry), 10000); // Max 10 seconds
        console.log(`Retrying EmailJS in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  // If we've exhausted all retries and still failed
  console.error(`Failed to send email via EmailJS after ${maxRetries + 1} attempts`);

  // Store the failed submission for potential recovery later
  try {
    const pendingSubmission = JSON.parse(localStorage.getItem('pendingEmailJSSubmission') || '{}');
    pendingSubmission.attempts = (pendingSubmission.attempts || 0) + 1;
    pendingSubmission.lastAttempt = Date.now();
    pendingSubmission.lastError = lastError ? (lastError as Error).message : 'Unknown error';
    localStorage.setItem('pendingEmailJSSubmission', JSON.stringify(pendingSubmission));
  } catch (e) {
    console.warn('Could not update pending EmailJS submission in localStorage:', e);
  }

  let errorMessage = "Failed to send email";

  if (lastError instanceof Error) {
    errorMessage += ": " + lastError.message;
  } else if (typeof lastError === 'object' && lastError !== null) {
    try {
      errorMessage += ": " + JSON.stringify(lastError);
    } catch (e) {
      errorMessage += ": [Object cannot be stringified]";
    }
  } else if (lastError) {
    errorMessage += ": " + String(lastError);
  }

  return {
    success: false,
    message: errorMessage
  };
}

/**
 * Retry any pending EmailJS submissions that failed previously
 * This should be called when the app initializes
 */
export async function retryPendingEmailJSSubmissions(): Promise<void> {
  if (typeof window === 'undefined') return; // Skip during SSR

  try {
    // Check if there's a pending submission
    const pendingSubmissionStr = localStorage.getItem('pendingEmailJSSubmission');
    if (!pendingSubmissionStr) return;

    const pendingSubmission = JSON.parse(pendingSubmissionStr);

    // Only retry if the submission is less than 24 hours old
    const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours
    const now = Date.now();
    const submissionTime = pendingSubmission.timestamp || 0;

    if (now - submissionTime > MAX_AGE_MS) {
      console.log('Pending EmailJS submission is too old, removing it');
      localStorage.removeItem('pendingEmailJSSubmission');
      return;
    }

    // Only retry if we haven't tried too many times already
    const MAX_ATTEMPTS = 5;
    if ((pendingSubmission.attempts || 0) >= MAX_ATTEMPTS) {
      console.log(`Pending EmailJS submission has been attempted ${pendingSubmission.attempts} times, giving up`);
      return;
    }

    console.log('Found pending EmailJS submission, retrying...');

    // Retry the submission
    const result = await sendResultsEmailJS(pendingSubmission.result);

    if (result.success) {
      console.log('Successfully retried pending EmailJS submission');
      localStorage.removeItem('pendingEmailJSSubmission');
    } else {
      console.warn('Failed to retry pending EmailJS submission:', result.message);
    }
  } catch (error) {
    console.error('Error retrying pending EmailJS submission:', error);
  }
}