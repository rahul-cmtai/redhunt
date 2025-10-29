"use client"

import Link from 'next/link'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { Globe, ArrowRight, Play, ShieldCheck, Ban, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative group overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black py-20 lg:py-32 w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1521791055366-0d553872125f?q=80&w=1920&auto=format&fit=crop")'
        }}
      />
      {/* Base Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/85 to-gray-800/85" />
      {/* Hover Tint Overlay (red) */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-500 bg-red-500" />

      <div className="relative w-full px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text and Buttons */}
          <div className="space-y-8">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-sm font-medium overflow-hidden">
                <Globe className="h-4 w-4 mr-2" />
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  Trusted by 100+ Companies Worldwide
                </motion.span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Verify Before You{' '}
                <span className="text-red-400">Hire</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                Uncover the truth about candidates who accept job offers but never show up. Our platform provides employment data to help you build trust and make smarter recruitment decisions. Get insights into a candidate's past, including any history of fraudulent activity, termination, or absconding, to ensure you're hiring the right person for the job.
              </p>

              {/* Sliding tagline ticker */}
              <div className="h-6 overflow-hidden relative max-w-xl">
                <motion.div
                  className="space-y-1"
                  animate={{ y: [0, -24, -48, 0] }}
                  // transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <div className="text-sm text-gray-300">Detect offer-hoarders before onboarding</div>
                  <div className="text-sm text-gray-300">Check shared Red-flagged database across companies</div>
                  <div className="text-sm text-gray-300">Reduce no-shows and hiring risks</div>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <Link href="/employer/register" className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center group">
                Join Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact" className="border-2 border-red-400 text-red-400 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-500/10 transition-all duration-300 flex items-center justify-center">
                <Play className="mr-2 h-5 w-5" />
                Contact Us
              </Link>
            </motion.div>

            {/* Premium bullet points */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <div className="flex items-center gap-3 bg-gray-800/80 backdrop-blur-sm border border-red-500/30 rounded-xl p-4">
                <ShieldCheck className="h-5 w-5 text-red-400" />
                <div>
                  <div className="text-sm font-semibold text-white">No-show insights</div>
                  <div className="text-xs text-gray-300">Spot "offer-accepted but not joined" Patterns</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-800/80 backdrop-blur-sm border border-red-500/30 rounded-xl p-4">
                <Clock className="h-5 w-5 text-red-400" />
                <div>
                  <div className="text-sm font-semibold text-white">Red-flagged Candidates</div>
                  <div className="text-xs text-gray-300">Avoid Risky hires Proactively</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-800/80 backdrop-blur-sm border border-red-500/30 rounded-xl p-4">
                <Ban className="h-5 w-5 text-red-400" />
                <div>
                  <div className="text-sm font-semibold text-white">Candidate's Version</div>
                  <div className="text-xs text-gray-300">Know the reason why candidate declined the offer</div>
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
