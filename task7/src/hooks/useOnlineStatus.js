import { useCallback, useEffect, useRef, useState } from "react";
import { checkConnection } from "../lib/connectivity";

const POLL_MS = 30000;

// navigator.onLine + online/offline events + a real periodic network check.
function useOnlineStatus() {
  const [online, setOnline] = useState(() => navigator.onLine);
  const mounted = useRef(true);

  const check = useCallback(async () => {
    const ok = await checkConnection();
    if (mounted.current) setOnline(ok);
    return ok;
  }, []);

  useEffect(() => {
    mounted.current = true;
    const goOffline = () => setOnline(false);
    const goOnline = () => check();
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    const onVisible = () => document.visibilityState === "visible" && check();
    document.addEventListener("visibilitychange", onVisible);
    const timer = setInterval(check, POLL_MS);
    check();
    return () => {
      mounted.current = false;
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
      document.removeEventListener("visibilitychange", onVisible);
      clearInterval(timer);
    };
  }, [check]);

  return { online, check };
}

export default useOnlineStatus;
