/**
 * Simple Google Apps Script for handling Redemptive Gifts Test submissions
 * This version includes fixes for timestamp parsing
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
        'Raw Data'
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
 * Parse and format date in 12-hour format: MM/DD/YYYY hh:mm:ss AM/PM
 * This function is more robust and handles various date formats
 */
function parseAndFormatDate(dateStr) {
  try {
    let date;
    
    // If it's already in our format, just return it
    if (typeof dateStr === 'string' && 
        /^\d{2}\/\d{2}\/\d{4} \d{1,2}:\d{2}:\d{2} [AP]M$/.test(dateStr)) {
      return dateStr;
    }
    
    // Try to parse the date
    if (typeof dateStr === 'number') {
      // If it's a timestamp in milliseconds
      date = new Date(dateStr);
    } else if (typeof dateStr === 'string') {
      // Try to parse the string as a date
      if (dateStr.includes('T') && dateStr.includes('Z')) {
        // ISO format
        date = new Date(dateStr);
      } else if (dateStr.includes('/')) {
        // MM/DD/YYYY format
        const parts = dateStr.split(/[/ :]/);
        if (parts.length >= 3) {
          const month = parseInt(parts[0], 10) - 1;
          const day = parseInt(parts[1], 10);
          let year = parseInt(parts[2], 10);
          
          // Handle 2-digit years
          if (year < 100) {
            year += 2000;
          }
          
          let hours = 0, minutes = 0, seconds = 0;
          if (parts.length >= 6) {
            hours = parseInt(parts[3], 10);
            minutes = parseInt(parts[4], 10);
            seconds = parseInt(parts[5], 10);
            
            // Handle AM/PM
            if (parts.length >= 7 && parts[6].toUpperCase().includes('PM') && hours < 12) {
              hours += 12;
            }
            if (parts.length >= 7 && parts[6].toUpperCase().includes('AM') && hours === 12) {
              hours = 0;
            }
          }
          
          date = new Date(year, month, day, hours, minutes, seconds);
        }
      } else {
        // Try standard parsing
        date = new Date(dateStr);
      }
    }
    
    // If we couldn't parse the date, use current date
    if (!date || isNaN(date.getTime())) {
      date = new Date();
    }
    
    // Format date as MM/DD/YYYY
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    
    // Format time in 12-hour format with AM/PM
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
  } catch (error) {
    Logger.log('Error formatting date: ' + error.toString());
    return new Date().toLocaleString();
  }
}

/**
 * Handle GET requests - for testing the connection
 */
function doGet(e) {
  const now = new Date();
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Google Apps Script is working correctly',
    timestamp: parseAndFormatDate(now)
  }))
  .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle POST requests - for receiving test submissions
 */
function doPost(e) {
  try {
    // Log the request for debugging
    Logger.log('Received POST request: ' + JSON.stringify(e));

    // Get the sheet
    const sheet = setupSpreadsheet();
    
    // Parse the incoming data
    let data;
    let rawData = 'No data found';
    
    // Try to parse the postData if it exists
    if (e.postData && e.postData.contents) {
      rawData = e.postData.contents;
      try {
        data = JSON.parse(rawData);
        Logger.log('Successfully parsed JSON data');
      } catch (parseError) {
        Logger.log('Error parsing JSON: ' + parseError.toString());
        
        // Try to extract data from form-urlencoded format
        if (e.postData.type === 'application/x-www-form-urlencoded') {
          const formData = {};
          const pairs = rawData.split('&');
          for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i].split('=');
            if (pair.length === 2) {
              const key = decodeURIComponent(pair[0]);
              const value = decodeURIComponent(pair[1]);
              formData[key] = value;
            }
          }
          
          // Check if we have a data parameter
          if (formData.data) {
            try {
              data = JSON.parse(formData.data);
              Logger.log('Successfully parsed form data');
            } catch (formParseError) {
              Logger.log('Error parsing form data: ' + formParseError.toString());
            }
          }
        }
      }
    }
    
    // If we still don't have data, check the parameters
    if (!data && e.parameter) {
      if (e.parameter.data) {
        try {
          data = JSON.parse(e.parameter.data);
          rawData = e.parameter.data;
          Logger.log('Successfully parsed parameter data');
        } catch (paramParseError) {
          Logger.log('Error parsing parameter data: ' + paramParseError.toString());
        }
      } else {
        // Use the parameters directly
        data = e.parameter;
        rawData = JSON.stringify(e.parameter);
        Logger.log('Using parameters directly');
      }
    }
    
    // If we still don't have data, return an error
    if (!data) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'No data found in the request'
      }))
      .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Clean up the fullName if it contains URL encoding
    if (data.fullName && typeof data.fullName === 'string' && data.fullName.includes('+')) {
      data.fullName = data.fullName.replace(/\+/g, ' ');
    }
    
    // Format the timestamp in 12-hour format
    const timestamp = parseAndFormatDate(data.timestamp || new Date());
    
    // Format the data for the spreadsheet
    const rowData = [
      timestamp,
      data.userId || 'Anonymous',
      data.fullName || 'Anonymous',
      data.email || 'Not provided',
      data.dominantGift || 'Not available',
      data.secondaryGift || 'Not available',
      Number(data.teacherScore || 0),
      Number(data.giverScore || 0),
      Number(data.rulerScore || 0),
      Number(data.exhorterScore || 0),
      Number(data.mercyScore || 0),
      Number(data.prophetScore || 0),
      Number(data.servantScore || 0),
      rawData.substring(0, 500) // Limit to 500 characters
    ];
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data received and processed successfully',
      timestamp: timestamp
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log the error
    Logger.log('Error in doPost: ' + error.toString());
    
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error: ' + error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Function to aggressively clean up the spreadsheet by removing or fixing problematic rows
 */
function aggressiveCleanup() {
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
    
    // Find rows that appear to be errors or contain encoded data
    const rowsToDelete = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Check for various error patterns
      let isError = false;
      
      // Check if the timestamp is invalid (contains NaN)
      if (typeof row[0] === 'string' && row[0].includes('NaN')) {
        isError = true;
      }
      
      // Check for encoded data
      for (let j = 0; j < row.length; j++) {
        const cell = row[j];
        if (typeof cell === 'string' && 
            (cell.includes('data=%7B') || 
             cell.includes('timestamp%22') || 
             cell.includes('userId%22') ||
             cell.includes('fullName%22') ||
             cell.startsWith('data='))) {
          isError = true;
          break;
        }
      }
      
      if (isError) {
        rowsToDelete.push(i + 1); // +1 because rows are 1-indexed
      }
    }
    
    // Delete rows from bottom to top to avoid shifting issues
    rowsToDelete.sort((a, b) => b - a);
    for (let i = 0; i < rowsToDelete.length; i++) {
      sheet.deleteRow(rowsToDelete[i]);
    }
    
    return `Cleaned up ${rowsToDelete.length} problematic rows`;
  } catch (error) {
    Logger.log('Error in aggressiveCleanup: ' + error.toString());
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
      const row = data[i];
      let needsFix = false;
      let jsonData = null;
      
      // Check if the timestamp is invalid
      if (typeof row[0] === 'string' && row[0].includes('NaN')) {
        needsFix = true;
      }
      
      // Check for encoded data in the last column
      const lastColumn = row[row.length - 1];
      if (typeof lastColumn === 'string' && lastColumn.startsWith('data=')) {
        try {
          // Extract the data parameter
          const encodedData = lastColumn.substring(5); // Remove 'data='
          const decodedData = decodeURIComponent(encodedData);
          jsonData = JSON.parse(decodedData);
          needsFix = true;
        } catch (parseError) {
          Logger.log(`Error parsing encoded data in row ${i + 1}: ${parseError.toString()}`);
        }
      }
      
      if (needsFix && jsonData) {
        try {
          // Format the timestamp
          const timestamp = parseAndFormatDate(jsonData.timestamp || new Date());
          
          // Clean up the fullName if it contains URL encoding
          if (jsonData.fullName && typeof jsonData.fullName === 'string' && jsonData.fullName.includes('+')) {
            jsonData.fullName = jsonData.fullName.replace(/\+/g, ' ');
          }
          
          // Create fixed row data
          const fixedRow = [
            timestamp,
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
            'Fixed from form-urlencoded data'
          ];
          
          // Update the row
          sheet.getRange(i + 1, 1, 1, fixedRow.length).setValues([fixedRow]);
          fixedCount++;
        } catch (fixError) {
          Logger.log(`Error fixing row ${i + 1}: ${fixError.toString()}`);
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
