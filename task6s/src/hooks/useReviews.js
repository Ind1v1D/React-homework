import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchReviews, createReview, deleteReview } from "../services/reviewsService";
import { reviewKeys } from "../lib/queryClient";

// Reviews change often: stale after 30 s and refreshed when the tab gets focus.
// After a create or delete, the movie's review list is invalidated and refetched.
function useReviews(movieId) {
  const queryClient = useQueryClient();
  const key = reviewKeys.byMovie(movieId);

  const query = useQuery({
    queryKey: key,
    queryFn: () => fetchReviews(movieId),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: key });

  const addReview = useMutation({
    mutationFn: (review) => createReview(movieId, review),
    onSuccess: invalidate,
  });

  const removeReview = useMutation({
    mutationFn: (reviewId) => deleteReview(movieId, reviewId),
    onSuccess: invalidate,
  });

  const reviews = query.data ?? [];
  const average = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  return { query, reviews, average, addReview, removeReview };
}

export default useReviews;
