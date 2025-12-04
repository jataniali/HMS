import mongoose from "mongoose";

const patientSchema= new mongoose.Schema({
userId:{
type:mongoose.Schema.Types.ObjectId,
ref:'User',
required:true
},
name: { type: String, required: true },
age: { type: Number,required: true },
gender: { type: String ,required: true},
phone: { type: String ,required: true},
email: { type: String,required: true },
medicalHistory: { type: String },
profileimage: { type: String },
disease: {
  type: String,
  required: true
}
},{timestamps:true})

const Patient= mongoose.model("Patient",patientSchema);
export default Patient