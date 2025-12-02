import type { Metadata } from 'next'
import Navbar from './components/navbar'
import Footer from './components/footer'
import Hero from './components/Home/Hero'
import StatsSection from './components/Home/Stats-Section'
import ClientSection from './components/Home/Client-Section'
import VideoSection from './components/Home/Video-Section'
import WhyChooseSection from './components/Home/Why-Choose-Section'
import Testimonial from './components/Home/Testimonial'
import Banner from './components/Home/Banner'

export const metadata: Metadata = {
  title: 'Red-Flagged | Verify Candidates Before You Hire',
  description:
    'Red-Flagged is a trusted B2B verification platform that helps employers detect offer-hoarders, track no-shows, and verify candidate history using a shared, secure database.',
}

export default function Home() {
  return (
    <div>
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Book a Consultation Section */}
      <Banner />

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

      

      {/* Diverse Footer */}
      <Footer />
    </div>
  )
}