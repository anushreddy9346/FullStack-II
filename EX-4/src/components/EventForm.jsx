import React, { useState } from 'react';
import { EVENT_CATEGORIES } from '../utils/calendarUtils.js';

const emptyForm = { title: '', date: '', time: '', category: 'general', description: '' };

/**
 * Controlled form used for both "create" and "edit" flows. Not memoized:
 * it only exists while the modal is open and always has fresh initialValues,
 * so memoization would provide no benefit here.
 */
function EventForm({ initialValues, onSubmit, onCancel, submitLabel }) {
  const [form, setForm] = useState(() => ({ ...emptyForm, ...initialValues }));
  const [validationError, setValidationError] = useState(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date) {
      setValidationError('Title and date are required.');
      return;
    }
    setValidationError(null);
    onSubmit(form);
  };

  return (
    <form className="event-form" onSubmit={handleSubmit} noValidate>
      {validationError && <p className="event-form__error">{validationError}</p>}

      <label className="event-form__field">
        <span>Title</span>
        <input
          type="text"
          value={form.title}
          onChange={handleChange('title')}
          placeholder="Event title"
          required
        />
      </label>

      <div className="event-form__row">
        <label className="event-form__field">
          <span>Date</span>
          <input type="date" value={form.date} onChange={handleChange('date')} required />
        </label>

        <label className="event-form__field">
          <span>Time</span>
          <input type="time" value={form.time} onChange={handleChange('time')} />
        </label>
      </div>

      <label className="event-form__field">
        <span>Category</span>
        <select value={form.category} onChange={handleChange('category')}>
          {EVENT_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </label>

      <label className="event-form__field">
        <span>Description</span>
        <textarea
          value={form.description}
          onChange={handleChange('description')}
          rows={3}
          placeholder="Optional details"
        />
      </label>

      <div className="event-form__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export default EventForm;
