/**
 * Function to aggressively clean up the spreadsheet by removing or fixing problematic rows
 * This will handle the specific format of data shown in the screenshot
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
    const rowsToFix = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const lastColumn = row[row.length - 1]; // Get the last column value
      
      // Check if the last column contains encoded data
      if (typeof lastColumn === 'string' && 
          (lastColumn.includes('data=%7B') || 
           lastColumn.includes('"timestamp"') ||
           lastColumn.includes('{"timestamp"') ||
           lastColumn.startsWith('data='))) {
        rowsToDelete.push(i + 1); // +1 because rows are 1-indexed
        continue;
      }
      
      // Check if any column contains the specific pattern from the screenshot
      let containsEncodedData = false;
      for (let j = 0; j < row.length; j++) {
        const cell = row[j];
        if (typeof cell === 'string' && 
            (cell.includes('timestamp%22') || 
             cell.includes('userId%22') ||
             cell.includes('fullName%22'))) {
          containsEncodedData = true;
          break;
        }
      }
      
      if (containsEncodedData) {
        rowsToDelete.push(i + 1);
      }
    }
    
    // Delete rows from bottom to top to avoid shifting issues
    rowsToDelete.sort((a, b) => b - a);
    for (let i = 0; i < rowsToDelete.length; i++) {
      sheet.deleteRow(rowsToDelete[i]);
    }
    
    return `Aggressively cleaned up ${rowsToDelete.length} problematic rows`;
  } catch (error) {
    Logger.log('Error in aggressiveCleanup: ' + error.toString());
    return 'Error: ' + error.toString();
  }
}

/**
 * Function to manually clean specific rows by row number
 * Use this if you know exactly which rows need to be deleted
 */
function deleteSpecificRows() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Submissions');
    
    if (!sheet) {
      return 'No Submissions sheet found';
    }
    
    // Specify the row numbers to delete (1-indexed, where 1 is the header row)
    // Adjust these numbers based on your spreadsheet
    const rowsToDelete = [8, 9, 10]; // Example: delete rows 8, 9, and 10
    
    // Delete rows from bottom to top to avoid shifting issues
    rowsToDelete.sort((a, b) => b - a);
    for (let i = 0; i < rowsToDelete.length; i++) {
      sheet.deleteRow(rowsToDelete[i]);
    }
    
    return `Deleted ${rowsToDelete.length} specific rows`;
  } catch (error) {
    Logger.log('Error in deleteSpecificRows: ' + error.toString());
    return 'Error: ' + error.toString();
  }
}
