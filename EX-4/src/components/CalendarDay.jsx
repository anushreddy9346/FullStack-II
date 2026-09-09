import React, { memo, useState } from 'react';
import { MemoizedEventCard, EventCardBase } from './EventCard.jsx';
import { useOptimizationSettings } from '../context/OptimizationContext.jsx';
import { useRenderCount } from '../hooks/useRenderCount.js';

/**
 * One grid cell in the calendar. Wrapped in React.memo: with 42 cells
 * rendered every month, re-rendering all of them whenever a single event
 * moves (or the search box changes) would be expensive. Because the parent
 * passes this component a pre-computed `events` array (already filtered and
 * grouped via useMemo) and stable callbacks (via useCallback), a day cell
 * only re-renders when its own date's events actually change.
 */
function CalendarDay({
  dateKey,
  day,
  isCurrentMonth,
  isToday,
  events,
  onEventClick,
  onDayClick,
  onDragStart,
  onDragEnd,
  onDrop,
  draggingEventId
}) {
  useRenderCount('CalendarDay');
  const [isDragOver, setIsDragOver] = useState(false);

  // "React.memo on cards" toggle: when on, use the memoized EventCard so
  // unaffected cards bail out of re-rendering; when off, use the plain,
  // unmemoized base component so every card re-renders whenever this day
  // cell re-renders.
  const { settings } = useOptimizationSettings();
  const CardComponent = settings.memoCards ? MemoizedEventCard : EventCardBase;

  const handleDragOver = (e) => {
    e.preventDefault(); // required to allow a drop
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(dateKey);
  };

  return (
    <div
      className={[
        'calendar-day',
        !isCurrentMonth && 'calendar-day--outside',
        isToday && 'calendar-day--today',
        isDragOver && 'calendar-day--drag-over'
      ]
        .filter(Boolean)
        .join(' ')}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => onDayClick(dateKey)}
      data-date={dateKey}
    >
      <div className="calendar-day__header">
        <span className="calendar-day__number">{day}</span>
        {isToday && <span className="calendar-day__today-badge">Today</span>}
      </div>
      <div className="calendar-day__events">
        {events.map((event) => (
          <CardComponent
            key={event.id}
            event={event}
            onClick={onEventClick}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            isDragging={draggingEventId === event.id}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(CalendarDay);
