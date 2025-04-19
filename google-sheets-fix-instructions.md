# Google Sheets Integration Fix Instructions

## Problem
The Google Sheets integration is receiving form-urlencoded data but not properly parsing it, resulting in raw data being displayed in the spreadsheet instead of the properly formatted test results.

## Solution
Follow these steps to fix the issue:

### 1. Update the Google Apps Script

1. Open your Google Sheet
2. Go to Extensions > Apps Script
3. Replace the entire script with the content from `google-apps-script-fixed.js`
4. Save the script

### 2. Fix Existing Data

1. In the Apps Script editor, select the `fixExistingData` function from the dropdown menu at the top
2. Click the "Run" button (play icon)
3. This will attempt to parse and fix any rows that contain form-urlencoded data
4. Check the execution log for results

### 3. Clean Up the Spreadsheet

1. In the Apps Script editor, select the `cleanupSpreadsheet` function from the dropdown menu
2. Click the "Run" button (play icon)
3. This will remove any rows that appear to be errors
4. Check the execution log for results

### 4. Deploy the Updated Script

1. Click on Deploy > New deployment
2. Select type: "Web app"
3. Set "Execute as" to "Me"
4. Set "Who has access" to "Anyone"
5. Click "Deploy"
6. Copy the new web app URL

### 5. Update Your Application

1. Update the `NEXT_PUBLIC_GOOGLE_SHEET_URL` in your `.env.local` file with the new URL
2. Redeploy your application to Netlify

### 6. Test the Integration

1. Complete a test submission at your website
2. Check if the data appears correctly in your Google Sheet
3. Verify that the scores match what's shown on the results page

## What the Fix Does

The updated script includes:

1. **Better Form Data Parsing**: Properly handles form-urlencoded data
2. **Data Cleaning**: Fixes and formats the data before storing it
3. **Error Handling**: Provides detailed error information
4. **Cleanup Functions**: Tools to fix existing data and remove error entries

## Troubleshooting

If you still see issues after implementing these fixes:

1. Check the Apps Script execution logs for errors
2. Make sure the web app is deployed with "Who has access" set to "Anyone"
3. Verify that the URL in your `.env.local` file matches the deployed web app URL
4. Try running the `testSetup` function to verify the script is working correctly
