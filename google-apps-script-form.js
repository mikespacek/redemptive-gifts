/**
 * Google Apps Script for handling Redemptive Gifts Test submissions via form
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
  
  try {
    // Get the data from the form submission
    let data;
    
    if (e.parameter && e.parameter.data) {
      // Data is in the 'data' parameter
      data = JSON.parse(e.parameter.data);
      console.log("Parsed data from parameter:", data);
    } else if (e.postData && e.postData.contents) {
      // Data is in the request body
      data = JSON.parse(e.postData.contents);
      console.log("Parsed data from body:", data);
    } else {
      // No data found
      console.log("No data found in request");
      return HtmlService.createHtmlOutput(
        '<html><body><h1>Error</h1><p>No data found in request</p></body></html>'
      );
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
    console.log("Data appended to sheet");
    
    // Return a success page that will auto-close
    return HtmlService.createHtmlOutput(
      '<html><body><h1>Submission Successful</h1><p>Your test results have been recorded.</p><script>window.close();</script></body></html>'
    );
      
  } catch (error) {
    // Log the error
    console.error('Error processing request:', error);
    
    // Return an error page
    return HtmlService.createHtmlOutput(
      `<html><body><h1>Error</h1><p>Error processing request: ${error.toString()}</p></body></html>`
    );
  }
}

/**
 * Handle GET requests
 */
function doGet(e) {
  // Return a simple HTML page
  return HtmlService.createHtmlOutput(
    '<html><body><h1>Redemptive Gifts Test API</h1><p>This is the API endpoint for the Redemptive Gifts Test. Please submit data using a POST request.</p></body></html>'
  );
}

/**
 * Test function to verify the script is working
 */
function testSetup() {
  setupSpreadsheet();
  Logger.log('Spreadsheet setup complete');
}
