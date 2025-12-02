import type { Metadata } from 'next'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import AboutHeroSection from '../components/About/Hero-Section'
import MissionVision from '../components/About/Mission-Vision'
import StorySection from '../components/About/Story-Section'
import ValuesSection from '../components/About/Values-Section'
import AboutCTASection from '../components/About/CTA-Section'

export const metadata: Metadata = {
  title: 'About Red-Flagged | Transparency. Trust. Talent.',
  description:
    'Learn how Red-Flagged was created to solve the problem of offer dropouts, no-shows, and unreliable hiring by building a transparent verification network for employers and candidates.',
}

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
