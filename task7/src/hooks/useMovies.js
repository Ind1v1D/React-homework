import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTrending, getMovies, getMovie, getDashboardMovies } from "../services/service";
import { movieKeys } from "../lib/queryClient";

// Every filter combination (search, genre, year, rating, sort, page) has its
// own cache key. A slow response for old filters can only fill its own entry,
// so it never overwrites the results for the filters you picked last.
// The AbortSignal also cancels requests that are no longer needed.
export function useMovieList(filters) {
  return useQuery({
    queryKey: movieKeys.list(filters),
    queryFn: ({ signal }) => getMovies(filters, signal),
    placeholderData: keepPreviousData, // keep showing the last page while the next loads
  });
}

export function useTrending() {
  return useQuery({
    queryKey: movieKeys.trending(),
    queryFn: ({ signal }) => getTrending(signal),
    staleTime: 10 * 60 * 1000,
  });
}

// Movie details barely change, so they stay fresh for 30 min.
export function useMovie(id) {
  return useQuery({
    queryKey: movieKeys.detail(id),
    queryFn: ({ signal }) => getMovie(id, signal),
    enabled: /^\d+$/.test(id),
    staleTime: 30 * 60 * 1000,
    retry: (count, error) => error.message !== "NOT_FOUND" && count < 1,
  });
}

export function useDashboardMovies() {
  return useQuery({
    queryKey: movieKeys.dashboard(),
    queryFn: ({ signal }) => getDashboardMovies(signal),
    staleTime: 10 * 60 * 1000,
  });
}
