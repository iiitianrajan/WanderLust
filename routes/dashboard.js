const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/wrapAsync");
const {isLoggedIn,isAdmin} = require("../middleware");
const dashboardController = require("../controllers/dashboard");

// dashboard
router.get("/", isLoggedIn, isAdmin, WrapAsync(dashboardController.dashboard));

module.exports = router;
