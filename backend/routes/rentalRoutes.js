const express = require("express");
const router = express.Router();
const {
  requestRental, getMyRentals, getIncomingRentals,
  acceptRental, cancelRental, completeRental,
} = require("../controllers/rentalController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, requestRental);
router.get("/my", protect, getMyRentals);
router.get("/incoming", protect, getIncomingRentals);
router.put("/:id/accept", protect, acceptRental);
router.put("/:id/cancel", protect, cancelRental);
router.put("/:id/complete", protect, completeRental);

module.exports = router;
