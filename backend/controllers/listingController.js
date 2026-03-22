const Listing = require("../models/Listing");

// POST /api/listings
const createListing = async (req, res) => {
  try {
    const { title, description, category, size, pricePerDay, city } = req.body;
    const images = req.files ? req.files.map((f) => f.path) : [];

    const listing = await Listing.create({
      owner: req.user._id,
      title, description, category, size,
      pricePerDay, city, images,
    });

    // Add "lender" role if not already present
    if (!req.user.role.includes("lender")) {
      req.user.role.push("lender");
      await req.user.save();
    }

    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/listings
const getListings = async (req, res) => {
  try {
    const { category, size, city, minPrice, maxPrice, search } = req.query;
    const filter = { isAvailable: true };

    if (category) filter.category = category;
    if (size) filter.size = size;
    if (city) filter.city = new RegExp(city, "i");
    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
    }
    if (search) filter.title = new RegExp(search, "i");

    const listings = await Listing.find(filter)
      .populate("owner", "name city avatar")
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/listings/my
const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/listings/:id
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("owner", "name city avatar phone");
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/listings/:id
const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (listing.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    const updates = req.body;
    if (req.files?.length) updates.images = req.files.map((f) => f.path);

    const updated = await Listing.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/listings/:id
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (listing.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    await listing.deleteOne();
    res.json({ message: "Listing deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createListing, getListings, getMyListings, getListingById, updateListing, deleteListing };
