import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import Reviews from "../components/Reviews";
import { IMG } from "../services/service";
import { useMovie } from "../hooks/useMovies";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const validId = /^\d+$/.test(id);
  const { data: movie, isPending, isError, error, refetch } = useMovie(id);
  const notFound = !validId || error?.message === "NOT_FOUND";

  const links = (
    <div className="back-links">
      <button className="btn btn-outline" onClick={() => navigate(-1)}>← Back</button>
      <Link to="/movies" className="btn btn-outline">All movies</Link>
    </div>
  );

  if (validId && isPending) return <Loader text="Loading movie..." />;

  if (notFound) {
    return (
      <div className="center-box">
        <h1>Movie not found</h1>
        <p className="muted">There is no movie with ID "{id}".</p>
        {links}
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        {links}
        <ErrorMessage message={error.message} onRetry={() => refetch()} />
      </div>
    );
  }

  const director = movie.credits.crew.find((p) => p.job === "Director");
  const cast = movie.credits.cast.slice(0, 6).map((p) => p.name).join(", ");
  const money = (n) => (n ? "$" + n.toLocaleString() : "Unknown");

  const details = [
    ["Release date", movie.release_date || "Unknown"],
    ["Runtime", movie.runtime ? `${movie.runtime} min` : "Unknown"],
    ["Genres", movie.genres.map((g) => g.name).join(", ") || "Unknown"],
    ["Director", director ? director.name : "Unknown"],
    ["Cast", cast || "Unknown"],
    ["Language", movie.original_language.toUpperCase()],
    ["Status", movie.status],
    ["Budget", money(movie.budget)],
    ["Revenue", money(movie.revenue)],
  ];

  return (
    <div>
      {links}

      <div className="details">
        {movie.poster_path ? (
          <img className="details-poster" src={`${IMG}/w500${movie.poster_path}`} alt={movie.title} />
        ) : (
          <div className="no-poster details-poster">No poster</div>
        )}

        <div className="details-info">
          <h1>{movie.title}</h1>
          {movie.tagline && <p className="tagline">“{movie.tagline}”</p>}
          <p className="big-rating">
            ★ {movie.vote_average.toFixed(1)} <span className="muted">/ 10 · {movie.vote_count.toLocaleString()} votes</span>
          </p>
          <p>{movie.overview || "No description available."}</p>

          <dl className="details-list">
            {details.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <Reviews movieId={movie.id} />
    </div>
  );
}

export default MovieDetails;
