# Setting Up Google Sheets Integration for Redemptive Gifts Test

This guide will walk you through setting up a Google Sheet to collect test submissions from the Redemptive Gifts Test application.

## Prerequisites

- A Google account
- Access to Google Sheets and Google Apps Script

## Step 1: Create a New Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Give it a name like "Redemptive Gifts Test Submissions"

## Step 2: Set Up Google Apps Script

1. In your Google Sheet, go to **Extensions > Apps Script**
2. This will open the Google Apps Script editor in a new tab
3. Delete any code in the editor
4. Copy and paste the code from the `google-apps-script-form.js` file in this repository
5. Click the **Save** button (disk icon) and give your project a name like "Redemptive Gifts Test Submissions"

## Step 3: Test the Script

1. In the Apps Script editor, select the `testSetup` function from the dropdown menu next to the "Debug" button
2. Click the **Run** button (play icon)
3. You'll be asked to authorize the script. Click "Review Permissions" and then "Allow"
4. The script will create a "Submissions" sheet with headers for the test data
5. Go back to your Google Sheet and verify that the "Submissions" sheet was created with headers

## Step 4: Deploy as a Web App

1. In the Apps Script editor, click **Deploy > New deployment**
2. Select **Web app** as the deployment type
3. Configure the deployment:
   - Description: "Redemptive Gifts Test Submissions"
   - Execute as: "Me" (your Google account)
   - Who has access: "Anyone"
4. Click **Deploy**
5. Copy the Web app URL that is displayed

## Step 5: Update Your Application

1. Open the `.env.local` file in your application
2. Update the `NEXT_PUBLIC_GOOGLE_SHEET_URL` variable with the Web app URL you copied:

```
NEXT_PUBLIC_GOOGLE_SHEET_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec
```

Replace `YOUR_SCRIPT_ID_HERE` with the actual script ID from the URL.

## Step 6: Test the Integration

1. Run your application locally with `npm run dev`
2. Complete the Redemptive Gifts Test with your name and email
3. Check your Google Sheet to see if the submission was recorded

## Important Notes About This Implementation

- This implementation uses a form submission approach to avoid CORS issues
- When a user submits their test, a hidden form is created and submitted to the Google Apps Script
- The script processes the form data and adds it to the Google Sheet
- A new browser tab will briefly open and then close automatically
- This approach is more reliable than using fetch or XMLHttpRequest for cross-origin requests

## Troubleshooting

If submissions are not being recorded in your Google Sheet:

1. Check if a new tab briefly opens when you submit the test
2. If the tab stays open, check for any error messages
3. Verify that the Web app URL is correct in your `.env.local` file
4. Make sure the Google Apps Script is deployed as a web app with the correct permissions
5. Try redeploying the Google Apps Script as a new version
6. Check your browser's pop-up blocker settings - it might be preventing the form submission

## Security Considerations

- The Google Apps Script is set to allow requests from any origin. In a production environment, you may want to restrict this to your application's domain.
- The script executes as your Google account, so it has access to your Google Sheets. Be careful about sharing the Web app URL.
- Consider implementing additional security measures like API keys or JWT tokens for a production environment.
