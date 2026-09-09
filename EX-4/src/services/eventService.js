// -----------------------------------------------------------------------------
// API/service layer. These functions are the ONLY place in the app that talks
// to the network. In development and in tests, Mock Service Worker intercepts
// these fetch() calls (see src/mocks) and returns realistic mock data, so the
// rest of the application behaves exactly as if it were wired to a real
// backend, without needing one.
// -----------------------------------------------------------------------------

const BASE_URL = '/api/events';

async function parseResponse(response) {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = (data && data.message) || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

/** Fetch all events from the API. */
export async function getEvents() {
  const response = await fetch(BASE_URL, { method: 'GET' });
  return parseResponse(response);
}

/** Create a new event. */
export async function createEvent(eventData) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData)
  });
  return parseResponse(response);
}

/** Update an existing event (used for edits and drag-and-drop date moves). */
export async function updateEvent(id, updates) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  return parseResponse(response);
}

/** Delete an event by id. */
export async function deleteEvent(id) {
  const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  return parseResponse(response);
}
