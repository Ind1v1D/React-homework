import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { getTrending } from "../services/service";

function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    getTrending()
      .then((data) => setTrending(data.results.slice(0, 6)))
      .catch(() => setTrending([]));
  }, []);

  function submitSearch(e) {
    e.preventDefault();
    const text = query.trim();
    if (text) navigate(`/movies?q=${encodeURIComponent(text)}`);
  }

  return (
    <div>
      <section className="hero">
        <h1>Know what to watch.</h1>
        <p className="hero-sub">
          Discover great films, check their ratings and share your own opinion —
          all in one place, in a couple of clicks.
        </p>

        <form className="search-panel" onSubmit={submitSearch}>
          <div className="search-row">
            <input
              type="search"
              placeholder="Search for a movie..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="search-actions">
            <button className="btn" type="submit">Search</button>
            <Link to="/movies" className="btn btn-outline">Browse all</Link>
            <span className="spacer"></span>
            <button className="search-btn" type="submit" aria-label="Search">→</button>
          </div>
        </form>

        <div className="hero-links">
          <Link to="/dashboard" className="pill-link">View dashboard</Link>
          <Link to="/about" className="pill-link">How it works</Link>
        </div>
      </section>

      {trending.length > 0 && (
        <section>
          <div className="section-head">
            <h2>Featured classics</h2>
            <Link to="/movies" className="text-link">See all →</Link>
          </div>
          <div className="grid">
            {trending.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
