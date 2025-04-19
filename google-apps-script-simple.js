/**
 * Extremely simple Google Apps Script for handling Redemptive Gifts Test submissions
 * with basic JSONP support
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
  }

  return sheet;
}

/**
 * Handle GET requests
 */
function doGet(e) {
  // Check if this is a JSONP request
  const callback = e.parameter.callback;
  
  // Prepare the response data
  const responseData = {
    success: true,
    message: 'Google Apps Script is working correctly',
    timestamp: new Date().toISOString()
  };
  
  // If a callback is provided, wrap the response in the callback function (JSONP)
  if (callback) {
    return ContentService.createTextOutput(callback + '(' + JSON.stringify(responseData) + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  } 
  
  // Otherwise, return a standard JSON response
  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle POST requests
 */
function doPost(e) {
  try {
    // Parse the incoming data
    let data;
    
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter && e.parameter.data) {
      data = JSON.parse(e.parameter.data);
    } else {
      throw new Error('No data received');
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
    .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error: ' + error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}
