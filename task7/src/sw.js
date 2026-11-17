/* eslint-env serviceworker */
import { cleanupOutdatedCaches, precacheAndRoute, matchPrecache } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst, NetworkOnly, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

// Bumping VERSION changes every runtime cache name below. The activate handler then
// deletes all older "cinerate-*" caches, so users get a clean slate on the next update.
const VERSION = "v1";

const CACHES = {
  images: `cinerate-images-${VERSION}`,
  api: `cinerate-api-${VERSION}`,
  fonts: `cinerate-fonts-${VERSION}`,
  fontStyles: `cinerate-font-styles-${VERSION}`,
};
const ALLOWED_CACHES = Object.values(CACHES);

const NAV_TIMEOUT_MS = 3000;

// ---------------------------------------------------------------- lifecycle
self.addEventListener("install", () => {
  // No skipWaiting() here on purpose: a new worker waits until the user clicks
  // "Update now" in the UI (which sends SKIP_WAITING), so a page is never swapped mid-use.
  console.log(`[SW ${VERSION}] install`);
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((n) => n.startsWith("cinerate-") && !ALLOWED_CACHES.includes(n))
          .map((n) => {
            console.log(`[SW ${VERSION}] deleting old cache`, n);
            return caches.delete(n);
          })
      );
      await self.clients.claim();
      console.log(`[SW ${VERSION}] activated`);
    })()
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

// ------------------------------------------------------------------ helpers
// Never let a handler reject: the page gets a real Response instead of an unhandled error.
function safe(strategy, fallback) {
  return async ({ request, url, event }) => {
    try {
      const res = await strategy.handle({ request, event, url });
      if (res) return res;
    } catch (err) {
      console.warn(`[SW ${VERSION}] handler failed`, request.url, err);
    }
    return fallback(request);
  };
}
const errorResponse = () => Response.error();
const apiOffline = () =>
  new Response(JSON.stringify({ offline: true, status_message: "You are offline and this data is not cached." }), {
    status: 503,
    statusText: "Service Unavailable",
    headers: { "Content-Type": "application/json" },
  });

// ----------------------------------------------- routes that must hit network
// Registered BEFORE precaching so connectivity pings are never served from a cache.
registerRoute(({ url }) => url.searchParams.has("ping"), new NetworkOnly());

// Auth / private traffic is never cached (tokens, user info, sign-in popups) and is
// always sent straight to the network, so we can never serve or leak another session's data.
const AUTH_HOSTS = [
  "identitytoolkit.googleapis.com",
  "securetoken.googleapis.com",
  "apis.google.com",
  "accounts.google.com",
  "www.googleapis.com",
];
// Workbox only handles GET by default, so non-GET requests always hit the network.
// Auth hosts are explicitly network-only (never cached).
registerRoute(
  ({ url }) => AUTH_HOSTS.includes(url.hostname) || url.hostname.endsWith(".firebaseapp.com"),
  new NetworkOnly()
);

// ------------------------------------------------------------- precache shell
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// --------------------------------------------------------------- navigations
// Network first (3 s timeout) -> precached index.html (SPA shell) -> precached offline.html.
async function navigationHandler({ request }) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), NAV_TIMEOUT_MS);
    try {
      const res = await fetch(request, { signal: controller.signal });
      if (res) return res;
    } finally {
      clearTimeout(timer);
    }
  } catch {
    /* offline or slow: fall through to the cache */
  }
  return (
    (await matchPrecache("index.html")) ||
    (await matchPrecache("offline.html")) ||
    Response.error()
  );
}
registerRoute(({ request }) => request.mode === "navigate", navigationHandler);

// ------------------------------------------------------------- static assets
const cacheable = () => new CacheableResponsePlugin({ statuses: [0, 200] });

const imageStrategy = new CacheFirst({
  cacheName: CACHES.images,
  plugins: [cacheable(), new ExpirationPlugin({ maxEntries: 150, maxAgeSeconds: 30 * 24 * 60 * 60, purgeOnQuotaError: true })],
});
registerRoute(
  ({ url, request, sameOrigin }) =>
    url.hostname === "image.tmdb.org" || (sameOrigin && request.destination === "image"),
  safe(imageStrategy, errorResponse)
);

const fontStrategy = new CacheFirst({
  cacheName: CACHES.fonts,
  plugins: [cacheable(), new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 365 * 24 * 60 * 60, purgeOnQuotaError: true })],
});
registerRoute(({ url }) => url.hostname === "fonts.gstatic.com", safe(fontStrategy, errorResponse));

const fontStyleStrategy = new StaleWhileRevalidate({
  cacheName: CACHES.fontStyles,
  plugins: [cacheable(), new ExpirationPlugin({ maxEntries: 10, purgeOnQuotaError: true })],
});
registerRoute(({ url }) => url.hostname === "fonts.googleapis.com", safe(fontStyleStrategy, errorResponse));

// ------------------------------------------------------------------- TMDB API
// Stamps the time a response was stored, and marks responses served from the cache so the
// UI can show "You're viewing cached data". (CORS hides the Date header, so we stamp our own.)
const EXPOSE = "X-From-SW-Cache, X-Cached-At, X-SW-Stored-At";
const cacheMarkerPlugin = {
  cacheWillUpdate: async ({ response }) => {
    if (!response || response.status !== 200) return null;
    const headers = new Headers(response.headers);
    headers.set("X-SW-Stored-At", String(Date.now()));
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Expose-Headers", EXPOSE);
    return new Response(await response.clone().blob(), {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
  cachedResponseWillBeUsed: async ({ cachedResponse }) => {
    if (!cachedResponse) return cachedResponse;
    const headers = new Headers(cachedResponse.headers);
    const stored = headers.get("X-SW-Stored-At");
    const date = headers.get("Date");
    const at = stored ? Number(stored) : date ? new Date(date).getTime() : Date.now();
    headers.set("X-From-SW-Cache", "1");
    headers.set("X-Cached-At", new Date(at).toISOString());
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Expose-Headers", EXPOSE);
    return new Response(await cachedResponse.clone().blob(), {
      status: cachedResponse.status,
      statusText: cachedResponse.statusText,
      headers,
    });
  },
};

const apiStrategy = new NetworkFirst({
  cacheName: CACHES.api,
  networkTimeoutSeconds: 4,
  plugins: [
    new CacheableResponsePlugin({ statuses: [200] }),
    new ExpirationPlugin({ maxEntries: 120, maxAgeSeconds: 24 * 60 * 60, purgeOnQuotaError: true }),
    cacheMarkerPlugin,
  ],
});
registerRoute(
  ({ url }) => url.origin === "https://api.themoviedb.org" && url.pathname.startsWith("/3/"),
  safe(apiStrategy, apiOffline),
  "GET"
);
