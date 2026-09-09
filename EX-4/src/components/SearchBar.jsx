import React, { memo } from 'react';
import { useRenderCount } from '../hooks/useRenderCount.js';

/**
 * Wrapped in React.memo because it only depends on `value` and the
 * `onChange` callback. As long as App.jsx passes a stable onChange
 * (see useCallback in App.jsx), typing elsewhere in the app or the
 * PerformanceMonitor's live render count won't re-render this input.
 */
function SearchBar({ value, onChange, resultCount, totalCount }) {
  useRenderCount('SearchBar');
  console.log('SearchBar rendered');

  return (
    <div className="search-bar">
      <div className="search-bar__inner">
        <svg className="search-bar__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          aria-label="Search events"
          placeholder="Search events by title, category or description…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button
            type="button"
            className="search-bar__clear-btn"
            onClick={() => onChange('')}
            title="Clear search"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      {value ? (
        <span className="search-count">
          {resultCount} of {totalCount} events match
        </span>
      ) : (
        <span className="search-count search-count--muted">{totalCount} events this month</span>
      )}
    </div>
  );
}

export default memo(SearchBar);
