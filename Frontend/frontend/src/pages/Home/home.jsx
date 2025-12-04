import React from 'react'
import Hero from '../Hero/hero'
import About from '../../components/About/about.jsx'
import Services from '../../components/Services/services.jsx'
import WorkSchedule from '../../components/Services/workschedule.jsx'
import Testimonials from '../../components/Testimonials/testimonials.jsx'
import Blog from '../../components/Blog/blog.jsx'
const home = () => {
  return (
<div id='home'>
<Hero/>
<About/>
<Services/>
<WorkSchedule/>
<Testimonials/>
<Blog/>
</div>
  )
}

export default home
