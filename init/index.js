const mongoose = require("mongoose")
const initData = require('./data.js');
const listing = require('../models/listing.js')


// database connection
main().then((result)=>{
    console.log("connection successful")
}).catch((err)=>{
    console.log("data base connection erro: ",err);
})
async function main(){
await mongoose.connect("mongodb://127.0.0.1:27017/myDatabase");
}

const initDB = async ()=>{
   await listing.deleteMany({});
    initData.data= initData.data.map((obj)=>({...obj,owner:"68dfcd0d758e9eba4b865ccc"})); // map function return new array with old object and add owner property 
   await listing.insertMany(initData.data);
   console.log("data was initialized");
}
initDB();