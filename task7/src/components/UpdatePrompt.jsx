import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

const HOUR = 60 * 60 * 1000;

function UpdatePrompt() {
  const [dismissed, setDismissed] = useState(false);
  const [readyShown, setReadyShown] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegisteredSW(_url, registration) {
      if (!registration) return;
      const update = () => registration.update().catch(() => {});
      setInterval(update, HOUR);
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") update();
      });
    },
    onRegisterError(err) {
      console.warn("Service worker registration failed", err);
    },
  });

  useEffect(() => {
    if (!offlineReady) return undefined;
    setReadyShown(true);
    const t = setTimeout(() => {
      setReadyShown(false);
      setOfflineReady(false);
    }, 4000);
    return () => clearTimeout(t);
  }, [offlineReady, setOfflineReady]);

  const showUpdate = needRefresh && !dismissed;
  if (!showUpdate && !readyShown) return null;

  return (
    <div className="pwa-toasts">
      {showUpdate && (
        <div className="pwa-toast" role="alertdialog" aria-label="Update available">
          <span>A new version of CineRate is available</span>
          <div className="pwa-toast-actions">
            <button className="btn btn-primary" onClick={() => updateServiceWorker(true)}>Update now</button>
            <button
              className="btn btn-outline"
              onClick={() => {
                setDismissed(true);
                setNeedRefresh(false);
              }}
            >
              Later
            </button>
          </div>
        </div>
      )}
      {readyShown && (
        <div className="pwa-toast" role="status">App ready to work offline</div>
      )}
    </div>
  );
}

export default UpdatePrompt;
