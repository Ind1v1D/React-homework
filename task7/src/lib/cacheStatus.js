// Tiny external store: did the latest API data come from the service worker cache?
// Used with useSyncExternalStore (subscribe / getSnapshot).
let snapshot = { fromCache: false, cachedAt: null };
const listeners = new Set();

function set(next) {
  if (next.fromCache === snapshot.fromCache && next.cachedAt === snapshot.cachedAt) return;
  snapshot = next;
  listeners.forEach((l) => l());
}

export function markFromCache(cachedAt) {
  set({ fromCache: true, cachedAt: cachedAt || null });
}

export function markFresh() {
  set({ fromCache: false, cachedAt: null });
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot() {
  return snapshot;
}
