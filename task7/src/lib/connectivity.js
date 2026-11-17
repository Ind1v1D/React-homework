// Real connectivity check. navigator.onLine only says a network interface exists, so we
// fetch a tiny file with cache: 'no-store'. The service worker routes "ping=" requests to
// NetworkOnly, so this never comes from a cache.
export async function checkConnection(timeoutMs = 5000) {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return false;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`./manifest.json?ping=${Date.now()}`, {
      cache: "no-store",
      signal: controller.signal,
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}
