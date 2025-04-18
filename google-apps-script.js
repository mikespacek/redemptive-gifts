/**
 * Google Apps Script for handling Redemptive Gifts Test submissions
 *
 * Instructions:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Copy and paste this code
 * 4. Save the project with a name like "Redemptive Gifts Test Submissions"
 * 5. Deploy as a web app:
 *    - Click "Deploy" > "New deployment"
 *    - Select type: "Web app"
 *    - Set "Execute as" to "Me"
 *    - Set "Who has access" to "Anyone"
 *    - Click "Deploy"
 * 6. Copy the web app URL and use it in your .env.local file
 *
 * Data Structure:
 * The app sends the following data structure:
 * {
 *   timestamp: ISO date string,
 *   userId: string,
 *   fullName: string,
 *   email: string,
 *   dominantGift: string,
 *   secondaryGift: string,
 *   teacherScore: number,  // Actual score for Teacher gift
 *   giverScore: number,    // Actual score for Giver gift
 *   rulerScore: number,    // Actual score for Ruler gift
 *   exhorterScore: number, // Actual score for Exhorter gift
 *   mercyScore: number,    // Actual score for Mercy gift
 *   prophetScore: number,  // Actual score for Prophet gift
 *   servantScore: number   // Actual score for Servant gift
 * }
 */

// Set up the spreadsheet headers on first run
function setupSpreadsheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Submissions') || ss.insertSheet('Submissions');

  // Set up headers if they don't exist
  if (sheet.getRange('A1').getValue() === '') {
    const headers = [
      'Timestamp',
      'User ID',
      'Full Name',
      'Email',
      'Dominant Gift',
      'Secondary Gift',
      'Teacher Score',
      'Giver Score',
      'Ruler Score',
      'Exhorter Score',
      'Mercy Score',
      'Prophet Score',
      'Servant Score'
    ];

    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);

    // Format the header row
    sheet.getRange(1, 1, 1, headers.length)
      .setBackground('#4285F4')
      .setFontColor('#FFFFFF')
      .setFontWeight('bold');

    // Auto-resize columns
    for (let i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
  }

  return sheet;
}

/**
 * Process incoming POST requests
 * @param {Object} e - The event object containing the POST data
 */
function doPost(e) {
  try {
    // Set up CORS headers for all origins
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    // Log the incoming request for debugging
    console.log('Received POST request with data:', e.postData.contents);

    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);

    // Get the sheet
    const sheet = setupSpreadsheet();

    // Format the data for the spreadsheet
    const rowData = [
      data.timestamp || new Date().toISOString(),
      data.userId || 'Anonymous',
      data.fullName || 'Anonymous',
      data.email || 'Not provided',
      data.dominantGift || 'Not available',
      data.secondaryGift || 'Not available',
      data.teacherScore || 0,
      data.giverScore || 0,
      data.rulerScore || 0,
      data.exhorterScore || 0,
      data.mercyScore || 0,
      data.prophetScore || 0,
      data.servantScore || 0
    ];

    // Append the data to the sheet
    sheet.appendRow(rowData);

    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data received and processed successfully'
    })).setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);

  } catch (error) {
    // Log the error
    console.error('Error processing request:', error);

    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error processing request: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      });
  }
}

/**
 * Handle preflight OPTIONS requests
 * @param {Object} e - The event object (unused but required by Apps Script)
 */
function doOptions(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };

  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders(headers);
}

/**
 * Handle GET requests for testing
 * @param {Object} e - The event object
 */
function doGet(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Google Apps Script is working correctly',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
}

/**
 * Test function to verify the script is working
 */
function testSetup() {
  setupSpreadsheet();
  Logger.log('Spreadsheet setup complete');
}
