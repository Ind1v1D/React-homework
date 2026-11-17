import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useConnectivity } from "../context/ConnectivityContext";

// Shared "you're offline" message with a Retry Connection button that really tests the network.
function OfflineNotice({ onRecovered, showLink = true, title = "You're offline" }) {
  const { pathname, search } = useLocation();
  const { check } = useConnectivity();
  const [state, setState] = useState("idle"); // idle | checking | failed

  async function retry() {
    setState("checking");
    const ok = await check();
    if (ok) {
      setState("idle");
      onRecovered?.();
    } else {
      setState("failed");
    }
  }

  return (
    <div className="offline-notice" role="alert">
      <div className="offline-icon" aria-hidden="true">★</div>
      <h2>{title}</h2>
      <p>
        CineRate can't reach the network. Cached pages and movies you've already viewed may still work;
        everything else will load once you're back online.
      </p>
      <button className="btn btn-primary offline-btn" onClick={retry} disabled={state === "checking"}>
        {state === "checking" ? "Checking..." : "Retry connection"}
      </button>
      <p className="offline-feedback" role="status" aria-live="polite">
        {state === "failed" && "Still offline. Check your connection and try again."}
      </p>
      {showLink && (
        <Link className="offline-link" to={`/offline?from=${encodeURIComponent(pathname + search)}`}>
          Open offline page
        </Link>
      )}
    </div>
  );
}

export default OfflineNotice;
