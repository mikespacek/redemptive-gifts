# Setting Up Resend Email Service

This guide will help you set up Resend to send email notifications when users complete the Redemptive Gifts Test.

## What is Resend?

Resend is a modern email API built for developers. It provides reliable email delivery with a simple API and excellent deliverability rates.

## Step 1: Verify Your Domain (Important)

For best deliverability, you should verify your domain with Resend:

1. Log in to your Resend account at [resend.com](https://resend.com)
2. Go to Domains → Add Domain
3. Enter your domain (e.g., redemptivegifts.com)
4. Follow the DNS verification instructions
5. Wait for verification to complete (usually takes a few minutes)

## Step 2: Update the From Address

After verifying your domain, update the "from" address in the email.ts file to use your verified domain:

```javascript
from: 'Redemptive Gifts Test <test@yourdomain.com>',
```

Replace `yourdomain.com` with your actual verified domain.

## Step 3: API Key Security

The API key is currently hardcoded in the email.ts file. For better security, you should:

1. Go to the Convex dashboard
2. Navigate to Settings → Environment Variables
3. Add a new environment variable:
   - Name: `RESEND_API_KEY`
   - Value: `re_UkauHpJ7_79vMJgf6yP76dekYiCg98xrs`
4. Update the code to use the environment variable:

```javascript
const RESEND_API_KEY = process.env.RESEND_API_KEY;
```

## Step 4: Test the Email Functionality

1. Complete a test submission
2. Check your admin email (mike@unionhouston.com) to see if you received the notification
3. Check the Convex logs for any errors if the email wasn't received

## Troubleshooting

If emails aren't being sent:

1. Check the Convex logs for error messages
2. Verify that your Resend API key is correct
3. Make sure your domain is verified if you're using a custom domain
4. Check your Resend dashboard for any sending issues or limits

## Email Customization

You can customize the email template in `convex/email.ts`:

- Change the subject line format
- Modify the HTML content
- Add more recipient emails if needed
- Include additional information from the test results

## Resend Features

Resend offers several features that might be useful:

- Email analytics and tracking
- Bounce and complaint handling
- Scheduled sending
- Email templates

Visit the [Resend documentation](https://resend.com/docs) for more information on these features.
