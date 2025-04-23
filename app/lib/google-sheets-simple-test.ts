'use client';

/**
 * Test the Google Sheets connection
 *
 * @returns A promise that resolves with the test result
 */
export async function testGoogleSheetsConnection(): Promise<{ success: boolean; message: string }> {
  try {
    // Get the Google Sheet URL from environment variables
    const GOOGLE_SHEET_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL ||
      'https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec';

    console.log('Testing Google Sheets connection to URL:', GOOGLE_SHEET_URL);

    // Create a unique ID for this test
    const testId = 'test-' + Math.random().toString(36).substring(2, 8);

    // Make a direct fetch request with a timestamp to prevent caching
    const timestamp = new Date().getTime();
    
    try {
      const response = await fetch(`${GOOGLE_SHEET_URL}?test=${testId}&_=${timestamp}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'no-cors', // This allows the request to succeed even with CORS issues
      });

      // Since we're using no-cors mode, we can't actually read the response
      // But if we get here, the request didn't throw an error
      console.log('Request completed without throwing an error');

      return {
        success: true,
        message: 'Connection test completed. The request was sent successfully, but we cannot verify the response due to CORS restrictions.'
      };
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      throw fetchError;
    }
  } catch (error) {
    console.error('Error testing Google Sheets connection:', error);
    return {
      success: false,
      message: 'Failed to connect to Google Sheet: ' + (error as Error).message
    };
  }
}
