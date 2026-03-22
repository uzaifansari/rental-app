import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createListing } from "../redux/slices/listingSlice";
import "./CreateListing.css";

const CATEGORIES = ["dress", "top", "bottom", "jacket", "ethnic", "accessories", "footwear", "other"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "free size"];

const CreateListing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { loading, error } = useSelector((s) => s.listings);
  const [previews, setPreviews] = useState([]);
  const [form, setForm] = useState({
    title: "", description: "", category: "dress", size: "M",
    pricePerDay: "", city: "", images: [],
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => { if (!user) navigate("/login"); }, [user, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, images: files });
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === "images") v.forEach((f) => fd.append("images", f));
      else fd.append(k, v);
    });
    const result = await dispatch(createListing(fd));
    if (result.meta.requestStatus === "fulfilled") {
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1200);
    }
  };

  return (
    <div className="create-page">
      <div className="create-card">
        <div className="create-header">
          <h1>List an Item</h1>
          <p>Share something from your wardrobe</p>
        </div>

        {error && <div className="create-error">{error}</div>}
        {success && <div className="create-success">Listing created! Redirecting...</div>}

        <form onSubmit={handleSubmit} className="create-form">
          <div className="form-group">
            <label>Title</label>
            <input type="text" name="title" placeholder="e.g. Black Floral Midi Dress"
              value={form.title} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" rows={3} placeholder="Condition, brand, how it fits..."
              value={form.description} onChange={handleChange} required />
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Size</label>
              <select name="size" value={form.size} onChange={handleChange}>
                {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Price / Day (₹)</label>
              <input type="number" name="pricePerDay" placeholder="299"
                value={form.pricePerDay} onChange={handleChange} min="1" required />
            </div>
          </div>

          <div className="form-group">
            <label>City</label>
            <input type="text" name="city" placeholder="Mumbai"
              value={form.city} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Photos (up to 5)</label>
            <label className="upload-area">
              <input type="file" accept="image/*" multiple onChange={handleImages} style={{ display: "none" }} />
              {previews.length === 0 ? (
                <div className="upload-placeholder">
                  <span className="upload-icon">📷</span>
                  <span>Click to upload photos</span>
                </div>
              ) : (
                <div className="upload-previews">
                  {previews.map((src, i) => <img key={i} src={src} alt="" className="preview-thumb" />)}
                  <span className="upload-more">+ Change</span>
                </div>
              )}
            </label>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Publishing..." : "Publish Listing"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
