import { Link } from "react-router-dom";
import Icon from "./Icon";
import { IMG } from "../services/service";

function MovieCard({ movie }) {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";

  return (
    <Link to={`/movies/${movie.id}`} className="card">
      <div className="poster">
        {movie.poster_path ? (
          <img src={`${IMG}/w342${movie.poster_path}`} alt="" loading="lazy" />
        ) : (
          <div className="no-poster">
            <Icon name="film" />
            <span>No poster</span>
          </div>
        )}
      </div>
      <h3 className="card-title">{movie.title}</h3>
      <p className="card-meta">
        <Icon name="star" fill className="rating-star" />
        <span className="rating"><span className="sr-only">Rating </span>{movie.vote_average.toFixed(1)}</span>
        <span aria-hidden="true">·</span>
        <span>{year}</span>
      </p>
    </Link>
  );
}

export default MovieCard;
