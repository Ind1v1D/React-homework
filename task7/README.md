# CineRate - Installable PWA (Task 7)

CineRate (React 18 + Vite + React Router + TanStack Query + Firebase Auth + TMDB) is now an
**installable Progressive Web App** that keeps working offline. Everything from Task 6 still works:
Home, Movies (search, filters, sorting, pagination), movie details, reviews, Dashboard, About,
login / signup / Google sign-in, protected profile, and the 404 page.

**Live demo:** https://ind1v1d.github.io/React-homework/task7/

## PWA features
- **Installable** (manifest + service worker + icons), runs in its own window (`display: standalone`)
- **App shell is precached**: the app opens offline, including lazy-loaded pages
- **Runtime caching** for TMDB posters, fonts and API responses (see the table below)
- **Offline page** (`public/offline.html`, plus the in-app `/offline` route) with a *Retry connection* button
- **Connection indicator** (Online / Offline pill, offline bar, "Back online" toast)
- **Cached-data banner**: "You're viewing cached data saved at ..." when the API answer came from the cache
- **Update flow**: "A new version of CineRate is available" with *Update now* / *Later*

## Manifest
`public/manifest.json`: name "CineRate - Rate & Review Movies", short name "CineRate", `start_url` and
`scope` `./`, `display: standalone`, theme `#2f66f0`, background `#070b1a`, icons 192, 512 and 512 maskable.
Icons are generated from `public/icons/icon.svg` / `icon-maskable.svg` with `npm run icons`
(`scripts/generate-icons.mjs`, uses `sharp`); the PNGs are committed. `vite-plugin-pwa` runs with
`manifest: false`, so our file is the only manifest.

## Service worker lifecycle
Source: `src/sw.js` (Workbox modules, built by `vite-plugin-pwa` with `injectManifest`).
1. **install**: the app shell is precached. There is **no automatic `skipWaiting()`**, so a new worker waits.
2. **waiting**: the page shows the update prompt. *Update now* sends `{type: 'SKIP_WAITING'}`.
3. **activate**: deletes every `cinerate-*` cache that is not in the current allow-list, then `clients.claim()`.
   Old precaches are removed by `cleanupOutdatedCaches()`.
4. The page reloads on `controllerchange`, so new versions load without clearing storage.

`const VERSION = 'v1'` in `src/sw.js` is part of every runtime cache name. Bumping it makes the next
activation drop the old runtime caches.

## Caching strategies
| Strategy | What | Cache name | Limits |
| --- | --- | --- | --- |
| Precache | index.html, all JS/CSS chunks (incl. lazy pages), icons, manifest, offline.html | `workbox-precache-v2-*` | replaced on every build |
| Network-first (3 s timeout) | Navigations; fallback to precached `index.html`, then `offline.html` | - | - |
| Cache-first | `image.tmdb.org` posters, same-origin images | `cinerate-images-v1` | 150 entries, 30 days, status 0/200 |
| Cache-first | `fonts.gstatic.com` font files | `cinerate-fonts-v1` | 30 entries, 1 year, status 0/200 |
| Stale-while-revalidate | `fonts.googleapis.com` stylesheet | `cinerate-font-styles-v1` | 10 entries |
| Network-first (4 s timeout) | `api.themoviedb.org/3/*` GET | `cinerate-api-v1` | 120 entries, 1 day, status 200, purge on quota error |
| Network-only | `*ping=*` connectivity checks | - | never cached |

Responses served from the API cache get `X-From-SW-Cache: 1` and `X-Cached-At` headers;
`src/services/service.js` reads them and `src/lib/cacheStatus.js` drives the banner.

**Never cached:** Firebase / Google auth traffic (`identitytoolkit.googleapis.com`,
`securetoken.googleapis.com`, `*.firebaseapp.com`, `apis.google.com`, `accounts.google.com`,
`www.googleapis.com`) and every non-GET request. These are explicit `NetworkOnly` routes, so tokens and
user data never end up in a cache. Reviews live in `localStorage`, not the network.

## Offline behaviour
- Visited pages and data open from the caches; unvisited ones show the offline notice.
- `public/offline.html` is the final navigation fallback (self-contained, inline CSS).
- The `/offline` route and `ErrorMessage` / the error boundary around the page outlet show the same notice
  with a **Retry connection** button. It fetches `./manifest.json?ping=<ts>` with `cache: 'no-store'`
  and, on success, returns to the page you came from (`?from=`).
- TanStack Query uses `networkMode: 'offlineFirst'`, so requests still reach the service worker offline.
  When the connection returns, paused mutations resume and queries are invalidated.

## How to test
1. `npm run build && npm run preview` (the service worker is not active in `npm run dev`).
2. DevTools -> **Application -> Manifest** (installability) and **Service Workers** (status, *Update*, *skipWaiting*).
3. Tick **Offline** in Application -> Service Workers (or Network -> Offline), reload: the app shell loads;
   visited movies appear with the cached-data banner; unvisited pages show the offline notice.
4. Untick Offline and press *Retry connection*: you return to the app and see "Back online".
5. Update flow: change something, bump `VERSION` in `src/sw.js`, rebuild; the open tab shows the update prompt.
6. Application -> Cache Storage: check `cinerate-*` caches; no auth host appears there.

## Routes
`/` Home - `/movies` - `/movies/:id` - `/dashboard` - `/about` - `/login` - `/signup` - `/profile` (protected) - `/offline` - `*` 404

The app uses `HashRouter`, so on GitHub Pages URLs look like `/#/login`.

## Mobile
Responsive from 320px, hamburger navigation, touch-friendly controls.

## Data caching (TanStack Query)
Server data is cached with **TanStack Query**. All query keys are defined in `src/lib/queryClient.js`.

| Data | Query key | Stays fresh for | Then |
| --- | --- | --- | --- |
| Movie list (search + filters + page) | `['movies', 'list', { search, genre, year, rating, sort, page }]` | 5 min | Refetched the next time it's used |
| Trending (Home) | `['movies', 'trending']` | 10 min | Refetched the next time it's used |
| Movie details | `['movies', 'detail', id]` | 30 min | Refetched the next time it's used |
| Dashboard movies | `['movies', 'dashboard']` | 10 min | Refetched the next time it's used |
| Genres | `['genres']` | 24 h | Refetched the next time it's used |
| Reviews of a movie | `['reviews', 'movie', id]` | 30 s | Also refetched when you return to the tab |

- Entries nothing is using are removed after 30 minutes (`gcTime`).
- Going back to a page or filter you've already seen shows the cached data instantly, with no new request.
- While the next page loads, the previous page stays visible but dimmed (`keepPreviousData`), so the list never flashes empty.

**When is cached data invalidated?**
After you **post** or **delete** a review, the mutation calls
`invalidateQueries({ queryKey: ['reviews', 'movie', id] })`. The review list and the average
rating then refetch right away. TMDB movie data is read-only, so it only expires by time.

**Outdated requests:** every combination of filters has its own query key. A slow response
for filters you've already changed only fills its own cache entry, so it can't overwrite the
results you're looking at. TanStack Query also passes an `AbortSignal` to every request,
which cancels requests that are no longer needed.

## Architecture
```
src/
  firebase.js               Firebase init from VITE_ environment variables
  lib/queryClient.js        QueryClient defaults + every query key
  services/
    service.js              TMDB API requests
    authService.js          Firebase sign up / log in / Google / log out + error messages
    reviewsService.js       Reviews API (async; stored in localStorage)
  context/AuthContext.jsx   AuthProvider + useAuth (onAuthStateChanged)
  context/ConnectivityContext.jsx  online status + refetch when back online
  sw.js                     Service worker (Workbox)
  lib/cacheStatus.js        "data came from SW cache" store
  hooks/
    useMovies.js            Cached movie queries
    useGenres.js            Cached genre list
    useReviews.js           Cached reviews + add/delete mutations with invalidation
    useAuthAction.js        Loading + error state for auth forms
  components/               NavBar, ProtectedRoute, AuthCard, Reviews, MovieCard, ...
  pages/                    Home, Movies, MovieDetails, Dashboard, About, Login, Signup, Profile, NotFound
```
Components never call `fetch`, Firebase, or `localStorage` directly. They only use hooks and context.

## Setup
1. Create a Firebase project. Under **Authentication → Sign-in method**, enable **Email/Password** and **Google**.
2. Under **Project settings → Your apps**, add a **Web app** and copy its config.
3. Create `.env.local` from the example and fill in the Firebase values and your TMDB key:
   ```bash
   cp .env.example .env.local
   ```
4. Install and run:
   ```bash
   npm install
   npm run dev
   ```

`.env.local` is listed in `.gitignore` and never gets committed.

## Deploy (GitHub Pages)
The repo workflow `.github/workflows/deploy.yml` builds this app into `/task7/`.
1. Under **Settings → Secrets and variables → Actions**, add `VITE_TMDB_KEY` and every `VITE_FIREBASE_*` value from `.env.example` as repository secrets.
2. In Firebase, under **Authentication → Settings → Authorized domains**, add `ind1v1d.github.io`.

## Author
Mahambet Erdaulet, 4th-year student at KBTU.
