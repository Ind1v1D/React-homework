import Icon from "./Icon";

function StarRating({ value, onChange }) {
  if (!onChange) {
    return (
      <div className="stars" role="img" aria-label={`${value} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= value ? "star on" : "star"} aria-hidden="true">
            <Icon name="star" fill={star <= value} />
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="stars stars-input" role="group" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          className={star <= value ? "star on" : "star"}
          onClick={() => onChange(star)}
          aria-pressed={star === value}
          aria-label={`${star} star`}
        >
          <Icon name="star" fill={star <= value} />
        </button>
      ))}
    </div>
  );
}

export default StarRating;
