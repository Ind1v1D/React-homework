# CineRate — Server Data, Caching & Firebase Auth (Task 6)

This extends my React Router homework, **CineRate** (Task 5), with **Firebase Authentication**,
**environment variables**, and **server-data caching with TanStack Query**.
Everything from Task 5 still works: Home, Movies (search, genre/year/rating filters, sorting and
pagination in the URL), movie details, reviews, Dashboard, About, and the 404 page.

**Live demo:** https://ind1v1d.github.io/React-uni/task6/

## What's new
- **Sign up** with email, password, and password confirmation, plus validation
- **Log in** with email and password, or with **Google** (popup)
- **Persistent sessions:** you stay signed in after a refresh (`browserLocalPersistence`)
- **`/profile`** is protected and shows your email and UID, with a Log out button.
  Signed-out visitors are sent to `/login`, then back to the page they asked for after logging in
- **NavBar** shows *Log in / Sign up* or *Log out / profile avatar*, depending on whether you're signed in
- Loading, error (with **Try again**), and empty states for movies, the dashboard, reviews, and the auth forms
- Reviews posted while signed in can be deleted only by their author

## Routes
`/` Home · `/movies` · `/movies/:id` · `/dashboard` · `/about` · `/login` · `/signup` · `/profile` (protected) · `*` 404

The app uses `HashRouter`, so on GitHub Pages URLs look like `/#/login`.

## Caching strategy
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
The repo workflow `.github/workflows/deploy.yml` builds this app into `/task6/`.
1. Under **Settings → Secrets and variables → Actions**, add `VITE_TMDB_KEY` and every `VITE_FIREBASE_*` value from `.env.example` as repository secrets.
2. In Firebase, under **Authentication → Settings → Authorized domains**, add `ind1v1d.github.io`.

## Author
Mahambet Erdaulet, 4th-year student at KBTU.
