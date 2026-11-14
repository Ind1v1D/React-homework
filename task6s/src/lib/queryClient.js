import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // fresh for 5 min, then revalidated on next use
      gcTime: 30 * 60 * 1000, // unused entries are removed after 30 min
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Every cache key lives here, so reads and invalidations always match.
export const movieKeys = {
  all: ["movies"],
  trending: () => ["movies", "trending"],
  list: (filters) => ["movies", "list", filters],
  detail: (id) => ["movies", "detail", String(id)],
  dashboard: () => ["movies", "dashboard"],
};

export const genreKeys = {
  all: ["genres"],
};

export const reviewKeys = {
  all: ["reviews"],
  byMovie: (movieId) => ["reviews", "movie", String(movieId)],
};
