import React, { useState, useEffect } from 'react';
import { 
  FaEnvelope, 
  FaPhone, 
  FaPhoneAlt,
  FaClock, 
  FaUserMd,
  FaSpinner,
  FaNotesMedical
} from "react-icons/fa";
import { 
  FaUserDoctor,
  FaCalendar,
  FaCheck
} from "react-icons/fa6";
import { FaHospital } from "react-icons/fa6";
import { appointmentAPI } from '../../api/appointment';
import { adminAPI } from '../../api/admin';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Appointment = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || user?.firstName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    date: '',
    time: '',
    doctor: '',
    department: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  const [departments, setDepartments] = useState([]);

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await adminAPI.getAllDoctors();
        const doctorsData = response.doctors || [];
        setDoctors(doctorsData);
        
        // Extract unique specializations as departments
        const uniqueDepartments = [...new Set(doctorsData.map(doctor => doctor.specialization).filter(Boolean))];
        setDepartments(uniqueDepartments);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast.error('Failed to load doctors');
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || user.firstName || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  // Generate available time slots
  useEffect(() => {
    const times = [];
    for (let hour = 9; hour <= 17; hour++) {
      if (hour === 12) continue; // Skip lunch hour
      times.push(`${hour < 10 ? '0' + hour : hour}:00`);
    }
    setAvailableTimes(times);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare appointment data
      const appointmentData = {
        disease: formData.department,
        date: formData.date,
        timeslot: formData.time,
        notes: formData.message,
        doctor: formData.doctor
      };

      // Call the API to create appointment
      const response = await appointmentAPI.createAppointment(appointmentData);
      
      // Show success message
      toast.success('Appointment booked successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });

      // Reset form (only reset appointment-specific fields, keep user data)
      setFormData(prev => ({
        ...prev,
        date: '',
        time: '',
        doctor: '',
        department: '',
        message: ''
      }));

      // Redirect to appointments page after a short delay
      setTimeout(() => {
        window.location.href = '/patient/appointments';
      }, 2000);
      
    } catch (error) {
      console.error('Error booking appointment:', error);
      
      // Check if it's an authentication error
      if (error.response?.status === 401) {
        toast.error('Your session has expired. Please login again.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        toast.error(error.response?.data?.message || error.message || 'Failed to book appointment. Please try again.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
<section className="bg-slate-950 py-16 text-white">
<div className="container mx-auto px-6 max-w-6xl">
<div className="text-center mb-12">
<h2 className="text-3xl md:text-4xl font-bold mb-4">Book an Appointment</h2>
<p className="text-slate-300 max-w-2xl mx-auto">
Schedule your visit with our specialists. We'll get back to you shortly to confirm your appointment.
</p>
</div>
<div className="bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden">
<div className="grid md:grid-cols-2 gap-0">
            {/* Form Section */}
<div className="p-8 md:p-10">
<form onSubmit={handleSubmit} className="space-y-6">
<div>
<label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
Full Name *
</label>
<div className="relative">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<FaUserMd className="h-4 w-4 text-cyan-400" />
</div>
<input
type="text"
id="name"
name="name"
required
value={formData.name}
readOnly
className="block w-full pl-10 pr-3 py-3 rounded-xl border border-white/10 bg-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
placeholder="Your Name"
disabled
/>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
 Email *
</label>
<div className="relative">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<FaEnvelope className="h-4 w-4 text-cyan-400" />
</div>
<input
type="email"
id="email"
name="email"
required
value={formData.email}
readOnly
className="block w-full pl-10 pr-3 py-3 rounded-xl border border-white/10 bg-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
placeholder="your@email.com"
disabled
/>
</div>
 </div>
<div>
<label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1">
Phone *
</label>
<div className="relative">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<FaPhone className="h-4 w-4 text-cyan-400" />
</div>
<input
type="tel"
id="phone"
name="phone"
required
value={formData.phone}
readOnly
className="block w-full pl-10 pr-3 py-3 rounded-xl border border-white/10 bg-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
placeholder="+254 123-4567"
disabled
/>
</div>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label htmlFor="department" className="block text-sm font-medium text-slate-300 mb-1">
Department *
</label>
<select
id="department"
name="department"
required
value={formData.department}
onChange={handleChange}
className="block w-full pl-3 pr-10 py-3 rounded-xl border border-white/10 bg-slate-900/80 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
>
<option value="">Select Department</option>
{departments.map(dept => (
<option key={dept} value={dept}>{dept}</option>
))}
</select>
</div>
<div>
<label htmlFor="doctor" className="block text-sm font-medium text-slate-300 mb-1">
Doctor *
</label>
<select
id="doctor"
name="doctor"
required
value={formData.doctor}
onChange={handleChange}
className="block w-full pl-3 pr-10 py-3 rounded-xl border border-white/10 bg-slate-900/80 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
disabled={loadingDoctors}
>
 <option value="">Select Doctor</option>
{loadingDoctors ? (
  <option value="">Loading doctors...</option>
) : (
  doctors.map(doctor => (
    <option key={doctor._id} value={doctor._id}>
      Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
    </option>
  ))
)}
</select>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label htmlFor="date" className="block text-sm font-medium text-slate-300 mb-1">
Appointment Date *
</label>
<div className="relative">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<FaCalendar className="h-4 w-4 text-cyan-400" />
</div>
<input
type="date"
id="date"
name="date"
required
value={formData.date}
onChange={handleChange}
min={new Date().toISOString().split('T')[0]}
className="block w-full pl-10 pr-3 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
 />
</div>
</div>
<div>
<label htmlFor="time" className="block text-sm font-medium text-slate-300 mb-1">
Preferred Time *
</label>
<div className="relative">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<FaClock className="h-4 w-4 text-cyan-400" />
</div>
<select
id="time"
name="time"
required
value={formData.time}
onChange={handleChange}
className="block w-full pl-3 pr-10 py-3 rounded-xl border border-white/10 bg-slate-900/80 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
>
<option value="">Select Time</option>
{availableTimes.map(time => (
<option key={time} value={time}>
{time}:00 {time >= 12 ? 'PM' : 'AM'}
</option>
))}
</select>
</div>
</div>
</div>
<div>
<label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">
Additional Notes
</label>
<div className="relative">
<div className="absolute top-3 left-3">
<FaNotesMedical className="h-4 w-4 text-cyan-400" />
</div>
<textarea
 id="message"
name="message"
rows="3"
value={formData.message}
onChange={handleChange}
className="block w-full pl-10 pr-3 py-3 rounded-xl border border-white/10
 bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 
 focus:ring-cyan-400 focus:border-transparent"
placeholder="Any specific concerns or notes for the doctor..."
/>
</div>
</div>
<div className="pt-2">
<button
type="submit"
disabled={isSubmitting}
className={`w-full ${
isSubmitting ? 'bg-cyan-600' : 'bg-cyan-500 hover:bg-cyan-600'
} text-white font-bold py-4 px-6 rounded-xl transition duration-300 flex items-center justify-center gap-2`}
>
{isSubmitting ? (
<>
<FaSpinner className="animate-spin h-5 w-5" />
Booking...
</>
) : (
<>
<FaCheck className="h-5 w-5" />
Book Appointment
</>
)}
</button>
</div>
</form>
</div>

            {/* Info Section */}
<div className="bg-linear-to-br from-cyan-900/30 to-slate-900/70 p-8 md:p-10 flex flex-col justify-center">
<div className="space-y-8">
<div>
<h3 className="text-2xl font-bold text-white mb-4">Why Choose Us?</h3>
<ul className="space-y-4">
<li className="flex items-start">
<div className="shrink-0 h-6 w-6 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3 mt-0.5">
<FaCheck className="h-3.5 w-3.5 text-cyan-400" />
</div>
<span className="text-slate-300">Experienced and qualified doctors</span>
</li>
 <li className="flex items-start">
  <div className="shrink-0 h-6 w-6 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3 mt-0.5">
<FaCheck className="h-3.5 w-3.5 text-cyan-400" />
</div>
 <span className="text-slate-300">State-of-the-art facilities</span>
</li>
<li className="flex items-start">
 <div className="shrink-0 h-6 w-6 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3 mt-0.5">
<FaCheck className="h-3.5 w-3.5 text-cyan-400" />
</div>
<span className="text-slate-300">Personalized care and attention</span>
</li>
<li className="flex items-start">
<div className="shrink-0 h-6 w-6 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3 mt-0.5">
<FaCheck className="h-3.5 w-3.5 text-cyan-400" />
</div>
<span className="text-slate-300">Flexible scheduling options</span>
</li>
</ul>
</div>
<div className="border-t border-white/10 pt-6">
 <h4 className="text-lg font-semibold text-white mb-3">Emergency?</h4>
<p className="text-slate-300 mb-4">
For urgent medical assistance, please call our emergency hotline immediately.
</p>
<a
href="tel:+1234567890"
className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-medium"
>
<FaPhoneAlt className="h-5 w-5 mr-2" />
+254 123-4567
 </a>
 </div>
<div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
<h4 className="font-medium text-white mb-2">Office Hours</h4>
<ul className="space-y-2 text-sm text-slate-300">
<li className="flex justify-between">
<span>Monday - Thursday</span>
<span>9:00 AM - 5:00 PM</span>
</li>
<li className="flex justify-between">
<span>Friday</span>
<span>9:00 AM - 3:00 PM</span>
</li>
 <li className="flex justify-between">
<span>Saturday</span>
 <span>10:00 AM - 2:00 PM</span>
</li>
<li className="flex justify-between text-rose-400">
<span>Sunday</span>
<span>Closed</span>
</li>
</ul>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
  );
};

export default Appointment;
