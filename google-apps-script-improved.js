/**
 * Google Apps Script for handling Redemptive Gifts Test submissions
 * with improved CORS handling for Netlify deployment
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
 * Handle GET requests for testing
 */
function doGet(e) {
  return handleRequest(e);
}

/**
 * Handle POST requests for data submission
 */
function doPost(e) {
  return handleRequest(e);
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
function doOptions(e) {
  return handleRequest(e);
}

/**
 * Unified request handler with proper CORS support
 */
function handleRequest(e) {
  // Set CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '3600',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS preflight request
  if (e.method === 'OPTIONS') {
    return ContentService.createTextOutput('')
      .setMimeType(ContentService.MimeType.TEXT)
      .setHeaders(headers);
  }

  // Handle GET request (for testing)
  if (e.method === 'GET') {
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Google Apps Script is working correctly',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
  }

  // Handle POST request (for data submission)
  if (e.method === 'POST') {
    try {
      // Log the incoming request for debugging
      console.log('Received POST request');
      
      // Parse the incoming data
      let data;
      if (e.postData && e.postData.contents) {
        console.log('POST data contents:', e.postData.contents);
        data = JSON.parse(e.postData.contents);
      } else if (e.parameter && e.parameter.data) {
        console.log('POST parameter data:', e.parameter.data);
        data = JSON.parse(e.parameter.data);
      } else {
        throw new Error('No data received in the request');
      }

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
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);

    } catch (error) {
      // Log the error
      console.error('Error processing request:', error);

      // Return error response
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Error processing request: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
    }
  }

  // Handle unexpected request method
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    message: 'Unsupported request method: ' + (e.method || 'unknown')
  }))
  .setMimeType(ContentService.MimeType.JSON)
  .setHeaders(headers);
}

/**
 * Test function to verify the script is working
 */
function testSetup() {
  setupSpreadsheet();
  Logger.log('Spreadsheet setup complete');
}
