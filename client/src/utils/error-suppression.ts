// Suppress known non-critical errors to prevent console spam
export function setupErrorSuppression() {
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  console.error = (...args) => {
    const message = args.join(' ');
    
    // Suppress util module externalization errors
    if (message.includes('util.debuglog') || 
        message.includes('util.inspect') || 
        message.includes('Module "util" has been externalized')) {
      return;
    }
    
    // Suppress Lit dev mode warnings
    if (message.includes('Lit is in dev mode') || 
        message.includes('Multiple versions of Lit loaded')) {
      return;
    }
    
    originalConsoleError.apply(console, args);
  };

  console.warn = (...args) => {
    const message = args.join(' ');
    
    // Suppress util module externalization warnings
    if (message.includes('util.debuglog') || 
        message.includes('util.inspect') || 
        message.includes('Module "util" has been externalized')) {
      return;
    }
    
    // Suppress Lit dev mode warnings
    if (message.includes('Lit is in dev mode') || 
        message.includes('Multiple versions of Lit loaded')) {
      return;
    }
    
    originalConsoleWarn.apply(console, args);
  };

  // Global error handler for unhandled errors
  window.addEventListener('error', (event) => {
    if (event.message.includes('util') || 
        event.message.includes('Lit') ||
        event.message === 'Uncaught') {
      event.preventDefault();
      return false;
    }
  });

  // Global promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    const message = event.reason?.message || '';
    if (message.includes('util') || 
        message.includes('Lit')) {
      event.preventDefault();
      return false;
    }
  });
}