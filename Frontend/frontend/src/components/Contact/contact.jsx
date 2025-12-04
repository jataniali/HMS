import React from 'react'
import contactImage from '../../assets/contact.jpg'
import { Link } from 'react-router-dom'
import { MdInfo } from 'react-icons/md'
import { HiOutlineClock } from 'react-icons/hi'
import { FaInstagram, FaLinkedin, FaFacebook, FaTwitter } from 'react-icons/fa'

const locations = [
  {
    title: 'MedicaLife HQ',
    subtitle: 'Juja Road, Kiambu',
    detail: 'Suite 7, Juja Complex',
  },
  {
    title: 'Satellite Clinic',
    subtitle: 'Ngong Lane, Nairobi',
    detail: 'Level 3, Wellness Wing',
  },
]

const hours = [
  { label: 'Mon - Thu', time: '09:00 AM – 05:00 PM' },
  { label: 'Fri - Sun', time: '09:00 AM – 01:00 PM' },
]

const socials = [
  { label: 'Facebook', icon: FaFacebook },
  { label: 'Twitter', icon: FaTwitter },
  { label: 'Instagram', icon: FaInstagram },
  { label: 'LinkedIn', icon: FaLinkedin },
]

const Contact = () => {
  return (
 <section className="bg-slate-950 py-16 text-white">
<div className="relative mx-auto w-full max-w-none overflow-hidden">
        <img src={contactImage} alt="Contact MedicaLife" className="h-[360px] w-full object-cover object-center" />
        <div className="absolute inset-0 bg-linear-to-r from-cyan-950/80 via-slate-950/70 to-slate-950/60" />
        <div className="absolute inset-0 flex flex-col items-start justify-center gap-4 px-6 py-10 text-white md:px-16">
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-white/70">Get in touch</p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">Concierge support whenever you need it.</h1>
          <p className="text-sm text-white/80 md:w-2/3">
            Reach the MedicaLife coordination desk for appointments, second opinions, or a tailored care itinerary inspired by MedAid standards.
          </p>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
            <Link to="/" className="flex items-center gap-2 cursor-pointer text-white">
              Home
            </Link>
            <span className="text-white/50">/</span>
            Contact
          </p>
        </div>
</div>
<div className="mx-auto mt-16 max-w-6xl space-y-12 px-6">
<div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
<div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl 
shadow-cyan-500/10">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-cyan-300">Send a message</p>
            <h2 className="mt-2 text-3xl font-semibold">Tell us how we can help.</h2>
            <form className="mt-8 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input type="text" placeholder="Your Name" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-cyan-300 focus:outline-none" />
                <input type="email" placeholder="Your Email" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-cyan-300 focus:outline-none" />
                <input type="tel" placeholder="Your Phone" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-cyan-300 focus:outline-none" />
                <input type="text" placeholder="Your Subject" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-cyan-300 focus:outline-none" />
              </div>
              <textarea rows="4" placeholder="Your Message" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-cyan-300 focus:outline-none"></textarea>
              <button type="submit" className="w-auto rounded-2xl bg-cyan-400 px-8 py-2.5 text-sm font-bold uppercase tracking-[0.2em] text-slate-900 transition hover:bg-cyan-300">
                Send Message
              </button>
            </form>
</div>
<div className="space-y-6 h-full">
<div className="rounded-3xl border border-white/10 bg-linear-to-b from-white/5 
to-transparent p-8">
<p className="text-sm font-semibold uppercase tracking-[0.4em] text-cyan-300">
Visit us</p>
<h3 className="mt-2 text-2xl font-semibold">Let’s get in touch</h3>
 <p className="mt-3 text-sm text-slate-200">
 Concierge coordinators manage arrivals, telehealth, and medical dossier uploads so
  physicians can focus on care.
</p>
<div className="mt-6 space-y-4">
{locations.map(({ title, subtitle, detail }) => (
<div key={title} className="flex gap-3 rounded-2xl border border-white/10
 bg-white/5 p-4">
<span className="mt-1 rounded-2xl bg-cyan-500/15 p-2 text-cyan-300">
<MdInfo size={18} />
</span>
<div>
                      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">{subtitle}</p>
                      <h4 className="text-lg font-semibold text-white">{title}</h4>
                      <p className="text-sm text-slate-300">{detail}</p>
</div>
</div>
 ))}
</div>
  </div>
<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
<p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-200">
Working hours</p>
<div className="mt-4 space-y-4">
{hours.map(({ label, time }) => (
<div key={label} className="flex items-center justify-between rounded-2xl border
 border-white/10 bg-white/5 p-4">
<div className="flex items-center gap-3 text-sm text-white/80">
<HiOutlineClock />
<span>{label}</span>
</div>
<p className="text-sm font-semibold text-white">{time}</p>
  </div>
))}
</div>
 </div>
</div>
 </div>
<div className="rounded-3xl border border-white/10 bg-linear-to-r from-cyan-500/20
 via-slate-900 to-slate-950 p-8">
<div className="flex flex-col gap-4 text-center md:flex-row md:items-center 
md:justify-between md:text-left">
<div>
<p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-200">
    Follow us</p>
<h3 className="text-2xl font-semibold text-white">
Stay connected for care innovations</h3>
<p className="text-sm text-slate-200">
Real-time updates on clinics, specialists, 
and MedAid-inspired wellness drives.</p>
 </div>
<div className="flex flex-wrap justify-center gap-3 md:justify-end">
{socials.map(({ label, icon: Icon }) => (
  <button
key={label}
type="button"
aria-label={label}
className="inline-flex h-11 w-11 items-center justify-center rounded-full border
 border-white/20 bg-white/10 text-white transition hover:border-cyan-300
 hover:text-cyan-200"
>
<Icon size={16} />
 </button>
))}
</div>
</div>
 </div>
</div>
 </section>
  )
}

export default Contact
