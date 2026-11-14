import { useQuery } from "@tanstack/react-query";
import { getGenres } from "../services/service";
import { genreKeys } from "../lib/queryClient";

// The genre list almost never changes: cache it for 24 hours.
function useGenres() {
  const { data } = useQuery({
    queryKey: genreKeys.all,
    queryFn: ({ signal }) => getGenres(signal),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
  return data?.genres ?? [];
}

export default useGenres;
