import mongoose from "mongoose";


const appointmentschema= new mongoose.Schema({
patient:{
type:mongoose.Schema.Types.ObjectId,
ref:'Patient',
required:true
},
doctor:{
type:mongoose.Schema.Types.ObjectId,
ref:'Doctor',
required:true
},
date:{
type:Date,
required:true
},
timeslot:{
type:String,
required:true
},
status:{
type:String,
enum:['scheduled','completed','canceled','pending'],
default:'pending'
}
},{timestamps:true});

const Appointment= mongoose.model('Appointment',appointmentschema);
export default Appointment;
