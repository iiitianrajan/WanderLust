
const Review = require('./models/review');
module.exports.isLoggedIn = (req,res,next)=>{
    // console.log(req.path+".."+req.originalUrl)
    if(!req.isAuthenticated()){ // isAutenticated() is method of passport


        req.session.redirectURL = req.originalUrl; //req.originalUrl-> whenever we want to go another page url of that page store inside originalUrl;
        req.flash("error","you must be logged in!"); 
         return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{ // passport reset session after middleware call so you need to save req.originalUrl into res.locals
    if( req.session.redirectURL){
     res.locals.redirectURL = req.session.redirectURL;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
         req.flash("error","You don't have permission!"); 
       return  res.redirect(`/listing/${id}`);
    }
    next();
}