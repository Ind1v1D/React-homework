import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAuthAction } from "../hooks/useAuthAction";
import AuthCard, { Field, GoogleButton } from "../components/AuthCard";

function Login() {
  const { user, login, loginWithGoogle } = useAuth();
  const { pending, error, setError, run } = useAuthAction();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Already signed in → go back to the page that sent us here
  if (user) return <Navigate to={location.state?.from?.pathname || "/profile"} replace />;

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    run(() => login(email.trim(), password));
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to save your reviews and see your profile."
      footer={<>New to CineRate? <Link to="/signup" state={location.state} className="text-link">Create an account</Link></>}
    >
      <GoogleButton onClick={() => run(loginWithGoogle)} disabled={pending} />
      <div className="divider"><span>or</span></div>

      <form onSubmit={handleSubmit} noValidate>
        <Field label="Email" type="email" placeholder="you@example.com" autoComplete="email"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field label="Password" type="password" placeholder="••••••••" autoComplete="current-password"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn btn-block" type="submit" disabled={pending}>
          {pending ? "Logging in..." : "Log in"}
        </button>
      </form>
    </AuthCard>
  );
}

export default Login;
