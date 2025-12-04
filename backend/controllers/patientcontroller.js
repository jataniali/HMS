import bcrypt from "bcryptjs";
import Patient from "../models/patient.js"
import User from "../models/user.js";

class PatientController{

    // create patient
static createpatient = async (req,res)=>{
try {
const {name,age,phone,profileimage,email,disease}=req.body;
if(!email || !name || !gender ){
return res.status(400).json({message:"Name and email is required"})
}
const existingpattient= await Patient.findOne({email})
if(existingpattient){
return res.status(400).json({message:"Patient already exists"})
}
let user=await User.findOne({email})
if(!user){
const temppassword="12345"
const hashedpassword=await bcrypt(temppassword,10)
const user= new User({
username:name,
email,
password:hashedpassword,
role:"patient",
 isApproved: true
})
await user.save()
}
const userId=req.user.id
const newPatient= new Patient({
name,
age: age || null,
phone: phone || null,
profileimage: profileimage || null,
email,
disease,
gender,
userId:user._id
})
await newPatient.save();
return res.status(201).json({message:"Patient created successfully",newPatient})
} 
catch (error) {
  res.status(500).json({ message: error.message });   
}
}

// get all patient
static getallpatient= async(req,res)=>{
try {
const patients= await Patient.find().sort({createdAt:-1});
return res.status(200).json({patients})
} 
catch (error) {
 res.status(500).json({ message: error.message });
}
}

// get single patient
static getsinglepatient= async(req,res)=>{
try {
const patient= await Patient.findById(req.params.id) 
if(!patient){
return res.status(404).json({message:"Patient not found"})
}
res.status(200).json(patient)
} 
catch (error) {
res.status(500).json({ message: error.message }); 
}
}

// update patient
 static UpdatePatient = async(req,res)=>{
try {
const updatedpatient =await Patient.findByIdAndUpdate(
req.params.id,
req.body,{new:true,runValidators: true}
)   
if(!updatedpatient){
return res.status(404).json({message:"Patient not found"})
}
res.status(200).json({message:"Patient updated successfully",updatedpatient})
} 
catch (error) {
res.status(500).json({ message: error.message });
}
}

//delete patient 
static deletepatient= async(req,res)=>{
try {
const deletepatient= await Patient.findByIdAndDelete(req.params.id) 
if(!deletepatient){
return res.status(404).json({message:"Patient not found"})
}
res.status(200).json({message:"Patient deleted successfully"})
} 
catch (error) {
res.status(500).json({ message: error.message });
}
}

}
export default PatientController