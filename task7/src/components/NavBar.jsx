import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Icon from "./Icon";
import { useConnectivity } from "../context/ConnectivityContext";

function NavBar() {
  const { user, initializing, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { online } = useConnectivity();
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null);
  const toggleRef = useRef(null);
  const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    function onPointer(e) {
      if (headerRef.current && !headerRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  async function handleLogout() {
    setOpen(false);
    try {
      await logout();
      navigate("/login");
    } catch {
      /* stays signed in; the profile page shows logout errors */
    }
  }

  return (
    <header className="navbar" ref={headerRef}>
      <div className="navbar-inner">
        <Link to="/" className="logo">
          <span className="logo-mark">
            <Icon name="star" fill />
          </span>
          CineRate
        </Link>
        <div
          className={online ? "conn-indicator is-online" : "conn-indicator is-offline"}
          role="status"
          aria-live="polite"
          title={online ? "Online" : "Offline"}
        >
          <span className="conn-dot" aria-hidden="true" />
          <span className="conn-text">{online ? "Online" : "Offline"}</span>
        </div>
        <button
          type="button"
          ref={toggleRef}
          className={open ? "nav-toggle open" : "nav-toggle"}
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="nav-toggle-bar" aria-hidden="true"></span>
        </button>
        <nav id="primary-nav" className={open ? "nav-links open" : "nav-links"} aria-label="Main" onClick={(e) => { if (e.target.closest("a")) setOpen(false); }}>
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
                <span className="user-label">Profile</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Log in</NavLink>
              <Link to="/signup" className="btn btn-outline btn-sm">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
