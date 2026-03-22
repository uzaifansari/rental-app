const Rental = require("../models/Rental");
const Listing = require("../models/Listing");

// POST /api/rentals — renter requests a rental
const requestRental = async (req, res) => {
  try {
    const { listingId, startDate, endDate, meetupLocation } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (!listing.isAvailable) return res.status(400).json({ message: "Listing is not available" });
    if (listing.owner.toString() === req.user._id.toString())
      return res.status(400).json({ message: "You cannot rent your own listing" });

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (days < 1) return res.status(400).json({ message: "Invalid date range" });

    const totalPrice = days * listing.pricePerDay;

    const rental = await Rental.create({
      listing: listing._id,
      renter: req.user._id,
      lender: listing.owner,
      startDate: start,
      endDate: end,
      totalPrice,
      meetupLocation,
    });

    res.status(201).json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/rentals/my — rentals made by the renter
const getMyRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({ renter: req.user._id })
      .populate("listing", "title images pricePerDay city")
      .populate("lender", "name phone")
      .sort({ createdAt: -1 });
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/rentals/incoming — requests received by lender
const getIncomingRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({ lender: req.user._id })
      .populate("listing", "title images pricePerDay city")
      .populate("renter", "name phone city")
      .sort({ createdAt: -1 });
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/rentals/:id/accept — lender accepts
const acceptRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: "Rental not found" });
    if (rental.lender.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    if (rental.status !== "pending")
      return res.status(400).json({ message: "Rental is not in pending state" });

    rental.status = "accepted";
    await rental.save();

    // Mark listing as unavailable
    await Listing.findByIdAndUpdate(rental.listing, { isAvailable: false });

    res.json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/rentals/:id/cancel — renter or lender cancels
const cancelRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: "Rental not found" });

    const isInvolved =
      rental.renter.toString() === req.user._id.toString() ||
      rental.lender.toString() === req.user._id.toString();
    if (!isInvolved) return res.status(403).json({ message: "Not authorized" });

    if (["completed", "cancelled"].includes(rental.status))
      return res.status(400).json({ message: `Rental is already ${rental.status}` });

    rental.status = "cancelled";
    rental.cancelledBy = req.user._id;
    await rental.save();

    // Re-enable listing if it was accepted
    await Listing.findByIdAndUpdate(rental.listing, { isAvailable: true });

    res.json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/rentals/:id/complete — lender marks as completed
const completeRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: "Rental not found" });
    if (rental.lender.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    if (rental.status !== "accepted")
      return res.status(400).json({ message: "Rental must be accepted before completing" });

    rental.status = "completed";
    await rental.save();

    // Re-enable listing
    await Listing.findByIdAndUpdate(rental.listing, { isAvailable: true });

    res.json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { requestRental, getMyRentals, getIncomingRentals, acceptRental, cancelRental, completeRental };
