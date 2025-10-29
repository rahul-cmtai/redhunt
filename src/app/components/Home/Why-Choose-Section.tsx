'use client'

import { Shield, Zap, BarChart3, Users, Target, Award, CheckCircle, TrendingUp, Database } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'

export default function WhyChooseSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const features = [
    {
      icon: Shield,
      title: 'Comprehensive Background Checks',
      description: 'Get detailed insights into candidate history, employment patterns, and reliability indicators to make informed decisions.',
      color: 'green',
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      icon: BarChart3,
      title: 'Advanced Pattern Analysis',
      description: 'AI-powered analysis of hiring patterns, candidate behavior, and recruitment trends to predict success rates.',
      color: 'blue',
      gradient: 'from-blue-400 to-cyan-500'
    },
    {
      icon: Target,
      title: 'Track Offer Letter Dropouts',
      description: 'Identify candidates who accept offer letters but never join, preventing repeated hiring mistakes.',
      color: 'red',
      gradient: 'from-red-400 to-rose-500'
    },
    {
      icon: Database,
      title: 'Shared Data Network',
      description: 'Access verified data from thousands of employers to make smarter hiring decisions based on collective insights.',
      color: 'purple',
      gradient: 'from-purple-400 to-pink-500'
    },
    {
      icon: TrendingUp,
      title: 'Smarter Workforce',
      description: 'Build a more reliable workforce by leveraging comprehensive data and pattern analysis for better candidate selection.',
      color: 'indigo',
      gradient: 'from-indigo-400 to-purple-500'
    },
    {
      icon: Users,
      title: 'Leading Companies Trust Us',
      description: 'Join industry leaders who use Red-flagged.com to track unreliable candidates and access shared hiring intelligence.',
      color: 'yellow',
      gradient: 'from-yellow-400 to-orange-500'
    }
  ]

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Red-flagged.com?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Make Better Hiring Decisions: Comprehensive Background Checks and Pattern Analysis for a Smarter Workforce
          </p>
          <p className="text-lg text-gray-500 max-w-4xl mx-auto">
            Join leading companies using Red-flagged.com to track candidates who accept offer letters but never join, and access shared data on Red-flagged.com to make smarter hiring decisions
          </p>
        </motion.div>
        
        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden group border border-gray-100"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              whileHover={{ 
                y: -15,
                scale: 1.02,
                transition: { duration: 0.3, type: "spring", stiffness: 300 }
              }}
            >
              {/* Gradient Background on Hover */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />

              {/* Animated Border */}
              <motion.div
                className={`absolute -top-1 -left-1 w-20 h-20 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
                animate={{
                  scale: [1, 1.5, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />

              <motion.div 
                className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 relative z-10 shadow-lg`}
                whileHover={{ 
                  rotate: [0, -5, 5, -5, 0],
                  scale: 1.15
                }}
                transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
              >
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.3,
                    ease: "easeInOut"
                  }}
                >
                  <feature.icon className="h-8 w-8 text-white drop-shadow-lg" />
                </motion.div>
                
                {/* Pulsing Ring */}
                <motion.div
                  className={`absolute inset-0 rounded-2xl border-2 border-white/30`}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                />
              </motion.div>

              <motion.h3 
                className="text-xl font-bold text-gray-900 mb-4 relative z-10 group-hover:text-gray-800 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              >
                {feature.title}
              </motion.h3>
              
              <motion.p 
                className="text-gray-600 leading-relaxed relative z-10 group-hover:text-gray-700 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
              >
                {feature.description}
              </motion.p>

              {/* Shine Effect */}
              <motion.div
                className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 group-hover:left-full transition-all duration-1000"
                style={{ transform: 'skewX(-20deg)' }}
              />
            </motion.div>
          ))}
        </div>

        {/* Floating Background Elements */}
        <motion.div
          className="absolute top-20 right-10 w-32 h-32 bg-red-400/10 rounded-full blur-3xl"
          animate={{
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-20 left-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-400/10 rounded-full blur-2xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </section>
  )
}
