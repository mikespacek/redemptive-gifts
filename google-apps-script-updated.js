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
      'Teacher Score (T)',
      'Giver Score (G)',
      'Ruler Score (R)',
      'Exhorter Score (E)',
      'Mercy Score (M)',
      'Prophet Score (P)',
      'Servant Score (S)'
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
 */
function doPost(e) {
  // Log the incoming request for debugging
  console.log("Received POST request");
  console.log("Content type: " + e.contentType);
  console.log("Post data: " + e.postData.contents);
  
  // Set up CORS headers for the response
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
  
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    console.log("Parsed data:", data);
    
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
    console.log("Data appended to sheet");
    
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
      .setHeaders(headers);
  }
}

/**
 * Handle preflight OPTIONS requests
 */
function doGet(e) {
  // Log the incoming request for debugging
  console.log("Received GET request");
  
  // Set up CORS headers for the response
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
  
  // Return a simple response for GET requests
  return ContentService.createTextOutput(JSON.stringify({
    status: "OK",
    message: "Redemptive Gifts Test API is running"
  })).setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
}

/**
 * Handle preflight OPTIONS requests
 */
function doOptions(e) {
  // Log the incoming request for debugging
  console.log("Received OPTIONS request");
  
  // Set up CORS headers for the response
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
    "Access-Control-Max-Age": "3600"
  };
  
  // Return an empty response with CORS headers
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders(headers);
}

/**
 * Test function to verify the script is working
 */
function testSetup() {
  setupSpreadsheet();
  Logger.log('Spreadsheet setup complete');
}
