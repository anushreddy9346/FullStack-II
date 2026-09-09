import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server.js';
import App from '../App.jsx';
import { getEvents, createEvent } from '../services/eventService.js';

describe('Mock API integration', () => {
  it('getEvents() resolves with the mocked event list', async () => {
    const events = await getEvents();
    expect(Array.isArray(events)).toBe(true);
    expect(events.length).toBeGreaterThan(0);
    expect(events[0]).toHaveProperty('title');
    expect(events[0]).toHaveProperty('date');
  });

  it('createEvent() posts a new event and receives it back with an id', async () => {
    const created = await createEvent({ title: 'API Test Event', date: '2026-09-10', time: '10:00', category: 'work' });
    expect(created).toHaveProperty('id');
    expect(created.title).toBe('API Test Event');
  });

  it('shows a loading indicator before events arrive, then renders them', async () => {
    render(<App />);

    expect(screen.getByText('Loading events…')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading events…')).not.toBeInTheDocument();
    });

    expect(screen.getAllByText('Team Standup').length).toBeGreaterThan(0);
  });

  it('shows an error banner and lets the user retry when the API fails', async () => {
    server.use(
      http.get('/api/events', () => HttpResponse.json({ message: 'Server unavailable' }, { status: 500 }))
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Couldn't load events/)).toBeInTheDocument();
    });

    // Restore the default (working) handler and retry.
    server.resetHandlers();
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

    await waitFor(() => {
      expect(screen.queryByText(/Couldn't load events/)).not.toBeInTheDocument();
    });
  });
});
