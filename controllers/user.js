
const User = require('../models/user')
module.exports.renderSignUpForm = (req, res) => {
    res.render("./users/signup.ejs");
};


module.exports.signUp = async (req, res) => {
    try {

        let { username, email, password } = req.body;

        const newUser = new User({ email, username })
        let userRegistered = await User.register(newUser, password); 
        req.login(userRegistered, (err) => {
            if (err) {
                return next(err);
            } else {
                req.flash("success", "Welcome to Wanderlust!")
                res.redirect("/listing")
            }
        })

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.loginForm = (req, res) => {
    res.render("./users/login.ejs")
};

module.exports.loginDone = async (req, res) => {
    req.flash("success", "Welcome to Wanderlust! you are logged in!")
    if(!res.locals.redirectURL){
        res.redirect("/listing")
    }else{

        res.redirect(res.locals.redirectURL);
    }

};

module.exports.logOut = (req, res, next) => {
    req.logOut((err) => { // logOut method take callback as parameter. it is provided by passport 
        if (err) {
            next(err);
        } else {
            req.flash("success", "You are successfully LogOut!");
            res.redirect("/listing");
        }
    })
}