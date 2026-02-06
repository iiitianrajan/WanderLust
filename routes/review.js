const express = require('express');
const router = express.Router({mergeParams:true}); // router is object that contains all routes (get ,post). and {mergeParams:true}-> it pull params(id) from (/listing/:id/revies) in review.js
const WrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/EpressError.js');
const { reviewSchema } = require('../schema.js')
const { isLoggedIn, isOwner } = require('../middleware.js');
const reviewController = require('../controllers/review.js');


// validate review schema
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg)
    }
    else {
        next();
    }
}


// Route for listing review
router.post("/",isLoggedIn, validateReview, WrapAsync(reviewController.addReview))


// Route for delete review
router.delete("/:reviewId",isOwner, reviewController.destroyReview)

module.exports = router; // export all routes