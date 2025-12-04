import express from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "../.env" })

mongoose.connect(process.env.MONGO_URI,{
useNewUrlParser: true,
useUnifiedTopology: true,
}).then(()=>console.log("MongoDB connected"))
.catch((err)=>console.log("MongoDB connection error:", err))



async function createsupperadmin(){

try {
 const existinguser= await User.findOne({isSuperAdmin: true})
 if(existinguser){
 console.log("Super Admin already exists.");
return 
 }
 const adminpass="12345"
const hashedpassword= await bcrypt.hash(adminpass,10)
const superAdmin= new User({
username:"Ali",
email:"ali@gmail.com",
password:hashedpassword,
role:"admin",
isSuperAdmin: true,
isApproved: true
})
await superAdmin.save()
console.log("Super Admin created successfully!");
process.exit(0);
} 
catch (error) {
     console.log("Error creating super admin:", error.message);
}
}
createsupperadmin()