import React, { memo } from 'react';
import { categoryColor } from '../utils/calendarUtils.js';
import { useRenderCount } from '../hooks/useRenderCount.js';

/**
 * EventCard is rendered once per event, per visible day — potentially dozens
 * of times per month. Normally it's wrapped in React.memo so that when one
 * event's details change (or the search term changes) only the affected
 * card(s) re-render, instead of every card in the calendar. The "React.memo
 * on cards" toggle in the Performance Monitor lets you compare this
 * component WITH memo (`MemoizedEventCard`, used when the toggle is on) and
 * WITHOUT it (`EventCardBase`, used when the toggle is off) at runtime.
 */
function EventCardBase({ event, onClick, onDragStart, onDragEnd, isDragging }) {
  useRenderCount('EventCard');

  // Deliberately unthrottled: this is the console log the experiment's
  // "Re-render Analysis" section asks for, so unnecessary re-renders can be
  // observed before/after memoization is applied.
  console.log('EventCard rendered:', event.title);

  const handleClick = (e) => {
    e.stopPropagation();
    onClick(event);
  };

  return (
    <div
      className={`event-card${isDragging ? ' event-card--dragging' : ''}`}
      style={{ borderLeftColor: categoryColor(event.category) }}
      draggable
      onDragStart={(e) => onDragStart(e, event)}
      onDragEnd={onDragEnd}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(event);
        }
      }}
      title={`${event.title} — ${event.time}`}
    >
      <span className="event-card__time">{event.time}</span>
      <span className="event-card__title">{event.title}</span>
    </div>
  );
}

// Custom comparison isn't necessary here since props are primitives/objects
// that only change when the event itself changes, but memo() alone already
// prevents re-renders when sibling cards' props change instead.
export const MemoizedEventCard = memo(EventCardBase);

export { EventCardBase };

// Default export keeps existing imports (e.g. tests) working unchanged —
// it is the memoized variant, matching this component's original behavior.
export default MemoizedEventCard;
