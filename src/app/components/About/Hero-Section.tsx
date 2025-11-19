'use client'

import { Globe, Users, Shield, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function AboutHeroSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="relative py-20 overflow-hidden group bg-gray-900">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=80")',
        }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/85 to-gray-900/75" />
      {/* Red Accent Tint */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 via-red-400/10 to-red-400/20 opacity-100 group-hover:opacity-35 transition-opacity duration-500" />
      
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
      
      {/* Floating Circles */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
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
        className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
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
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, staggerChildren: 0.15, delayChildren: 0.2 }}
      >
        <motion.div 
          className="inline-flex items-center px-6 py-3 bg-red-400/20 text-red-400 rounded-full text-sm font-medium mb-6 border border-red-400/30"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          <Globe className="h-5 w-5 mr-2" />
          About Red-Flagged
        </motion.div>

        <motion.h1 
          className="text-4xl md:text-6xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          Hire with Trust, Verify with{' '}
          <motion.span
            className="inline-block text-red-400"
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
            Red-Flagged
          </motion.span>
        </motion.h1>

        <motion.p 
          className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          With Red-Flagged, you can verify candidate history, identify potential red flags, and hire with confidence. Our goal is to transform the hiring process, one background check at a time. By providing accurate and reliable information, we help businesses like yours thrive.
        </motion.p>
        
        {/* Feature Stats */}
        <motion.div 
          className="flex flex-wrap justify-center gap-6 pt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {[
            { icon: Users, text: '200+ Companies', subtext: 'Trust Red-Flagged' },
            { icon: Shield, text: '20K+ Profiles', subtext: 'Verified Daily' },
            { icon: CheckCircle, text: '98% Accuracy', subtext: 'Reliable Data' }
          ].map((item, index) => (
            <motion.div 
              key={index}
              className="flex items-center space-x-3 bg-gray-800/80 backdrop-blur-sm border border-red-400/30 rounded-xl p-4 shadow-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -2 }}
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
                <item.icon className="h-6 w-6 text-red-400" />
              </motion.div>
              <div>
                <div className="font-semibold text-white">{item.text}</div>
                <div className="text-sm text-gray-300">{item.subtext}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pulsing Border Effect */}
        <motion.div
          className="absolute inset-0 border-4 border-red-400/20 rounded-3xl pointer-events-none"
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
