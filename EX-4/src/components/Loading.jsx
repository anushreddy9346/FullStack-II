import React from 'react';

/**
 * Small presentational loading indicator, reused for the initial event fetch
 * and as the React.Suspense fallback for the lazily-loaded performance panel.
 */
function Loading({ label = 'Loading…' }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export default Loading;
