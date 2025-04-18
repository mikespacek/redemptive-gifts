# EmailJS Setup Guide

This guide will help you set up EmailJS for sending test results from the Redemptive Gifts application.

## Step 1: Create an EmailJS Account

1. Go to [EmailJS](https://www.emailjs.com/) and sign up for an account
2. Verify your email address

## Step 2: Create an Email Service

1. In the EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the instructions to connect your email account
5. Name your service (e.g., "Redemptive Gifts")
6. Note the Service ID (it will look like `service_xxxxxxx`)

## Step 3: Create an Email Template

1. In the EmailJS dashboard, go to "Email Templates"
2. Click "Create New Template"
3. Design your email template with the following variables:
   - `{{user_name}}` - The full name of the person who took the test
   - `{{user_email}}` - The email of the person who took the test
   - `{{test_date}}` - The date and time the test was taken
   - `{{dominant_gift}}` - The person's dominant gift
   - `{{secondary_gift}}` - The person's secondary gift
   - `{{all_scores}}` - All gift scores
   - `{{principle}}` - Principle of the dominant gift
   - `{{summary}}` - Summary of the dominant gift
   - `{{strengths}}` - Strengths of the dominant gift (HTML list)
   - `{{challenges}}` - Challenges of the dominant gift (HTML list)
   - `{{mature_gift}}` - Mature gift description
   - `{{carnal_gift}}` - Carnal gift description
   - `{{battlefield}}` - Battlefield description
   - `{{legitimacy_lie}}` - Legitimacy lie description
   - `{{biblical_example}}` - Biblical example
   - `{{birthright}}` - Birthright description
4. Save the template
5. Note the Template ID (it will look like `template_xxxxxxx`)

## Step 4: Get Your Public Key

1. In the EmailJS dashboard, go to "Account" > "API Keys"
2. Copy your Public Key (it will be a long string)

## Step 5: Update Your .env.local File

Update your `.env.local` file with the following values:

```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
NEXT_PUBLIC_ADMIN_EMAIL=your_admin_email@example.com
```

Replace the placeholder values with your actual EmailJS credentials.

## Step 6: Test the EmailJS Integration

1. Go to the test page at `/test-email`
2. Click the "Send Test Email" button
3. Check your admin email to see if you received the test email

## Troubleshooting

If you're having issues with EmailJS:

1. Check the browser console for error messages
2. Verify that your EmailJS credentials are correct
3. Make sure your email template has all the required variables
4. Check if your email service is properly connected
5. Try sending a test email from the EmailJS dashboard

## Additional Resources

- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS API Reference](https://www.emailjs.com/docs/api/)
