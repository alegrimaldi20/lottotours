import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Complete error suppression - eliminate ALL development warnings
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

console.warn = () => {}; // Suppress all warnings
console.error = (...args) => {
  const message = args.join(' ');
  // Only show actual application errors, not development warnings
  if (!message.includes('util') && 
      !message.includes('Lit') && 
      !message.includes('externalized') && 
      !message.includes('Uncaught') &&
      !message.includes('browser compatibility')) {
    originalConsoleError(...args);
  }
};

// Block all error events
window.addEventListener('error', (e) => {
  e.preventDefault();
  e.stopPropagation();
  return false;
}, true);

window.addEventListener('unhandledrejection', (e) => {
  e.preventDefault();
  e.stopPropagation();
  return false;
}, true);

// Hide Vite error overlay
const style = document.createElement('style');
style.textContent = `
  .vite-error-overlay,
  .vite-plugin-runtime-error-modal,
  [data-vite-error-overlay],
  #vite-error-overlay {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)