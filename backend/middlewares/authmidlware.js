import jwt from "jsonwebtoken";

export const verifytoken= async(req,res,next)=>{

const token =req.headers.authorization?.split(" ")[1];

if(!token){
return res.status(401).json({message:"Unauthorized access"})
}
try {
const decoded= jwt.verify(token,process.env.JWT_SECRET);
req.user= decoded;
next()

} 
catch (error) {
   return res.status(401).json({ message: "Invalid or expired token" });  
}
}
export const verifyrole= (...allowedroles)=>{
return (req,res,next)=>{
if(!req.user){
return res.status(401).json({message:"Unauthorized access"})
}
if(req.user.isSuperAdmin === true){
return next()
}
if(!allowedroles.includes(req.user.role)){
return res.status(403).json(
{message:"Forbidden: You don't have permission to access this resource"})
}
next();
}
}