import type { Metadata } from 'next'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import FeaturesHeroSection from '../components/Features/Features-Hero-Section'
import FeaturesGridSection from '../components/Features/Features-Grid-Section'

export const metadata: Metadata = {
  title: 'Features | Red-Flagged Candidate Verification Platform',
  description:
    'Explore Red-Flagged features: shared verification database, offer letter tracking, risk alerts, AI‑based pattern analysis, and tools to verify candidates before you hire.',
}

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