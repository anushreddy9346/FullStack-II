import React, { useMemo, useState } from 'react';
import CalendarDay from './CalendarDay.jsx';
import {
  MONTH_NAMES,
  WEEKDAY_LABELS,
  buildMonthGrid,
  groupEventsByDate,
  todayKey
} from '../utils/calendarUtils.js';
import { useOptimizationSettings } from '../context/OptimizationContext.jsx';
import { useToggleableCallback } from '../hooks/useToggleableCallback.js';
import { useRenderCount } from '../hooks/useRenderCount.js';
import { recordPerformanceAction } from '../utils/performanceActivity.js';

/**
 * Top-level calendar grid. Owns which month is being viewed and which event
 * (if any) is currently being dragged.
 *
 * Performance notes:
 * - `grid` and `eventsByDate` are derived data computed with useMemo, since
 *   rebuilding a 42-cell grid or re-grouping every event on every keystroke
 *   in the search box (which only changes the `events` prop) would be
 *   wasted work whenever `year`/`month` haven't changed.
 * - All handlers passed down to CalendarDay/EventCard are wrapped with
 *   useToggleableCallback, which behaves exactly like useCallback when the
 *   "useCallback on handlers" toggle is on, and hands out a brand-new
 *   function reference every render (as if useCallback were never used)
 *   when it's off — so those React.memo'd children can be seen re-rendering
 *   on every parent render once it's switched off.
 */
function Calendar({ events, onEventClick, onDayClick, onMoveEvent }) {
  useRenderCount('Calendar');
  const { settings } = useOptimizationSettings();
  const useCallbackOn = settings.useCallbackHandlers;

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [draggingEventId, setDraggingEventId] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const grid = useMemo(() => buildMonthGrid(year, month), [year, month]);
  const eventsByDate = useMemo(() => groupEventsByDate(events), [events]);
  const today = useMemo(() => todayKey(), []);

  const goToPrevMonth = useToggleableCallback(
    () => { setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)); recordPerformanceAction('previous month', settings); },
    [settings],
    useCallbackOn
  );

  const goToNextMonth = useToggleableCallback(
    () => { setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)); recordPerformanceAction('next month', settings); },
    [settings],
    useCallbackOn
  );

  const goToToday = useToggleableCallback(() => { setCurrentDate(new Date()); recordPerformanceAction('today', settings); }, [settings], useCallbackOn);

  const handleDragStart = useToggleableCallback(
    (e, event) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', event.id);
      setDraggingEventId(event.id);
    },
    [],
    useCallbackOn
  );

  const handleDragEnd = useToggleableCallback(() => setDraggingEventId(null), [], useCallbackOn);

  const handleDrop = useToggleableCallback(
    (targetDateKey) => {
      if (draggingEventId) {
        // The actual move handler records this action once after the move succeeds.
        onMoveEvent(draggingEventId, targetDateKey);
      }
      setDraggingEventId(null);
    },
    [draggingEventId, onMoveEvent],
    useCallbackOn
  );

  return (
    <div className="calendar">
      <div className="calendar__toolbar">
        <div className="calendar__nav">
          <button type="button" onClick={goToPrevMonth} aria-label="Previous month">
            ‹
          </button>
          <button type="button" className="calendar__today-btn" onClick={goToToday}>
            Today
          </button>
          <button type="button" onClick={goToNextMonth} aria-label="Next month">
            ›
          </button>
        </div>
        <h2 className="calendar__heading">
          {MONTH_NAMES[month]} {year}
        </h2>
      </div>

      <div className="calendar__weekdays">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="calendar__weekday">
            {label}
          </div>
        ))}
      </div>

      <div className="calendar__grid">
        {grid.map((cell) => (
          <CalendarDay
            key={cell.dateKey + cell.isCurrentMonth}
            dateKey={cell.dateKey}
            day={cell.day}
            isCurrentMonth={cell.isCurrentMonth}
            isToday={cell.dateKey === today}
            events={eventsByDate.get(cell.dateKey) || []}
            onEventClick={onEventClick}
            onDayClick={onDayClick}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            draggingEventId={draggingEventId}
          />
        ))}
      </div>
    </div>
  );
}

export default Calendar;
