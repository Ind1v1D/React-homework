import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import SearchBox from "../components/SearchBox";
import Icon from "../components/Icon";
import { HeroPostersSkeleton, MovieGridSkeleton } from "../components/Skeletons";
import { useTrending } from "../hooks/useMovies";
import { IMG } from "../services/service";

const HERO_POSTERS = 4;

function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { data, isPending } = useTrending();
  const withPoster = data ? data.results.filter((m) => m.poster_path) : [];
  const heroMovies = withPoster.slice(0, HERO_POSTERS);
  const trending = data ? data.results.filter((m) => !heroMovies.includes(m)).slice(0, 6) : [];
  const hasPosters = isPending || heroMovies.length > 0;

  function submitSearch(e) {
    e.preventDefault();
    const text = query.trim();
    if (text) navigate(`/movies?q=${encodeURIComponent(text)}`);
  }

  return (
    <div>
      <section className={hasPosters ? "hero" : "hero hero-solo"}>
        <div className="hero-copy">
          <h1>Find a movie, check its rating, leave your own review</h1>
          <p className="hero-lead">
            Search the TMDB catalogue by title, compare ratings and vote counts, then write a review
            of your own.
          </p>
          <SearchBox size="lg" inputId="home-search" value={query} onChange={setQuery} onSubmit={submitSearch} />
          <Link to="/movies" className="hero-browse">
            Or browse all movies
            <Icon name="arrow-right" />
          </Link>
        </div>

        {isPending && <HeroPostersSkeleton />}
        {heroMovies.length > 0 && (
          <div className="hero-posters">
            {heroMovies.map((movie) => (
              <Link key={movie.id} to={`/movies/${movie.id}`} className="poster" title={movie.title}>
                <img src={`${IMG}/w342${movie.poster_path}`} alt={movie.title} />
              </Link>
            ))}
          </div>
        )}
      </section>

      {(isPending || trending.length > 0) && (
        <section className="section">
          <div className="section-head">
            <h2>Trending this week</h2>
            <Link to="/movies" className="text-link">
              See all
              <Icon name="arrow-right" />
            </Link>
          </div>
          {isPending ? (
            <MovieGridSkeleton count={6} label="Loading trending movies" />
          ) : (
            <div className="grid">
              {trending.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default Home;
