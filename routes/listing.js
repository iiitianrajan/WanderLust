const express = require('express');
const router = express.Router(); // router is object that contains all routes (get ,post)
const WrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/EpressError.js');
const { listingSchema,reviewSchema } = require('../schema.js')
const {isLoggedIn,isOwner} = require("../middleware.js")
const listingController = require('../controllers/listing.js')
const multer  = require('multer')
const {storage} = require('../cloudConfig.js')
const upload = multer({ storage})


// validate Listing schema
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404, errMsg)
    }
    else{
        next();
    }
}


router
.route("/")
.get( WrapAsync(listingController.index))
.post(validateListing,isLoggedIn,upload.single('listing[image]'), WrapAsync(listingController.createNewList))

// search feature
router.post("/search", WrapAsync(listingController.search));



// crete new list(getting form)
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get( WrapAsync(listingController.showListing))
.put(isLoggedIn,upload.single('listing[image]'), WrapAsync(listingController.updateList))
.delete(isLoggedIn, WrapAsync(listingController.deleteList))

// edit form
router.get("/:id/edit",isLoggedIn, WrapAsync(listingController.editList))

module.exports = router;