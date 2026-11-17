import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAuthAction } from "../hooks/useAuthAction";
import AuthCard, { Field, GoogleButton } from "../components/AuthCard";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ email, password, confirm }) {
  const errors = {};
  if (!EMAIL_RE.test(email.trim())) errors.email = "Enter a valid email address.";
  if (password.length < 6) errors.password = "Use at least 6 characters.";
  if (confirm !== password) errors.confirm = "Passwords do not match.";
  return errors;
}

function Signup() {
  const { user, signup, loginWithGoogle } = useAuth();
  const { pending, error, run } = useAuthAction();
  const location = useLocation();
  const [values, setValues] = useState({ email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});

  if (user) return <Navigate to={location.state?.from?.pathname || "/profile"} replace />;

  function update(field) {
    return (e) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
      setErrors((errs) => ({ ...errs, [field]: undefined }));
    };
  }

  function handleSubmit(e) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    run(() => signup(values.email.trim(), values.password));
  }

  return (
    <AuthCard
      title="Create account"
      subtitle="Join CineRate to keep your reviews in one place."
      footer={<>Already have an account? <Link to="/login" state={location.state} className="text-link">Log in</Link></>}
    >
      <GoogleButton onClick={() => run(loginWithGoogle)} disabled={pending} />
      <div className="divider"><span>or</span></div>

      <form onSubmit={handleSubmit} noValidate>
        <Field label="Email" type="email" placeholder="you@example.com" autoComplete="email"
          value={values.email} onChange={update("email")} error={errors.email} />
        <Field label="Password" type="password" placeholder="At least 6 characters" autoComplete="new-password"
          value={values.password} onChange={update("password")} error={errors.password} />
        <Field label="Confirm password" type="password" placeholder="Repeat your password" autoComplete="new-password"
          value={values.confirm} onChange={update("confirm")} error={errors.confirm} />
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn btn-block" type="submit" disabled={pending}>
          {pending ? "Creating account..." : "Sign up"}
        </button>
      </form>
    </AuthCard>
  );
}

export default Signup;
