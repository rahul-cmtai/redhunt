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
      description: 'The Red-Flagged Story: Over the years, we witnessed first-hand the struggles of companies grappling with uncertainties in hiring. Countless businesses were plagued by candidates who would accept job offers only to vanish on their start date or leave shortly after joining. The broken hiring process was not only costly but also filled with uncertainty, leaving companies wondering if they had made the right hire. This lack of transparency and reliability was a pervasive issue across industries. We felt that controlled measures needed to be introduced.',
      gradient: 'from-red-500 to-pink-500'
    },
    {
      number: '2',
      title: 'The Solution',
      description: 'Driven by a passion to revolutionize the hiring process, we embarked on a mission to create a solution. We pooled our expertise, conducted extensive research, and worked tirelessly to develop a platform that brings transparency and reliability to the forefront of hiring. And thus, Red-flagged.com was born. With a mission to empower businesses to make informed hiring decisions, Red-flagged set out to transform the way companies discover, verify, and hire talent. Today, we\'re proud to be a trusted partner for businesses, helping them mitigate risk and build trustworthy teams.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      number: '3',
      title: 'The Impact',
      description: 'Within a short span, we have created a significant impact in the industry and transformed the hiring cycle. Today, over 100+ companies trust Red-flagged.com to verify 20,000+ candidates annually. We\'ve helped organizations reduce hiring risks by 70% and save millions in recruitment costs.',
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

