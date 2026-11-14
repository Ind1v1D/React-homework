import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NavBar() {
  const { user, initializing, logout } = useAuth();
  const navigate = useNavigate();
  const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch {
      /* stays signed in; the profile page shows logout errors */
    }
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo">
          <span className="logo-mark">
            <svg viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true">
              <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z" />
            </svg>
          </span>
          CineRate
        </Link>
        <nav className="nav-links">
          <NavLink to="/movies" className={linkClass}>Movies</NavLink>
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>

          {initializing ? null : user ? (
            <>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Log out</button>
              <NavLink to="/profile" className="user-btn" aria-label="Profile" title={user.email}>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" referrerPolicy="no-referrer" />
                ) : (
                  <span>{user.email?.[0]?.toUpperCase() ?? "?"}</span>
                )}
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Log in</NavLink>
              <Link to="/signup" className="btn btn-sm">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
