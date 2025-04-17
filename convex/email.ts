import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

/**
 * Email service for sending test results
 *
 * This module uses Resend (https://resend.com) to send emails.
 * The API key is configured in the environment variables.
 *
 * For best deliverability, verify your domain with Resend and update
 * the 'from' address to use your verified domain.
 *
 * See RESEND_SETUP.md for more information.
 */

// Define the email action
export const sendResultsEmail = action({
  args: {
    resultId: v.id("results"),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const { resultId, adminEmail } = args;

    // Get the result data
    const result = await ctx.runQuery(api.results.getById, { resultId });
    if (!result) {
      throw new Error("Result not found");
    }

    // Format the scores for email
    const formattedScores = Object.entries(result.scores)
      .map(([gift, score]) => `${gift.charAt(0).toUpperCase() + gift.slice(1)}: ${score}`)
      .join("<br>");

    // Create email content
    const userName = result.fullName || 'Anonymous User';
    const emailSubject = `Redemptive Gifts Test Result - ${userName}`;
    const emailBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
          .header { background-color: #000; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .footer { background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; }
          .scores { margin: 20px 0; }
          .score-item { margin-bottom: 5px; }
          .button { display: inline-block; background-color: #000; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Redemptive Gifts Test</h1>
        </div>
        <div class="content">
          <h2>Test Results for ${userName}</h2>
          <p style="font-size: 18px; font-weight: bold;">Name: ${userName}</p>
          ${result.email ? `<p><strong>Email:</strong> ${result.email}</p>` : ''}
          <p><strong>Date:</strong> ${new Date(result.timestamp).toLocaleString()}</p>

          <h3>Primary Results:</h3>
          <p><strong>Dominant Gift:</strong> ${result.dominantGift.charAt(0).toUpperCase() + result.dominantGift.slice(1)}</p>
          <p><strong>Secondary Gift:</strong> ${result.secondaryGift.charAt(0).toUpperCase() + result.secondaryGift.slice(1)}</p>

          <div class="scores">
            <h3>All Scores:</h3>
            <div>${formattedScores}</div>
          </div>

          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://your-app-url.com"}/results?resultId=${result._id}" class="button">View Full Results</a>
          </p>
        </div>
        <div class="footer">
          <p>This email was sent from the Redemptive Gifts Test application.</p>
        </div>
      </body>
      </html>
    `;

    try {
      // Use Resend to send the email
      const RESEND_API_KEY = process.env.RESEND_API_KEY || "re_UkauHpJ7_79vMJgf6yP76dekYiCg98xrs";

      if (!RESEND_API_KEY) {
        console.error("Resend API key is not configured");
        return { success: false, message: "Email service not configured" };
      }

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'Redemptive Gifts Test <test@redemptivegifts.com>',
          to: [adminEmail],
          subject: emailSubject,
          html: emailBody
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Resend API error: ${response.status}`, errorText);
        throw new Error(`Email service responded with ${response.status}: ${errorText}`);
      }

      console.log(`Email sent successfully to ${adminEmail}`);
      return { success: true, message: "Email sent successfully" };
    } catch (error) {
      console.error("Error sending email:", error);
      return { success: false, message: "Failed to send email" };
    }
  },
});
