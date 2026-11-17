import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import Loader from "../components/Loader";
import ErrorBoundary from "../components/ErrorBoundary";
import ConnectionStatus from "../components/ConnectionStatus";
import CachedDataBanner from "../components/CachedDataBanner";
import UpdatePrompt from "../components/UpdatePrompt";
import { useConnectivity } from "../context/ConnectivityContext";
import { markFresh } from "../lib/cacheStatus";

function RootLayout() {
  const { pathname } = useLocation();
  const { online } = useConnectivity();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // New page = new data; banner reappears only if this page's requests come from the cache (kept while offline).
  useEffect(() => {
    if (online) markFresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div className="app">
      <ConnectionStatus />
      <CachedDataBanner />
      <NavBar />
      <main className="container">
        <ErrorBoundary key={pathname}>
          <Suspense fallback={<Loader text="Loading page..." />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <UpdatePrompt />
      <footer className="footer">
        <p>
          Data from{" "}
          <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">
            TMDB
          </a>{" "}
          · Reviews are stored in your browser · Accounts by Firebase
        </p>
      </footer>
    </div>
  );
}

export default RootLayout;
