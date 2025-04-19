/**
 * Google Apps Script for handling Redemptive Gifts Test submissions
 * with enhanced debugging and error handling
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
 * Parse form-urlencoded data to extract the JSON payload
 */
function parseFormUrlEncoded(formData) {
  try {
    // Check if the data parameter exists
    if (formData && formData.data) {
      return JSON.parse(formData.data);
    }

    // If there's no data parameter, try to find a parameter that looks like JSON
    if (formData) {
      const keys = Object.keys(formData);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        try {
          if (formData[key].startsWith('{') && formData[key].endsWith('}')) {
            return JSON.parse(formData[key]);
          }
        } catch (e) {
          // Continue to next parameter
        }
      }
    }

    return null;
  } catch (error) {
    Logger.log('Error parsing form-urlencoded data: ' + error.toString());
    return null;
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

    // First, try to parse the postData if it exists
    if (e.postData && e.postData.contents) {
      rawRequest = e.postData.contents;
      debugInfo.dataSource = 'postData.contents';

      // Check if the content type is form-urlencoded
      if (e.postData.type === 'application/x-www-form-urlencoded') {
        debugInfo.parseMethod = 'form-urlencoded';
        // Parse the form data
        const formData = {};
        const pairs = rawRequest.split('&');
        for (let i = 0; i < pairs.length; i++) {
          const pair = pairs[i].split('=');
          if (pair.length === 2) {
            const key = decodeURIComponent(pair[0]);
            const value = decodeURIComponent(pair[1]);
            formData[key] = value;
          }
        }

        // Try to extract JSON from the form data
        data = parseFormUrlEncoded(formData);
        if (data) {
          debugInfo.parseResult = 'Success (form-urlencoded)';
        } else {
          debugInfo.parseResult = 'Failed to extract JSON from form data';
        }
      } else {
        // Try to parse as JSON directly
        try {
          data = JSON.parse(rawRequest);
          debugInfo.parseMethod = 'direct JSON';
          debugInfo.parseResult = 'Success (direct JSON)';
        } catch (parseError) {
          debugInfo.parseMethod = 'direct JSON';
          debugInfo.parseResult = 'Error: ' + parseError.toString();
          Logger.log('Error parsing postData.contents as JSON: ' + parseError.toString());
        }
      }
    }

    // If we couldn't parse the postData, try the parameter.data
    if (!data && e.parameter && e.parameter.data) {
      rawRequest = e.parameter.data;
      debugInfo.dataSource = 'parameter.data';
      try {
        data = JSON.parse(e.parameter.data);
        debugInfo.parseMethod = 'parameter.data JSON';
        debugInfo.parseResult = 'Success (parameter.data)';
      } catch (parseError) {
        debugInfo.parseMethod = 'parameter.data JSON';
        debugInfo.parseResult = 'Error: ' + parseError.toString();
        Logger.log('Error parsing parameter.data: ' + parseError.toString());
      }
    }

    // If we still don't have data, try to find it in any parameter
    if (!data && e.parameter) {
      const keys = Object.keys(e.parameter);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key !== 'data') { // We already tried parameter.data
          rawRequest = e.parameter[key];
          debugInfo.dataSource = 'parameter.' + key;
          try {
            if (rawRequest.startsWith('{') && rawRequest.endsWith('}')) {
              data = JSON.parse(rawRequest);
              debugInfo.parseMethod = 'parameter.' + key + ' JSON';
              debugInfo.parseResult = 'Success (parameter.' + key + ')';
              break;
            }
          } catch (parseError) {
            // Continue to next parameter
          }
        }
      }
    }

    // If we still don't have data, use the parameter directly
    if (!data && e.parameter && Object.keys(e.parameter).length > 0) {
      data = e.parameter;
      rawRequest = JSON.stringify(e.parameter);
      debugInfo.dataSource = 'parameter (direct)';
      debugInfo.parseMethod = 'direct parameter';
      debugInfo.parseResult = 'Using parameter directly';
    }

    // If we still don't have data, create a placeholder
    if (!data) {
      data = {
        timestamp: new Date().toISOString(),
        userId: 'Unknown',
        fullName: 'Unknown',
        email: 'Unknown',
        dominantGift: 'Unknown',
        secondaryGift: 'Unknown',
        error: 'Failed to parse data'
      };
      debugInfo.parseResult = 'Failed to parse any data';
    }

    // Log the parsed data
    Logger.log('Parsed data: ' + JSON.stringify(data));
    debugInfo.parsedData = JSON.stringify(data).substring(0, 100) + '...';

    // Clean up the fullName if it contains URL encoding
    if (data.fullName && typeof data.fullName === 'string' && data.fullName.includes('+')) {
      data.fullName = data.fullName.replace(/\+/g, ' ');
    }

    // Format the data for the spreadsheet
    const rowData = [
      // Use a proper date format for the timestamp
      new Date(data.timestamp || Date.now()).toISOString(),
      data.userId || 'Anonymous',
      data.fullName || 'Anonymous',
      data.email || 'Not provided',
      data.dominantGift || 'Not available',
      data.secondaryGift || 'Not available',
      Number(data.teacherScore || data.columnScores?.T || 0),
      Number(data.giverScore || data.columnScores?.G || 0),
      Number(data.rulerScore || data.columnScores?.R || 0),
      Number(data.exhorterScore || data.columnScores?.E || 0),
      Number(data.mercyScore || data.columnScores?.M || 0),
      Number(data.prophetScore || data.columnScores?.P || 0),
      Number(data.servantScore || data.columnScores?.S || 0),
      // Store the raw request and debug info in the last columns
      rawRequest.substring(0, 500), // Limit to 500 characters
      JSON.stringify(debugInfo).substring(0, 500) // Limit debug info size
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

/**
 * Function to fix existing data in the spreadsheet
 * This will attempt to parse and fix rows that contain form-urlencoded data
 */
function fixExistingData() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Submissions');

    if (!sheet) {
      return 'No Submissions sheet found';
    }

    // Get all data
    const data = sheet.getDataRange().getValues();

    // Skip header row
    if (data.length <= 1) {
      return 'No data to fix';
    }

    // Find rows that need fixing
    let fixedCount = 0;
    for (let i = 1; i < data.length; i++) {
      const timestamp = data[i][0];

      // Check if this row contains form-urlencoded data
      if (typeof timestamp === 'string' && timestamp.startsWith('data=')) {
        try {
          // Extract the data parameter
          const encodedData = timestamp.substring(5); // Remove 'data='
          const decodedData = decodeURIComponent(encodedData);
          const jsonData = JSON.parse(decodedData);

          // Create fixed row data
          const fixedRow = [
            new Date(jsonData.timestamp || Date.now()).toISOString(),
            jsonData.userId || 'Anonymous',
            jsonData.fullName || 'Anonymous',
            jsonData.email || 'Not provided',
            jsonData.dominantGift || 'Not available',
            jsonData.secondaryGift || 'Not available',
            Number(jsonData.teacherScore || 0),
            Number(jsonData.giverScore || 0),
            Number(jsonData.rulerScore || 0),
            Number(jsonData.exhorterScore || 0),
            Number(jsonData.mercyScore || 0),
            Number(jsonData.prophetScore || 0),
            Number(jsonData.servantScore || 0),
            'Fixed from form-urlencoded data',
            'Fixed by fixExistingData() function'
          ];

          // Update the row
          sheet.getRange(i + 1, 1, 1, fixedRow.length).setValues([fixedRow]);
          fixedCount++;
        } catch (parseError) {
          Logger.log(`Error fixing row ${i + 1}: ${parseError.toString()}`);
        }
      }
    }

    return `Fixed ${fixedCount} rows of data`;
  } catch (error) {
    Logger.log('Error in fixExistingData: ' + error.toString());
    return 'Error: ' + error.toString();
  }
}

/**
 * Function to clean up the spreadsheet by removing raw request data
 * that appears to be form-urlencoded errors
 */
function cleanupSpreadsheet() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Submissions');

    if (!sheet) {
      return 'No Submissions sheet found';
    }

    // Get all data
    const data = sheet.getDataRange().getValues();

    // Skip header row
    if (data.length <= 1) {
      return 'No data to clean up';
    }

    // Find rows that appear to be errors
    const rowsToDelete = [];
    for (let i = 1; i < data.length; i++) {
      const timestamp = data[i][0];
      const userId = data[i][1];
      const fullName = data[i][2];

      // Check for various error patterns
      const isError = (
        // JSON in timestamp column
        (typeof timestamp === 'string' &&
          (timestamp.startsWith('{') ||
           timestamp.includes('"requestType"') ||
           timestamp.includes('"hasPostData"'))) ||
        // URL encoded data in timestamp
        (typeof timestamp === 'string' && timestamp.startsWith('data=%7B')) ||
        // Form data in timestamp
        (typeof timestamp === 'string' && timestamp.startsWith('data=')) ||
        // Debug info in userId column
        (typeof userId === 'string' &&
          (userId.includes('"requestType"') ||
           userId === 'ERROR')) ||
        // URL encoded name
        (typeof fullName === 'string' && fullName.includes('%'))
      );

      if (isError) {
        rowsToDelete.push(i + 1); // +1 because rows are 1-indexed
      }
    }

    // Delete rows from bottom to top to avoid shifting issues
    rowsToDelete.sort((a, b) => b - a);
    for (let i = 0; i < rowsToDelete.length; i++) {
      sheet.deleteRow(rowsToDelete[i]);
    }

    return `Cleaned up ${rowsToDelete.length} error rows`;
  } catch (error) {
    Logger.log('Error in cleanupSpreadsheet: ' + error.toString());
    return 'Error: ' + error.toString();
  }
}
