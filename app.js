
if (process.env.NODE_ENV != "production") {
    
    require('dotenv').config();
}




const express = require('express');
const app = express();
const path = require('path');
const mongoose = require("mongoose");
const Listing = require('./models/listing.js'); // not in use
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const WrapAsync = require('./utils/wrapAsync.js'); //// not in use
const ExpressError = require('./utils/EpressError.js');
const { listingSchema, reviewSchema } = require('./schema.js') // not in use
const Review = require("./models/review.js"); // not in use


// router
const listingRouter = require('./routes/listing.js');  //import whole files but execute only routes 
const reviewRouter = require('./routes/review.js');  //import whole files but execute only routes 
const userRouter = require('./routes/user.js');  //import whole files but execute only routes 

const session = require('express-session'); // session 
const MongoStore = require('connect-mongo');
const flash = require("connect-flash") // flash
const passport = require('passport');
const User = require('./models/user.js')
const LocalStrategy = require('passport-local'); //set user login info in req object


app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))



const dbUrl = process.env.ATLASDB_URL;


console.log("SECRET:", process.env.SECRET);



//database connection
main().then((result) => {
    console.log("connection successful")
}).catch((err) => {
    console.log("data base connection erro: ", err);
})
async function main() {
    await mongoose.connect(dbUrl);
}



const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
});


store.on("error",(err)=>{
    console.log("Error in MONGO STORE",err)
})

// session
const sessionOption = {
    store:store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,//set cookies expiry time (in ms)
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
    }
}

// Home (root path)
// app.get("/", (req, res) => {
//     res.send("i am root path")
// })



app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize()); // middleware for initialise the passport
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{ // middleware for flash
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.use("/demoUser",async (req,res)=>{
//     let fakeUser = new User({
//         email:"abc123@gmail.com",
        // username:"coder"
//     })
//     let registerUser = await User.register(fakeUser,"helloword");
//     res.send(registerUser);
// })

app.get("/", (req, res) => {
    res.redirect("/listing");
});


app.use("/listing", listingRouter); //middleware for listingRouter
app.use("/listing/:id/reviews/", reviewRouter); //middleware for reviewRouter
app.use("/",userRouter);

// if request for route and that router not available
app.all("/*any", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
})

// middleware for error handling
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;

    if (res.headersSent) {
        return next(err);
    }

    res.status(statusCode).render("error.ejs", { message });
});



//server listening point 
app.listen(8080, () => {
    console.log("listening to port 8080")
})
