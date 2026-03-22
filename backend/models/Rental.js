const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
    renter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    meetupLocation: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "active", "completed", "cancelled"],
      default: "pending",
    },
    cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rental", rentalSchema);
