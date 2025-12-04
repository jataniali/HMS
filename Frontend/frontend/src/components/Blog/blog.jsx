import React from 'react'
import image4 from '../../assets/image4.jpg'
import image5 from '../../assets/image5.jpg'
import image6 from '../../assets/image6.jpg'
import { HiArrowRight } from 'react-icons/hi'

const articles = [
  {
    category: 'Health',
    title: 'Best Medical Network Directory For Physicians & Clients',
    summary:
      'Inside access to MedicaLife’s curated physician network plus concierge scheduling support.',
    image: image4,
  },
  {
    category: 'Medical',
    title: 'Why Primary Health Care Is Essential For Modern Families',
    summary:
      'Preventive checkups and digital vitals monitoring inspired by MedAid’s whole-family plan.',
    image: image5,
  },
  {
    category: 'Insight',
    title: '6 Tips to Protect Your Mental Health When You’re Sick',
    summary:
      'Mindfulness coaches, teletherapy, and rest protocols recommended by our specialists.',
    image: image6,
  },
]

const Blog = () => {
  return (
<section className="bg-slate-950 py-20 text-white">
<div className="mx-auto max-w-6xl px-6">
 <div className="space-y-4 text-center">
<p className="text-sm font-semibold uppercase tracking-[0.4em] text-cyan-300">
 Our Blog
</p>
<h2 className="text-3xl font-semibold leading-tight md:text-5xl">
Latest News & Articles
</h2>
<p className="text-base text-slate-300 md:text-lg">
Curated stories inspired by MedAid, spotlighting premium care, innovation,
 and lifestyle tips.
</p>
</div>
<div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
{articles.map(({ category, title, summary, image }) => (
<article key={title} className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-lg shadow-cyan-500/10">
<div className="relative h-60 w-full overflow-hidden">
<img src={image} alt={title} className="h-full w-full object-cover" />
<span className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-900">
{category}
</span>
</div>
<div className="flex flex-1 flex-col gap-4 px-6 py-6">
<h3 className="text-xl font-semibold text-white">{title}</h3>
<p className="text-sm text-slate-300">{summary}</p>
<button className="mt-auto inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-cyan-300">
Read More <HiArrowRight size={16} />
</button>
</div>
</article>
))}
</div>
<div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-3xl 
border border-white/10 bg-linear-to-r from-cyan-500/20 via-slate-900 to-slate-950 px-8 py-6">
<div>
 <p className="text-sm font-semibold uppercase tracking-[0.4em] text-cyan-200">Subscribe</p>
<h3 className="text-2xl font-semibold text-white">Weekly MedicaLife intelligence, direct to your inbox.</h3>
</div>
<button className="rounded-full bg-cyan-400 px-10 py-3 text-sm font-bold uppercase 
tracking-widest text-slate-900 transition hover:bg-cyan-300">
View All Articles
</button>
</div>
</div>
</section>
  )
}

export default Blog
