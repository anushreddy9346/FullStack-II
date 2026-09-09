import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calendar from '../components/Calendar.jsx';
import { MONTH_NAMES, toDateKey } from '../utils/calendarUtils.js';

function buildSampleEvents() {
  const now = new Date();
  const day15 = toDateKey(now.getFullYear(), now.getMonth(), 15);
  return [
    { id: 'e1', title: 'Physics Lecture', date: day15, time: '09:00', category: 'study', description: '' },
    { id: 'e2', title: 'Lunch with Dev', date: day15, time: '13:00', category: 'personal', description: '' }
  ];
}

describe('Calendar rendering', () => {
  it('renders the current month and year heading', () => {
    render(<Calendar events={[]} onEventClick={vi.fn()} onDayClick={vi.fn()} onMoveEvent={vi.fn()} />);

    const now = new Date();
    const heading = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;
    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
  });

  it('renders all seven weekday labels', () => {
    render(<Calendar events={[]} onEventClick={vi.fn()} onDayClick={vi.fn()} onMoveEvent={vi.fn()} />);

    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('places events on their correct date cell', () => {
    const events = buildSampleEvents();
    render(<Calendar events={events} onEventClick={vi.fn()} onDayClick={vi.fn()} onMoveEvent={vi.fn()} />);

    const cell = document.querySelector(`[data-date="${events[0].date}"]`);
    expect(cell).not.toBeNull();
    expect(within(cell).getByText('Physics Lecture')).toBeInTheDocument();
    expect(within(cell).getByText('Lunch with Dev')).toBeInTheDocument();
  });

  it('navigates to the next and previous month', async () => {
    const user = userEvent.setup();
    render(<Calendar events={[]} onEventClick={vi.fn()} onDayClick={vi.fn()} onMoveEvent={vi.fn()} />);

    const now = new Date();
    const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const nextHeading = `${MONTH_NAMES[nextMonthDate.getMonth()]} ${nextMonthDate.getFullYear()}`;

    await user.click(screen.getByLabelText('Next month'));
    expect(screen.getByRole('heading', { name: nextHeading })).toBeInTheDocument();

    await user.click(screen.getByLabelText('Previous month'));
    const originalHeading = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;
    expect(screen.getByRole('heading', { name: originalHeading })).toBeInTheDocument();
  });

  it('returns to the current month when Today is clicked after navigating away', async () => {
    const user = userEvent.setup();
    render(<Calendar events={[]} onEventClick={vi.fn()} onDayClick={vi.fn()} onMoveEvent={vi.fn()} />);

    await user.click(screen.getByLabelText('Next month'));
    await user.click(screen.getByLabelText('Next month'));
    await user.click(screen.getByText('Today'));

    const now = new Date();
    const originalHeading = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;
    expect(screen.getByRole('heading', { name: originalHeading })).toBeInTheDocument();
  });

  it('calls onEventClick with the event when an event card is clicked', async () => {
    const user = userEvent.setup();
    const onEventClick = vi.fn();
    const events = buildSampleEvents();
    render(<Calendar events={events} onEventClick={onEventClick} onDayClick={vi.fn()} onMoveEvent={vi.fn()} />);

    await user.click(screen.getByText('Physics Lecture'));
    expect(onEventClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'e1' }));
  });

  it('calls onDayClick with the date key when an empty day cell is clicked', async () => {
    const user = userEvent.setup();
    const onDayClick = vi.fn();
    render(<Calendar events={[]} onEventClick={vi.fn()} onDayClick={onDayClick} onMoveEvent={vi.fn()} />);

    const now = new Date();
    const key = toDateKey(now.getFullYear(), now.getMonth(), 10);
    const cell = document.querySelector(`[data-date="${key}"]`);
    await user.click(cell);

    expect(onDayClick).toHaveBeenCalledWith(key);
  });
});
