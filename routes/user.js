const express = require('express');
const router = express.Router({ mergeParams: true }); // router is object that contains all routes (get ,post). and {mergeParams:true}-> it pull params(id) from (/listing/:id/revies) in review.js
const User = require('../models/user.js')
const WrapAsync = require('../utils/wrapAsync.js');
const { route } = require('./listing');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require('../controllers/user.js')

// render sign up form
router.get("/signup", userController.renderSignUpForm);

// signup
router.post("/signup", WrapAsync(userController.signUp));

// render login-form
router.get("/login", userController.loginForm)

// login
router.post("/login",saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), WrapAsync(userController.loginDone))

// logout
router.get("/logout", userController.logOut)



module.exports = router;