import type { Metadata } from 'next'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import HeroSection from '../components/How-its-work/Hero-Section'
import FeaturesComparison from '../components/How-its-work/Features-Comparison'
import WhyChooseSection from '../components/Home/Why-Choose-Section'

export const metadata: Metadata = {
  title: 'How Red-Flagged Works | Verify Before You Hire',
  description:
    'Understand how Red-Flagged connects employers via a shared verification network to track offer-hoarders, no-shows, and risky hiring patterns across industries.',
}

export default function HowItsWork() {
  return ( 
    <div>
        <Navbar />
        <HeroSection />
        <FeaturesComparison />
        <WhyChooseSection />
        <Footer />
    </div>
  )
}