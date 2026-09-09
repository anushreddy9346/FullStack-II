import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App.jsx';

async function waitForInitialLoad() {
  await waitFor(() => expect(screen.getAllByText('Team Standup')[0]).toBeInTheDocument());
}

describe('Event interaction', () => {
  it('lets the user click an event and see its details', async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitForInitialLoad();

    await user.click(screen.getAllByText('Team Standup')[0]);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(within(screen.getByRole('dialog')).getByText('Team Standup')).toBeInTheDocument();
    expect(within(screen.getByRole('dialog')).getByText('09:30')).toBeInTheDocument();
  });

  it('lets the user create a new event', async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitForInitialLoad();

    await user.click(screen.getByRole('button', { name: '+ Add Event' }));
    expect(screen.getByText('Add Event')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Title'), 'Library Study Block');
    await user.click(screen.getByRole('button', { name: 'Create Event' }));

    await waitFor(() => {
      expect(screen.getAllByText('Library Study Block').length).toBeGreaterThan(0);
    });
  });

  it('lets the user edit an existing event', async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitForInitialLoad();

    await user.click(screen.getAllByText('Gym Session')[0]);
    await user.click(screen.getByRole('button', { name: 'Edit' }));

    const titleInput = screen.getByLabelText('Title');
    await user.clear(titleInput);
    await user.type(titleInput, 'Evening Gym Session');
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => {
      expect(screen.getAllByText('Evening Gym Session').length).toBeGreaterThan(0);
    });
    expect(screen.queryByText('Gym Session')).not.toBeInTheDocument();
  });

  it('lets the user delete an event', async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitForInitialLoad();

    await user.click(screen.getAllByText('Mock Interview')[0]);
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(screen.queryByText('Mock Interview')).not.toBeInTheDocument();
    });
  });

  it('moves an event to a new date via drag-and-drop', async () => {
    render(<App />);
    await waitForInitialLoad();

    const card = screen.getAllByText('Sprint Planning')[0].closest('.event-card');
    const originCell = card.closest('.calendar-day');
    const targetCell = document.querySelector('.calendar-day:not(.calendar-day--outside)');

    expect(targetCell).not.toBe(originCell);

    const dataTransfer = { setData: () => {}, effectAllowed: '' };
    fireEvent.dragStart(card, { dataTransfer });
    fireEvent.dragOver(targetCell, { dataTransfer });
    fireEvent.drop(targetCell, { dataTransfer });

    await waitFor(() => {
      expect(within(targetCell).getByText('Sprint Planning')).toBeInTheDocument();
    });
  });

  it('filters visible events as the user types in the search box', async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitForInitialLoad();

    const search = screen.getByLabelText('Search events');
    await user.type(search, 'birthday');

    await waitFor(() => {
      expect(screen.getAllByText('Birthday Party').length).toBeGreaterThan(0);
    });
    expect(screen.queryByText('Team Standup')).not.toBeInTheDocument();
  });
});
