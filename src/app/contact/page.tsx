'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  Globe,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.red-flagged.com'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact-leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit contact form')
      }

      setSubmitSuccess(true)
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        message: ''
      })
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000)
    } catch (error: any) {
      setSubmitError(error.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-brand-100 text-brand rounded-full text-sm font-medium">
              <MessageSquare className="h-4 w-4 mr-2" />
              Get in Touch
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              We&apos;re Here to{' '}
              <span className="text-brand">Help</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Have questions about Red-Flagged? Our team is ready to assist you with demos, 
              pricing, or any other inquiries.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-1 gap-8 mb-16">
            <div className="w-full bg-gradient-to-br from-brand-50 via-white to-white p-8 rounded-3xl shadow-lg border border-brand/10 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center">
                  <Mail className="h-6 w-6 text-brand" />
                </div>
                <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wide bg-white rounded-full text-brand border border-brand/20">
                  Response in <strong className="font-bold">under 12h</strong>
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 text-sm mb-5">
                Drop us a line and one of our specialists will follow up with demo details, pricing, or technical answers.
              </p>
              <a
                href="mailto:support@red-flagged.com"
                className="inline-flex items-center gap-2 text-brand font-semibold text-base hover:text-brand-700"
              >
                support@red-flagged.com
                <ArrowRight className="h-4 w-4" />
              </a>
              <ul className="mt-6 space-y-2 text-sm text-gray-500">
                <li>• Monday – Friday, 9 AM – 7 PM IST</li>
                <li>• Enterprise onboarding assistance</li>
                <li>• Dedicated CSM for premium plans</li>
              </ul>
            </div>

         
          </div>

          {/* Main Contact Form */}
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10 w-full max-w-5xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              
              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-green-700 font-medium">Message sent successfully! We&apos;ll get back to you soon.</p>
                </div>
              )}

              {submitError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <span className="text-red-700 text-sm font-medium">{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-all"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-all"
                      placeholder="Your Company"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-all"
                    placeholder="Enter your subject"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-brand py-4 rounded-lg text-lg font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="space-y-4">
            <details className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer">
              <summary className="font-semibold text-gray-900 text-lg">
                How does Red-Flagged help prevent no-shows and offer-hoarders?
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Red-Flagged maintains a shared database across verified employers that tracks candidates who accept job offers but fail to join. When you search for a candidate, we cross-reference our database to show you their history of offer acceptances, no-show patterns, and joining behavior. This helps you identify potential risks before making a hiring decision and avoid candidates with a history of not showing up after accepting offers.
              </p>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer">
              <summary className="font-semibold text-gray-900 text-lg">
                What information does Red-Flagged track about candidates?
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Our platform tracks verified employment history, offer acceptance records, joining patterns, and any red-flagged incidents such as fraudulent activity, termination, or absconding. We also provide insights into candidates who have accepted offers but never joined, helping you make informed hiring decisions and reduce recruitment risks.
              </p>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer">
              <summary className="font-semibold text-gray-900 text-lg">
                Is candidate data secure and compliant?
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Absolutely. Red-Flagged is 100% secure and HIPAA compliant. We employ bank-level encryption, follow strict data privacy standards, and conduct regular security audits. All candidate data is handled with the highest standards of privacy and security, ensuring that sensitive information is protected at all times.
              </p>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer">
              <summary className="font-semibold text-gray-900 text-lg">
                How does the shared database work across companies?
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Red-Flagged operates as a collaborative platform where verified employers contribute and access candidate verification data. When a company adds a candidate record (such as an offer acceptance or no-show), this information becomes part of our shared database. Other verified employers can then search and view this data to make informed hiring decisions, creating a transparent ecosystem that benefits all participating companies.
              </p>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer">
              <summary className="font-semibold text-gray-900 text-lg">
                What makes a candidate "red-flagged"?
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                A candidate is red-flagged when they have a history of concerning behavior such as accepting job offers but not joining, fraudulent activity, termination for cause, or absconding from previous positions. Our platform helps you identify these patterns proactively, allowing you to avoid risky hires and make better recruitment decisions based on verified historical data.
              </p>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer">
              <summary className="font-semibold text-gray-900 text-lg">
                How can I get started with Red-Flagged?
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Getting started is easy! Simply register your company on our platform to become a verified employer. Once approved, you can start adding candidate records and searching our database for verification. Our team provides onboarding assistance to help you understand the platform and maximize its benefits. Contact us through the form above or email support@red-flagged.com to begin.
              </p>
            </details>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

