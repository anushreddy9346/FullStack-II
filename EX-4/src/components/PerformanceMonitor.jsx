import React, { useEffect, useState } from 'react';
import {
  getPerformanceActivity,
  resetPerformanceActivity,
  subscribePerformanceActivity
} from '../utils/performanceActivity.js';
import { getRenderCounts, resetRenderStats } from '../utils/renderStats.js';

const MAX_ACTIVITY = 16;

function PerformanceMonitor() {
  const [activity, setActivity] = useState(getPerformanceActivity());
  const [renderCounts, setRenderCounts] = useState(getRenderCounts());

  useEffect(() => {
    const unsubscribe = subscribePerformanceActivity(setActivity);
    const interval = setInterval(() => {
      setRenderCounts(getRenderCounts());
    }, 300);
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleReset = () => {
    resetPerformanceActivity();
    resetRenderStats();
    setRenderCounts(getRenderCounts());
  };

  const total = Math.min(
    MAX_ACTIVITY,
    activity.cards + activity.handlers + activity.agenda
  );

  const percentage = Math.round((total / MAX_ACTIVITY) * 100);

  return (
    <section className="render-monitor" aria-label="Performance activity monitor">
      <div className="render-monitor__top">
        <div className="render-monitor__title-group">
          <p className="render-monitor__eyebrow">Performance Activity</p>
          <span className="render-monitor__live-tag">● Live</span>
        </div>
        <button
          type="button"
          className="render-monitor__reset"
          onClick={handleReset}
          title="Reset monitor counters"
        >
          Reset
        </button>
      </div>

      <div className="render-monitor__fraction" aria-live="polite">
        <strong>{total}</strong>
        <span>/ {MAX_ACTIVITY} ops</span>
      </div>

      {/* Animated Activity Progress Bar */}
      <div className="render-monitor__bar-container" title={`${percentage}% load`}>
        <div
          className="render-monitor__bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="render-monitor__breakdown-chips">
        <span className="chip chip--cards">Cards: {activity.cards}</span>
        <span className="chip chip--handlers">Handlers: {activity.handlers}</span>
        <span className="chip chip--agenda">Agenda: {activity.agenda}</span>
      </div>

      {/* Render / Re-render Component Counts */}
      <div className="render-monitor__renders" style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #dfe3eb', fontSize: '0.74rem' }}>
        <p style={{ margin: '0 0 6px 0', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.05em' }}>
          Component Render Counts
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          <span className="chip" style={{ background: '#f0f4ff', color: '#1a73e8' }}>
            Calendar: {renderCounts.Calendar || 0}
          </span>
          <span className="chip" style={{ background: '#e6f4ea', color: '#137333' }}>
            Days: {renderCounts.CalendarDay || 0}
          </span>
          <span className="chip" style={{ background: '#e8f0fe', color: '#1a73e8' }}>
            Cards: {renderCounts.EventCard || 0}
          </span>
          <span className="chip" style={{ background: '#fef7e0', color: '#b06000' }}>
            Agenda: {renderCounts.EventList || 0}
          </span>
          <span className="chip" style={{ background: '#fce8e6', color: '#c5221f' }}>
            Search: {renderCounts.SearchBar || 0}
          </span>
        </div>
      </div>

      <p className="render-monitor__action">
        Last action: <strong>{activity.lastAction || 'None'}</strong>
      </p>
    </section>
  );
}

export default PerformanceMonitor;
