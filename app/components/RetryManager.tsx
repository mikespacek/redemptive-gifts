'use client';

import { useEffect } from 'react';
import { initializeRetryManager, schedulePeriodicRetries } from '../lib/retry-manager';

/**
 * RetryManager component
 * 
 * This component initializes the retry manager when the app loads.
 * It should be included in the app's layout or main component.
 */
export default function RetryManager() {
  useEffect(() => {
    // Initialize the retry manager
    initializeRetryManager();
    
    // Schedule periodic retries
    schedulePeriodicRetries();
    
    // No cleanup needed
  }, []);
  
  // This component doesn't render anything
  return null;
}
