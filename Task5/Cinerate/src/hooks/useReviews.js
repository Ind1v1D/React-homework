import useLocalStorage from "./useLocalStorage";

function useReviews(movieId) {
  const [allReviews, setAllReviews] = useLocalStorage("cinerate_reviews", {});
  const reviews = allReviews[movieId] || [];

  function addReview({ name, rating, text }) {
    const newReview = { id: Date.now(), name, rating, text, date: new Date().toISOString() };
    setAllReviews({ ...allReviews, [movieId]: [newReview, ...reviews] });
  }

  function deleteReview(id) {
    setAllReviews({ ...allReviews, [movieId]: reviews.filter((r) => r.id !== id) });
  }

  const average = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return { reviews, addReview, deleteReview, average };
}

export default useReviews;
