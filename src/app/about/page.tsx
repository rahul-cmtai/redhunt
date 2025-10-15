'use client'

import Navbar from '../components/navbar'
import Footer from '../components/footer'
import AboutHeroSection from '../components/About/Hero-Section'
import MissionVision from '../components/About/Mission-Vision'
import StorySection from '../components/About/Story-Section'
import ValuesSection from '../components/About/Values-Section'
import AboutCTASection from '../components/About/CTA-Section'

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <AboutHeroSection />

      {/* Mission & Vision */}
      <MissionVision />

      {/* Our Story */}
      <StorySection />

      {/* Values */}
      <ValuesSection />

      {/* CTA Section */}
      <AboutCTASection />

      <Footer />
    </div>
  )
}
