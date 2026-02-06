const Listing = require("../models/listing");


module.exports.index = async (req, res, next) => {
    let allListing = await Listing.find({});
    res.render("index.ejs", { allListing });

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