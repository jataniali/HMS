import Appointment from "../models/appointment.js";
import Doctor from "../models/doctor.js";
import Patient from "../models/patient.js";

class appointmentController{

// create an Appointment
static async createAppointment(req,res){
try {
const {disease,date,timeslot}=req.body;
const patientId=req.user.id
if(!disease|| !date || !timeslot){
return res.status(400).json({message:"All fields are required"});
} 

const doctor= await Doctor.findOne({
specialization:disease
})
if(!doctor){
return res.status(404).json({
        message: `No doctor available for specialization: ${disease}`,
      });
}
const newappointment= new Appointment({
patient:patientId,
doctor:doctor._id,
disease,
date,
timeslot
})
await newappointment.save();
return res.status(201).json({message:"Appointment created successfully",newappointment});
} 
catch (error) {
res.status(500).json({ message: error.message }); 
}
}

// get all apointments 
static async getallAppointments(req,res){
try {
   const appointment= await Appointment.find()
   .populate('patient')
   .populate('doctor')
   .sort({date:1})
return res.status(200).json({appointment})
} 
catch (error) {
 res.status(500).json({ message: error.message });   
}
}

// get patient appointments
static async getPatientAppointments(req,res){
try {
const patientId = req.user.id;
const appointment= await Appointment.find({patient:patientId})
.populate('doctor')
.sort({date:1});
return res.status(200).json({appointment})
} 
catch (error) {
 res.status(500).json({ message: error.message }); 
}
}

// Get single appointment by ID
static async getAppointmentById(req, res) {
  try {
    // First get the raw appointment without population
    const rawAppointment = await Appointment.findById(req.params.id);
    console.log('Raw appointment data:', rawAppointment);
    
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email')
      .populate('doctor', 'name specialization email');
      
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Get the current user's role and ID
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;
    
    console.log('Authorization check:', {
      currentUserId,
      currentUserRole,
      appointmentPatientId: appointment.patient,
      appointmentPatientString: appointment.patient ? appointment.patient.toString() : 'null'
    });
    
    // For admins, allow access to any appointment
    if (currentUserRole === 'admin') {
      console.log('Admin access granted');
      return res.status(200).json(appointment);
    }
    
    // For patients, check if they are the patient in the appointment
    if (currentUserRole === 'patient') {
      // Check the raw appointment data directly
      if (rawAppointment.patient && rawAppointment.patient.toString() === currentUserId) {
        console.log('Patient access granted (raw appointment patient ID match)');
        return res.status(200).json(appointment);
      }
      // Also check if populated patient has matching userId
      if (appointment.patient && 
          appointment.patient.userId && 
          appointment.patient.userId.toString() === currentUserId) {
        console.log('Patient access granted (userId match)');
        return res.status(200).json(appointment);
      }
    }
    
    // For doctors, check if they are the assigned doctor
    if (currentUserRole === 'doctor' && 
        appointment.doctor && 
        appointment.doctor._id.toString() === currentUserId) {
      console.log('Doctor access granted');
      return res.status(200).json(appointment);
    }
    
    // If none of the above conditions are met, deny access
    return res.status(403).json({ 
      message: 'Not authorized to view this appointment' 
    });
    
  } catch (error) {
    console.error('Error in getAppointmentById:', error);
    res.status(500).json({ 
      message: 'Error fetching appointment',
      error: error.message 
    });
  }
}

// doctor appointments
static async getDoctorAppointments(req,res){
try {
 const userId= req.user.id;
 const doctor=await Doctor.findOne({userId})
 if(!doctor){
return res.status(404).json({message: "Doctor profile not found"})
 }
 const appointment= await Appointment.find({doctor:doctor._id});
 return res.status(200).json({appointment})
} 
catch (error) {
  res.status(500).json({ message: error.message });  
}
}

// delete an appointment
static async deleteAppointment(req,res){
try {
 const appointment = await Appointment.findById(req.params.id)  
 if(!appointment){
return res.status(404).json({message:"Appointment not found"})
 }

 const currentUserId = req.user.id;
 const currentUserRole = req.user.role;

 // Check authorization
 if (currentUserRole === 'admin') {
   // Admin can delete any appointment
 } else if (currentUserRole === 'doctor') {
   // Doctor can only delete appointments assigned to them
   if (appointment.doctor.toString() !== currentUserId) {
     return res.status(403).json({message:"Not authorized to delete this appointment"});
   }
 } else if (currentUserRole === 'patient') {
   // Patient can only delete their own appointments
   if (appointment.patient.toString() !== currentUserId) {
     return res.status(403).json({message:"Not authorized to delete this appointment"});
   }
 } else {
   return res.status(403).json({message:"Not authorized to delete appointments"});
 }

 const deleteAppointment = await Appointment.findByIdAndDelete(req.params.id);
 return res.status(200).json({message:"Appointment deleted successfully"})
} 
catch (error) {
 res.status(500).json({ message: error.message });   
}
}


}
export default appointmentController;