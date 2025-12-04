import React, { useState } from 'react'
import drcover1 from '../../assets/coverdoc.jpg'
import { HiArrowRight } from 'react-icons/hi2'
import Services from '../../components/Services/services.jsx'
import image2 from '../../assets/image2.jpg'
import image3 from '../../assets/image3.jpg'
import { Link } from 'react-router-dom'
const faqs = [
  {
    title: 'Can I personally meet a doctor at the clinic?',
    copy:
      'Absolutely. Our concierge desk coordinates in-person visits with the right specialist, including airport pickup for international patients.',
  },
  {
    title: 'How do I book a medical check-up?',
    copy:
      'Use the MedicaLife portal or call our 24/7 hotline. We align diagnostics, labs, and pre/post consults in a single itinerary.',
  },
  {
    title: 'How can I find the nearest MedicaLife partner hospital?',
    copy:
      'Our geo-aware app highlights nearby partner facilities and telehealth pods, with live availability for urgent cases.',
  },
  {
    title: 'What payment methods are available?',
    copy:
      'We accept major insurers, HSA cards, mobile money, and concierge billing plans managed by our finance advocates.',
  },
]
const ServiceFull = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index))
  }

  return (
<section id="services" className="bg-slate-950 py-16 text-white">
<div className="mx-auto max-w-6xl space-y-16 px-6">
<div className="relative overflow-hidden rounded-3xl">
<img src={drcover1} alt="MedicaLife doctors" className="h-[380px] w-full rounded-3xl 
object-cover object-top" />
 <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-cyan-900/80
  via-slate-900/70 to-slate-900/50" />
<div className="absolute inset-0 flex flex-col items-start justify-center gap-3 
px-8 py-10 text-white md:px-16">
<p className="text-xs font-semibold uppercase tracking-[0.5em] text-white/70">
Medical Services</p>
<h1 className="text-4xl font-bold leading-tight md:text-5xl">
    Every specialty, concierge coordinated.</h1>
<p className="flex items-center gap-2 text-xs font-semibold uppercase 
tracking-[0.3em]
 text-white/70">
<Link to="/" className="flex items-center gap-2 cursor-pointer">
    Home <HiArrowRight className="text-white" />
  </Link>
Services
</p>
</div>
</div>
<Services sectionId="services-list" />
<div className="grid gap-10 rounded-3xl border border-white/10 bg-white/5 p-8 
md:grid-cols-2 lg:grid-cols-[1.1fr,0.9fr]">
<div className="space-y-6">
 <p className="text-sm font-semibold uppercase tracking-[0.4em] text-cyan-300">
    Help & FAQ</p>
<h2 className="text-3xl font-semibold md:text-4xl">General questions</h2>
<p className="text-sm text-slate-300 md:text-base">
We combine live care advocates with smart automation to resolve questions before 
appointments begin.
</p>
<div className="space-y-4">
{faqs.map(({ title, copy }, index) => {
const isOpen = activeIndex === index
return (
<article key={title} className="rounded-3xl border border-white/10 bg-white/5">
<button
type="button"
className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
onClick={() => toggleFaq(index)}
aria-expanded={isOpen}
 >
<h3 className="text-base font-semibold text-white">{title}</h3>
<span className="text-xl text-cyan-300">{isOpen ? '−' : '+'}</span>
</button>
<div
 className={`${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden
  px-4 pb-4 text-sm text-slate-300 transition-all duration-300`}
>
{copy}
 </div>
 </article>
)
})}
 </div>
</div>
 <div className="relative flex flex-col justify-center pb-16 md:pb-0">
 <div className="relative overflow-hidden rounded-3xl border border-white/10
  bg-white/5 p-4 shadow-2xl shadow-cyan-500/20">
<img src={image2} alt="Concierge consultation" className="h-full w-full rounded-2xl 
object-cover object-top" />
<div className="absolute bottom-6 left-6 rounded-2xl bg-white/90 px-5 py-3
 text-slate-900">
<p className="text-xs font-semibold uppercase tracking-[0.4em]">24/7 hotline</p>
<p className="text-sm">+254 700 123 456</p>
</div>
</div>
<div className="absolute -bottom-10 right-6 w-4/5 max-w-sm overflow-hidden rounded-3xl 
border border-white/10 bg-white/5 p-4 shadow-xl shadow-rose-500/15">
<img src={image3} alt="Specialist support" className="h-full w-full rounded-2xl
 object-cover object-top" />
 <div className="absolute inset-0 -z-10 rounded-3xl bg-linear-to-tr from-cyan-500/20
  to-transparent blur-3xl" />
 </div>
</div>
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
 <button className="rounded-full bg-cyan-400 px-10 py-3 text-sm font-bold uppercase
  tracking-[0.4em] text-slate-900 transition hover:bg-cyan-300">
Plan My Visit
</button>
</div>
</div>
</div>
</section>
  )
}

export default ServiceFull
