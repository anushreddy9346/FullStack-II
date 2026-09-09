import React, { memo, useState } from 'react';
import EventForm from './EventForm.jsx';
import { categoryColor } from '../utils/calendarUtils.js';

/**
 * Handles all three event dialog modes: viewing details, creating a new
 * event and editing an existing one. Wrapped in React.memo: while the modal
 * is closed, `mode` is null and the parent renders `null` early, so memo
 * mainly guards against re-renders triggered by unrelated App state (like
 * the performance monitor tick) while the modal happens to be open with
 * unchanged props.
 */
function EventModal({ mode, event, defaultDate, onClose, onCreate, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(mode === 'edit');

  if (!mode) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const renderContent = () => {
    if (mode === 'create') {
      return (
        <>
          <h3>Add Event</h3>
          <EventForm
            initialValues={{ date: defaultDate || '' }}
            submitLabel="Create Event"
            onSubmit={onCreate}
            onCancel={onClose}
          />
        </>
      );
    }

    if (mode === 'view' && event && !isEditing) {
      return (
        <>
          <div className="event-modal__title-row">
            <span className="event-modal__dot" style={{ background: categoryColor(event.category) }} />
            <h3>{event.title}</h3>
          </div>
          <dl className="event-modal__details">
            <dt>Date</dt>
            <dd>{event.date}</dd>
            <dt>Time</dt>
            <dd>{event.time}</dd>
            <dt>Category</dt>
            <dd className="event-modal__category">{event.category}</dd>
            {event.description && (
              <>
                <dt>Description</dt>
                <dd>{event.description}</dd>
              </>
            )}
          </dl>
          <div className="event-form__actions">
            <button type="button" className="btn btn--danger" onClick={() => onDelete(event.id)}>
              Delete
            </button>
            <button type="button" className="btn btn--primary" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          </div>
        </>
      );
    }

    if (event) {
      return (
        <>
          <h3>Edit Event</h3>
          <EventForm
            initialValues={event}
            submitLabel="Save Changes"
            onSubmit={(values) => onEdit(event.id, values)}
            onCancel={onClose}
          />
        </>
      );
    }

    return null;
  };

  return (
    <div className="event-modal__overlay" onClick={handleOverlayClick}>
      <div className="event-modal" role="dialog" aria-modal="true">
        <button type="button" className="event-modal__close" onClick={onClose} aria-label="Close dialog">
          ×
        </button>
        {renderContent()}
      </div>
    </div>
  );
}

export default memo(EventModal);
