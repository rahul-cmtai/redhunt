import Navbar from '../components/navbar'
import Footer from '../components/footer'
import HeroSection from '../components/How-its-work/Hero-Section'
import FeaturesComparison from '../components/How-its-work/Features-Comparison'
import WhyChooseSection from '../components/Home/Why-Choose-Section'

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