import React, { Profiler, Suspense, lazy, useMemo, useState } from 'react';
import Calendar from './components/Calendar.jsx';
import EventList from './components/EventList.jsx';
import EventModal from './components/EventModal.jsx';
import SearchBar from './components/SearchBar.jsx';
import Loading from './components/Loading.jsx';
import PerformanceOptions from './components/PerformanceOptions.jsx';
import { useEvents } from './hooks/useEvents.js';
import { useOptimizationSettings } from './context/OptimizationContext.jsx';
import { useToggleableCallback } from './hooks/useToggleableCallback.js';
import { useToggleableMemo } from './hooks/useToggleableMemo.js';
import { recordProfilerRender } from './utils/renderStats.js';
import { todayKey } from './utils/calendarUtils.js';
import { recordPerformanceAction } from './utils/performanceActivity.js';
import './App.css';

// Code-split the performance panel: it isn't needed for the calendar's core
// job (viewing/editing events) so there's no reason to ship it in the main
// bundle or block first paint on it.
const PerformanceMonitor = lazy(() => import('./components/PerformanceMonitor.jsx'));

/** Simulated moderately-expensive work so the "useMemo for agenda" toggle
 * has a measurable effect in the React Profiler timings, not just a
 * conceptual one. Real agenda-building is cheap; this stands in for a
 * heavier real-world computation (e.g. conflict detection, recurring-event
 * expansion) without changing the actual result. */
function simulateExpenseWork() {
  let dummy = 0;
  for (let i = 0; i < 60000; i += 1) {
    dummy += (i * 7) % 13;
  }
  return dummy;
}

function buildUpcomingEvents(events) {
  simulateExpenseWork();
  const today = todayKey();
  return [...events]
    .filter((e) => e.date >= today)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 8);
}

function App() {
  const { events, loading, error, reloadEvents, addEvent, editEvent, removeEvent, moveEvent } = useEvents();
  const { settings, toggle } = useOptimizationSettings();
  const useCallbackOn = settings.useCallbackHandlers;

  const [searchTerm, setSearchTerm] = useState('');
  const [modalState, setModalState] = useState({ mode: null, event: null, defaultDate: null });
  const [actionError, setActionError] = useState(null);

  // Derived, filtered event list. useMemo avoids re-filtering the full
  // events array on renders that don't touch `events` or `searchTerm`
  // (e.g. when only the modal's open/closed state changes). This one is
  // always memoized — only the "agenda" list below is toggleable.
  const filteredEvents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return events;
    return events.filter((event) =>
      [event.title, event.category, event.description]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term))
    );
  }, [events, searchTerm]);

  // How many filtered events fall in the current calendar month is computed
  // for the Performance Monitor; grouping by date is reused for that count.
  const visibleThisMonthCount = useMemo(() => {
    const now = new Date();
    const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return filteredEvents.filter((e) => e.date.startsWith(prefix)).length;
  }, [filteredEvents]);

  // "useMemo for agenda" toggle: when on, this behaves like a normal
  // useMemo(buildUpcomingEvents, [filteredEvents]) — recomputed only when
  // the filtered event list changes. When off, buildUpcomingEvents() runs
  // on every single App render (including unrelated ones, like opening the
  // performance panel), so its simulated cost shows up in the "agenda-list"
  // row of the Render Duration table below every time.
  const upcomingEvents = useToggleableMemo(
    () => buildUpcomingEvents(filteredEvents),
    [filteredEvents],
    settings.memoAgenda
  );

  // Stable callbacks passed down into memoized children (Calendar,
  // CalendarDay, EventCard, EventList). useToggleableCallback behaves like
  // useCallback when "useCallback on handlers" is on, and hands back a
  // fresh function reference every render (breaking memo downstream) when
  // it's off.
  const handleEventClick = useToggleableCallback(
    (event) => setModalState({ mode: 'view', event, defaultDate: null }),
    [],
    useCallbackOn
  );

  const handleDayClick = useToggleableCallback(
    (dateKey) => setModalState({ mode: 'create', event: null, defaultDate: dateKey }),
    [],
    useCallbackOn
  );

  const handleCloseModal = useToggleableCallback(
    () => setModalState({ mode: null, event: null, defaultDate: null }),
    [],
    useCallbackOn
  );

  const handleCreate = useToggleableCallback(
    async (formValues) => {
      try {
        await addEvent(formValues);
        recordPerformanceAction('add event', settings);
        setActionError(null);
        setModalState({ mode: null, event: null, defaultDate: null });
      } catch (err) {
        setActionError(err.message || 'Failed to create event');
      }
    },
    [addEvent, settings],
    useCallbackOn
  );

  const handleEdit = useToggleableCallback(
    async (id, formValues) => {
      try {
        await editEvent(id, formValues);
        recordPerformanceAction('edit event', settings);
        setActionError(null);
        setModalState({ mode: null, event: null, defaultDate: null });
      } catch (err) {
        setActionError(err.message || 'Failed to update event');
      }
    },
    [editEvent, settings],
    useCallbackOn
  );

  const handleDelete = useToggleableCallback(
    async (id) => {
      try {
        await removeEvent(id);
        recordPerformanceAction('delete event', settings);
        setActionError(null);
        setModalState({ mode: null, event: null, defaultDate: null });
      } catch (err) {
        setActionError(err.message || 'Failed to delete event');
      }
    },
    [removeEvent, settings],
    useCallbackOn
  );

  const handleMoveEvent = useToggleableCallback(
    async (id, newDate) => {
      try {
        await moveEvent(id, newDate);
        recordPerformanceAction('move event', settings);
        setActionError(null);
      } catch (err) {
        setActionError(err.message || 'Failed to move event');
      }
    },
    [moveEvent, settings],
    useCallbackOn
  );

  const handleSearchChange = useToggleableCallback((value) => { setSearchTerm(value); recordPerformanceAction('search', settings); }, [settings], useCallbackOn);

  const handleProfilerRender = (id, phase, actualDuration) => {
    recordProfilerRender(id, actualDuration);
  };

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1>Smart Interactive Calendar</h1>
          <p className="app__subtitle">React Performance Optimization &amp; Testing</p>
        </div>
        <button type="button" className="btn btn--primary" onClick={() => handleDayClick(todayKey())}>
          + Add Event
        </button>
      </header>

      {error && (
        <div className="banner banner--error">
          <span>Couldn&apos;t load events: {error}</span>
          <button type="button" onClick={reloadEvents}>
            Retry
          </button>
        </div>
      )}

      {actionError && (
        <div className="banner banner--error">
          <span>{actionError}</span>
          <button type="button" onClick={() => setActionError(null)}>
            Dismiss
          </button>
        </div>
      )}

      <SearchBar
        value={searchTerm}
        onChange={handleSearchChange}
        resultCount={filteredEvents.length}
        totalCount={events.length}
      />

      {loading ? (
        <Loading label="Loading events…" />
      ) : (
        <div className="app__layout">
          <main>
            <Profiler id="calendar-cards" onRender={handleProfilerRender}>
              <Calendar
                events={filteredEvents}
                onEventClick={handleEventClick}
                onDayClick={handleDayClick}
                onMoveEvent={handleMoveEvent}
              />
            </Profiler>
          </main>

          <aside className="app__sidebar">
            <PerformanceOptions />

            <section className="performance-monitor-section">
              <Suspense fallback={<Loading label="Loading performance panel…" />}>
                <PerformanceMonitor />
              </Suspense>
            </section>

            <section className="upcoming-events-section">
              <h3>Upcoming Events</h3>
              <Profiler id="agenda-list" onRender={handleProfilerRender}>
                <EventList events={upcomingEvents} onEventClick={handleEventClick} />
              </Profiler>
            </section>
          </aside>
        </div>
      )}

      <EventModal
        mode={modalState.mode}
        event={modalState.event}
        defaultDate={modalState.defaultDate}
        onClose={handleCloseModal}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
