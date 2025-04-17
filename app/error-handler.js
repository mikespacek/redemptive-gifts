// Client-side error handler for Netlify deployments
export function setupErrorHandler() {
  if (typeof window !== 'undefined') {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Check if it's a Convex-related error
      const errorString = String(event.reason);
      if (errorString.includes('Convex') || 
          errorString.includes('connection') || 
          errorString.includes('network')) {
        // Redirect to error page
        window.location.href = '/error';
      }
    });

    // Handle runtime errors
    window.addEventListener('error', (event) => {
      console.error('Runtime error:', event.error);
      
      // Check if it's a Convex-related error
      const errorString = String(event.error);
      if (errorString.includes('Convex') || 
          errorString.includes('connection') || 
          errorString.includes('network')) {
        // Redirect to error page
        window.location.href = '/error';
      }
    });
  }
}
