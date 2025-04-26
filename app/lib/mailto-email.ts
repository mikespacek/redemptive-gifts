'use client';

import { TestResult } from '../types/test-types';

/**
 * Open a mailto: link to send an email to the user
 * This is a simple approach that uses the user's default email client
 * 
 * @param result The test result to send
 * @returns Promise with success status and message
 */
export function openMailtoEmail(result: TestResult): { success: boolean; message: string } {
  try {
    // Check if user provided an email
    if (!result.email || !result.email.includes('@')) {
      console.log('No valid email provided, skipping mailto email');
      return {
        success: false,
        message: 'No valid email provided'
      };
    }

    console.log('Opening mailto email for user:', result.email);

    // Format the scores for email
    const formattedScores = result.columnScores ? 
      `Teacher: ${result.columnScores.T}, Giver: ${result.columnScores.G}, Ruler: ${result.columnScores.R}, 
       Exhorter: ${result.columnScores.E}, Mercy: ${result.columnScores.M}, Prophet: ${result.columnScores.P}, 
       Servant: ${result.columnScores.S}` : 
      'Scores not available';

    // Capitalize gift names
    const dominantGift = result.dominantGift.charAt(0).toUpperCase() + result.dominantGift.slice(1);
    const secondaryGift = result.secondaryGift.charAt(0).toUpperCase() + result.secondaryGift.slice(1);

    // Create a simple text email body
    const emailBody = `
Hello ${result.fullName || 'there'},

Thank you for completing the Your Design test. Here are your results:

Dominant Gift: ${dominantGift}
Secondary Gift: ${secondaryGift}

All Scores:
${formattedScores}

Thank you,
Union Houston
    `;

    // Create the mailto URL
    const mailtoUrl = `mailto:${result.email}?subject=Your Design Test Results&body=${encodeURIComponent(emailBody)}`;

    // Open the mailto URL
    window.open(mailtoUrl, '_blank');

    return {
      success: true,
      message: 'Mailto email opened successfully'
    };
  } catch (error) {
    console.error('Error opening mailto email:', error);
    return {
      success: false,
      message: `Error opening mailto email: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}
