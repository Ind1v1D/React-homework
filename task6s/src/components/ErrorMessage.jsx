function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-box">
      <h3>Something went wrong</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-outline" onClick={onRetry}>Try again</button>
      )}
    </div>
  );
}

export default ErrorMessage;
