import User from '../models/user.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import Patient from '../models/patient.js';

class Authcontroller{

static registeruser= async (req,res)=>{
const {username,email,password,age,gender,phone,disease}=req.body;
try {
// checking if all field are filled
if(!username || !email || !password || !disease){
 return res.status(400).json({ message: "All fields are required" });
} 

//chcking if the email already exist
const existinguser= await User.findOne({email})
if(existinguser){
return res.json({message:"User already exists"})
}
// hashing the password
const hashedpassword= await bcrypt.hash(password,10);

// save the user to db
const newuser= new User({
username,
email,
password:hashedpassword,
role:"patient",
isApproved:true
})
await newuser.save();
const newPatient= new Patient({
userId:newuser._id,
name:username,
age:age || null,
gender:gender || null,
phone:phone || null,
email,
disease:disease 
})
await newPatient.save()
res.status(201).json({
  success: true,
  message: "User registered successfully",
  user: {
    id: newuser._id,
    username: newuser.username,
    email: newuser.email,
    role: newuser.role
  }
})

} catch (error) {
 res.status(500).json({ message: error.message });
}


}

static loginuser= async(req,res)=>{
const {email,password}=req.body;
console.log('Login attempt for email:', email);
try {
// checking if all field are filled
if(!email || !password){
console.log('Missing email or password');
return res.status(400).json({message:"All fields are required"})
}
// find user by email
const user=await User.findOne({email})
console.log('Found user:', user ? {id: user._id, role: user.role, email: user.email} : 'null');
if(!user){
return res.status(400).json({message:"Invalid credentials"})
}
// compare password
const passwordmatch= await bcrypt.compare(password,user.password)
console.log('Password match:', passwordmatch);
if(!passwordmatch){
return res.status(400).json({message:"Invalid credentials"})
}
// if the password match generate jwt token
const token= jwt.sign({
id:user._id,
role:user.role,isSuperAdmin: user.isSuperAdmin}
,process.env.JWT_SECRET)
res.status(200).json({message:'Login succefuly',
token,
user:{
id:user._id,
username:user.username,
email:user.email,
role:user.role
}
})
} 
catch (error) {
 res.status(500).json({ message: error.message });   
}
}

static getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// supper admin creates admins
static createadmin= async (req,res)=>{
try {
 const {username,email,password}=req.body;

if(!req.user?.isSuperAdmin){
 return res.status(403).json({ message: "Only super admin can create admins" });
}

const existinguser= await User.findOne({email})
if(existinguser){
return res.status(400).json({ message: "Email already exists" });
}
const hashedpassword= await bcrypt.hash(password,10);
const admin= new User({
username,
email,
password:hashedpassword,
role:"admin",
isSuperAdmin: false
})
await admin.save()
return res.status(200).json({message:"Admin created successfully"})   
}
 catch (error) {
    res.status(500).json({ message: error.message });
}
}

// Forgot password method
static forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    // For now, just return success (in production, you'd send an email)
    // TODO: Implement email sending with reset token
    res.status(200).json({ 
      message: "Password reset instructions sent to your email",
      // In development, you might return a reset token for testing
      // resetToken: "demo-token-" + Date.now()
    });
    
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: "Failed to process forgot password request" });
  }
};

}
export default Authcontroller;