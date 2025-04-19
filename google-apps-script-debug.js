/**
 * Google Apps Script for handling Redemptive Gifts Test submissions
 * with enhanced debugging and logging
 */

// Set up the spreadsheet headers on first run
function setupSpreadsheet() {
  try {
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
        'Servant Score',
        'Raw Request',
        'Debug Info'
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
  } catch (error) {
    Logger.log('Error in setupSpreadsheet: ' + error.toString());
    throw error;
  }
}

/**
 * Handle GET requests
 */
function doGet(e) {
  try {
    // Log the request for debugging
    Logger.log('Received GET request with parameters: ' + JSON.stringify(e.parameter));
    
    // Check if this is a JSONP request
    const callback = e.parameter.callback;
    
    // Prepare the response data
    const responseData = {
      success: true,
      message: 'Google Apps Script is working correctly',
      timestamp: new Date().toISOString(),
      parameters: e.parameter
    };
    
    // If a callback is provided, wrap the response in the callback function (JSONP)
    if (callback) {
      return ContentService.createTextOutput(callback + '(' + JSON.stringify(responseData) + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    } 
    
    // Otherwise, return a standard JSON response
    return ContentService.createTextOutput(JSON.stringify(responseData))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('Error in doGet: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error: ' + error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle POST requests
 */
function doPost(e) {
  try {
    // Log the entire request for debugging
    Logger.log('Received POST request: ' + JSON.stringify(e));
    
    // Get the sheet
    const sheet = setupSpreadsheet();
    
    // Initialize debug info
    let debugInfo = {
      requestType: 'POST',
      timestamp: new Date().toISOString(),
      hasPostData: !!e.postData,
      hasParameter: !!e.parameter,
      contentLength: e.postData ? e.postData.length : 'N/A',
      contentType: e.postData ? e.postData.type : 'N/A',
      parameterKeys: e.parameter ? Object.keys(e.parameter) : []
    };
    
    // Parse the incoming data
    let data;
    let rawRequest = 'No data found';
    
    if (e.postData && e.postData.contents) {
      rawRequest = e.postData.contents;
      debugInfo.dataSource = 'postData.contents';
      try {
        data = JSON.parse(e.postData.contents);
        debugInfo.parseResult = 'Success';
      } catch (parseError) {
        debugInfo.parseResult = 'Error: ' + parseError.toString();
        Logger.log('Error parsing postData.contents: ' + parseError.toString());
      }
    } 
    
    if (!data && e.parameter && e.parameter.data) {
      rawRequest = e.parameter.data;
      debugInfo.dataSource = 'parameter.data';
      try {
        data = JSON.parse(e.parameter.data);
        debugInfo.parseResult = 'Success';
      } catch (parseError) {
        debugInfo.parseResult = 'Error: ' + parseError.toString();
        Logger.log('Error parsing parameter.data: ' + parseError.toString());
      }
    }
    
    if (!data) {
      // Try to find data in any parameter
      if (e.parameter) {
        const keys = Object.keys(e.parameter);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          rawRequest = e.parameter[key];
          debugInfo.dataSource = 'parameter.' + key;
          try {
            const parsed = JSON.parse(e.parameter[key]);
            if (parsed && typeof parsed === 'object') {
              data = parsed;
              debugInfo.parseResult = 'Success from ' + key;
              break;
            }
          } catch (parseError) {
            // Continue to next parameter
          }
        }
      }
    }
    
    if (!data) {
      // Last resort: try to use the parameter directly
      if (e.parameter && Object.keys(e.parameter).length > 0) {
        data = e.parameter;
        rawRequest = JSON.stringify(e.parameter);
        debugInfo.dataSource = 'parameter (direct)';
        debugInfo.parseResult = 'Using parameter directly';
      } else {
        throw new Error('No data received or could not parse data');
      }
    }
    
    // Log the parsed data
    Logger.log('Parsed data: ' + JSON.stringify(data));
    debugInfo.parsedData = JSON.stringify(data).substring(0, 100) + '...';
    
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
      data.servantScore || 0,
      rawRequest.substring(0, 1000), // Limit to 1000 characters
      JSON.stringify(debugInfo)
    ];

    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Log success
    Logger.log('Data successfully appended to sheet');

    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data received and processed successfully',
      debug: debugInfo
    }))
    .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log the error
    Logger.log('Error in doPost: ' + error.toString());
    
    // Try to log the error to the spreadsheet
    try {
      const sheet = setupSpreadsheet();
      const errorData = [
        new Date().toISOString(),
        'ERROR',
        'ERROR',
        'ERROR',
        'ERROR',
        'ERROR',
        0, 0, 0, 0, 0, 0, 0,
        e ? JSON.stringify(e).substring(0, 1000) : 'No request data',
        'Error: ' + error.toString()
      ];
      sheet.appendRow(errorData);
    } catch (logError) {
      Logger.log('Error logging to spreadsheet: ' + logError.toString());
    }
    
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error: ' + error.toString(),
      request: e ? JSON.stringify(e) : 'No request data'
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Test function to verify the script is working
 */
function testSetup() {
  try {
    const sheet = setupSpreadsheet();
    Logger.log('Spreadsheet setup complete');
    return 'Spreadsheet setup complete';
  } catch (error) {
    Logger.log('Error in testSetup: ' + error.toString());
    return 'Error: ' + error.toString();
  }
}
