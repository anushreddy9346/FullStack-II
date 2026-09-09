import React from 'react';
import { useOptimizationSettings } from '../context/OptimizationContext.jsx';
import { resetPerformanceActivity } from '../utils/performanceActivity.js';
import { resetRenderStats } from '../utils/renderStats.js';

function PerformanceOptions() {
  const { settings, toggle, setAll, resetSettings } = useOptimizationSettings();

  const allActive = settings.memoCards && settings.useCallbackHandlers && settings.memoAgenda;
  const anyActive = settings.memoCards || settings.useCallbackHandlers || settings.memoAgenda;
  const activeCount = [settings.memoCards, settings.useCallbackHandlers, settings.memoAgenda].filter(Boolean).length;

  const handleMasterToggle = () => {
    setAll(!allActive);
  };

  const handleReset = () => {
    resetSettings();
    resetPerformanceActivity();
    resetRenderStats();
  };

  const optionsList = [
    {
      key: 'memoCards',
      label: 'React.memo on cards',
      desc: 'Bails out of re-rendering unchanged calendar event cards',
      value: settings.memoCards
    },
    {
      key: 'useCallbackHandlers',
      label: 'useCallback on handlers',
      desc: 'Stabilizes event handler function references across renders',
      value: settings.useCallbackHandlers
    },
    {
      key: 'memoAgenda',
      label: 'useMemo for agenda',
      desc: 'Caches heavy agenda sorting & filtering computations',
      value: settings.memoAgenda
    }
  ];

  return (
    <section className="optimization-controls" aria-label="Performance Options Panel">
      <div className="optimization-controls__header">
        <div className="optimization-title-group">
          <h3>Performance Options</h3>
          <span className={`opt-status-badge ${allActive ? 'opt-status-badge--full' : anyActive ? 'opt-status-badge--partial' : 'opt-status-badge--off'}`}>
            {activeCount} / 3 Active
          </span>
        </div>
        <button
          type="button"
          className="btn btn--reset"
          onClick={handleReset}
          title="Reset all performance options to defaults and clear activity stats"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          Reset All
        </button>
      </div>

      {/* Master Toggle Slide Switch for ALL options */}
      <div className="master-toggle-card">
        <div className="master-toggle-info">
          <span className="master-toggle-title">Enable All Optimizations</span>
          <span className="master-toggle-subtitle">Master slide switch for all 3 features</span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={allActive}
          className={`slide-switch slide-switch--master ${allActive ? 'slide-switch--on' : ''}`}
          onClick={handleMasterToggle}
          title={allActive ? 'Disable all optimizations' : 'Enable all optimizations'}
        >
          <span className="slide-switch__thumb" />
        </button>
      </div>

      <div className="optimization-divider">
        <span>Individual Feature Toggles</span>
      </div>

      {/* Individual Slide Switches */}
      <div className="optimization-controls__list">
        {optionsList.map((opt) => (
          <div key={opt.key} className={`option-item ${opt.value ? 'option-item--active' : ''}`}>
            <div className="option-item__text">
              <div className="option-item__header-row">
                <span className="option-item__label">{opt.label}</span>
                <span className={`option-state-pill ${opt.value ? 'is-on' : 'is-off'}`}>
                  {opt.value ? 'ON' : 'OFF'}
                </span>
              </div>
              <span className="option-item__desc">{opt.desc}</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={opt.value}
              className={`slide-switch ${opt.value ? 'slide-switch--on' : ''}`}
              onClick={() => toggle(opt.key)}
              aria-label={`${opt.label} — ${opt.value ? 'ON' : 'OFF'}`}
            >
              <span className="slide-switch__thumb" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PerformanceOptions;
