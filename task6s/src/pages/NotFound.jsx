import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="center-box">
      <h1 className="big-404">404</h1>
      <h2>Scene not found</h2>
      <p className="muted">The page you are looking for does not exist.</p>
      <Link to="/" className="btn">Go to Home</Link>
    </div>
  );
}

export default NotFound;
