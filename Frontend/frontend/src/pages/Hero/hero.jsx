import React from 'react'
import image10 from '../../assets/image10.jpg'
import { Link } from 'react-router-dom'

const Hero = ({ sectionId }) => {
  return (
    <section
      id={sectionId}
      className="bg-linear-to-r from-slate-950 via-slate-900 to-slate-800
 text-white">
<div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 lg:flex-row 
lg:items-center lg:gap-16">
<div className="flex-1 space-y-6">
 <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
Trusted care since 2001
</p>
<h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
Best Medical &amp; Healthcare Service For Your Family
</h1>
 <p className="text-base text-slate-200 md:text-lg">
Access world-class doctors, modern facilities, and 24/7 emergency support—
all tailored to keep you and your loved ones healthy and protected.
</p>
<div className="flex flex-col gap-4 sm:flex-row">
<Link to='/appointment' className="rounded-full bg-cyan-400 px-8 py-3 text-sm font-semibold uppercase
 tracking-wider text-slate-900 transition hover:bg-cyan-300">
Book Appointment
</Link>
 <Link to='/contacts' className="rounded-full border border-slate-600 px-8 py-3 text-sm font-semibold 
 uppercase tracking-wider text-white transition hover:border-white">
 Contact Us
</Link>
</div>
<div className="grid gap-6 pt-6 sm:grid-cols-3">
{[
{ label: 'Specialists', value: '120+' },
{ label: 'Patients Served', value: '50K+' },
{ label: 'Cities Covered', value: '18' },
].map(({ label, value }) => (
<div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4 
text-center">
<p className="text-2xl font-bold text-white">{value}</p>
<p className="text-xs uppercase tracking-widest text-slate-300">{label}</p>
</div>
))}
</div>
</div>
 <div className="flex-1">
<div className="relative rounded-3xl border border-white/10 bg-white/5 p-3
 shadow-2xl shadow-cyan-500/20">
<div className="absolute inset-0 -z-10 rounded-3xl bg-linear-to-r from-cyan-500/20 
to-transparent blur-3xl" />
<img
src={image10}
alt="Healthcare professionals providing medical support"
className="h-full w-full rounded-2xl object-cover"
/>
</div>
</div>
</div>
</section>
  )
}

export default Hero
