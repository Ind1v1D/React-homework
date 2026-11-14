const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_KEY;

export const IMG = "https://image.tmdb.org/t/p";

async function request(path, params = {}, signal) {
  if (!API_KEY) {
    throw new Error("API key is missing. Add VITE_TMDB_KEY to your .env.local file.");
  }

  const url = new URL(BASE_URL + path);
  url.searchParams.set("api_key", API_KEY);
  for (const key in params) {
    if (params[key] !== "" && params[key] !== undefined && params[key] !== null) {
      url.searchParams.set(key, params[key]);
    }
  }

  const response = await fetch(url, { signal });
  if (response.status === 404) throw new Error("NOT_FOUND");
  if (!response.ok) throw new Error("Request failed with status " + response.status);
  return response.json();
}

export function getGenres(signal) {
  return request("/genre/movie/list", {}, signal);
}

export function getTrending(signal) {
  return request("/trending/movie/week", {}, signal);
}

export async function getMovies({ search, genre, year, rating, sort, page }, signal) {
  let data;

  if (search) {
    data = await request("/search/movie", { query: search, page, year }, signal);
    let results = data.results;

    if (genre) results = results.filter((m) => m.genre_ids.includes(Number(genre)));
    if (rating) results = results.filter((m) => m.vote_average >= Number(rating));

    const field = sort.split(".")[0];
    results = [...results].sort((a, b) => {
      if (field === "release_date") return (b.release_date || "").localeCompare(a.release_date || "");
      return b[field] - a[field];
    });
    data = { ...data, results };
  } else {
    data = await request(
      "/discover/movie",
      {
        page,
        sort_by: sort,
        with_genres: genre,
        primary_release_year: year,
        "vote_average.gte": rating,
        "vote_count.gte": 200,
      },
      signal
    );
  }

  return {
    results: data.results,
    totalPages: Math.min(data.total_pages, 500),
    totalResults: data.total_results,
  };
}

export function getMovie(id, signal) {
  return request(`/movie/${id}`, { append_to_response: "credits" }, signal);
}

export async function getDashboardMovies(signal) {
  const pages = [1, 2, 3, 4, 5];
  const responses = await Promise.all(pages.map((p) => request("/movie/popular", { page: p }, signal)));
  return responses.flatMap((r) => r.results);
}
