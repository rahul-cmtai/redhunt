'use client'

import Link from 'next/link'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { 
  Search, 
  Shield, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight, 
  Play,
  Star,
  Globe,
  Award,
  Target,
  Zap,
  Lock,
  BarChart3,
  Clock,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  ChevronRight,
  Menu,
  X,
  Calendar
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-red-600">RedHunt</h1>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                How it Works
              </Link>
              <Link href="#pricing" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Pricing
              </Link>
              <Link href="#contact" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Contact
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/employer/login" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Employer Login
              </Link>
              <Link href="/admin/login" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Admin Login
              </Link>
              <Link href="/demo" className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors">
                Get a Free Demo
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 via-white to-blue-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text and Buttons */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                  <Globe className="h-4 w-4 mr-2" />
                  Trusted by 500+ Companies Worldwide
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Verify Before You{' '}
                  <span className="text-red-600">Hire</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Discover how many job offers a candidate accepted but never joined. 
                  Build hiring trust with verified employer data and make smarter recruitment decisions.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/demo" className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-all duration-300 flex items-center justify-center group">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#how-it-works" className="border-2 border-red-600 text-red-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-50 transition-all duration-300 flex items-center justify-center">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Link>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="w-8 h-8 bg-gradient-to-r from-red-400 to-red-600 rounded-full border-2 border-white"></div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">Join 2,000+ HR professionals</span>
                </div>
                <div className="flex items-center space-x-1">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">4.9/5 rating</span>
                </div>
              </div>
            </div>

            {/* Right Side - Lottie Animation */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden">
                <DotLottieReact
                  src="https://lottie.host/029551e8-7520-47e1-a484-a1ee35f2d68c/OD3h8NihZn.lottie"
                  loop
                  autoplay
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Leading Companies
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of companies already using RedHunt to make smarter hiring decisions
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">50K+</div>
              <div className="text-gray-600 font-medium">Candidates Verified</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">98%</div>
              <div className="text-gray-600 font-medium">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Trusted by Industry Leaders</h2>
            <p className="text-gray-600">Join companies that trust RedHunt for their hiring decisions</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center opacity-60">
            {['TechCorp', 'FinanceFirst', 'HealthTech', 'EduSoft', 'RetailPro', 'ManufacturingCo'].map((company, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-16 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-600">{company}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Placeholder */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              See RedHunt in Action
            </h2>
            <p className="text-xl text-gray-600">
              Watch how RedHunt transforms your hiring process in just 2 minutes
            </p>
          </div>
          
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="aspect-video bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="h-8 w-8 ml-1" />
                </div>
                <h3 className="text-2xl font-bold mb-2">RedHunt Demo Video</h3>
                <p className="text-red-100">See how easy it is to verify candidates</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose RedHunt?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for modern HR teams who value transparency, efficiency, and data-driven decisions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: '100% Secure & Encrypted',
                description: 'All candidate data is encrypted and accessible only to verified employers. Your data privacy is our top priority.',
                color: 'green'
              },
              {
                icon: Zap,
                title: 'Instant Verification',
                description: 'Get candidate verification results in seconds, not days. Make informed hiring decisions quickly.',
                color: 'yellow'
              },
              {
                icon: BarChart3,
                title: 'Advanced Analytics',
                description: 'Comprehensive insights into hiring patterns, candidate behavior, and recruitment trends.',
                color: 'blue'
              },
              {
                icon: Users,
                title: 'Network Effect',
                description: 'Leverage verified data from thousands of employers to make better hiring decisions.',
                color: 'purple'
              },
              {
                icon: Target,
                title: 'Reduce No-Shows',
                description: 'Prevent repeated offer dropouts and save time and resources on unreliable candidates.',
                color: 'red'
              },
              {
                icon: Award,
                title: 'Industry Recognition',
                description: 'Trusted by leading companies and recognized for innovation in HR technology.',
                color: 'indigo'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-6`}>
                  <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book a Consultation Section */}
      <section className="py-20 bg-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Hiring Process?
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Book a free consultation with our HR experts and discover how RedHunt can help your organization hire smarter.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#contact" 
              className="bg-white text-red-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Book Free Consultation
            </Link>
            <Link 
              href="/demo" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Try Live Demo
            </Link>
          </div>
          
          <div className="mt-8 flex items-center justify-center space-x-8 text-red-100">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>30-day free trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Diverse Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-red-400 mb-4">RedHunt</h3>
                <p className="text-gray-300 leading-relaxed">
                  The leading B2B verification platform that helps employers make smarter hiring decisions with verified candidate data.
                </p>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Product</h4>
              <ul className="space-y-3">
                <li><Link href="#features" className="text-gray-300 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/demo" className="text-gray-300 hover:text-white transition-colors">Demo</Link></li>
                <li><Link href="#api" className="text-gray-300 hover:text-white transition-colors">API Documentation</Link></li>
                <li><Link href="#integrations" className="text-gray-300 hover:text-white transition-colors">Integrations</Link></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Company</h4>
              <ul className="space-y-3">
                <li><Link href="#about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#careers" className="text-gray-300 hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#press" className="text-gray-300 hover:text-white transition-colors">Press</Link></li>
                <li><Link href="#partners" className="text-gray-300 hover:text-white transition-colors">Partners</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Contact</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-red-400" />
                  <span className="text-gray-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-red-400" />
                  <span className="text-gray-300">support@redhunt.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-red-400" />
                  <span className="text-gray-300">San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm">
                © 2025 RedHunt Technologies Pvt. Ltd. All rights reserved.
              </div>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="#privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
                <Link href="#terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
                <Link href="#cookies" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</Link>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-500 text-sm">
                <span className="text-red-400 font-semibold">RedHunt</span> - Transparency. Trust. Talent.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}