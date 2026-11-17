import { useSyncExternalStore } from "react";
import { subscribe, getSnapshot } from "../lib/cacheStatus";
import { useConnectivity } from "../context/ConnectivityContext";

function CachedDataBanner() {
  const { fromCache, cachedAt } = useSyncExternalStore(subscribe, getSnapshot);
  const { online } = useConnectivity();

  // The offline bar already explains being offline; show this only when data came from cache.
  if (!fromCache) return null;

  const time = cachedAt ? new Date(cachedAt).toLocaleString() : null;
  return (
    <div className="cached-banner" role="status">
      {time
        ? `You're viewing cached data saved at ${time}. Some content may be out of date.`
        : `${online ? "" : "You're offline. "}You're viewing cached data. Some content may be out of date.`}
    </div>
  );
}

export default CachedDataBanner;
