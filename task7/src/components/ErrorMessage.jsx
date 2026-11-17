import { useConnectivity } from "../context/ConnectivityContext";
import OfflineNotice from "./OfflineNotice";

function ErrorMessage({ message, onRetry }) {
  const { online } = useConnectivity();

  if (!online) {
    return <OfflineNotice onRecovered={onRetry} />;
  }

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
