const { ref, string } = require('joi');
const mongoose = require('mongoose');
// const { validatelistingSchema } = require('../schema');
const Review = require('./review');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,


    },

    description: String,
    image: {
       url:String,
       filename:String,
    },

    price: {
        type: Number,
        min: 0
    },
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }

})


const Listing = mongoose.model("Listing", listingSchema)
module.exports = Listing;
