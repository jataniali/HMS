import React, { useState, useEffect } from 'react'
import { FaEye, FaTooth, FaHeartbeat, FaChild, FaCalendarAlt } from 'react-icons/fa'
import { FaPersonDress } from 'react-icons/fa6'
import { MdPregnantWoman } from 'react-icons/md'
import { GiBodyBalance } from 'react-icons/gi'
import { Link } from 'react-router-dom'
import { adminAPI } from '../../api/admin'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// Icon mapping for service categories
const getIconForCategory = (category) => {
  const iconMap = {
    'consultation': FaHeartbeat,
    'procedure': FaTooth,
    'test': FaEye,
    'treatment': GiBodyBalance,
    'other': FaCalendarAlt,
  };
  return iconMap[category] || FaHeartbeat;
};

// Accent color mapping for service categories
const getAccentForCategory = (category) => {
  const accentMap = {
    'consultation': 'from-cyan-500/30 to-blue-500/20',
    'procedure': 'from-amber-500/30 to-orange-500/20',
    'test': 'from-rose-500/30 to-pink-500/10',
    'treatment': 'from-indigo-500/30 to-purple-500/20',
    'other': 'from-sky-500/30 to-cyan-500/20',
  };
  return accentMap[category] || 'from-cyan-500/30 to-blue-500/20';
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await adminAPI.getAllServices();
        setServices(response.services || []);
      } catch (error) {
        console.error('Error fetching services:', error);
        toast.error('Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
<section id='services' className="bg-slate-950 py-20 text-white">
<div className="mx-auto max-w-6xl px-6">
<div className="max-w-2xl space-y-4">
<p className="text-sm font-semibold uppercase tracking-[0.4em] text-cyan-300">
 Medical Services
 </p>
<h2 className="text-3xl font-semibold leading-tight md:text-5xl">
Our Healthcare Services
</h2>
<p className="text-base text-slate-300 md:text-lg">
Inspired by MedAid’s premium experience, MedicaLife delivers multi-disciplinary
programs that keep every patient informed, prepared, and supported at each step.
</p>
</div>
<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
{services.length > 0 ? (
  services.map((service) => {
    const Icon = getIconForCategory(service.category);
    const accent = getAccentForCategory(service.category);
    return (
      <article
        key={service._id}
        className="rounded-3xl border border-white/5 bg-white/5 p-6 shadow-lg shadow-cyan-500/5 transition hover:-translate-y-2 hover:bg-white/10"
      >
        <div
          className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${accent} text-white`}
        >
          <Icon size={26} />
        </div>
        <h3 className="text-xl font-semibold text-white">{service.name}</h3>
        <p className="mt-3 text-sm text-slate-300">{service.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-lg font-bold text-cyan-300">
            Ksh {service.price.toLocaleString()}
          </p>
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-300">
            {service.category?.charAt(0).toUpperCase() + service.category?.slice(1)}
          </span>
        </div>
        <button className="mt-6 text-sm font-semibold uppercase tracking-widest text-cyan-300">
          Book Now
        </button>
      </article>
    );
  })
) : (
  <div className="col-span-full text-center py-12">
    <p className="text-slate-400">No services available at the moment.</p>
  </div>
)}
 </div>
<div className="mt-16 grid gap-6 rounded-3xl border border-white/10 bg-linear-to-r
 from-cyan-500/20 via-slate-900 to-slate-950 p-8 lg:grid-cols-[2fr,1fr] 
 lg:items-center">
<div className="space-y-3">
<p className="inline-flex items-center gap-2 text-sm font-semibold uppercase 
tracking-widest text-cyan-200">
<FaCalendarAlt /> Open for Appointments
</p>
<h3 className="text-2xl font-semibold text-white md:text-3xl">
24/7 scheduling, priority care for emergencies, and on-call specialists.
</h3>
 <p className="text-sm text-slate-200">
 Book a visit directly from the portal or connect with our care concierge team to
arrange diagnostics, second opinions, or telehealth consultations.
</p>
</div>
<div className="flex justify-end">
<Link to='/appointment' className="w-full rounded-full bg-cyan-400 px-10 py-3 text-sm font-bold 
uppercase tracking-widest text-slate-900 transition hover:bg-cyan-300 lg:w-auto">
Make an Appointment
</Link>
</div>
</div>
</div>
</section>
  )
}
  

export default Services
