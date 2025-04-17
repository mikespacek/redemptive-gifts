"use client";

import { useEffect } from 'react';
import { setupErrorHandler } from '../error-handler';

export default function ClientErrorHandler() {
  // Set up error handler for client-side errors
  useEffect(() => {
    setupErrorHandler();
  }, []);

  // This component doesn't render anything
  return null;
}
