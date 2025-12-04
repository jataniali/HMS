import React from 'react'
import About from '../../components/About/about.jsx'
import cover from '../../assets/cover2.jpg'
import { HiArrowRight } from 'react-icons/hi2'
import { FaHeartbeat, FaUserMd, FaHandsHelping } from 'react-icons/fa'
import dr1 from '../../assets/Dr1.jpg'
import dr2 from '../../assets/dr2.jpg'
import dr3 from '../../assets/dr3.jpg'
import dr4 from '../../assets/dr4.jpg'
import dr5 from '../../assets/dr5.jpg'
import { FaInstagram, FaLinkedin, FaFacebook, FaTwitter } from 'react-icons/fa'
import Blog from '../Blog/blog.jsx'
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

const doctors = [
  { name: 'Dr. Ryley Mueller', specialty: 'Cardiology', image: dr1 },
  { name: 'Dr. Lydia Kamau', specialty: 'Pediatrics', image: dr2 },
  { name: 'Dr. Henry Kiptoo', specialty: 'Orthopedics', image: dr3 },
  { name: 'Dr. Aisha Noor', specialty: 'Radiology', image: dr4 },
  { name: 'Dr. Kevin Mutua', specialty: 'Neurology', image: dr5 },
]

const AboutFull = () => {
  return (
<section id="about" className="bg-slate-950 py-16 text-white">
<div className="mx-auto max-w-6xl space-y-16 px-6">
<div className="relative overflow-hidden rounded-3xl">
<img src={cover} alt="Team delivering compassionate care" className="h-[420px] w-full
 rounded-3xl object-cover" />
<div className="absolute inset-0 rounded-3xl bg-linear-to-r from-cyan-900/80
 via-slate-900/70 to-slate-900/40" />
<div className="absolute inset-0 flex flex-col items-start justify-center gap-4 px-8 
py-10 text-white md:px-16">
<p className="text-xs font-semibold uppercase tracking-[0.5em] text-white/70">
Healing & Care</p>
<h1 className="text-4xl font-bold leading-tight md:text-5xl">About MedicaLife</h1>
<p className="text-sm text-white/80 md:text-base">
 Delivering concierge-grade healthcare inspired by MedAid’s refined 
 aesthetic—now optimized for the communities
we serve across Africa.
 </p>
<p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em]
 text-white/70">
<span className="flex items-center gap-2 cursor-pointer">
Home <HiArrowRight className="text-white" />
</span>
About Us
 </p>
</div>
</div>
<div className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 
shadow-2xl shadow-cyan-500/10 sm:grid-cols-2 md:grid-cols-4">
  {stats.map(({ label, value }) => (
<div key={label} className="text-center">
<p className="text-3xl font-semibold text-white">{value}</p>
<p className="text-xs uppercase tracking-[0.4em] text-slate-300">{label}</p>
</div>
 ))}
</div>
<div className="space-y-12">
          <About />

          <div className="grid gap-6 lg:grid-cols-3">
            {values.map(({ icon: Icon, title, copy }) => (
              <article key={title} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-cyan-500/5">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300">
                  <Icon size={26} />
                </div>
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-slate-300">{copy}</p>
              </article>
            ))}
          </div>
</div>
<div className="rounded-3xl border border-white/10 bg-linear-to-r from-cyan-500/20
 via-slate-900 to-slate-950 p-8 text-center md:text-left">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-200">Talk to our team</p>
              <h3 className="text-2xl font-semibold text-white">Schedule a concierge tour or medical onboarding call.</h3>
              <p className="text-sm text-slate-200">We tailor the MedAid-inspired experience to every patient journey.</p>
            </div>
            <button className="rounded-full bg-cyan-400 px-10 py-3 text-sm font-bold uppercase tracking-[0.4em] text-slate-900 transition hover:bg-cyan-300">
              Book Consultation
            </button>
          </div>
</div>
<div className="space-y-8">
 <div className="space-y-3 text-center">
<p className="text-sm font-semibold uppercase tracking-[0.4em] text-cyan-300">Our Doctors</p>
<h2 className="text-3xl font-semibold md:text-4xl">Meet Our Specialists</h2>
<p className="text-sm text-slate-300 md:text-base">
A multidisciplinary team combining precision medicine with a concierge experience.
</p>
</div>
<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
{doctors.map(({ name, specialty, image }) => (
<article key={name} className="rounded-3xl border border-white/10 bg-white/5 p-5
 shadow-lg shadow-cyan-500/10">
<div className="relative h-60 overflow-hidden rounded-2xl">
<img src={image} alt={name} className="h-full w-full object-cover object-top" />
<div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent" />
</div>
<div className="mt-4 space-y-1">
<p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-300">
  {specialty}</p>
<h3 className="text-xl font-semibold text-white">{name}</h3>
</div>
<div className="mt-4 flex gap-3 text-slate-300">
{[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, index) => (
<button
key={`${name}-${index}`}
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
))}
</div>
 </div>
 <Blog/>
</div>
</section>
  )
}

export default AboutFull
