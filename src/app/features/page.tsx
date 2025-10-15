'use client'

import Navbar from '../components/navbar'
import Footer from '../components/footer'
import FeaturesHeroSection from '../components/Features/Features-Hero-Section'
import FeaturesGridSection from '../components/Features/Features-Grid-Section'

export default function Features() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <FeaturesHeroSection />
      <FeaturesGridSection />
      <Footer />
    </div>
  )
}