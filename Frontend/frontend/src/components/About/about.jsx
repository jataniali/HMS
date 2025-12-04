import React from 'react'
import dr1 from '../../assets/Dr1.jpg'
import image6 from '../../assets/image6.jpg'
import { Link } from 'react-router-dom';
import {
  FaHeart,
  FaStethoscope,
  FaPills,
  FaClock,
  FaCheck,
} from "react-icons/fa";


const serviceHighlights = [
  {
    icon: FaHeart,
    title: 'Quality of Care Services',
    copy: 'Holistic treatment plans designed around every patient.',
  },
  {
    icon: FaPills,
    title: 'Infection Prevention',
    copy: 'Sterile environments and evidence-based protocols.',
  },
  {
    icon: FaStethoscope,
    title: 'Standards of Treatment',
    copy: 'World-class specialists leveraging modern equipment.',
  },
  {
    icon: FaClock,
    title: '24/7 Working Time',
    copy: 'Emergency teams on standby whenever you need us.',
  },
]

const checklist = [
  '24 Hours emergency assistance. Call us anytime.',
  'We are committed to compassionate healthcare services.',
  'We understand the real needs and expectations of patients.',
]

const About = () => {
  return (
<section  className="bg-slate-950 py-20">
<div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
<div className="relative flex flex-col gap-6">
<div className="absolute -left-10 top-8 hidden h-24 w-24 rounded-full bg-cyan-500/20
 blur-3xl lg:block" />
 <div className="absolute -right-6 bottom-16 hidden h-24 w-24 rounded-full
  bg-rose-500/20 
 blur-3xl lg:block" />
<div className="relative overflow-hidden rounded-3xl border border-white/10
 bg-white/5
 p-4 shadow-2xl shadow-cyan-500/20">
<img
src={dr1}
alt="Lead doctor of MedicaLife"
className="h-full w-full rounded-2xl object-cover"
/>
<div className="absolute bottom-6 left-6 rounded-2xl bg-white/90 px-5 py-4
 text-slate-900">
<p className="text-sm font-semibold uppercase tracking-widest">20+ Years</p>
<p className="text-xs text-slate-600">of dependable medical excellence</p>
</div>
</div>
<div className="absolute -bottom-8 right-6 w-3/4 max-w-sm overflow-hidden rounded-3xl
 border border-white/10 bg-white/5 p-4 shadow-xl shadow-rose-500/20">
 <img
src={image6}
alt="Medical team supporting patients"
className="h-full w-full rounded-2xl object-cover"
 />
<div className="absolute inset-0 -z-10 rounded-3xl bg-linear-to-tr from-rose-500/20
 to-transparent blur-3xl" />
</div>
</div>
<div className="space-y-8 text-white">
<p className="text-sm font-semibold uppercase tracking-[0.4em] text-cyan-300">
About MedicaLife
</p>
<h2 className="text-3xl font-semibold leading-tight text-white md:text-5xl">
We Provide Essential Services For Your Healthcare
</h2>
<p className="text-base text-slate-300 md:text-lg">
From preventive screenings to specialized surgeries, MedicaLife delivers
integrated medical support that mirrors the premium look and feel of MedAid.
 Our multidisciplinary experts collaborate closely to keep you thriving.
</p>
<div className="grid gap-4">
{serviceHighlights.map(({ icon: Icon, title, copy }) => (
<div
key={title}
className="flex gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur"
 >
<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/20 text-cyan-300">
<Icon size={28} />
</div>
<div>
<p className="text-lg font-semibold text-white">{title}</p>
<p className="text-sm text-slate-300">{copy}</p>
</div>
</div>
 ))}
</div>
<div className="space-y-3">
{checklist.map((item) => (
<p key={item} className="flex items-start gap-3 text-sm text-slate-200">
<span className="mt-1 text-cyan-300">
< FaCheck size={18} />
</span>
{item}
</p>
))}
</div>
<div className="pt-4">
<Link to='/about' className="rounded-full bg-cyan-400 px-10 py-3 text-sm font-bold uppercase
 tracking-widest text-slate-900 transition hover:bg-cyan-300">
More About Us
</Link>
</div>
</div>
</div>
</section>
  )
}

export default About
