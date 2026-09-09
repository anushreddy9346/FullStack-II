const counts = new Map();

export function recordTestCardRender(id) {
  counts.set(id, (counts.get(id) || 0) + 1);
}

export function getTestCardRenderCounts(ids) {
  return Object.fromEntries(ids.map((id) => [id, counts.get(id) || 0]));
}

export function resetTestCardRenderCounts() {
  counts.clear();
}
