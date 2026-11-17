import { useConnectivity } from "../context/ConnectivityContext";

// Full-width bar when offline + "Back online" toast. The online/offline indicator lives in the NavBar.
function ConnectionStatus() {
  const { online, justReconnected } = useConnectivity();

  return (
    <>
      {!online && (
        <div className="offline-bar" role="status">
          You're offline. Showing saved content where available.
        </div>
      )}
      {justReconnected && (
        <div className="pwa-toasts">
          <div className="pwa-toast" role="status">Back online</div>
        </div>
      )}
    </>
  );
}

export default ConnectionStatus;
