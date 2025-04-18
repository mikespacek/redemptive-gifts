/**
 * Email service for sending test results using Formspree
 * 
 * This module uses Formspree (https://formspree.io/) to send emails.
 * No domain validation required, works directly from the browser.
 */

import { TestResult } from './google-sheets';

// Formspree configuration
// You'll need to sign up at formspree.io and create a form
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'; // Replace with your form ID

/**
 * Send test results via email to the admin using Formspree
 * 
 * @param result The test result to send
 * @returns A promise that resolves when the email is sent
 */
export async function sendResultsFormspree(result: TestResult): Promise<{ success: boolean; message: string }> {
  try {
    // Format the scores for email
    const formattedScores = Object.entries(result.scores)
      .map(([gift, score]) => `${gift.charAt(0).toUpperCase() + gift.slice(1)}: ${score}`)
      .join(", ");

    // Prepare form data
    const formData = {
      subject: `Redemptive Gifts Test Result - ${result.fullName || 'Anonymous User'}`,
      name: result.fullName || 'Anonymous User',
      email: result.email || 'Not provided',
      test_date: new Date(result.timestamp).toLocaleString(),
      dominant_gift: result.dominantGift.charAt(0).toUpperCase() + result.dominantGift.slice(1),
      secondary_gift: result.secondaryGift.charAt(0).toUpperCase() + result.secondaryGift.slice(1),
      all_scores: formattedScores
    };

    // Send the form data to Formspree
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      throw new Error(`Formspree responded with ${response.status}: ${await response.text()}`);
    }

    console.log('Formspree SUCCESS:', await response.json());
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error('Formspree ERROR:', error);
    return { 
      success: false, 
      message: "Failed to send email: " + (error as Error).message 
    };
  }
}
