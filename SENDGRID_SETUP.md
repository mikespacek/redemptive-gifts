# Setting Up SendGrid Email Notifications

This guide will help you set up SendGrid to send email notifications when users complete the Redemptive Gifts Test.

## Step 1: Create a SendGrid Account

1. Go to [SendGrid's website](https://sendgrid.com/) and sign up for an account
2. Complete the verification process

## Step 2: Create an API Key

1. Log in to your SendGrid account
2. Navigate to Settings > API Keys
3. Click "Create API Key"
4. Name your key (e.g., "Redemptive Gifts Test")
5. Select "Full Access" or "Restricted Access" with at least "Mail Send" permissions
6. Click "Create & View"
7. Copy your API key (you won't be able to see it again)

## Step 3: Verify a Sender Identity

1. Navigate to Settings > Sender Authentication
2. Choose either "Single Sender Verification" or "Domain Authentication"
   - For testing, Single Sender is simpler
   - For production, Domain Authentication is recommended
3. Follow the steps to verify your email or domain

## Step 4: Add the API Key to Convex

1. In your Convex dashboard, go to Settings > Environment Variables
2. Add a new environment variable:
   - Name: `SENDGRID_API_KEY`
   - Value: Paste your SendGrid API key
3. Click "Save"

## Step 5: Update the From Email

1. Open the `convex/email.ts` file
2. Update the `from` email address to match your verified sender:
   ```javascript
   from: { email: 'your-verified-email@yourdomain.com', name: 'Redemptive Gifts Test' },
   ```

## Step 6: Test the Email Functionality

1. Complete a test submission
2. Check your admin email (mike@unionhouston.com) to see if you received the notification
3. Check the Convex logs for any errors if the email wasn't received

## Troubleshooting

If emails aren't being sent:

1. Check the Convex logs for error messages
2. Verify that your SendGrid API key is correct
3. Make sure your sender email is verified
4. Check your SendGrid dashboard for any sending issues or limits

## Additional Configuration

- You can customize the email template in `convex/email.ts`
- You can add CC or BCC recipients if needed
- You can set up SendGrid templates for more advanced email designs
