import { useMemo } from 'react';

/**
 * Lets the "useMemo for agenda" toggle actually be demonstrable at runtime.
 *
 * - enabled=true  -> returns useMemo(factory, deps), cached until deps change.
 * - enabled=false -> calls factory() directly on every render, i.e. exactly
 *                    what the computation would cost WITHOUT useMemo.
 *
 * useMemo is always called (never conditionally), so this doesn't break the
 * rules of hooks — only whether the cached or freshly-computed value is used.
 */
// eslint-disable-next-line react-hooks/exhaustive-deps
export function useToggleableMemo(factory, deps, enabled) {
  const memoized = useMemo(factory, deps);
  return enabled ? memoized : factory();
}
