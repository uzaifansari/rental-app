import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyListings, deleteListing } from "../redux/slices/listingSlice";
import { fetchMyRentals, fetchIncomingRentals, updateRentalStatus } from "../redux/slices/rentalSlice";
import "./Dashboard.css";

const STATUS_COLORS = {
  pending: "#c9a96e", accepted: "#5cb87a",
  active: "#5b9bd5", completed: "#7a7570", cancelled: "#e05c5c",
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { myListings } = useSelector((s) => s.listings);
  const { myRentals, incomingRentals } = useSelector((s) => s.rentals);
  const [tab, setTab] = useState("my-listings");

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    dispatch(fetchMyListings());
    dispatch(fetchMyRentals());
    dispatch(fetchIncomingRentals());
  }, [user, dispatch, navigate]);

  const handleStatus = (id, action) => dispatch(updateRentalStatus({ id, action }));

  const RentalCard = ({ rental, isIncoming }) => (
    <div className="rental-card">
      <div className="rental-img-wrap">
        <img src={rental.listing?.images?.[0] || "https://via.placeholder.com/100"} alt="" />
      </div>
      <div className="rental-info">
        <p className="rental-title">{rental.listing?.title}</p>
        <p className="rental-meta">
          {new Date(rental.startDate).toLocaleDateString()} → {new Date(rental.endDate).toLocaleDateString()}
        </p>
        <p className="rental-meta">📍 {rental.meetupLocation}</p>
        {isIncoming && <p className="rental-meta">Renter: <strong>{rental.renter?.name}</strong> · {rental.renter?.phone}</p>}
        {!isIncoming && <p className="rental-meta">Lender: <strong>{rental.lender?.name}</strong> · {rental.lender?.phone}</p>}
        <p className="rental-price">₹{rental.totalPrice}</p>
      </div>
      <div className="rental-actions">
        <span className="rental-status" style={{ color: STATUS_COLORS[rental.status] }}>
          ● {rental.status}
        </span>
        {isIncoming && rental.status === "pending" && (
          <div className="action-btns">
            <button className="btn-accept" onClick={() => handleStatus(rental._id, "accept")}>Accept</button>
            <button className="btn-cancel" onClick={() => handleStatus(rental._id, "cancel")}>Decline</button>
          </div>
        )}
        {isIncoming && rental.status === "accepted" && (
          <button className="btn-complete" onClick={() => handleStatus(rental._id, "complete")}>Mark Complete</button>
        )}
        {!isIncoming && rental.status === "pending" && (
          <button className="btn-cancel" onClick={() => handleStatus(rental._id, "cancel")}>Cancel</button>
        )}
      </div>
    </div>
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="dash-sub">Welcome back, {user?.name?.split(" ")[0]} ✦</p>
        </div>
        <button className="btn-new" onClick={() => navigate("/create-listing")}>+ New Listing</button>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card"><span className="stat-num">{myListings.length}</span><span>My Listings</span></div>
        <div className="stat-card"><span className="stat-num">{myRentals.length}</span><span>My Rentals</span></div>
        <div className="stat-card"><span className="stat-num">{incomingRentals.filter(r => r.status === "pending").length}</span><span>Pending Requests</span></div>
        <div className="stat-card"><span className="stat-num">{incomingRentals.filter(r => r.status === "completed").length}</span><span>Completed</span></div>
      </div>

      {/* Tabs */}
      <div className="dash-tabs">
        {["my-listings", "my-rentals", "incoming"].map((t) => (
          <button key={t} className={`dash-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t === "my-listings" ? "My Listings" : t === "my-rentals" ? "My Rentals" : "Incoming Requests"}
            {t === "incoming" && incomingRentals.filter(r => r.status === "pending").length > 0 && (
              <span className="tab-badge">{incomingRentals.filter(r => r.status === "pending").length}</span>
            )}
          </button>
        ))}
      </div>

      {/* My Listings */}
      {tab === "my-listings" && (
        <div className="dash-section">
          {myListings.length === 0 ? (
            <div className="dash-empty">No listings yet. <button onClick={() => navigate("/create-listing")}>Create one →</button></div>
          ) : (
            <div className="my-listings-grid">
              {myListings.map((l) => (
                <div key={l._id} className="my-listing-card">
                  <img src={l.images?.[0] || "https://via.placeholder.com/200"} alt={l.title} />
                  <div className="my-listing-info">
                    <p className="my-listing-title">{l.title}</p>
                    <p className="my-listing-meta">₹{l.pricePerDay}/day · {l.size} · {l.city}</p>
                    <span className={`availability-tag ${l.isAvailable ? "avail" : "not-avail"}`}>
                      {l.isAvailable ? "Available" : "Rented Out"}
                    </span>
                  </div>
                  <button className="btn-delete" onClick={() => dispatch(deleteListing(l._id))}>Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Rentals */}
      {tab === "my-rentals" && (
        <div className="dash-section">
          {myRentals.length === 0 ? (
            <div className="dash-empty">No rentals yet. <button onClick={() => navigate("/")}>Browse items →</button></div>
          ) : (
            myRentals.map((r) => <RentalCard key={r._id} rental={r} isIncoming={false} />)
          )}
        </div>
      )}

      {/* Incoming */}
      {tab === "incoming" && (
        <div className="dash-section">
          {incomingRentals.length === 0 ? (
            <div className="dash-empty">No incoming requests yet.</div>
          ) : (
            incomingRentals.map((r) => <RentalCard key={r._id} rental={r} isIncoming={true} />)
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
