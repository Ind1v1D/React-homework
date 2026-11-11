# CineRate 🎬

Movie rating website made as my React Router homework project (React + React Router + Vite).
Movie data comes from the [TMDB API](https://developer.themoviedb.org).
Users can browse movies, open a movie page, and leave their own star rating and comment (saved in localStorage).

## How to run locally

1. Get a free API key at https://www.themoviedb.org/settings/api
2. Copy `.env.example` to `.env` and paste your key into `VITE_TMDB_KEY`
3. Run `npm install` then `npm run dev`

## Deploy (GitHub Pages)

The site is deployed to GitHub Pages with a GitHub Actions workflow (`.github/workflows/deploy.yml`).

Steps:
1. Push the project to a GitHub repository named `cinerate`
2. In the repository go to Settings → Secrets and variables → Actions and add the secret `VITE_TMDB_KEY`
3. In Settings → Pages set Source to "GitHub Actions"
4. Every push to `main` rebuilds and deploys the site

The app uses `HashRouter` so direct URLs and page refresh work on GitHub Pages.

## Routes

`/` Home · `/about` · `/movies` · `/movies/:id` · `/dashboard` · `/login` · `*` 404

## Author

Mahambet Erdaulet, 4th-year student at KBTU.
