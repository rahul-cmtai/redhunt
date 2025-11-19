'use client'

import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function Banner() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="py-20 relative overflow-hidden group">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1521791055366-0d553872125f?q=80&w=1920&auto=format&fit=crop")'
        }}
      />
      {/* Soft Light Overlay (keeps image while ensuring contrast) */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-white/80 to-white/70" />
      {/* Brand Red Tint (slightly stronger on hover) */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-rose-500/15 to-red-600/20 opacity-100 group-hover:opacity-40 transition-opacity duration-500" />
      {/* Animated Background Elements */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Floating Circles in brand hue */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 bg-red-500/10 rounded-full blur-2xl"
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-40 h-40 bg-rose-500/10 rounded-full blur-2xl"
        animate={{
          y: [0, 30, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Animated Particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/30 rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: `${10 + i * 15}%`
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut"
          }}
        />
      ))}

      <motion.div 
        ref={ref}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, staggerChildren: 0.15, delayChildren: 0.2 }}
      >
        <motion.h2 
          className="text-3xl md:text-5xl font-extrabold text-red-600 mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          Stop Hiring{' '}
          <motion.span
            className="inline-block"
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut"
            }}
          >
            High-Risk Candidates?
          </motion.span>
        </motion.h2>

        <motion.p 
          className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Join 200+ companies using Red-Flagged to track candidates who accept offer letters but never join, and access shared Red-flagged database to make smarter hiring decisions.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
    <Link 
      href="/contact" 
              className="relative bg-white text-red-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-50 transition-colors inline-flex items-center justify-center group overflow-hidden shadow-xl ring-1 ring-red-200/60"
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-red-50 to-white"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10 flex items-center">
                Contact Us
                <motion.span
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
    </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
    <Link 
      href="/employer/login" 
              className="relative border-2 border-red-600/80 text-red-700 px-8 py-4 rounded-lg text-lg font-semibold bg-white/70 backdrop-blur hover:bg-white/90 transition-colors inline-flex items-center justify-center group overflow-hidden shadow-xl"
            >
              <motion.span
                className="absolute inset-0 bg-red-500/10"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">Check Red-flagged Database</span>
    </Link>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-gray-800"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {[
            { icon: CheckCircle, text: 'Real-time verification' },
            { icon: CheckCircle, text: 'Shared Red-flagged database' },
            { icon: CheckCircle, text: 'Offer letter tracking' }
          ].map((item, index) => (
            <motion.div 
              key={index}
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: index * 0.1 + 0.7, duration: 0.5 }}
              whileHover={{ scale: 1.1, x: 5 }}
            >
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2,
                  delay: index * 0.3 + 1,
                  repeat: Infinity,
                  repeatDelay: 5
                }}
              >
                <item.icon className="h-5 w-5 text-red-600" />
              </motion.div>
              <span className="font-medium">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Pulsing Border Effect in brand tone */}
        <motion.div
          className="absolute inset-0 border-4 border-red-500/20 rounded-3xl pointer-events-none"
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
</section>
  )
}
