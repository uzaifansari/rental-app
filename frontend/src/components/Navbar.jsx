import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import "./Navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">✦</span>
        <span className="brand-name">celeb</span>
      </Link>

      <div className="navbar-links">
        <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>Browse</Link>
        {user && (
          <>
            <Link to="/create-listing" className={`nav-link ${isActive("/create-listing") ? "active" : ""}`}>List Item</Link>
            <Link to="/dashboard" className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}>Dashboard</Link>
          </>
        )}
      </div>

      <div className="navbar-actions">
        {user ? (
          <div className="user-menu">
            <span className="user-name">{user.name?.split(" ")[0]}</span>
            <button className="btn-outline-sm" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="btn-accent-sm">Join Free</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
