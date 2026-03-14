const Booking = require("../models/booking");
const Listing = require("../models/listing");

// create booking
module.exports.createBooking = async (req,res)=>{
    const {fromDate,toDate} = req.body;
    const listingId = req.params.id;

    const listing = await Listing.findById(listingId);

    const d1 = new Date(fromDate);
    const d2 = new Date(toDate);

    //  check invalid date
    if(d2 <= d1){
        req.flash("error","Invalid date selection");
        return res.redirect(`/listing/${listingId}`);
    }

    //  CHECK DOUBLE BOOKING
    const existingBooking = await Booking.findOne({
        property: listingId,
        fromDate: { $lte: d2 },
        toDate: { $gte: d1 }
    });

    if(existingBooking){
        req.flash("error","❌ Already booked for selected dates");
        return res.redirect(`/listing/${listingId}`);
    }

    // calculate price
    const days = Math.ceil((d2-d1)/(1000*60*60*24));
    const totalPrice = days * listing.price;

    const newBooking = new Booking({
        property: listing._id,
        user: req.user._id,
        fromDate:d1,
        toDate:d2,
        totalPrice
    });

    await newBooking.save();
    

    req.flash("success","Booking Confirmed 🎉");
    res.redirect(`/listing/${listingId}`);
};



// show my bookings
module.exports.myBookings = async (req,res)=>{

   const bookings = await Booking.find({user:req.user._id})
   .populate("property")
   .sort({fromDate:-1});

   const today = new Date();

   const upcoming = [];
   const past = [];

   bookings.forEach(b=>{
      if(new Date(b.toDate) >= today){
         upcoming.push(b);
      }else{
         past.push(b);
      }
   });

   res.render("mybookings",{upcoming,past});
};




// cancel boooking
module.exports.cancelBooking = async (req,res)=>{
   const {bookingId} = req.params;

   const booking = await Booking.findById(bookingId);

   // security: only user who booked can cancel
   if(!booking.user.equals(req.user._id)){
      req.flash("error","Not authorized");
      return res.redirect("/booking/mybooking");
   }

   await Booking.findByIdAndDelete(bookingId);

   req.flash("success","Booking cancelled successfully");
   res.redirect("/booking/mybooking");
};

