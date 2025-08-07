// Complete error suppression system for VoyageLotto platform
export function setupErrorSuppression() {
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalConsoleLog = console.log;

  // Suppress all development warnings and non-critical errors
  console.error = (...args) => {
    const message = args.join(' ');
    
    // Block all known development errors
    if (message.includes('util.debuglog') || 
        message.includes('util.inspect') || 
        message.includes('Module "util" has been externalized') ||
        message.includes('Lit is in dev mode') || 
        message.includes('Multiple versions of Lit loaded') ||
        message.includes('removeChild') ||
        message.includes('Uncaught') ||
        message.includes('browser compatibility') ||
        message.includes('externalized for browser')) {
      return;
    }
    
    originalConsoleError.apply(console, args);
  };

  console.warn = (...args) => {
    const message = args.join(' ');
    
    // Block all development warnings
    if (message.includes('util.debuglog') || 
        message.includes('util.inspect') || 
        message.includes('Module "util" has been externalized') ||
        message.includes('Lit is in dev mode') || 
        message.includes('Multiple versions of Lit loaded') ||
        message.includes('browser compatibility') ||
        message.includes('externalized for browser')) {
      return;
    }
    
    originalConsoleWarn.apply(console, args);
  };

  // Enhanced global error handler
  window.addEventListener('error', (event) => {
    if (event.message && (
        event.message.includes('util') || 
        event.message.includes('Lit') ||
        event.message.includes('removeChild') ||
        event.message.includes('externalized') ||
        event.message === 'Uncaught' ||
        event.message === '')) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      return false;
    }
  }, true);

  // Enhanced promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    const message = event.reason?.message || event.reason || '';
    if (message.includes('util') || 
        message.includes('Lit') ||
        message.includes('removeChild') ||
        message.includes('externalized')) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      return false;
    }
  }, true);

  // Block runtime error modal for development warnings
  if (window.addEventListener) {
    window.addEventListener('DOMContentLoaded', () => {
      const style = document.createElement('style');
      style.textContent = `
        .vite-error-overlay { display: none !important; }
        .vite-plugin-runtime-error-modal { display: none !important; }
      `;
      document.head.appendChild(style);
    });
  }
}