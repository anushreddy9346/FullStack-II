import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EventForm from '../components/EventForm.jsx';

describe('EventForm', () => {
  it('pre-fills fields from initialValues', () => {
    render(
      <EventForm
        initialValues={{ title: 'Existing Event', date: '2026-09-01', time: '14:00', category: 'work', description: 'Notes' }}
        submitLabel="Save Changes"
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByLabelText('Title')).toHaveValue('Existing Event');
    expect(screen.getByLabelText('Date')).toHaveValue('2026-09-01');
    expect(screen.getByLabelText('Description')).toHaveValue('Notes');
  });

  it('shows a validation error when submitting without a title', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<EventForm initialValues={{}} submitLabel="Create Event" onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Create Event' }));

    expect(screen.getByText('Title and date are required.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with the entered values when valid', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<EventForm initialValues={{}} submitLabel="Create Event" onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText('Title'), 'New Study Session');
    await user.type(screen.getByLabelText('Date'), '2026-09-05');
    await user.click(screen.getByRole('button', { name: 'Create Event' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'New Study Session', date: '2026-09-05' })
    );
  });

  it('calls onCancel when the Cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<EventForm initialValues={{}} submitLabel="Create Event" onSubmit={vi.fn()} onCancel={onCancel} />);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalled();
  });
});
