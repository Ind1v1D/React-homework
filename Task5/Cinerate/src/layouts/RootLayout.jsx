import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import Loader from "../components/Loader";

function RootLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app">
      <NavBar />
      <main className="container">
        <Suspense fallback={<Loader text="Loading page..." />}>
          <Outlet />
        </Suspense>
      </main>
      <footer className="footer">
        <p>
          Data from{" "}
          <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">
            TMDB
          </a>{" "}
          · Reviews are stored in your browser
        </p>
      </footer>
    </div>
  );
}

export default RootLayout;
