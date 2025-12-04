import React from 'react'
import profile1 from '../../assets/profile_img_1.png'
import profile2 from '../../assets/profile_img_2.png'
import profile3 from '../../assets/profile_img.png'

const testimonialsData = [
  {
    quote:
      '“MedicaLife coordinated my entire cardiac recovery plan. The concierge team checked on me daily, just like MedAid promises.”',
    name: 'Dr. wako',
    role: 'Cardiac Surgery Patient',
    avatar: profile1,
  },
  {
    quote:
      '“Specialists, labs, and billing are all in one place. It feels like a luxury health club built for families.”',
    name: 'Samuel wanjala',
    role: 'Father of two',
    avatar: profile2,
  },
  {
    quote:
      '“Telehealth follow-ups were seamless, and they shipped my meds the same day. I’m never switching providers.”',
    name: 'Abduba',
    role: 'Chronic care member',
    avatar: profile3,
  },
]

const Testimonials = () => {
  return (
<section className="bg-slate-950 py-20 text-white">
<div className="mx-auto max-w-6xl px-6">
<div className="space-y-4 text-center">
<p className="text-sm font-semibold uppercase tracking-[0.4em] text-cyan-300">
Testimonials
</p>
<h2 className="text-3xl font-semibold leading-tight md:text-5xl">
 What patients say about us
</h2>
<p className="text-base text-slate-300 md:text-lg">
Real stories from members experiencing concierge-grade healthcare inspired by MedAid.
</p>
</div>
 <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
{testimonialsData.map(({ quote, name, role, avatar }) => (
<article
key={name}
className="relative flex h-full flex-col gap-6 rounded-3xl border border-white/5
 bg-white/5 p-6 shadow-lg shadow-cyan-500/5"
>
<p className="text-lg font-medium text-slate-100">{quote}</p>
<div className="flex items-center gap-4">
<img src={avatar} alt={name} className="h-12 w-12 rounded-full border border-white/20 
object-cover" />
<div>
<p className="text-base font-semibold text-white">{name}</p>
<p className="text-sm uppercase tracking-widest text-cyan-200">{role}</p>
</div>
</div>
<div className="absolute -top-8 right-6 hidden h-16 w-16 items-center justify-center 
rounded-full border border-white/10 bg-white/5 text-4xl text-cyan-200 md:flex">
“
</div>
</article>
))}
</div>
<div className="mt-12 rounded-3xl border border-white/10 bg-linear-to-r
 from-cyan-500/20 via-slate-900 to-slate-950 p-8 text-center">
<p className="text-lg font-semibold text-white md:text-xl">
Join 50,000+ patients enjoying premium, well-coordinated care every day.
</p>
 <button className="mt-6 rounded-full bg-cyan-400 px-10 py-3 text-sm font-bold
 uppercase tracking-widest text-slate-900 transition hover:bg-cyan-300">
Share Your Story
</button>
</div>
</div>
</section>
  )
}

export default Testimonials

