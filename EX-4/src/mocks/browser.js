import { setupWorker } from 'msw/browser';
import { handlers } from './handlers.js';

// This configures a Service Worker that intercepts requests made from the
// browser (used only in the app itself, not in tests).
export const worker = setupWorker(...handlers);
