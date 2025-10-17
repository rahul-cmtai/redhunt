"use client"

import Link from 'next/link'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { Globe, ArrowRight, Play, ShieldCheck, Ban, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative group overflow-hidden bg-gradient-to-br from-brand-50 via-white to-blue-50 py-20 lg:py-32">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1521791055366-0d553872125f?q=80&w=1920&auto=format&fit=crop")'
        }}
      />
      {/* Base Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-white/80 to-white/70" />
      {/* Hover Tint Overlay (red) */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-red-500" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text and Buttons */}
          <div className="space-y-8">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-brand-100 text-brand rounded-full text-sm font-medium overflow-hidden">
                <Globe className="h-4 w-4 mr-2" />
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  Trusted by 100+ Companies Worldwide
                </motion.span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Verify Before You{' '}
                <span className="text-brand">Hire</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Discover how many job offers a candidate accepted but never joined. 
                Build hiring trust with verified employer data and make smarter recruitment decisions.
              </p>

              {/* Sliding tagline ticker */}
              <div className="h-6 overflow-hidden relative max-w-xl">
                <motion.div
                  className="space-y-1"
                  animate={{ y: [0, -24, -48, 0] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <div className="text-sm text-gray-700">Detect offer-hoarders before onboarding</div>
                  <div className="text-sm text-gray-700">Check shared blacklist across companies</div>
                  <div className="text-sm text-gray-700">Reduce no-shows and hiring risks</div>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <Link href="/demo" className="btn-brand px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center group">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#how-it-works" className="border-2 border-brand text-brand px-8 py-4 rounded-lg text-lg font-semibold hover:bg-brand-50 transition-all duration-300 flex items-center justify-center">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Link>
            </motion.div>

            {/* Premium bullet points */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-red-100 rounded-xl p-4 shadow-sm">
                <ShieldCheck className="h-5 w-5 text-red-500" />
                <div>
                  <div className="text-sm font-semibold text-gray-900">Verified History</div>
                  <div className="text-xs text-gray-600">Cross-company checks in seconds</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-red-100 rounded-xl p-4 shadow-sm">
                <Clock className="h-5 w-5 text-red-500" />
                <div>
                  <div className="text-sm font-semibold text-gray-900">No-Show Insights</div>
                  <div className="text-xs text-gray-600">Spot offer-accept but not join patterns</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-red-100 rounded-xl p-4 shadow-sm">
                <Ban className="h-5 w-5 text-red-500" />
                <div>
                  <div className="text-sm font-semibold text-gray-900">Shared Blacklist</div>
                  <div className="text-xs text-gray-600">Avoid risky hires proactively</div>
                </div>
              </div>
            </motion.div>

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
  )
}
