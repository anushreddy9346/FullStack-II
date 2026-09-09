import { useRef } from 'react';
import { recordRender } from '../utils/renderStats.js';

/**
 * Call at the top of a component to (a) record this render into the shared
 * render-stats store, read by the Performance Monitor panel, and (b) return
 * a running per-instance render count, handy for on-screen debugging.
 */
export function useRenderCount(name) {
  const countRef = useRef(0);
  countRef.current += 1;
  recordRender(name);
  return countRef.current;
}
