import React, { memo } from 'react';
import { categoryColor } from '../utils/calendarUtils.js';
import { useRenderCount } from '../hooks/useRenderCount.js';

/**
 * Flat, sorted list of events shown in the sidebar ("Upcoming events" /
 * agenda). Wrapped in React.memo because it receives the same `events`
 * array reference (see the "useMemo for agenda" toggle in App.jsx) on
 * renders where only unrelated state (like the performance monitor's tick)
 * changes — as long as that toggle is on.
 */
function EventList({ events, onEventClick }) {
  useRenderCount('EventList');
  console.log('EventList rendered');

  if (events.length === 0) {
    return <p className="event-list__empty">No events match your search.</p>;
  }

  return (
    <ul className="event-list">
      {events.map((event) => (
        <li key={event.id}>
          <button
            type="button"
            className="event-list__item"
            style={{ borderLeftColor: categoryColor(event.category) }}
            onClick={() => onEventClick(event)}
          >
            <span className="event-list__date">
              {event.date} · {event.time}
            </span>
            <span className="event-list__title">{event.title}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default memo(EventList);
