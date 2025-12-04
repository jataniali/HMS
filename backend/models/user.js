import mongoose  from "mongoose";

const UserSchema= new mongoose.Schema({
username:{type:String,required:true},
email:{type:String,required:true,unique:true},
password:{type:String,required:true},
role:{type: String,
enum: ["admin", "doctor", "patient"],
default: "patient"},
isSuperAdmin: {
  type: Boolean,
  default: false
},
isApproved:{type:Boolean,default:true}
},{timestamps:true});

const User= new mongoose.model('User',UserSchema);
export default User;