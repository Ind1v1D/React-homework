import { Link, NavLink } from "react-router-dom";

function NavBar() {
  const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

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
          <NavLink to="/login" className="user-btn" aria-label="Login">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4.5 20c1.6-3.3 4.2-5 7.5-5s5.9 1.7 7.5 5" />
            </svg>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
