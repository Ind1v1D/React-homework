import { Link } from "react-router-dom";

function About() {
  return (
    <div className="page-narrow">
      <h1>About CineRate</h1>
      <p>
        CineRate is a movie rating website made as a React Router homework project. You can search
        movies, filter them, open a movie page, and leave your own star rating and comment.
      </p>

      <h2>Features</h2>
      <ul className="list">
        <li>Movie list with search, filters, sorting and pagination</li>
        <li>Movie details page with cast, runtime, budget and more</li>
        <li>Your own reviews and star ratings (saved in your browser)</li>
        <li>Dashboard with statistics about popular movies</li>
        <li>Accounts with email/password or Google (Firebase Authentication)</li>
        <li>Cached movie data, so pages you already visited open instantly</li>
      </ul>

      <h2>Technologies</h2>
      <p>React, React Router, TanStack Query, Firebase Authentication, Vite, TMDB API, CSS.</p>

      <h2>About me</h2>
      <p>
        Hi! My name is Mahambet Erdaulet. I am a 4th-year student at KBTU (Kazakh-British Technical
        University) and a beginning React developer. CineRate is my React Router homework project —
        it helped me practice nested routes, dynamic URLs, URL parameters and lazy loading.
      </p>
      <p>
        I have always loved watching movies, so I decided to build a place where people can rate
        films and share their opinions. My favorite movie is Inception (2010).
      </p>

      <p className="muted">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
      <Link to="/movies" className="btn">Start exploring</Link>
    </div>
  );
}

export default About;
