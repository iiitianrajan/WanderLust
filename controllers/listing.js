const Listing = require("../models/listing");
const Booking = require("../models/booking");



module.exports.index = async (req, res, next) => {
    let allListing = await Listing.find({});
    res.render("index.ejs", { allListing });

};

// search

module.exports.search = async (req,res,next)=>{
    let { city } = req.body;

    // if(!city){
    //     req.flash("error","Search empty");
    //     return res.redirect("/listing");
    // }

    // split words: "New Delhi" -> ["New","Delhi"]
    let words = city.split(" ");

    let searchConditions = words.map(word => ({
        location: { $regex: word, $options: "i" }
    }));

    let allListing = await Listing.find({
        $or: searchConditions
    });

    if(allListing.length === 0){
        req.flash("error","No place found 😢");
        return res.redirect("/listing");
    }

    res.render("index.ejs",{ allListing });
};

// Trending
module.exports.trending = async (req,res)=>{

   
   const trendingData = await Booking.aggregate([
      {
         $group:{
            _id:"$property",      
            totalBookings:{ $sum:1 } 
         }
      },
      {
         $sort:{ totalBookings:-1 } 
      },
      {
         $limit:6
      }
   ]);

   
   const propertyIds = trendingData.map(item => item._id);

   
   const allListing = await Listing.find({
      _id: { $in: propertyIds }
   });

   res.render("index.ejs",{ allListing });
};


module.exports.categoryFilter = async (req,res)=>{
   const {cat} = req.params;

   const allListing = await Listing.find({category:cat});

   res.render("index.ejs",{allListing});
};



module.exports.renderNewForm = (req, res) => {
    res.render("form.ejs")
    
};

module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author",

    },
}).populate("owner");
    // console.log(listing)
    if(!listing){
        req.flash('error',"Listing does not exist that listing you are trying to access");
        res.redirect("/listing")
    } else{
        res.render("show.ejs", { listing })
    }
   
    

};

module.exports.createNewList = async (req, res, next) => {
    let url = req.file.path; // req.file contains path and filename of uploaded image
    let filename = req.file.filename;

    let listing = req.body.listing; 

    const newListing = new Listing(listing);
    newListing.owner =  res.locals.currUser._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash('success',"New Listing successfully Added");
    res.redirect("/listing");
};

module.exports.editList = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
     if(!listing){
        req.flash('error',"Listing does not exist that listing you are trying to access");
        res.redirect("/listing")
       
    }
      let originalImageUrl = listing.image.url;
      originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
        res.render("edit.ejs", { listing ,originalImageUrl});
    
};

module.exports.updateList = async (req, res, next) => {
    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file!="undefined"){
    let url = req.file.path; // req.file contains path and filename of uploaded image
    let filename = req.file.filename;
    listing.image = {url,filename}
    await listing.save();
    }

    req.flash('success',"Listing successfully updated");
    res.redirect(`/listing/${id}`)
};

module.exports.deleteList = async (req, res, next) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash('success',"Listing Deleted");
    res.redirect("/listing")
};