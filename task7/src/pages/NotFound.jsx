import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="center-box">
      <h1 className="big-404">404</h1>
      <h2>This page does not exist</h2>
      <p className="muted">The address may be mistyped, or the page was moved.</p>
      <Link to="/" className="btn">Back to home</Link>
    </div>
  );
}

export default NotFound;
