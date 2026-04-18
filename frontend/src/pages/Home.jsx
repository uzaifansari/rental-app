import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, MapPinOff } from "lucide-react";
import { fetchListings } from "../redux/slices/listingSlice";
import ListingCard from "../components/ListingCard";
import "./Home.css";

const CATEGORIES = ["", "dress", "top", "bottom", "jacket", "ethnic", "accessories", "footwear", "other"];
const SIZES = ["", "XS", "S", "M", "L", "XL", "XXL", "free size"];

const getBrowserCity = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}&zoom=10&addressdetails=1`
          );

          if (!response.ok) {
            resolve("");
            return;
          }

          const data = await response.json();
          const address = data.address || {};
          const city = address.city || address.town || address.village || address.hamlet || address.suburb || address.county || address.state || "";

          resolve(city);
        } catch {
          resolve("");
        }
      },
      () => reject(new Error("Location permission denied")),
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 10 * 60 * 1000,
      }
    );
  });

const Home = () => {
  const dispatch = useDispatch();
  const { listings = [], loading } = useSelector((s) => s.listings);
  const { user, token, loading: authLoading } = useSelector((s) => s.auth);
  const [filters, setFilters] = useState({ search: "", category: "", size: "", city: "" });
  const [defaultCity, setDefaultCity] = useState("");
  const [locationReady, setLocationReady] = useState(false);
  const [useLocationBasedListings, setUseLocationBasedListings] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const resolveDefaultCity = async () => {
      if (!user) {
        if (isMounted) {
          setDefaultCity("");
          setLocationReady(true);
        }
        return;
      }

      const fallbackCity = user.city?.trim() || "";

      try {
        const browserCity = await getBrowserCity();
        if (!isMounted) return;
        setDefaultCity(browserCity || fallbackCity);
      } catch {
        if (!isMounted) return;
        setDefaultCity(fallbackCity);
      } finally {
        if (isMounted) setLocationReady(true);
      }
    };

    setLocationReady(false);

    if (!token && !authLoading) {
      setDefaultCity("");
      setLocationReady(true);
      return () => {
        isMounted = false;
      };
    }

    if (token && authLoading && !user) {
      return () => {
        isMounted = false;
      };
    }

    resolveDefaultCity();

    return () => {
      isMounted = false;
    };
  }, [authLoading, token, user]);

  const effectiveFilters = useMemo(() => {
    const params = {};
    const manualCity = filters.city.trim();
    const city = useLocationBasedListings ? (manualCity || defaultCity) : manualCity;

    if (filters.search.trim()) params.search = filters.search.trim();
    if (filters.category) params.category = filters.category;
    if (filters.size) params.size = filters.size;
    if (city) params.city = city;

    return params;
  }, [defaultCity, filters, useLocationBasedListings]);

  useEffect(() => {
    if (!locationReady) return;
    dispatch(fetchListings(effectiveFilters));
  }, [dispatch, effectiveFilters, locationReady]);

  const handleFilter = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const locationLabel = filters.city.trim() || defaultCity;
  const showLocationListings = () => setUseLocationBasedListings(true);
  const showAllListings = () => setUseLocationBasedListings(false);

  return (
    <div className="home-page">
      {/* Hero */}
      <div className="hero">
        <div className="hero-content">
          <p className="hero-tag">Community Fashion Rental</p>
          <h1 className="hero-title">Wear more.<br /><em>Own less.</em></h1>
          <p className="hero-sub">Rent outfits & accessories from real people in your city.</p>
          <div className="hero-location-row">
            <p className="hero-location">
              {locationReady
                ? useLocationBasedListings && locationLabel
                  ? `Showing listings in ${locationLabel}`
                  : "Showing all listings"
                : "Finding your location..."}
            </p>
            {locationReady && locationLabel && (
              <button
                type="button"
                className="hero-location-toggle"
                onClick={useLocationBasedListings ? showAllListings : showLocationListings}
                aria-label={useLocationBasedListings ? "Show all listings" : "Use location-based listings"}
                title={useLocationBasedListings ? "Show all listings" : "Use location-based listings"}
              >
                {useLocationBasedListings ? <MapPinOff className="hero-location-icon" /> : <MapPin className="hero-location-icon" />}
                <span className="sr-only">
                  {useLocationBasedListings ? "Show all listings" : "Use location"}
                </span>
              </button>
            )}
          </div>
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
