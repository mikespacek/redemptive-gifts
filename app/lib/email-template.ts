'use client';

import { TestResult } from '../types/test-types';

/**
 * Generate an HTML email template for the test results
 * 
 * @param result The test result to include in the email
 * @returns HTML string for the email
 */
export function generateEmailTemplate(result: TestResult): string {
  // Format the scores for email
  const formattedScores = result.columnScores ? 
    `Teacher: ${result.columnScores.T}, Giver: ${result.columnScores.G}, Ruler: ${result.columnScores.R}, 
     Exhorter: ${result.columnScores.E}, Mercy: ${result.columnScores.M}, Prophet: ${result.columnScores.P}, 
     Servant: ${result.columnScores.S}` : 
    'Scores not available';

  // Capitalize gift names
  const dominantGift = result.dominantGift.charAt(0).toUpperCase() + result.dominantGift.slice(1);
  const secondaryGift = result.secondaryGift.charAt(0).toUpperCase() + result.secondaryGift.slice(1);

  // Create the email content
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Design Test Results</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #181818;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
          background-color: #f9f9f9;
        }
        .gift-box {
          background-color: white;
          border-left: 4px solid #F3762F;
          padding: 15px;
          margin: 20px 0;
        }
        .scores {
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #666;
        }
        h1, h2, h3 {
          color: #F3762F;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Design Test Results</h1>
        </div>
        <div class="content">
          <p>Hello ${result.fullName || 'there'},</p>
          <p>Thank you for completing the Your Design test. Here are your results:</p>
          
          <div class="gift-box">
            <h2>Your Gifts</h2>
            <p><strong>Dominant Gift:</strong> ${dominantGift}</p>
            <p><strong>Secondary Gift:</strong> ${secondaryGift}</p>
          </div>
          
          <div class="scores">
            <h3>All Scores</h3>
            <p>${formattedScores}</p>
          </div>
          
          <p>We encourage you to learn more about your gifts and how to use them effectively.</p>
          <p>Thank you,<br>Union Houston</p>
        </div>
        <div class="footer">
          <p>This email was sent to ${result.email} from Union Houston.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
