import React from 'react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPhoneAlt } from 'react-icons/fa'
import { HiOutlineMail } from 'react-icons/hi'

const footerLinks = [
  {
    title: 'Departments',
    links: ['Cardiology', 'Pediatrics', 'Diagnostics', 'Emergency Care', 'Telehealth'],
  },
  {
    title: 'Support',
    links: ['FAQs', 'Insurance', 'Privacy Policy', 'Terms & Conditions', 'Careers'],
  },
]

const Footer = () => {
  return (
 <footer className="bg-slate-950 text-white">
<div className="mx-auto max-w-6xl px-6 py-16">
<div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
<div className="space-y-6 rounded-3xl border border-white/10 bg-linear-to-r
 from-cyan-500/20 via-slate-900 to-slate-950 p-8">
<p className="text-sm font-semibold uppercase tracking-[0.4em] text-cyan-200">
Newsletter
</p>
 <h3 className="text-3xl font-semibold leading-tight">
Subscribe for MedAid-inspired health insights and exclusive MedicaLife updates.
</h3>
<p className="text-sm text-slate-200">
 We deliver curated stories, care reminders, and concierge perks—no spam, just premium wellness intel.
</p>
<form className="flex flex-col gap-4 sm:flex-row">
<label className="relative flex-1">
<span className="sr-only">Email address</span>
<HiOutlineMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2
 text-slate-400" />
<input
type="email"
placeholder="Enter your email"
className="w-full rounded-full border border-white/10 bg-white/10 py-3 pl-12 pr-4 
text-sm text-white placeholder:text-slate-400 focus:border-cyan-400 
focus:outline-none"
/>
</label>
<button
 type="submit"
 className="rounded-full bg-cyan-400 px-8 py-3 text-sm font-bold uppercase 
 tracking-widest text-slate-900 transition hover:bg-cyan-300" >
Subscribe
</button>
 </form>
</div>
<div className="grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 
lg:grid-cols-2">
{footerLinks.map(({ title, links }) => (
<div key={title}>
<p className="text-sm font-semibold uppercase tracking-[0.4em] text-cyan-300">
 {title}
</p>
<ul className="mt-4 space-y-3 text-sm text-slate-300">
{links.map((link) => (
<li key={link} className="transition hover:text-white">
{link}
</li>
))}
 </ul>
</div>
))}
</div>
</div>
<div className="mt-12 grid gap-8 border-t border-white/10 pt-8 
lg:grid-cols-[1.2fr_0.8fr]">
<div className="space-y-4">
<h4 className="text-xl font-semibold text-white">MedicaLife</h4>
<p className="text-sm text-slate-300">
Delivering concierge-grade healthcare inspired by MedAid—advanced diagnostics, 24/7 specialists, and compassionate care teams.
</p>
<div className="flex gap-3 text-slate-200">
{[FaFacebookF, FaInstagram, FaLinkedinIn].map((Icon) => (
<button
key={Icon.name}
className="flex h-10 w-10 items-center justify-center rounded-full border
 border-white/10 bg-white/5 transition hover:border-cyan-400 hover:text-cyan-300"
type="button"
aria-label={`Visit our ${Icon.name.replace('Fa', '')}`}
>
<Icon size={16} />
</button>
))}
</div>
</div>
<div className="space-y-4 text-sm text-slate-300">
<div className="flex items-center gap-3">
<FaPhoneAlt className="text-cyan-300" />
<span>24/7 Careline: +254 700 123 456</span>
</div>
<div className="flex items-center gap-3">
<HiOutlineMail className="text-cyan-300" />
<span>support@medicalife.com</span>
</div>
<p>Upper Hill Medical Plaza, Nairobi, Kenya</p>
</div>
</div>
<p className="mt-12 text-center text-xs uppercase tracking-[0.4em] text-slate-500">
© {new Date().getFullYear()} MedicaLife. All rights reserved.
</p>
</div>
</footer>
  )
}

export default Footer
