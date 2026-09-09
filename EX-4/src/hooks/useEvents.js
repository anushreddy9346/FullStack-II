import { useCallback, useEffect, useState } from 'react';
import { createEvent, deleteEvent, getEvents, updateEvent } from '../services/eventService.js';

/**
 * Centralizes all event state and API interaction so that App.jsx and the
 * calendar components stay focused on rendering. Every mutator below is
 * wrapped in useCallback so components that receive them as props (and are
 * wrapped in React.memo) don't re-render just because App re-rendered.
 */
export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const addEvent = useCallback(async (eventData) => {
    const created = await createEvent(eventData);
    setEvents((prev) => [...prev, created]);
    return created;
  }, []);

  const editEvent = useCallback(async (id, updates) => {
    const updated = await updateEvent(id, updates);
    setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
    return updated;
  }, []);

  const removeEvent = useCallback(async (id) => {
    await deleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  /** Convenience wrapper used by drag-and-drop: only the date field changes. */
  const moveEvent = useCallback(
    async (id, newDate) => {
      return editEvent(id, { date: newDate });
    },
    [editEvent]
  );

  return { events, loading, error, reloadEvents: loadEvents, addEvent, editEvent, removeEvent, moveEvent };
}
