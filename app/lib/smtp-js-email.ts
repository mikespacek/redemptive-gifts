'use client';

import { TestResult } from '../types/test-types';

/**
 * Send an email directly to the user using SMTP.js
 * This is a completely different service from EmailJS
 * 
 * @param result The test result to send
 * @returns Promise with success status and message
 */
export async function sendSmtpJsEmail(
  result: TestResult
): Promise<{ success: boolean; message: string }> {
  try {
    // Check if user provided an email
    if (!result.email || !result.email.includes('@')) {
      console.log('No valid email provided, skipping SMTP.js email');
      return {
        success: false,
        message: 'No valid email provided'
      };
    }

    console.log('Sending SMTP.js email to user:', result.email);

    // Format the scores for email
    const formattedScores = result.columnScores ? 
      `Teacher: ${result.columnScores.T}, Giver: ${result.columnScores.G}, Ruler: ${result.columnScores.R}, 
       Exhorter: ${result.columnScores.E}, Mercy: ${result.columnScores.M}, Prophet: ${result.columnScores.P}, 
       Servant: ${result.columnScores.S}` : 
      'Scores not available';

    // Capitalize gift names
    const dominantGift = result.dominantGift.charAt(0).toUpperCase() + result.dominantGift.slice(1);
    const secondaryGift = result.secondaryGift.charAt(0).toUpperCase() + result.secondaryGift.slice(1);

    // Load the SMTP.js library dynamically
    if (typeof window !== 'undefined' && !window.Email) {
      const script = document.createElement('script');
      script.src = 'https://smtpjs.com/v3/smtp.js';
      script.async = true;
      document.body.appendChild(script);
      
      // Wait for the script to load
      await new Promise<void>((resolve) => {
        script.onload = () => resolve();
        script.onerror = () => {
          console.error('Failed to load SMTP.js');
          resolve();
        };
      });
    }

    // Create the email content
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #181818;">Your Design Test Results</h2>
        <p>Hello ${result.fullName || 'there'},</p>
        <p>Thank you for completing the Your Design test. Here are your results:</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #F3762F; margin-top: 0;">Your Gifts</h3>
          <p><strong>Dominant Gift:</strong> ${dominantGift}</p>
          <p><strong>Secondary Gift:</strong> ${secondaryGift}</p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #F3762F;">All Scores</h3>
          <p>${formattedScores}</p>
        </div>
        
        <p>Thank you,<br>Union Houston</p>
      </div>
    `;

    // Wait for Email to be defined
    if (typeof window === 'undefined' || !window.Email) {
      console.error('SMTP.js not loaded');
      return {
        success: false,
        message: 'SMTP.js not loaded'
      };
    }

    // Send the email using SMTP.js
    // @ts-ignore - Email is loaded dynamically
    const response = await window.Email.send({
      SecureToken: "8f3f3f9f-3f3f-3f3f-3f3f-3f3f3f3f3f3f", // Replace with your token
      To: result.email,
      From: "noreply@unionhouston.com",
      Subject: "Your Design Test Results",
      Body: emailContent
    });

    if (response === "OK") {
      console.log('SMTP.js email sent successfully');
      return {
        success: true,
        message: 'Email sent successfully to user'
      };
    } else {
      console.error('Error sending SMTP.js email:', response);
      return {
        success: false,
        message: `Failed to send email: ${response}`
      };
    }
  } catch (error) {
    console.error('Error in SMTP.js email sending:', error);
    return {
      success: false,
      message: `Error sending email: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}
