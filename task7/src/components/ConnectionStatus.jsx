import { useConnectivity } from "../context/ConnectivityContext";

// Slim bar when offline + small pill (bottom-left) always. Easy to move into NavBar later.
function ConnectionStatus() {
  const { online, justReconnected } = useConnectivity();

  return (
    <>
      {!online && (
        <div className="offline-bar" role="status">
          You're offline. Showing saved content where available.
        </div>
      )}
      <div className={`conn-pill ${online ? "is-online" : "is-offline"}`} role="status" aria-live="polite">
        <span className="conn-dot" aria-hidden="true" />
        {online ? "Online" : "Offline"}
      </div>
      {justReconnected && (
        <div className="pwa-toasts">
          <div className="pwa-toast" role="status">Back online</div>
        </div>
      )}
    </>
  );
}

export default ConnectionStatus;
