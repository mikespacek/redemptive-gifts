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

    // Format date in 12-hour format: MM/DD/YYYY hh:mm:ss AM/PM
    const formatDate = (date: Date | number): string => {
      const d = new Date(date);

      // Format date as MM/DD/YYYY
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      const year = d.getFullYear();

      // Format time in 12-hour format with AM/PM
      let hours = d.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const minutes = d.getMinutes().toString().padStart(2, '0');
      const seconds = d.getSeconds().toString().padStart(2, '0');

      return `${month}/${day}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
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
      strengths: '<li>Ability to see root causes</li><li>Strong sense of justice</li><li>Passionate about truth</li>',
      challenges: '<li>Can be overly critical</li><li>May struggle with patience</li><li>Sometimes too direct</li>',
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

export async function sendResultsEmailJS(result: TestResult): Promise<{ success: boolean; message: string }> {
  console.log('EmailJS function called with result:', {
    fullName: result.fullName,
    email: result.email,
    dominantGift: result.dominantGift,
    secondaryGift: result.secondaryGift,
    timestamp: result.timestamp
  });
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

    // Format strengths and challenges as HTML list items
    const strengths = giftDescriptions[dominantGiftType].strengths
      .map(s => `<li>${s}</li>`)
      .join('');

    const challenges = giftDescriptions[dominantGiftType].challenges
      .map(c => `<li>${c}</li>`)
      .join('');

    // Get the application URL from environment or use a default
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://your-design.unionhouston.com';

    // Format date in 12-hour format: MM/DD/YYYY hh:mm:ss AM/PM
    const formatDate = (date: Date | number): string => {
      const d = new Date(date);

      // Format date as MM/DD/YYYY
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      const year = d.getFullYear();

      // Format time in 12-hour format with AM/PM
      let hours = d.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const minutes = d.getMinutes().toString().padStart(2, '0');
      const seconds = d.getSeconds().toString().padStart(2, '0');

      return `${month}/${day}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
    };

    // Format the date for display
    const testDate = formatDate(result.timestamp);

    // Capitalize gift names
    const capitalizedDominantGift = result.dominantGift.charAt(0).toUpperCase() + result.dominantGift.slice(1);
    const capitalizedSecondaryGift = result.secondaryGift.charAt(0).toUpperCase() + result.secondaryGift.slice(1);

    // Extract first name for personalization
    const firstName = result.firstName || result.fullName?.split(' ')[0] || 'Friend';

    // Prepare template parameters
    const templateParams = {
      // Basic info
      to_email: ADMIN_EMAIL,
      from_name: 'Your Design',
      subject: `Your Design Test Result - ${result.fullName || 'Anonymous User'}`,
      user_name: firstName,
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
      emailjs.init(EMAILJS_PUBLIC_KEY);
      console.log('EmailJS initialized successfully');
    } catch (initError) {
      console.error('Error initializing EmailJS:', initError);
      throw new Error(`EmailJS initialization failed: ${initError instanceof Error ? initError.message : String(initError)}`);
    }

    // Send the email
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('EmailJS SUCCESS:', response);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error('EmailJS ERROR:', error);

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

    let errorMessage = "Failed to send email";

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
