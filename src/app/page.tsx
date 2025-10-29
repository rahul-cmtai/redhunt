'use client'

import Navbar from './components/navbar'
import Footer from './components/footer'
import Hero from './components/Home/Hero'
import StatsSection from './components/Home/Stats-Section'
import ClientSection from './components/Home/Client-Section'
import VideoSection from './components/Home/Video-Section'
import WhyChooseSection from './components/Home/Why-Choose-Section'
import Testimonial from './components/Home/Testimonial'
import Banner from './components/Home/Banner'

export default function Home() {
  return (
    <div>
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <StatsSection />

      {/* Clients Section */}
      <ClientSection />

      {/* Video Placeholder */}
      <VideoSection />

      {/* Why Us Section */}
      <WhyChooseSection />

      {/* Testimonials Section */}
      <Testimonial />

      {/* Book a Consultation Section */}
      <Banner />

      {/* Diverse Footer */}
      <Footer />
    </div>
  )
}