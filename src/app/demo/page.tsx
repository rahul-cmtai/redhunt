'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, CheckCircle, AlertTriangle, ArrowRight, Play, Users, Shield, TrendingUp } from 'lucide-react'

export default function DemoPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [isSearching, setIsSearching] = useState(false)

  const handleDemoSearch = () => {
    setIsSearching(true)
    // Simulate search delay
    setTimeout(() => {
      setSearchResult({
        found: true,
        candidate: 'Rajesh Kumar',
        uan: 'UAN-854392',
        offers: 3,
        notJoined: 2,
        lastCompany: 'AlphaTech Pvt. Ltd.',
        lastDate: 'August 2025',
        verifiedBy: 3,
        details: [
          { company: 'AlphaTech Pvt. Ltd.', position: 'Software Engineer', status: 'Not Joined', date: 'Aug 2025' },
          { company: 'BetaCorp Inc.', position: 'Senior Developer', status: 'Not Joined', date: 'Jun 2025' },
          { company: 'GammaTech Solutions', position: 'Full Stack Developer', status: 'Joined', date: 'Mar 2025' }
        ]
      })
      setIsSearching(false)
    }, 2000)
  }

  const features = [
    {
      icon: Search,
      title: 'Instant Verification',
      description: 'Search candidates by UAN, email, or phone number to get instant joining history.',
      demo: 'Try searching for "UAN-854392" to see how it works.'
    },
    {
      icon: Shield,
      title: 'Verified Data',
      description: 'All records are verified by multiple employers and encrypted for security.',
      demo: 'See how we verify each record with employer confirmation.'
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Get insights into hiring patterns and candidate behavior trends.',
      demo: 'View comprehensive analytics and reporting features.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-red-600">RedHunt</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/employer/login" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium">
                Employer Login
              </Link>
              <Link href="/admin/login" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Try RedHunt <span className="text-red-600">Live Demo</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Experience how RedHunt helps you verify candidates before making offers.
              See the power of verified employer data in action.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Interactive Candidate Verification
            </h2>
            <p className="text-xl text-gray-600">
              Try our search functionality with sample data
            </p>
          </div>

          {/* Demo Search Interface */}
          <div className="bg-white rounded-xl shadow-2xl p-8 mb-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Candidate Record</h3>
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter UAN, Email, or Phone (try: UAN-854392)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <button
                  onClick={handleDemoSearch}
                  disabled={isSearching}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      Search
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Search Results */}
            {searchResult && (
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Search className="h-5 w-5 text-green-500 mr-2" />
                  <span className="font-semibold text-gray-900">Candidate Found</span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Candidate Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{searchResult.candidate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">UAN:</span>
                        <span className="font-medium">{searchResult.uan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Offers:</span>
                        <span className="font-medium">{searchResult.offers} accepted</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Not Joined:</span>
                        <span className="font-medium text-red-600">{searchResult.notJoined} offers</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Verified by:</span>
                        <span className="font-medium">{searchResult.verifiedBy} employers</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Offer History</h4>
                    <div className="space-y-2">
                      {searchResult.details.map((detail, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                          <div>
                            <p className="font-medium text-sm">{detail.company}</p>
                            <p className="text-xs text-gray-500">{detail.position}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              detail.status === 'Joined' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {detail.status}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">{detail.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Verification Alert</p>
                      <p className="text-sm text-yellow-700">
                        This candidate has a history of accepting offers but not joining. 
                        Consider this information when making your hiring decision.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!searchResult && !isSearching && (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Enter a UAN, email, or phone number to search for candidate records</p>
                <p className="text-sm mt-2">Try: UAN-854392, rajesh@email.com, or +91 98765 43210</p>
              </div>
            )}
          </div>

          {/* Demo Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <p className="text-sm text-red-600 font-medium">{feature.demo}</p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="bg-red-600 rounded-xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Hiring Process?</h3>
            <p className="text-red-100 mb-6">
              Join hundreds of companies already using RedHunt to make smarter hiring decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/employer/register" 
                className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Start Free Trial
              </Link>
              <Link 
                href="/contact" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors"
              >
                Schedule Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Trusted by Leading Companies
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
              {['AlphaTech', 'BetaCorp', 'GammaTech', 'DeltaInc'].map((company, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">{company}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-red-400 mb-4">RedHunt</h3>
            <p className="text-gray-400 mb-6">Transparency. Trust. Talent.</p>
            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-400">
                © 2025 RedHunt Technologies Pvt. Ltd. | All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
