/**
 * Direct EmailJS Integration
 *
 * This module provides a direct approach to integrate with EmailJS
 * without relying on complex methods.
 */

import { TestResult } from './google-sheets-direct';
import { giftDescriptions } from './gift-descriptions';

/**
 * Send test results via EmailJS using a direct approach
 *
 * @param result The test result to send
 * @returns A promise that resolves with the result of the operation
 */
export function sendEmailDirect(result: TestResult): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    try {
      // Get EmailJS configuration from environment variables
      const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://lighthearted-mooncake-5c49fc.netlify.app';

      // Check if EmailJS is configured
      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        console.error('EmailJS not configured properly');
        resolve({ success: false, message: 'EmailJS not configured properly' });
        return;
      }

      if (!ADMIN_EMAIL) {
        console.warn('Admin email not configured, using default');
      }

      console.log('Sending email with EmailJS:', {
        serviceId: EMAILJS_SERVICE_ID,
        templateId: EMAILJS_TEMPLATE_ID,
        publicKey: EMAILJS_PUBLIC_KEY ? 'Configured' : 'Not configured',
        adminEmail: ADMIN_EMAIL || 'Not configured'
      });

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

      // Format the test date
      const testDate = formatDate(result.timestamp);

      // Get the dominant gift type
      const dominantGiftType = result.dominantGift as keyof typeof giftDescriptions;

      // Capitalize the first letter of the gift types
      const capitalizedDominantGift = dominantGiftType.charAt(0).toUpperCase() + dominantGiftType.slice(1);
      const capitalizedSecondaryGift = result.secondaryGift.charAt(0).toUpperCase() + result.secondaryGift.slice(1);

      // Format the scores for display
      const formattedScores = Object.entries(result.scores)
        .map(([gift, score]) => `${gift.charAt(0).toUpperCase() + gift.slice(1)}: ${score}`)
        .join('\n');

      // Format strengths and challenges as plain text with bullet points
      const strengths = giftDescriptions[dominantGiftType].strengths
        .map(s => `• ${s}`)
        .join('\n');

      const challenges = giftDescriptions[dominantGiftType].challenges
        .map(c => `• ${c}`)
        .join('\n');

      // Use full name for personalization
      const userName = result.fullName || 'Friend';

      // Prepare template parameters
      const templateParams = {
        // Basic info
        to_email: ADMIN_EMAIL || 'mike@spacedigital.com',
        from_name: 'Your Design',
        subject: `Your Design Test Result - ${result.fullName || 'Anonymous User'}`,
        user_name: userName,
        user_email: result.email || 'Not provided',
        test_date: testDate,
        app_url: APP_URL,

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

      console.log('Email template parameters prepared');

      // Load the EmailJS SDK dynamically
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
      script.async = true;

      script.onload = () => {
        console.log('EmailJS SDK loaded');

        // Initialize EmailJS
        try {
          (window as any).emailjs.init(EMAILJS_PUBLIC_KEY);
          console.log('EmailJS initialized');

          // Send the email
          (window as any).emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams
          ).then(
            (response: any) => {
              console.log('EmailJS SUCCESS:', response);
              resolve({ success: true, message: "Email sent successfully" });
            },
            (error: any) => {
              console.error('EmailJS ERROR:', error);
              resolve({
                success: false,
                message: `Failed to send email: ${error.text || JSON.stringify(error)}`
              });
            }
          );
        } catch (initError) {
          console.error('Error initializing EmailJS:', initError);
          resolve({
            success: false,
            message: `EmailJS initialization failed: ${initError instanceof Error ? initError.message : String(initError)}`
          });
        }
      };

      script.onerror = (error) => {
        console.error('Error loading EmailJS SDK:', error);
        resolve({
          success: false,
          message: 'Failed to load EmailJS SDK'
        });
      };

      // Add the script to the document
      document.head.appendChild(script);
    } catch (error) {
      console.error('Error sending email:', error);
      resolve({
        success: false,
        message: 'Failed to send email: ' + (error instanceof Error ? error.message : String(error))
      });
    }
  });
}
