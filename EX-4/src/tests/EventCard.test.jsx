import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EventCard from '../components/EventCard.jsx';

const sampleEvent = {
  id: 'e1',
  title: 'Design Review',
  date: '2026-08-20',
  time: '10:00',
  category: 'work',
  description: 'Review the new landing page.'
};

describe('EventCard', () => {
  it('renders the event title and time', () => {
    render(<EventCard event={sampleEvent} onClick={vi.fn()} onDragStart={vi.fn()} onDragEnd={vi.fn()} />);

    expect(screen.getByText('Design Review')).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
  });

  it('calls onClick with the event when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<EventCard event={sampleEvent} onClick={onClick} onDragStart={vi.fn()} onDragEnd={vi.fn()} />);

    await user.click(screen.getByText('Design Review'));
    expect(onClick).toHaveBeenCalledWith(sampleEvent);
  });

  it('calls onClick when activated with the keyboard', () => {
    const onClick = vi.fn();
    render(<EventCard event={sampleEvent} onClick={onClick} onDragStart={vi.fn()} onDragEnd={vi.fn()} />);

    const card = screen.getByText('Design Review').closest('.event-card');
    fireEvent.keyDown(card, { key: 'Enter' });

    expect(onClick).toHaveBeenCalledWith(sampleEvent);
  });

  it('is draggable and calls onDragStart with the event on drag start', () => {
    const onDragStart = vi.fn();
    render(<EventCard event={sampleEvent} onClick={vi.fn()} onDragStart={onDragStart} onDragEnd={vi.fn()} />);

    const card = screen.getByText('Design Review').closest('.event-card');
    expect(card).toHaveAttribute('draggable', 'true');

    const dataTransfer = { setData: vi.fn(), effectAllowed: '' };
    fireEvent.dragStart(card, { dataTransfer });

    expect(onDragStart).toHaveBeenCalled();
    expect(onDragStart.mock.calls[0][1]).toEqual(sampleEvent);
  });

  it('applies the dragging class when isDragging is true', () => {
    render(
      <EventCard event={sampleEvent} onClick={vi.fn()} onDragStart={vi.fn()} onDragEnd={vi.fn()} isDragging />
    );

    const card = screen.getByText('Design Review').closest('.event-card');
    expect(card).toHaveClass('event-card--dragging');
  });
});
