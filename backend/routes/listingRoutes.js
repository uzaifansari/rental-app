const express = require("express");
const router = express.Router();
const {
  createListing, getListings, getMyListings,
  getListingById, updateListing, deleteListing,
} = require("../controllers/listingController");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");

router.get("/", getListings);
router.get("/my", protect, getMyListings);
router.get("/:id", getListingById);
router.post("/", protect, upload.array("images", 5), createListing);
router.put("/:id", protect, upload.array("images", 5), updateListing);
router.delete("/:id", protect, deleteListing);

module.exports = router;
