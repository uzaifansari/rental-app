import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup, clearError } from "../redux/slices/authSlice";
import "./Auth.css";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", city: "" });

  useEffect(() => { if (user) navigate("/"); }, [user, navigate]);
  useEffect(() => { return () => dispatch(clearError()); }, [dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signup(form));
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-brand">✦ celeb</span>
          <h1>Create account</h1>
          <p>Start renting & lending today</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" placeholder="Priya Sharma"
              value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Min. 6 characters"
              value={form.password} onChange={handleChange} required minLength={6} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input type="text" name="phone" placeholder="+91 98765 43210"
                value={form.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>City</label>
              <input type="text" name="city" placeholder="Mumbai"
                value={form.city} onChange={handleChange} />
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
