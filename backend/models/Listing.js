const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["dress", "top", "bottom", "jacket", "ethnic", "accessory", "shoes", "other"],
      required: true,
    },
    size: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "XXL", "Free Size"],
      required: true,
    },
    pricePerDay: { type: Number, required: true },
    images: [{ type: String }],
    city: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", listingSchema);
