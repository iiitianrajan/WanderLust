
if (process.env.NODE_ENV != "production") {

    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require("mongoose");
const Listing = require('./models/listing.js');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate"); //EJS-Mate is a layout middleware for EJS that allows template inheritance and reusable layouts
const WrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/EpressError.js');
const { listingSchema, reviewSchema } = require('./schema.js')
const Review = require("./models/review.js");

// router
const listingRouter = require('./routes/listing.js');  //import whole files but execute only routes 
const reviewRouter = require('./routes/review.js');  //import whole files but execute only routes 
const userRouter = require('./routes/user.js');  //import whole files but execute only routes 
const bookingRouter = require("./routes/booking");
const dashboardRouter = require("./routes/dashboard");

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
app.use(express.urlencoded({ extended: true })) //URL-encoded data = form data sent as text like key=value&key=value
app.use(methodOverride("_method"))



const dbUrl = process.env.ATLASDB_URL;
const mongoURL = process.env.MONGO_URL;


//database connection
main().then((result) => {
    console.log("connection successful")
}).catch((err) => {
    console.log("data base connection erro: ", err);
})

async function main() {
    await mongoose.connect(mongoURL);
}



const store = MongoStore.create({
    mongoUrl: mongoURL,
    touchAfter: 24 * 3600,
});


store.on("error", (err) => {
    console.log("Error in MONGO STORE", err)
})

// session
const sessionOption = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,//set cookies expiry time (in ms)
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}




app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => { // middleware for flash
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


app.get("/", (req, res) => {
    res.redirect("/listing");
});


app.use("/listing", listingRouter);
app.use("/listing/:id/reviews/", reviewRouter);
app.use("/", userRouter);
app.use('/booking', bookingRouter)
app.use("/dashboard", dashboardRouter);



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
