"use client";

import { useEffect } from 'react';
import { setupErrorHandler } from '../error-handler';
import ConnectionTestWrapper from './ConnectionTestWrapper';

export default function ClientErrorHandler() {
  // Set up error handler for client-side errors
  useEffect(() => {
    setupErrorHandler();
  }, []);

  // Return the connection test wrapper (which will only render in dev mode)
  return <ConnectionTestWrapper />;
}
