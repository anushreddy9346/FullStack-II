import React, { createContext, useContext, useMemo, useState } from 'react';

// -----------------------------------------------------------------------------
// Drives the three optimize/unoptimize toggles used to demonstrate the effect
// of each React performance technique in isolation:
//   - memoCards            -> whether EventCard is wrapped in React.memo
//   - useCallbackHandlers  -> whether App/Calendar handlers are stabilized
//                             with useCallback, or recreated every render
//   - memoAgenda           -> whether the "Upcoming Events" (agenda) list is
//                             computed with useMemo, or recomputed every render
//
// A default value (all optimizations ON, no-op toggle) is provided so any
// component/test that renders in isolation without <OptimizationProvider>
// keeps behaving exactly as it did before these toggles were introduced.
// -----------------------------------------------------------------------------

export const DEFAULT_OPTIMIZATION_SETTINGS = {
  memoCards: true,
  useCallbackHandlers: true,
  memoAgenda: true
};

const OptimizationContext = createContext({
  settings: DEFAULT_OPTIMIZATION_SETTINGS,
  toggle: () => {},
  setAll: () => {},
  resetSettings: () => {}
});

export function OptimizationProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_OPTIMIZATION_SETTINGS);

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const setAll = (enabled) => {
    setSettings({
      memoCards: enabled,
      useCallbackHandlers: enabled,
      memoAgenda: enabled
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_OPTIMIZATION_SETTINGS);
  };

  const value = useMemo(() => ({ settings, toggle, setAll, resetSettings }), [settings]);

  return <OptimizationContext.Provider value={value}>{children}</OptimizationContext.Provider>;
}

export function useOptimizationSettings() {
  return useContext(OptimizationContext);
}
