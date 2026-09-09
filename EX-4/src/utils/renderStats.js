// -----------------------------------------------------------------------------
// A plain (non-React) store for render statistics. Components record into it
// synchronously during their own render phase — which is safe because it's
// just a mutation of module-level Maps, not a setState call — and the
// PerformanceMonitor panel polls it on an interval to refresh its display.
// Using React state here instead would mean one component's render
// triggering a setState in a totally different component while React is
// still rendering, which is exactly the "Cannot update a component while
// rendering a different component" anti-pattern.
// -----------------------------------------------------------------------------

const renderCounts = new Map(); // componentName -> number of renders
const profilerStats = new Map(); // profilerId -> { commits, totalDuration, lastDuration }

export function recordRender(name) {
  renderCounts.set(name, (renderCounts.get(name) || 0) + 1);
}

export function getRenderCounts() {
  return Object.fromEntries(renderCounts);
}

export function recordProfilerRender(id, actualDuration) {
  const prev = profilerStats.get(id) || { commits: 0, totalDuration: 0, lastDuration: 0 };
  profilerStats.set(id, {
    commits: prev.commits + 1,
    totalDuration: prev.totalDuration + actualDuration,
    lastDuration: actualDuration
  });
}

export function getProfilerStats() {
  return Object.fromEntries(profilerStats);
}

export function resetRenderStats() {
  renderCounts.clear();
  profilerStats.clear();
}
