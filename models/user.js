const { required } = require('joi');
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new schema({
    email:{
        type:String,
        required:true,
    }
})

userSchema.plugin(passportLocalMongoose); // it will automatically create username and password field;

const User = mongoose.model("User",userSchema);
module.exports = User;