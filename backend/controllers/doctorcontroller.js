import Doctor from "../models/doctor.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
class DoctorController{

// create a doctor
static async createDoctor(req,res){
try {
 const {name,specialization,email,phone,gender, profileimage}=req.body;

// check if name and specialization are provided
if( !name || !specialization){
return res.status(400).json({message:"name and specialization field required"})
}
const temppassword="12345"
const hashpassword= await bcrypt.hash(temppassword,10)
const newuser= new User({
username:name,
email,
password:hashpassword,
role:"doctor",
isApproved: true
})
await newuser.save()

const userId=req.user.id
const doctor= new Doctor({
userId:newuser._id,
name,
specialization,
email,
phone,
gender,
profileimage
 })
 await doctor.save();
 return res.status(201).json({message:"Doctor created successfully",doctor})
} 
catch (error) {
 res.status(500).json({ message: error.message });   
}
}

// get all doctors 
static async getAlldoctors(req,res){
try {
const doctors =await Doctor.find().sort({createdAt:-1});
return res.status(200).json({doctors});
} 
catch (error) {
  res.status(500).json({ message: error.message });   
}
}

// updating all doctors
static async updateDoctor(req,res){
try {
 const updateDoctor= await Doctor.findByIdAndUpdate(req.params.id,req.body,{new:true,
runValidators: true
 });
 if(!updateDoctor){
return res.status(404).json({message:"Doctor not found"})
 }   
 return res.status(200).json({message:"Doctor updated successfully",updateDoctor});
} 
catch (error) {
    res.status(500).json({ message: error.message });
}
}

// delete a doctor
static async deleteDoctor(req,res){
try {
const deletedDoctor= await Doctor.findByIdAndDelete(req.params.id) ;
if(!deletedDoctor){
return res.status(404).json({message:"Doctor not found"})
}  
return res.status(200).json({message:"Doctor deleted successfully"}); 
} 
catch (error) {
    res.status(500).json({ message: error.message }); 
}
}

}
export default DoctorController;