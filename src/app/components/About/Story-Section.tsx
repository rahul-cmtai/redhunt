'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'

export default function StorySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const stories = [
    {
      number: '1',
      title: 'The Problem',
      description: 'In 2023, our founders witnessed countless companies struggling with candidates who accepted offers but never joined, or left within days. The hiring process was broken, costly, and filled with uncertainty.',
      gradient: 'from-red-500 to-pink-500'
    },
    {
      number: '2',
      title: 'The Solution',
      description: 'We created Red-Flagged - a platform where employers could share and access verified candidate data, revealing patterns of no-shows, offer dropouts, and unreliable candidates before making hiring decisions.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      number: '3',
      title: 'The Impact',
      description: 'Today, over 500+ companies trust Red-Flagged to verify 50,000+ candidates annually. We\'ve helped organizations reduce hiring risks by 70% and save millions in recruitment costs.',
      gradient: 'from-green-500 to-emerald-500'
    }
  ]

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-brand/10 rounded-full blur-3xl"
        animate={{
          y: [0, 50, 0],
          x: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Story</h2>
          <p className="text-xl text-gray-600">How Red-Flagged came to be</p>
        </motion.div>
        
        <div ref={ref} className="space-y-8">
          {stories.map((story, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden group"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              {/* Gradient Background */}
              <motion.div
                className={`absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br ${story.gradient} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500`}
              />

              <div className="flex items-start gap-4 relative z-10">
                <motion.div 
                  className={`w-12 h-12 bg-gradient-to-br ${story.gradient} rounded-full flex items-center justify-center flex-shrink-0 shadow-lg`}
                  whileHover={{ 
                    rotate: 360,
                    scale: 1.2
                  }}
                  transition={{ duration: 0.6, type: "spring" }}
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(239, 68, 68, 0.4)',
                      '0 0 0 20px rgba(239, 68, 68, 0)',
                    ]
                  }}
                  style={{
                    transition: 'box-shadow 1.5s infinite'
                  }}
                >
                  <span className="text-white font-bold text-xl">{story.number}</span>
                </motion.div>

                <div className="flex-1">
                  <motion.h3 
                    className="text-xl font-semibold text-gray-900 mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ delay: index * 0.2 + 0.3 }}
                  >
                    {story.title}
                  </motion.h3>
                  <motion.p 
                    className="text-gray-600 leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ delay: index * 0.2 + 0.4 }}
                  >
                    {story.description}
                  </motion.p>
                </div>
              </div>

              {/* Progress Line */}
              {index < stories.length - 1 && (
                <motion.div
                  className="absolute bottom-0 left-10 w-0.5 h-8 bg-gradient-to-b from-brand to-transparent"
                  initial={{ height: 0 }}
                  animate={isInView ? { height: 32 } : { height: 0 }}
                  transition={{ delay: index * 0.2 + 0.5, duration: 0.3 }}
                />
              )}

              {/* Shine Effect */}
              <motion.div
                className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 group-hover:left-full transition-all duration-1000"
                style={{ transform: 'skewX(-20deg)' }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

