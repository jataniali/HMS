import React from 'react'
import { FaClipboardList, FaStethoscope, FaHandshake } from 'react-icons/fa'
import { HiSquares2X2 } from "react-icons/hi2";
import image2 from '../../assets/image2.jpg'
import image3 from '../../assets/image3.jpg'

const workflow = [
  {
    icon: HiSquares2X2,
    label: 'Book an Appointment',
    description: 'Select your specialty, share preferred timings, and we confirm instantly.',
  },
  {
    icon: FaClipboardList,
    label: 'Prepare Your Plan',
    description: 'Upload medical history, insurance details, and custom notes in one hub.',
  },
  {
    icon: FaStethoscope,
    label: 'Meet Your Specialist',
    description: 'In-person or virtual sessions aligned with MedAid-inspired concierge care.',
  },
  {
    icon: FaHandshake,
    label: 'Ongoing Follow-up',
    description: 'Digital care teams coordinate refills, lab tracking, and next visits.',
  },
]

const WorkSchedule = () => {
  return (
<section className="bg-slate-950 py-20 text-white">
 <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 
 lg:grid-cols-[1.1fr,0.9fr] lg:items-start">
 <div className="space-y-8">
<div className="space-y-4">
<p className="text-sm font-semibold uppercase tracking-[0.4em] text-cyan-300">
How We Work
</p>
<h2 className="text-3xl font-semibold leading-tight md:text-5xl">
A Comprehensive Directory For Your Healthcare Journey
</h2>
<p className="text-base text-slate-300 md:text-lg">
From the first booking to post-care follow ups, our workflow mirrors MedAid’s
polished service cadence—clear, proactive, and always human-centered.
</p>
</div>
 <div className="space-y-4">
{workflow.map(({ icon: Icon, label, description }, index) => (
<div
key={label}
className="relative flex gap-4 rounded-3xl border border-white/5 bg-white/5 p-5 
shadow-lg shadow-cyan-500/5"
>
<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl 
bg-linear-to-br from-cyan-500/30 to-blue-500/20 text-white">
<Icon size={26} />
</div>
<div>
<p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
Step {index + 1}
</p>
<h3 className="text-lg font-semibold text-white">{label}</h3>
<p className="text-sm text-slate-300">{description}</p>
</div>
</div>
))}
</div>
 </div>
<div className="relative flex flex-col justify-center">
 <div className="relative overflow-hidden rounded-3xl border border-white/10
  bg-white/5 p-4 shadow-2xl shadow-cyan-500/20">
<img
src={image2}
alt="Medical team collaborating during consultation"
className="h-full w-full rounded-2xl object-cover"
 />
<div className="absolute bottom-6 left-6 rounded-2xl bg-white/90 px-5 py-4
 text-slate-900">
<p className="text-sm font-semibold uppercase tracking-widest">Same-Day Slots</p>
<p className="text-xs text-slate-600">Emergency care and telehealth coverage 24/7</p>
</div>
</div>
<div className="absolute -bottom-8 right-6 w-3/4 max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl shadow-rose-500/10">
<img
src={image3}
alt="Doctor offering reassuring support"
className="h-full w-full rounded-2xl object-cover"/>
<div className="absolute inset-0 -z-10 rounded-3xl bg-linear-to-tr from-rose-500/20
 to-transparent blur-3xl" />
</div>
</div>
</div>
</section>
  )
}

export default WorkSchedule
