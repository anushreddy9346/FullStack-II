// -----------------------------------------------------------------------------
// Pure helper functions for building a month grid and working with the
// "YYYY-MM-DD" date strings used throughout the app. Keeping these pure and
// framework-free makes them cheap to memoize with useMemo in the components
// that consume them, and easy to unit-test in isolation.
// -----------------------------------------------------------------------------

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const pad = (n) => String(n).padStart(2, '0');

/** Format a year/month/day into the canonical "YYYY-MM-DD" key used on events. */
export function toDateKey(year, month, day) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

/** Return today's date key ("YYYY-MM-DD"). */
export function todayKey() {
  const now = new Date();
  return toDateKey(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Build a full 6-week (42 cell) grid for the given year/month, including the
 * trailing/leading days from adjacent months so the calendar grid is always
 * rectangular. Each cell carries its date key and whether it belongs to the
 * currently displayed month.
 */
export function buildMonthGrid(year, month) {
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];

  // Leading days from the previous month
  for (let i = startWeekday - 1; i >= 0; i -= 1) {
    const day = daysInPrevMonth - i;
    const prevMonthDate = new Date(year, month - 1, day);
    cells.push({
      day,
      dateKey: toDateKey(prevMonthDate.getFullYear(), prevMonthDate.getMonth(), day),
      isCurrentMonth: false
    });
  }

  // Days in the current month
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      day,
      dateKey: toDateKey(year, month, day),
      isCurrentMonth: true
    });
  }

  // Trailing days from the next month to complete the grid (6 rows x 7 cols)
  const totalCells = 42;
  let nextDay = 1;
  while (cells.length < totalCells) {
    const nextMonthDate = new Date(year, month + 1, nextDay);
    cells.push({
      day: nextDay,
      dateKey: toDateKey(nextMonthDate.getFullYear(), nextMonthDate.getMonth(), nextDay),
      isCurrentMonth: false
    });
    nextDay += 1;
  }

  return cells;
}

/**
 * Group an array of events by their date key. Returns a Map for O(1) lookups
 * when rendering each calendar cell. This is the kind of derived computation
 * that is a good candidate for useMemo, since re-grouping on every render
 * (e.g. while typing in the search box) would be wasted work once the events
 * array itself hasn't changed.
 */
export function groupEventsByDate(events) {
  const map = new Map();
  for (const event of events) {
    if (!map.has(event.date)) {
      map.set(event.date, []);
    }
    map.get(event.date).push(event);
  }
  // Keep each day's events sorted by time for a stable, readable order.
  for (const list of map.values()) {
    list.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  }
  return map;
}

export const EVENT_CATEGORIES = [
  { value: 'work', label: 'Work', color: '#4f6df5' },
  { value: 'personal', label: 'Personal', color: '#22a06b' },
  { value: 'study', label: 'Study', color: '#a256e8' },
  { value: 'deadline', label: 'Deadline', color: '#e2543c' },
  { value: 'general', label: 'General', color: '#6b7280' }
];

export function categoryColor(category) {
  const found = EVENT_CATEGORIES.find((c) => c.value === category);
  return found ? found.color : EVENT_CATEGORIES[EVENT_CATEGORIES.length - 1].color;
}
