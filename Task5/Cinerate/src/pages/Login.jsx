import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setMessage("Login is not available yet. Authentication is coming soon!");
  }

  return (
    <div className="login-box">
      <h1>Welcome back</h1>
      <p className="muted">Log in to save your reviews across devices.</p>

      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" placeholder="you@example.com" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" placeholder="••••••••" value={password}
            onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button className="btn" type="submit">Log in</button>
      </form>

      {message && <p className="info-message">{message}</p>}
      <p className="muted">
        You can still rate movies without an account. <Link to="/movies" className="text-link">Browse movies</Link>
      </p>
    </div>
  );
}

export default Login;
