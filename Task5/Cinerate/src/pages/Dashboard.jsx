import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import useGenres from "../hooks/useGenres";
import { getDashboardMovies } from "../services/service";

function Breakdown({ title, items }) {
  const max = Math.max(...items.map((i) => i.count), 1);
  return (
    <div className="panel">
      <h3>{title}</h3>
      {items.map((item) => (
        <div className="bar-row" key={item.label}>
          <span className="bar-label">{item.label}</span>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${(item.count / max) * 100}%` }}></div>
          </div>
          <span className="bar-count">{item.count}</span>
        </div>
      ))}
    </div>
  );
}

function Dashboard() {
  const genres = useGenres();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [genreId, setGenreId] = useState("");
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getDashboardMovies(controller.signal)
      .then((data) => {
        setMovies(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  if (loading) return <Loader text="Calculating statistics..." />;
  if (error) return <ErrorMessage message={error} />;

  const filtered = movies.filter((m) => {
    const genreOk = genreId === "" || m.genre_ids.includes(Number(genreId));
    return genreOk && m.vote_average >= minRating;
  });

  const total = filtered.length;
  const avgRating = total ? filtered.reduce((s, m) => s + m.vote_average, 0) / total : 0;
  const totalVotes = filtered.reduce((s, m) => s + m.vote_count, 0);
  const topMovie = filtered.reduce((best, m) => (!best || m.vote_average > best.vote_average ? m : best), null);

  const genreCount = {};
  filtered.forEach((m) => {
    m.genre_ids.forEach((gid) => {
      const g = genres.find((x) => x.id === gid);
      const name = g ? g.name : "Other";
      genreCount[name] = (genreCount[name] || 0) + 1;
    });
  });
  const genreItems = Object.entries(genreCount)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const ranges = [
    { label: "8.0 and up", min: 8, max: 11 },
    { label: "7.0 – 7.9", min: 7, max: 8 },
    { label: "6.0 – 6.9", min: 6, max: 7 },
    { label: "Below 6.0", min: 0, max: 6 },
  ];
  const ratingItems = ranges.map((r) => ({
    label: r.label,
    count: filtered.filter((m) => m.vote_average >= r.min && m.vote_average < r.max).length,
  }));

  const decadeCount = {};
  filtered.forEach((m) => {
    if (!m.release_date) return;
    const decade = Math.floor(Number(m.release_date.slice(0, 4)) / 10) * 10 + "s";
    decadeCount[decade] = (decadeCount[decade] || 0) + 1;
  });
  const decadeItems = Object.entries(decadeCount)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.label.localeCompare(a.label));

  const top5 = [...filtered].sort((a, b) => b.vote_average - a.vote_average).slice(0, 5);

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="muted">Statistics based on the {movies.length} most popular movies right now.</p>

      <div className="filters">
        <select value={genreId} onChange={(e) => setGenreId(e.target.value)}>
          <option value="">All genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
        <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
          <option value={0}>Any rating</option>
          <option value={6}>Rating 6+</option>
          <option value={7}>Rating 7+</option>
          <option value={8}>Rating 8+</option>
        </select>
      </div>

      {total === 0 ? (
        <div className="center-box">
          <h3>No movies match these filters</h3>
          <button className="btn" onClick={() => { setGenreId(""); setMinRating(0); }}>Reset filters</button>
        </div>
      ) : (
        <>
          <div className="stats">
            <div className="stat"><span>Movies</span><strong>{total}</strong></div>
            <div className="stat"><span>Average rating</span><strong>★ {avgRating.toFixed(2)}</strong></div>
            <div className="stat"><span>Total votes</span><strong>{totalVotes.toLocaleString()}</strong></div>
            <div className="stat">
              <span>Top movie</span>
              <strong><Link to={`/movies/${topMovie.id}`} className="text-link">{topMovie.title}</Link></strong>
            </div>
          </div>

          <div className="panels">
            <Breakdown title="By genre" items={genreItems} />
            <Breakdown title="By rating" items={ratingItems} />
            <Breakdown title="By decade" items={decadeItems} />
          </div>

          <div className="panel">
            <h3>Top rated in this selection</h3>
            <ol className="top-list">
              {top5.map((m) => (
                <li key={m.id}>
                  <Link to={`/movies/${m.id}`} className="text-link">{m.title}</Link>
                  <span>★ {m.vote_average.toFixed(1)}</span>
                </li>
              ))}
            </ol>
            <Link to="/movies" className="btn btn-outline">See all movies</Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
