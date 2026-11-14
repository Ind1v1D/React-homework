import { useState } from "react";
import StarRating from "./StarRating";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import useReviews from "../hooks/useReviews";
import { useAuth } from "../context/AuthContext";

function Reviews({ movieId }) {
  const { user } = useAuth();
  const { query, reviews, average, addReview, removeReview } = useReviews(movieId);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [formError, setFormError] = useState("");

  const defaultName = user ? user.displayName || user.email.split("@")[0] : "Anonymous";

  function handleSubmit(e) {
    e.preventDefault();
    if (rating === 0) {
      setFormError("Please choose a star rating.");
      return;
    }
    if (text.trim().length < 3) {
      setFormError("Comment is too short.");
      return;
    }
    setFormError("");
    addReview.mutate(
      { name: name.trim() || defaultName, rating, text: text.trim(), authorUid: user?.uid ?? null },
      {
        onSuccess: () => {
          setName("");
          setRating(0);
          setText("");
        },
        onError: (err) => setFormError(err.message),
      }
    );
  }

  // Signed-in users can delete only their own reviews; guest reviews stay deletable as before.
  const canDelete = (r) => !r.authorUid || r.authorUid === user?.uid;

  return (
    <section className="reviews">
      <div className="reviews-head">
        <h2>Community reviews</h2>
        {reviews.length > 0 && (
          <p className="muted">
            ★ {average.toFixed(1)} / 5 · {reviews.length} review{reviews.length > 1 ? "s" : ""}
          </p>
        )}
      </div>

      <form className="review-form" onSubmit={handleSubmit}>
        <h3>Leave your review</h3>
        <input
          type="text"
          placeholder={user ? `Your name (${defaultName})` : "Your name (optional)"}
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
        />
        <StarRating value={rating} onChange={setRating} />
        <textarea
          placeholder="What did you think about this movie?"
          rows="3"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {formError && <p className="form-error">{formError}</p>}
        <button className="btn" type="submit" disabled={addReview.isPending}>
          {addReview.isPending ? "Posting..." : "Post review"}
        </button>
      </form>

      {query.isPending && <Loader text="Loading reviews..." />}
      {query.isError && <ErrorMessage message={query.error.message} onRetry={() => query.refetch()} />}
      {removeReview.isError && <p className="form-error">{removeReview.error.message}</p>}

      {query.isSuccess && reviews.length === 0 && <p className="muted">No reviews yet. Be the first one!</p>}

      {query.isSuccess && reviews.length > 0 && (
        <ul className="review-list">
          {reviews.map((r) => {
            const deleting = removeReview.isPending && removeReview.variables === r.id;
            return (
              <li key={r.id} className="review">
                <div className="review-top">
                  <strong>{r.name}</strong>
                  <StarRating value={r.rating} />
                  <span className="muted">{new Date(r.date).toLocaleDateString()}</span>
                  {canDelete(r) && (
                    <button className="link-btn" onClick={() => removeReview.mutate(r.id)} disabled={deleting}>
                      {deleting ? "Deleting..." : "Delete"}
                    </button>
                  )}
                </div>
                <p>{r.text}</p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default Reviews;
