import { Link } from "react-router-dom";
import { IMG } from "../services/service";

function MovieCard({ movie }) {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";

  return (
    <Link to={`/movies/${movie.id}`} className="card">
      {movie.poster_path ? (
        <img src={`${IMG}/w342${movie.poster_path}`} alt={movie.title} loading="lazy" />
      ) : (
        <div className="no-poster">No poster</div>
      )}
      <span className="badge">★ {movie.vote_average.toFixed(1)}</span>
      <div className="card-body">
        <h3>{movie.title}</h3>
        <p>{year}</p>
      </div>
    </Link>
  );
}

export default MovieCard;
