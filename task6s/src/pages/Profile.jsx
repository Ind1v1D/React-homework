import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAuthAction } from "../hooks/useAuthAction";

const PROVIDERS = { password: "Email & password", "google.com": "Google" };

function Profile() {
  const { user, logout } = useAuth();
  const { pending, error, run } = useAuthAction();
  const navigate = useNavigate();

  async function handleLogout() {
    if (await run(logout)) navigate("/login", { replace: true });
  }

  const provider = user.providerData[0]?.providerId;

  return (
    <div className="login-box profile">
      {user.photoURL ? (
        <img className="avatar avatar-lg" src={user.photoURL} alt="" referrerPolicy="no-referrer" />
      ) : (
        <div className="avatar avatar-lg">{user.email?.[0]?.toUpperCase() ?? "?"}</div>
      )}
      <h1>{user.displayName || "Your profile"}</h1>
      <p className="muted">Signed in with {PROVIDERS[provider] ?? provider}</p>

      <dl className="details-list profile-list">
        <div>
          <dt>Email</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt>User ID</dt>
          <dd className="mono">{user.uid}</dd>
        </div>
      </dl>

      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="btn btn-outline btn-block" onClick={handleLogout} disabled={pending}>
        {pending ? "Logging out..." : "Log out"}
      </button>
    </div>
  );
}

export default Profile;
