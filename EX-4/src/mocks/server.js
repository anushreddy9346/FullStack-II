import { setupServer } from 'msw/node';
import { handlers } from './handlers.js';

// This configures a request interception server for the Node process used by
// Vitest, so component/integration tests exercise the real fetch() calls in
// src/services/eventService.js against mocked responses.
export const server = setupServer(...handlers);
