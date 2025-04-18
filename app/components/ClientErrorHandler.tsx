"use client";

import { useEffect } from 'react';
import { setupErrorHandler } from '../error-handler';

export default function ClientErrorHandler() {
  // Set up error handler for client-side errors
  useEffect(() => {
    setupErrorHandler();
  }, []);

  // Return null - no UI needed
  return null;
}
