'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { Play, ShieldCheck, AlertTriangle, Users, ArrowRight } from 'lucide-react'

export default function VideoSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="relative py-20 bg-gradient-to-b from-white via-red-50/50 to-white overflow-hidden">
      {/* Decorative background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-red-200/30 blur-3xl" />
        <div className="absolute bottom-0 -right-24 h-72 w-72 rounded-full bg-rose-300/30 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-10 md:space-y-12">
          <motion.div 
            className=""
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            {/* Premium bordered card */}
            <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-red-500/30 via-rose-400/20 to-red-500/30 shadow-[0_10px_40px_-10px_rgba(244,63,94,0.35)] ring-1 ring-red-200/40">
              <div className="rounded-2xl bg-white/80 backdrop-blur px-5 sm:px-7 py-6 sm:py-8 border border-white/60">
                <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 ring-1 ring-red-200 mb-3">
                  <ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> Trusted screening platform
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
                  Red-<span className="text-red-600">Flagged</span>
                </h2>
                <p className="text-base md:text-lg text-gray-700 leading-7 md:leading-8">
                  Red-flagged.com is a platform that helps employers verify candidate's history, providing alerts for potential risks and enabling informed hiring decisions. It also empowers candidates to understand their online presence, build trust, and showcase their authenticity to potential employers. With Red-flagged.com, employers can reduce hiring risks, while candidates can take control of their digital footprint and increase their chances of landing their dream job. By promoting transparency and trust, Red-flagged.com aims to revolutionize the hiring process for both the parties.
                </p>

                {/* Feature badges */}
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-gray-800 text-xs font-medium ring-1 ring-gray-200">
                    <AlertTriangle className="h-3.5 w-3.5 text-red-600" /> Risk alerts
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-gray-800 text-xs font-medium ring-1 ring-gray-200">
                    <ShieldCheck className="h-3.5 w-3.5 text-green-600" /> Verified history
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-gray-800 text-xs font-medium ring-1 ring-gray-200">
                    <Users className="h-3.5 w-3.5 text-blue-600" /> Candidate trust
                  </span>
                </div>

                <div className="mt-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                {/* CTAs */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <a href="/How-Its-Work" className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm font-semibold shadow-sm hover:from-red-700 hover:to-rose-700 transition-colors">
                    How it works <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                 
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            ref={ref}
            className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-200 bg-white/60 backdrop-blur"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6 }}
          >
            {/* Soft glow */}
            <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-tr from-red-500/10 via-transparent to-rose-500/10 blur-xl" />

            <div className="relative aspect-video bg-black">
              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="pointer-events-none absolute w-24 h-24 rounded-full bg-red-500/30 blur-2xl" />
                <div className="relative flex items-center justify-center h-16 w-16 rounded-full bg-white/90 text-red-600 shadow-lg ring-1 ring-white/40">
                  <Play className="h-6 w-6" />
                </div>
              </div>
              <video
                src="/home.mp4"
                className="w-full h-full object-cover"
                controls
                autoPlay
                muted
                loop
                playsInline
              />
              {/* Glass header */}
              <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between bg-gradient-to-b from-black/40 to-transparent text-white">
                <span className="text-xs md:text-sm font-medium">Product Overview</span>
                <span className="text-[10px] md:text-xs opacity-80">02:00</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
