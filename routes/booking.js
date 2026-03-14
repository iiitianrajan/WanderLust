const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");
const bookingController = require("../controllers/booking");

// create booking
router.post("/:id", isLoggedIn, WrapAsync(bookingController.createBooking));

// my bookings page
router.get("/mybooking",isLoggedIn, WrapAsync(bookingController.myBookings));

// cancel booking
router.delete("/:bookingId", isLoggedIn, WrapAsync(bookingController.cancelBooking));



module.exports = router;
