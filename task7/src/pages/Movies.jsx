import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import useGenres from "../hooks/useGenres";
import { useMovieList } from "../hooks/useMovies";

function Movies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const genres = useGenres();

  const search = searchParams.get("q") || "";
  const genre = searchParams.get("genre") || "";
  const year = searchParams.get("year") || "";
  const rating = searchParams.get("rating") || "";
  const sort = searchParams.get("sort") || "popularity.desc";
  const page = Number(searchParams.get("page")) || 1;

  const [searchText, setSearchText] = useState(search);
  const { data, isPending, isError, error, isPlaceholderData, refetch } = useMovieList({
    search, genre, year, rating, sort, page,
  });
  const movies = data?.results ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalResults = data?.totalResults ?? 0;

  useEffect(() => {
    setSearchText(search);
  }, [search]);

  function updateParam(name, value) {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(name, value);
    else params.delete(name);
    if (name !== "page") params.delete("page");
    setSearchParams(params);
  }

  function handleSearch(e) {
    e.preventDefault();
    updateParam("q", searchText.trim());
  }

  function clearFilters() {
    setSearchParams({});
  }

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= 1980; y--) years.push(y);

  return (
    <div>
      <h1>Movies</h1>

      <form className="search-panel" onSubmit={handleSearch}>
        <div className="search-row">
          <input
            type="search"
            placeholder="Search for a movie..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="search-actions">
          <button className="btn" type="submit">Search</button>
          <button className="btn btn-outline" type="button" onClick={clearFilters}>Clear</button>
          <span className="spacer"></span>
          <button className="search-btn" type="submit" aria-label="Search">→</button>
        </div>
      </form>

      <div className="filters">
        <select value={genre} onChange={(e) => updateParam("genre", e.target.value)}>
          <option value="">All genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>

        <select value={year} onChange={(e) => updateParam("year", e.target.value)}>
          <option value="">Any year</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select value={rating} onChange={(e) => updateParam("rating", e.target.value)}>
          <option value="">Any rating</option>
          <option value="6">6+ ★</option>
          <option value="7">7+ ★</option>
          <option value="8">8+ ★</option>
        </select>

        <select value={sort} onChange={(e) => updateParam("sort", e.target.value)}>
          <option value="popularity.desc">Most popular</option>
          <option value="vote_average.desc">Highest rated</option>
          <option value="release_date.desc">Newest first</option>
        </select>

        <button className="btn btn-outline" onClick={clearFilters}>Reset</button>
      </div>

      {isPending && <Loader text="Loading movies..." />}
      {isError && <ErrorMessage message={error.message} onRetry={() => refetch()} />}

      {!isPending && !isError && movies.length === 0 && (
        <div className="center-box">
          <h3>No movies found</h3>
          <p className="muted">Try another search or reset the filters.</p>
        </div>
      )}

      {!isPending && !isError && movies.length > 0 && (
        <div className={isPlaceholderData ? "is-updating" : ""} aria-busy={isPlaceholderData}>
          <p className="muted">{totalResults.toLocaleString()} movies found</p>
          <div className="grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={(p) => updateParam("page", String(p))} />
        </div>
      )}
    </div>
  );
}

export default Movies;
