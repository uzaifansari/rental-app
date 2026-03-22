import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchListingById } from "../redux/slices/listingSlice";
import { requestRental, clearRentalMessages } from "../redux/slices/rentalSlice";
import "./ListingDetail.css";

const ListingDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selected: listing, loading } = useSelector((s) => s.listings);
  const { loading: rentalLoading, error: rentalError, success } = useSelector((s) => s.rentals);
  const { user } = useSelector((s) => s.auth);

  const [activeImg, setActiveImg] = useState(0);
  const [form, setForm] = useState({ startDate: "", endDate: "", meetupLocation: "", meetupNote: "" });
  const [days, setDays] = useState(0);

  useEffect(() => { dispatch(fetchListingById(id)); return () => dispatch(clearRentalMessages()); }, [id, dispatch]);
  useEffect(() => { if (success) { setTimeout(() => navigate("/dashboard"), 1500); } }, [success, navigate]);

  const handleDateChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    if (updated.startDate && updated.endDate) {
      const d = Math.ceil((new Date(updated.endDate) - new Date(updated.startDate)) / 86400000);
      setDays(d > 0 ? d : 0);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    dispatch(requestRental({ listingId: id, ...form }));
  };

  if (loading || !listing) return (
    <div className="detail-loading">
      <div className="detail-skeleton" />
    </div>
  );

  const isOwner = user && listing.owner?._id === user._id;

  return (
    <div className="detail-page">
      {/* Images */}
      <div className="detail-images">
        <div className="main-image">
          <img src={listing.images?.[activeImg] || "https://via.placeholder.com/600x700"} alt={listing.title} />
          {!listing.isAvailable && <div className="unavailable-badge">Not Available</div>}
        </div>
        {listing.images?.length > 1 && (
          <div className="image-thumbs">
            {listing.images.map((img, i) => (
              <img key={i} src={img} alt="" className={`thumb ${i === activeImg ? "active" : ""}`}
                onClick={() => setActiveImg(i)} />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="detail-info">
        <div className="detail-header">
          <span className="detail-category">{listing.category}</span>
          <h1 className="detail-title">{listing.title}</h1>
          <p className="detail-price">₹{listing.pricePerDay}<span>/day</span></p>
        </div>

        <div className="detail-meta">
          <div className="meta-item"><span>Size</span><strong>{listing.size}</strong></div>
          <div className="meta-item"><span>City</span><strong>{listing.city}</strong></div>
          <div className="meta-item"><span>Listed by</span><strong>{listing.owner?.name}</strong></div>
        </div>

        <p className="detail-desc">{listing.description}</p>

        {/* Rental Form */}
        {!isOwner && listing.isAvailable && (
          <div className="rental-form-wrap">
            <h3>Request to Rent</h3>
            {rentalError && <div className="rental-error">{rentalError}</div>}
            {success && <div className="rental-success">{success} Redirecting...</div>}

            <form onSubmit={handleSubmit} className="rental-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="date" name="startDate" value={form.startDate}
                    onChange={handleDateChange} min={new Date().toISOString().split("T")[0]} required />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input type="date" name="endDate" value={form.endDate}
                    onChange={handleDateChange} min={form.startDate} required />
                </div>
              </div>
              <div className="form-group">
                <label>Meetup Location</label>
                <input type="text" name="meetupLocation" placeholder="e.g. Bandra Station, Mumbai"
                  value={form.meetupLocation} onChange={(e) => setForm({ ...form, meetupLocation: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Note to lender (optional)</label>
                <textarea name="meetupNote" rows={2} placeholder="Any message..."
                  value={form.meetupNote} onChange={(e) => setForm({ ...form, meetupNote: e.target.value })} />
              </div>

              {days > 0 && (
                <div className="price-summary">
                  <span>{days} day{days > 1 ? "s" : ""} × ₹{listing.pricePerDay}</span>
                  <strong>₹{days * listing.pricePerDay}</strong>
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={rentalLoading}>
                {rentalLoading ? "Requesting..." : user ? "Request Rental" : "Login to Rent"}
              </button>
            </form>
          </div>
        )}

        {isOwner && (
          <div className="owner-note">✦ This is your listing. View requests in your Dashboard.</div>
        )}
        {!listing.isAvailable && !isOwner && (
          <div className="owner-note" style={{ color: "var(--danger)" }}>This item is currently rented out.</div>
        )}
      </div>
    </div>
  );
};

export default ListingDetail;
