const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    property:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Listing"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    fromDate:Date,
    toDate:Date,
    totalPrice:Number,
     createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model("Booking",bookingSchema);
