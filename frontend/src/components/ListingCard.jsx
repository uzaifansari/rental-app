import React from "react";
import { Link } from "react-router-dom";
import "./ListingCard.css";

const ListingCard = ({ listing }) => {
  const { _id, title, category, size, pricePerDay, images, city, owner } = listing;
  const img = images?.[0] || "https://via.placeholder.com/400x500?text=No+Image";

  return (
    <Link to={`/listings/${_id}`} className="listing-card">
      <div className="card-image-wrap">
        <img src={img} alt={title} className="card-image" />
        <span className="card-badge">{category}</span>
      </div>
      <div className="card-body">
        <p className="card-owner">@{owner?.name || "unknown"}</p>
        <h3 className="card-title">{title}</h3>
        <div className="card-meta">
          <span className="card-size">Size {size}</span>
          <span className="card-city">📍 {city}</span>
        </div>
        <div className="card-footer">
          <span className="card-price">₹{pricePerDay}<span>/day</span></span>
          <span className="card-rent-btn">Rent →</span>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
