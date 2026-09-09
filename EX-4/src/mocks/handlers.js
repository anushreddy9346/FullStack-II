import { http, HttpResponse } from 'msw';

// ---------------------------------------------------------------------------
// In-memory "database" of events. MSW intercepts fetch() calls made by
// src/services/eventService.js and serves data from this array, so the UI
// behaves exactly as if it were talking to a real backend.
// ---------------------------------------------------------------------------

const today = new Date();
const y = today.getFullYear();
const m = today.getMonth();

const pad = (n) => String(n).padStart(2, '0');
const dateStr = (day) => `${y}-${pad(m + 1)}-${pad(day)}`;

let events = [
  {
    id: 'evt-1',
    title: 'Team Standup',
    date: dateStr(3),
    time: '09:30',
    category: 'work',
    description: 'Daily sync with the engineering team.'
  },
  {
    id: 'evt-2',
    title: 'React Performance Lab',
    date: dateStr(5),
    time: '11:00',
    category: 'study',
    description: 'Hands-on session covering memo, useMemo and useCallback.'
  },
  {
    id: 'evt-3',
    title: 'Dentist Appointment',
    date: dateStr(5),
    time: '15:00',
    category: 'personal',
    description: 'Routine check-up.'
  },
  {
    id: 'evt-4',
    title: 'Project Submission Deadline',
    date: dateStr(12),
    time: '23:59',
    category: 'deadline',
    description: 'Submit Experiment 4 project as a zipped folder.'
  },
  {
    id: 'evt-5',
    title: 'Birthday Party',
    date: dateStr(15),
    time: '19:00',
    category: 'personal',
    description: "Celebrating Ananya's birthday."
  },
  {
    id: 'evt-6',
    title: 'Sprint Planning',
    date: dateStr(18),
    time: '10:00',
    category: 'work',
    description: 'Plan tasks for the next sprint.'
  },
  {
    id: 'evt-7',
    title: 'Gym Session',
    date: dateStr(18),
    time: '18:30',
    category: 'personal',
    description: 'Leg day.'
  },
  {
    id: 'evt-8',
    title: 'Mock Interview',
    date: dateStr(22),
    time: '14:00',
    category: 'study',
    description: 'Practice interview with a senior mentor.'
  }
];

let nextId = 9;

export const handlers = [
  // GET /api/events - return all events
  http.get('/api/events', () => {
    return HttpResponse.json(events, { status: 200 });
  }),

  // POST /api/events - create a new event
  http.post('/api/events', async ({ request }) => {
    const body = await request.json();

    if (!body || !body.title || !body.date) {
      return HttpResponse.json(
        { message: 'title and date are required' },
        { status: 400 }
      );
    }

    const newEvent = {
      id: `evt-${nextId++}`,
      title: body.title,
      date: body.date,
      time: body.time || '09:00',
      category: body.category || 'general',
      description: body.description || ''
    };

    events = [...events, newEvent];
    return HttpResponse.json(newEvent, { status: 201 });
  }),

  // PUT /api/events/:id - update an existing event (used for edits and drag-and-drop moves)
  http.put('/api/events/:id', async ({ request, params }) => {
    const { id } = params;
    const body = await request.json();
    const index = events.findIndex((e) => e.id === id);

    if (index === -1) {
      return HttpResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    events[index] = { ...events[index], ...body, id };
    return HttpResponse.json(events[index], { status: 200 });
  }),

  // DELETE /api/events/:id - remove an event
  http.delete('/api/events/:id', ({ params }) => {
    const { id } = params;
    const index = events.findIndex((e) => e.id === id);

    if (index === -1) {
      return HttpResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    events = events.filter((e) => e.id !== id);
    return HttpResponse.json({ id }, { status: 200 });
  })
];
