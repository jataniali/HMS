import React, { useState, useEffect } from 'react'
import coverdoc from '../../assets/coverdoc2.jpg'
import { Link } from 'react-router-dom'
import { HiArrowRight } from 'react-icons/hi2'
import { FaHeartbeat, FaUserMd, FaHandsHelping } from 'react-icons/fa'
import { FaInstagram, FaLinkedin, FaFacebook, FaTwitter } from 'react-icons/fa'
import { adminAPI } from '../../api/admin'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const stats = [
  { label: 'Specialized Clinics', value: '15+' },
  { label: 'Dedicated Specialists', value: '120+' },
  { label: 'Patient Satisfaction', value: '98%' },
  { label: 'Countries Served', value: '6' },
]

const values = [
  {
    icon: FaHeartbeat,
    title: 'Integrative Medicine',
    copy: 'Holistic protocols blend diagnostics, nutrition, and mental wellness inspired by MedAid standards.',
  },
  {
    icon: FaUserMd,
    title: 'Personal Care Teams',
    copy: 'Each member receives a concierge physician, nurse navigator, and digital care coordinator.',
  },
  {
    icon: FaHandsHelping,
    title: 'Community Impact',
    copy: 'Mobile clinics and scholarships extend premium care access across East Africa.',
  },
]

const DoctorPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch doctors from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await adminAPI.getAllDoctors();
        setDoctors(response.doctors || []);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast.error('Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading doctors...</p>
        </div>
      </div>
    );
  }
  return (
<section className="bg-slate-950 py-16 text-white">
<div className="relative mx-auto w-full max-w-none overflow-hidden rounded-none">
        <img src={coverdoc} alt="MedicaLife doctors" className="h-[420px] w-full object-cover object-top" />
        <div className="absolute inset-0 bg-linear-to-r from-cyan-900/80 via-slate-900/70 to-slate-900/50" />
        <div className="absolute inset-0 flex flex-col items-start justify-center gap-4 px-6 py-12 text-white md:px-16">
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-white/70">Our Doctors</p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">Specialists who coordinate every detail of your care.</h1>
          <p className="text-sm text-white/80 md:w-2/3">
            Inspired by MedAid’s concierge blueprint, our board pairs in-person expertise with digital navigation so treatments stay personal.
          </p>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
            <Link to="/" className="flex items-center gap-2 cursor-pointer">
              Home <HiArrowRight className="text-white" />
            </Link>
            Doctors
          </p>
        </div>
 </div>

<div className="mx-auto mt-16 max-w-6xl space-y-16 px-6">
 <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-center sm:grid-cols-2 lg:grid-cols-4">
{stats.map(({ label, value }) => (
<div key={label} className="space-y-2">
<p className="text-3xl font-bold text-cyan-300">{value}</p>
<p className="text-sm uppercase tracking-[0.3em] text-white/70">{label}</p>
</div>
))}
</div>
<div className="grid gap-6 md:grid-cols-3">
{values.map(({ icon: Icon, title, copy }) => (
<article key={title} className="rounded-3xl border border-white/10 bg-linear-to-b
 from-white/5 to-transparent p-6">
<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl
 bg-cyan-500/15 text-cyan-300">
<Icon size={22} />
</div>
<h3 className="text-xl font-semibold">{title}</h3>
<p className="mt-2 text-sm text-slate-300">{copy}</p>
</article>
))}
</div>
<div className="space-y-6 text-center">
<p className="text-sm font-semibold uppercase tracking-[0.4em] text-cyan-300">
  Our Doctors</p>
<h2 className="text-3xl font-semibold md:text-4xl">Meet the multidisciplinary board</h2>
 <p className="text-sm text-slate-300 md:text-base">
 Precision medicine, preventive care, and concierge coordination come together through
  these lead consultants.
</p>
 </div>
<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
{doctors.length > 0 ? (
  doctors.map((doctor) => (
    <article key={doctor._id} className="rounded-3xl border border-white/10 bg-white/5 p-5 
    shadow-lg shadow-cyan-500/10">
    <div className="relative h-64 overflow-hidden rounded-2xl">
      {doctor.profileimage ? (
        <img src={doctor.profileimage} alt={doctor.name} className="h-full w-full object-cover object-top" />
      ) : (
        <div className="h-full w-full bg-linear-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
          <div className="text-4xl font-bold text-cyan-300">
            {doctor.name?.charAt(0) || 'D'}
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/0" />
    </div>
    <div className="mt-4 space-y-1">
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-300">
        {doctor.specialization || 'General Practice'}</p>
      <h3 className="text-xl font-semibold text-white">{doctor.name}</h3>
      {doctor.email && (
        <p className="text-sm text-slate-400">{doctor.email}</p>
      )}
    </div>
<div className="mt-4 flex gap-3 text-slate-300">
{[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, index) => (
 <button
key={`${doctor._id}-${index}`}
type="button"
className="inline-flex h-9 w-9 items-center justify-center rounded-full border
 border-white/10 bg-white/5 text-sm transition hover:border-cyan-400
  hover:text-cyan-300"
>
<Icon size={14} />
</button>
 ))}
 </div>
</article>
))
) : (
  <div className="col-span-full text-center py-12">
    <p className="text-slate-400">No doctors available at the moment.</p>
  </div>
)}
 </div>
<div className="rounded-3xl border border-white/10 bg-linear-to-r from-cyan-500/20
 via-slate-900 to-slate-950 p-8">
 <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
<div>
<p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-200">
  Concierge desk</p>
<h3 className="text-2xl font-semibold text-white">Need a custom care pathway?</h3>
<p className="text-sm text-slate-200">Share your case file and we will assemble 
  the right multi-specialty team within 24 hours.</p>
</div>
<Link to='/appointment' className="rounded-full bg-cyan-400 px-10 py-3 text-sm font-bold uppercase
 tracking-[0.4em] text-slate-900 transition hover:bg-cyan-300">
Plan My Visit
</Link>
</div>
</div>
</div>
</section>
  )
}

export default DoctorPage
