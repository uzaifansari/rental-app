import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchListings } from "../redux/slices/listingSlice";
import ListingCard from "../components/ListingCard";
import "./Home.css";

const CATEGORIES = ["", "dress", "top", "bottom", "jacket", "ethnic", "accessories", "footwear", "other"];
const SIZES = ["", "XS", "S", "M", "L", "XL", "XXL", "free size"];

const Home = () => {
  const dispatch = useDispatch();
  const { listings, loading } = useSelector((s) => s.listings);
  const [filters, setFilters] = useState({ search: "", category: "", size: "", city: "" });

  useEffect(() => { dispatch(fetchListings()); }, [dispatch]);

  const handleFilter = (e) => {
    const updated = { ...filters, [e.target.name]: e.target.value };
    setFilters(updated);
    const params = {};
    Object.entries(updated).forEach(([k, v]) => { if (v) params[k] = v; });
    dispatch(fetchListings(params));
  };

  return (
    <div className="home-page">
      {/* Hero */}
      <div className="hero">
        <div className="hero-content">
          <p className="hero-tag">Community Fashion Rental</p>
          <h1 className="hero-title">Wear more.<br /><em>Own less.</em></h1>
          <p className="hero-sub">Rent outfits & accessories from real people in your city.</p>
        </div>
        <div className="hero-glow" />
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <input
          className="filter-search" type="text" name="search"
          placeholder="Search outfits, styles..."
          value={filters.search} onChange={handleFilter}
        />
        <select name="category" value={filters.category} onChange={handleFilter} className="filter-select">
          <option value="">All Categories</option>
          {CATEGORIES.filter(Boolean).map((c) => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
        <select name="size" value={filters.size} onChange={handleFilter} className="filter-select">
          <option value="">All Sizes</option>
          {SIZES.filter(Boolean).map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input
          className="filter-input" type="text" name="city"
          placeholder="City..."
          value={filters.city} onChange={handleFilter}
        />
      </div>

      {/* Grid */}
      <div className="listings-section">
        {loading ? (
          <div className="loading-state">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
          </div>
        ) : listings.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">✦</p>
            <p>No listings found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="listings-grid">
            {listings.map((l) => <ListingCard key={l._id} listing={l} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
