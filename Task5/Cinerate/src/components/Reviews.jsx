import { useState } from "react";
import StarRating from "./StarRating";
import useReviews from "../hooks/useReviews";

function Reviews({ movieId }) {
  const { reviews, addReview, deleteReview, average } = useReviews(movieId);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [formError, setFormError] = useState("");

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
    addReview({ name: name.trim() || "Anonymous", rating, text: text.trim() });
    setName("");
    setRating(0);
    setText("");
    setFormError("");
  }

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
          placeholder="Your name (optional)"
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
        <button className="btn" type="submit">Post review</button>
      </form>

      {reviews.length === 0 ? (
        <p className="muted">No reviews yet. Be the first one!</p>
      ) : (
        <ul className="review-list">
          {reviews.map((r) => (
            <li key={r.id} className="review">
              <div className="review-top">
                <strong>{r.name}</strong>
                <StarRating value={r.rating} />
                <span className="muted">{new Date(r.date).toLocaleDateString()}</span>
                <button className="link-btn" onClick={() => deleteReview(r.id)}>Delete</button>
              </div>
              <p>{r.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default Reviews;
