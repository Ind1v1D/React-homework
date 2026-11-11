function StarRating({ value, onChange }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          className={star <= value ? "star on" : "star"}
          onClick={() => onChange && onChange(star)}
          disabled={!onChange}
          aria-label={`${star} star`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default StarRating;
