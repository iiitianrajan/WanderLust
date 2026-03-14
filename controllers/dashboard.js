const Listing = require("../models/listing");
const Booking = require("../models/booking");
const User = require("../models/user");

module.exports.dashboard = async (req,res)=>{

   const totalListings = await Listing.countDocuments();
   const totalBookings = await Booking.countDocuments();
   const totalUsers = await User.countDocuments();

   const bookings = await Booking.find();

   let revenue = 0;
   let monthlyRevenue = Array(12).fill(0); // Jan–Dec

   bookings.forEach(b=>{
      revenue += b.totalPrice;

      if(b.createdAt){
         const date = new Date(b.createdAt);

        
         const month = date.getMonth(); 

         monthlyRevenue[month] += b.totalPrice;
      }
   });



   res.render("dashboard",{
      totalListings,
      totalBookings,
      totalUsers,
      revenue,
      monthlyRevenue
   });
};
