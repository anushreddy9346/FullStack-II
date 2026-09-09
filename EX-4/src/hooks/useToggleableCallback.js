import { useCallback } from 'react';

/**
 * Lets the "useCallback on handlers" toggle actually be demonstrable at
 * runtime. `fn` should be a plain inline function created fresh in the
 * component body on every render (as handlers normally are).
 *
 * - enabled=true  -> returns a referentially-stable function via
 *                    useCallback(fn, deps), same as writing useCallback by hand.
 * - enabled=false -> returns `fn` itself, i.e. a brand-new function
 *                    reference every render, simulating what the handler
 *                    would look like WITHOUT useCallback.
 *
 * useCallback is always called (never conditionally), so this doesn't break
 * the rules of hooks — only which reference gets handed to the caller varies.
 */
// eslint-disable-next-line react-hooks/exhaustive-deps
export function useToggleableCallback(fn, deps, enabled) {
  const stable = useCallback(fn, deps);
  return enabled ? stable : fn;
}
