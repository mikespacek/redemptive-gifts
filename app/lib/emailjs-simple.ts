'use client';

import emailjs from '@emailjs/browser';
import { TestResult } from '../types/test-types';
import { giftDescriptions } from './gift-descriptions';

// EmailJS configuration - use hardcoded values as fallback to ensure it works
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_4tgz7bd';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_mzzf8vc';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'vaFeAuSrJZXHN4OTu';
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'mikespacek@unionhouston.com';

/**
 * Send test results via email to the admin using EmailJS
 *
 * @param result The test result to send
 * @returns Promise with success status and message
 */
export async function sendResultsEmailJS(
  result: TestResult
): Promise<{ success: boolean; message: string }> {
  try {
    console.log('EmailJS function called with result:', {
      fullName: result.fullName,
      email: result.email,
      dominantGift: result.dominantGift,
      secondaryGift: result.secondaryGift,
      timestamp: result.timestamp
    });

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

    // Format date in 12-hour format: YYYY-MM-DD hh:mm:ss AM/PM
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

        // Format date as YYYY-MM-DD hh:mm:ss AM/PM
        return d.toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });
      } catch (error) {
        console.error('Error formatting date:', error);
        // Return current date as fallback
        const now = new Date();
        return now.toLocaleString('en-US');
      }
    };

    // Format the date for display
    const testDate = formatDate(result.timestamp);

    // Capitalize gift names
    const capitalizedDominantGift = result.dominantGift.charAt(0).toUpperCase() + result.dominantGift.slice(1);
    const capitalizedSecondaryGift = result.secondaryGift.charAt(0).toUpperCase() + result.secondaryGift.slice(1);

    // Use full name for personalization
    const userName = result.fullName || 'Friend';

    // Check if user provided an email
    const userHasEmail = result.email && result.email.includes('@');

    // Prepare template parameters for admin email
    const adminTemplateParams = {
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

    console.log('Sending emails with EmailJS:', {
      serviceId: EMAILJS_SERVICE_ID,
      templateId: EMAILJS_TEMPLATE_ID,
      publicKey: EMAILJS_PUBLIC_KEY ? 'Configured' : 'Not configured',
      sendingToUser: userHasEmail
    });

    // Initialize EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);

    // Create a single template that includes both admin and user emails
    // This prevents duplicate emails to the admin
    const combinedTemplateParams = {
      ...adminTemplateParams,
      // If user has email, include it in the CC field
      cc_email: userHasEmail ? result.email : '',
      // Add a flag to indicate if user should receive a copy
      send_to_user: userHasEmail ? 'yes' : 'no',
      // Include user email for reference
      user_email_for_cc: userHasEmail ? result.email : 'No email provided'
    };

    console.log('Sending combined email with params:', {
      to_email: combinedTemplateParams.to_email,
      cc_email: combinedTemplateParams.cc_email,
      send_to_user: combinedTemplateParams.send_to_user,
      subject: combinedTemplateParams.subject
    });

    // Send a single email with CC to user if provided
    const emailResponse = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      combinedTemplateParams
    );

    console.log('Email sent successfully:', emailResponse);

    // Return success message based on whether user received a copy
    if (userHasEmail) {
      return {
        success: true,
        message: "Email sent to admin and copied to user"
      };
    } else {
      return {
        success: true,
        message: "Email sent to admin only (no user email provided)"
      };
    }
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
