# Redemptive Gifts Test - Google Sheets Database

This document explains how the Redemptive Gifts Test application now uses Google Sheets as its primary database instead of Convex.

## Overview

The application has been simplified to use Google Sheets as the primary database for storing test results. This approach has several benefits:

1. **Simplicity**: No need to manage a separate database service
2. **Direct Access**: Test results are immediately available in a Google Sheet
3. **Easy Maintenance**: You can view and edit data directly in Google Sheets
4. **No Authentication Required**: Users don't need to create accounts

## How It Works

1. When a user completes the test, their results are:
   - Stored locally in the browser's localStorage for immediate access
   - Submitted to a Google Sheet via a Google Apps Script web app

2. The Google Apps Script:
   - Receives the test data
   - Adds it as a new row in the Google Sheet
   - Returns a success/failure response

3. When viewing results:
   - The application first checks localStorage for the most recent results
   - Results can be accessed by user ID or result ID (stored in the URL)

## Configuration

The application uses the following environment variables:

```
# Google Sheets integration
NEXT_PUBLIC_GOOGLE_SHEET_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec

# Admin email for notifications
NEXT_PUBLIC_ADMIN_EMAIL=your-email@example.com
```

## Google Apps Script Setup

See the `GOOGLE_SHEETS_SETUP.md` file for detailed instructions on setting up the Google Sheet and Google Apps Script.

## Data Storage

The Google Sheet stores the following information for each test submission:

- Timestamp
- User ID
- Full Name
- Email
- Dominant Gift
- Secondary Gift
- Individual scores for each gift type (Teacher, Giver, Ruler, Exhorter, Mercy, Prophet, Servant)

## Local Development

During local development, test results are stored in localStorage, making it easy to test the application without needing to set up the Google Sheets integration.

## Deployment

When deploying to production, make sure to:

1. Set up the Google Sheet and Google Apps Script as described in `GOOGLE_SHEETS_SETUP.md`
2. Configure the environment variables in your hosting platform (Netlify, Vercel, etc.)
3. Test the integration by completing the test and checking if the data appears in your Google Sheet

## Limitations

- This approach doesn't support real-time updates or complex queries
- All data is public to anyone with access to the Google Sheet
- There's no built-in authentication or user management

## Future Improvements

If more advanced database features are needed in the future, consider:

1. Implementing a more robust backend with a proper database
2. Adding user authentication
3. Creating an admin dashboard for managing test results
