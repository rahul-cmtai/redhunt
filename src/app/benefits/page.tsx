'use client'

import Navbar from '../components/navbar'
import Footer from '../components/footer'
import BenefitsHeroSection from '../components/Benefits/Hero-Section'
import BenefitsGrid from '../components/Benefits/Benefits-Grid'
import ROICalculator from '../components/Benefits/ROI-Calculator'
import ComparisonSection from '../components/Benefits/Comparison-Section'
import BenefitsCTASection from '../components/Benefits/CTA-Section'

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
