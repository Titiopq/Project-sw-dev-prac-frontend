import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="navbar" role="banner">
      <div className="navbar-inner">
        <div className="navbar-left">
        <Link to="/" className="brand">Exhibition Booth Booking</Link>

        <nav className="nav-links" aria-label="Main navigation">
          <Link to="/">Exhibitions</Link>
          {user && <Link to="/bookings">Bookings</Link>}
          {user && isAdmin && <Link to="/exhibitions/new">New Exhibition</Link>}
        </nav>
        </div>

        <div className="navbar-right">
        {user ? (
          <>
            <span className="user-greeting">Hi, {user.name}</span>
            <button className="btn btn-outline" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-link">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </>
        )}
        </div>
      </div>
    </header>
  );
}
