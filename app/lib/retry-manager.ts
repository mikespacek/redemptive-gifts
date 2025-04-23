'use client';

/**
 * Retry Manager
 * 
 * This module handles retrying failed submissions to external services.
 * It should be imported and initialized in the app's layout or main component.
 */

import { retryPendingGoogleSheetsSubmissions } from './google-sheets';
import { retryPendingEmailJSSubmissions } from './emailjs';

/**
 * Initialize the retry manager
 * This will check for any pending submissions and retry them
 */
export async function initializeRetryManager(): Promise<void> {
  if (typeof window === 'undefined') return; // Skip during SSR
  
  console.log('Initializing retry manager...');
  
  // Wait a bit to ensure the app is fully loaded
  setTimeout(async () => {
    try {
      // Retry any pending Google Sheets submissions
      await retryPendingGoogleSheetsSubmissions();
      
      // Retry any pending EmailJS submissions
      await retryPendingEmailJSSubmissions();
      
      console.log('Retry manager initialization complete');
    } catch (error) {
      console.error('Error initializing retry manager:', error);
    }
  }, 5000); // Wait 5 seconds before retrying
}

/**
 * Schedule periodic retries
 * This will check for any pending submissions every 5 minutes
 */
export function schedulePeriodicRetries(): void {
  if (typeof window === 'undefined') return; // Skip during SSR
  
  // Set up an interval to retry pending submissions
  const RETRY_INTERVAL = 5 * 60 * 1000; // 5 minutes
  
  setInterval(async () => {
    try {
      console.log('Running scheduled retry check...');
      
      // Retry any pending Google Sheets submissions
      await retryPendingGoogleSheetsSubmissions();
      
      // Retry any pending EmailJS submissions
      await retryPendingEmailJSSubmissions();
      
      console.log('Scheduled retry check complete');
    } catch (error) {
      console.error('Error in scheduled retry check:', error);
    }
  }, RETRY_INTERVAL);
}
