import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useOnlineStatus from "../hooks/useOnlineStatus";

const ConnectivityContext = createContext({ online: true, check: async () => true, justReconnected: false });

export function ConnectivityProvider({ children }) {
  const queryClient = useQueryClient();
  const { online, check } = useOnlineStatus();
  const [justReconnected, setJustReconnected] = useState(false);
  const wasOffline = useRef(false);

  useEffect(() => {
    if (!online) {
      wasOffline.current = true;
      return undefined;
    }
    if (!wasOffline.current) return undefined;
    wasOffline.current = false;
    // Back online: replay paused mutations and refresh data.
    queryClient.resumePausedMutations().then(() => queryClient.invalidateQueries());
    setJustReconnected(true);
    const t = setTimeout(() => setJustReconnected(false), 3500);
    return () => clearTimeout(t);
  }, [online, queryClient]);

  return (
    <ConnectivityContext.Provider value={{ online, check, justReconnected }}>
      {children}
    </ConnectivityContext.Provider>
  );
}

export function useConnectivity() {
  return useContext(ConnectivityContext);
}
