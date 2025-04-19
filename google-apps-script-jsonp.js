/**
 * Google Apps Script for handling Redemptive Gifts Test submissions
 * with JSONP support for cross-domain requests
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
 * Handle GET requests for testing with JSONP support
 */
function doGet(e) {
  // Check if this is a JSONP request
  const callback = e.parameter.callback;
  
  // Prepare the response data
  const responseData = {
    success: true,
    message: 'Google Apps Script is working correctly',
    timestamp: new Date().toISOString(),
    params: e.parameter || 'No parameters'
  };
  
  // If a callback is provided, wrap the response in the callback function (JSONP)
  if (callback) {
    return ContentService.createTextOutput(callback + '(' + JSON.stringify(responseData) + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  } 
  
  // Otherwise, return a standard JSON response
  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
}

/**
 * Handle POST requests for data submission
 */
function doPost(e) {
  try {
    // Set CORS headers for all responses
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json'
    };

    // Log the incoming request for debugging
    console.log('Received POST request');
    
    // Parse the incoming data
    let data;
    
    // Try different ways to get the data
    if (e.postData && e.postData.contents) {
      console.log('POST data contents:', e.postData.contents);
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter && e.parameter.data) {
      console.log('POST parameter data:', e.parameter.data);
      data = JSON.parse(e.parameter.data);
    } else if (e.parameters && e.parameters.data) {
      console.log('POST parameters data:', e.parameters.data);
      data = JSON.parse(e.parameters.data[0]);
    } else {
      // Log all available properties for debugging
      console.log('No data found in standard locations. Logging all properties:');
      console.log('e.parameter:', JSON.stringify(e.parameter));
      console.log('e.parameters:', JSON.stringify(e.parameters));
      
      // Try to extract data from any parameter
      if (e.parameter) {
        const keys = Object.keys(e.parameter);
        if (keys.length > 0) {
          try {
            data = JSON.parse(e.parameter[keys[0]]);
            console.log('Found data in parameter:', keys[0]);
          } catch (parseError) {
            console.log('Failed to parse data from parameter:', keys[0]);
          }
        }
      }
      
      if (!data) {
        throw new Error('No data received in the request');
      }
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

    // Check if this is a JSONP request
    const callback = e.parameter && e.parameter.callback;
    
    // Prepare the response data
    const responseData = {
      success: true,
      message: 'Data received and processed successfully',
      data: data
    };
    
    // If a callback is provided, wrap the response in the callback function (JSONP)
    if (callback) {
      return ContentService.createTextOutput(callback + '(' + JSON.stringify(responseData) + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    // Otherwise, return a standard JSON response
    return ContentService.createTextOutput(JSON.stringify(responseData))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);

  } catch (error) {
    // Log the error
    console.error('Error processing request:', error);

    // Check if this is a JSONP request
    const callback = e.parameter && e.parameter.callback;
    
    // Prepare the error response
    const errorResponse = {
      success: false,
      message: 'Error processing request: ' + error.toString(),
      error: error.stack
    };
    
    // If a callback is provided, wrap the response in the callback function (JSONP)
    if (callback) {
      return ContentService.createTextOutput(callback + '(' + JSON.stringify(errorResponse) + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    // Otherwise, return a standard JSON response
    return ContentService.createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      });
  }
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '3600'
    });
}

/**
 * Test function to verify the script is working
 */
function testSetup() {
  setupSpreadsheet();
  Logger.log('Spreadsheet setup complete');
}
