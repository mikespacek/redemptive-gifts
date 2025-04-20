/**
 * Direct Google Sheets Integration
 * 
 * This module provides a direct form submission approach to integrate with Google Sheets
 * without relying on fetch API or other complex methods.
 */

import { GiftType } from '../data/redemptiveGiftsQuestions';

// Define the test result interface
export interface TestResult {
  userId: string;
  scores: Record<GiftType, number>;
  dominantGift: GiftType;
  secondaryGift: GiftType;
  timestamp: number;
  fullName?: string;
  email?: string;
  firstName?: string;
  columnScores?: {
    T: number; // Teacher (Column 1)
    G: number; // Giver (Column 2)
    R: number; // Ruler (Column 3)
    E: number; // Exhorter (Column 4)
    M: number; // Mercy (Column 5)
    P: number; // Prophet (Column 6)
    S: number; // Servant (Column 7)
  };
}

/**
 * Send test results to Google Sheets using a direct form submission approach
 * 
 * @param result The test result to send
 * @returns A promise that resolves with the result of the operation
 */
export function sendToGoogleSheets(result: TestResult): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    try {
      // Get the Google Sheet URL from environment variables
      const GOOGLE_SHEET_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL;
      
      if (!GOOGLE_SHEET_URL) {
        console.error('Google Sheet URL not configured');
        resolve({ success: false, message: 'Google Sheet URL not configured' });
        return;
      }
      
      console.log('Sending data to Google Sheet URL:', GOOGLE_SHEET_URL);
      
      // Format date in 24-hour format: YYYY-MM-DD HH:MM:SS
      const formatDate = (date: Date | number): string => {
        try {
          const d = new Date(date);
          
          // Check if date is valid
          if (isNaN(d.getTime())) {
            console.error('Invalid date:', date);
            // Use current date as fallback
            const now = new Date();
            return formatDate(now);
          }
          
          // Format date as YYYY-MM-DD HH:MM:SS
          const year = d.getFullYear();
          const month = (d.getMonth() + 1).toString().padStart(2, '0');
          const day = d.getDate().toString().padStart(2, '0');
          const hours = d.getHours().toString().padStart(2, '0');
          const minutes = d.getMinutes().toString().padStart(2, '0');
          const seconds = d.getSeconds().toString().padStart(2, '0');
          
          return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        } catch (error) {
          console.error('Error formatting date:', error);
          // Return current date as fallback
          const now = new Date();
          return now.toISOString().replace('T', ' ').substring(0, 19);
        }
      };
      
      // Format the data for Google Sheets
      const formattedData = {
        timestamp: formatDate(result.timestamp),
        userId: result.userId,
        fullName: result.fullName || 'Anonymous',
        email: result.email || 'Not provided',
        dominantGift: result.dominantGift,
        secondaryGift: result.secondaryGift,
        // Use the column scores if available, otherwise use the gift scores
        teacherScore: result.columnScores?.T || result.scores.teacher || 0,
        giverScore: result.columnScores?.G || result.scores.giver || 0,
        rulerScore: result.columnScores?.R || result.scores.ruler || 0,
        exhorterScore: result.columnScores?.E || result.scores.exhorter || 0,
        mercyScore: result.columnScores?.M || result.scores.mercy || 0,
        prophetScore: result.columnScores?.P || result.scores.prophet || 0,
        servantScore: result.columnScores?.S || result.scores.servant || 0,
      };
      
      console.log('Formatted data for Google Sheet:', formattedData);
      
      // Create a unique ID for the iframe
      const iframeId = `google-sheets-iframe-${Date.now()}`;
      
      // Create a hidden iframe for the form target
      const iframe = document.createElement('iframe');
      iframe.id = iframeId;
      iframe.name = iframeId;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      // Create a form element
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = GOOGLE_SHEET_URL;
      form.target = iframeId;
      form.style.display = 'none';
      
      // Add a single field with all data as JSON
      const jsonField = document.createElement('input');
      jsonField.type = 'hidden';
      jsonField.name = 'data';
      jsonField.value = JSON.stringify(formattedData);
      form.appendChild(jsonField);
      
      // Also add each field individually for better compatibility
      Object.entries(formattedData).forEach(([key, value]) => {
        const field = document.createElement('input');
        field.type = 'hidden';
        field.name = key;
        field.value = String(value);
        form.appendChild(field);
      });
      
      // Add the form to the document body
      document.body.appendChild(form);
      
      // Set up a timeout to resolve the promise after a reasonable time
      const timeoutId = setTimeout(() => {
        console.log('Google Sheets submission timeout reached, assuming success');
        
        // Clean up
        if (document.body.contains(form)) {
          document.body.removeChild(form);
        }
        
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
        
        resolve({ success: true, message: 'Results submitted to Google Sheet (timeout)' });
      }, 5000); // 5 second timeout
      
      // Set up iframe load handler
      iframe.onload = () => {
        console.log('Google Sheets iframe loaded, form submission completed');
        
        // Clear the timeout
        clearTimeout(timeoutId);
        
        // Clean up
        if (document.body.contains(form)) {
          document.body.removeChild(form);
        }
        
        // Keep the iframe for a moment to ensure the request completes
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 2000);
        
        resolve({ success: true, message: 'Results submitted to Google Sheet' });
      };
      
      // Submit the form
      console.log('Submitting form to Google Sheets...');
      form.submit();
      
      console.log('Form submission initiated');
      
      // Store the result in localStorage for local access
      localStorage.setItem('redemptiveGiftsTestResults', JSON.stringify(result));
      localStorage.setItem('testResults', JSON.stringify(result));
    } catch (error) {
      console.error('Error sending results to Google Sheet:', error);
      resolve({
        success: false,
        message: 'Failed to submit results to Google Sheet: ' + (error instanceof Error ? error.message : String(error))
      });
    }
  });
}
