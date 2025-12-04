import mongoose from "mongoose";


const DoctorSchema= new mongoose.Schema(
{
userId:{
type:mongoose.Schema.Types.ObjectId,
ref:'User',
required:true,

},
name:{type:String,required:true},
specialization:{type:String,required:true},
email:{type:String,required:true,unique:true},
phone:{type:String,required:true},
gender:{type:String,required:true},
profileimage:{type:String}
},{timestamps:true})

const Doctor=mongoose.model('Doctor',DoctorSchema);

export default Doctor;