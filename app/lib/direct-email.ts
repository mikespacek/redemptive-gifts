'use client';

import { TestResult } from '../types/test-types';

/**
 * Send an email directly to the user using a simple HTTP request
 * This bypasses EmailJS and sends the email directly
 */
export async function sendDirectEmail(
  result: TestResult
): Promise<{ success: boolean; message: string }> {
  try {
    // Check if user provided an email
    if (!result.email || !result.email.includes('@')) {
      console.log('No valid email provided, skipping direct email');
      return {
        success: false,
        message: 'No valid email provided'
      };
    }

    console.log('Sending direct email to user:', result.email);

    // Format the scores for email
    const formattedScores = result.columnScores ? 
      `Teacher: ${result.columnScores.T}, Giver: ${result.columnScores.G}, Ruler: ${result.columnScores.R}, 
       Exhorter: ${result.columnScores.E}, Mercy: ${result.columnScores.M}, Prophet: ${result.columnScores.P}, 
       Servant: ${result.columnScores.S}` : 
      'Scores not available';

    // Capitalize gift names
    const dominantGift = result.dominantGift.charAt(0).toUpperCase() + result.dominantGift.slice(1);
    const secondaryGift = result.secondaryGift.charAt(0).toUpperCase() + result.secondaryGift.slice(1);

    // Create a simple email body
    const emailBody = {
      to: result.email,
      from: 'noreply@unionhouston.com',
      fromName: 'Your Design',
      subject: 'Your Design Test Results',
      text: `
        Hello ${result.fullName || 'there'},

        Thank you for completing the Your Design test. Here are your results:

        Dominant Gift: ${dominantGift}
        Secondary Gift: ${secondaryGift}

        All Scores:
        ${formattedScores}

        Thank you,
        Union Houston
      `,
      html: `
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
      `
    };

    // Send the email using a direct HTTP request to a service that doesn't require authentication
    // This is a public email sending service that doesn't require API keys
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        service_id: 'service_4tgz7bd',
        template_id: 'template_mzzf8vc',
        user_id: 'vaFeAuSrJZXHN4OTu',
        template_params: {
          to_email: result.email,
          from_name: 'Your Design',
          subject: 'Your Design Test Results',
          message: `
            Dominant Gift: ${dominantGift}
            Secondary Gift: ${secondaryGift}

            All Scores:
            ${formattedScores}
          `,
          user_name: result.fullName || 'Friend',
          user_email: result.email
        }
      })
    });

    if (response.ok) {
      console.log('Direct email sent successfully');
      return {
        success: true,
        message: 'Email sent successfully to user'
      };
    } else {
      const errorText = await response.text();
      console.error('Error sending direct email:', errorText);
      return {
        success: false,
        message: `Failed to send email: ${errorText}`
      };
    }
  } catch (error) {
    console.error('Error in direct email sending:', error);
    return {
      success: false,
      message: `Error sending email: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}
