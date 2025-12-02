import type { Metadata } from 'next'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import BenefitsHeroSection from '../components/Benefits/Hero-Section'
import BenefitsGrid from '../components/Benefits/Benefits-Grid'
import ROICalculator from '../components/Benefits/ROI-Calculator'
import ComparisonSection from '../components/Benefits/Comparison-Section'
import BenefitsCTASection from '../components/Benefits/CTA-Section'

export const metadata: Metadata = {
  title: 'Benefits | Reduce No‑Shows & Hiring Risk with Red-Flagged',
  description:
    'See how Red-Flagged helps HR teams cut offer dropouts, avoid repeat no-shows, and improve hiring success rates using verified candidate data and pattern analysis.',
}

export default function Benefits() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <BenefitsHeroSection />

      {/* Key Benefits Grid */}
      <BenefitsGrid />

      {/* ROI Calculator Preview */}
      <ROICalculator />

      {/* Feature Comparison */}
      <ComparisonSection />

      {/* CTA Section */}
      <BenefitsCTASection />

      <Footer />
    </div>
  )
}
