'use client'

import { CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'

export default function ComparisonSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const traditional = [
    'Manual verification takes 2-3 weeks',
    'Limited candidate history visibility',
    'High risk of no-shows (30-40%)',
    'Expensive recruitment agencies',
    'No data-driven insights'
  ]

  const redHunt = [
    'Instant verification in seconds',
    'Complete candidate employment history',
    '70% reduction in no-shows',
    'Affordable subscription pricing',
    'Advanced analytics & reporting'
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Traditional Hiring vs Red-Flagged
          </h2>
          <p className="text-xl text-gray-600">See the difference for yourself</p>
        </motion.div>

        <motion.div 
          ref={ref}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid md:grid-cols-2">
            {/* Traditional */}
            <motion.div 
              className="p-8 bg-gray-50 relative overflow-hidden"
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Traditional Hiring</h3>
              <ul className="space-y-4">
                {traditional.map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                    whileHover={{ x: 5, scale: 1.02 }}
                  >
                    <motion.div 
                      className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5"
                      whileHover={{ rotate: 180, scale: 1.2 }}
                    >
                      <span className="text-red-600 text-sm">✕</span>
                    </motion.div>
                    <span className="text-gray-600">{item}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Sad Face Animation */}
              <motion.div
                className="absolute -bottom-10 -right-10 text-8xl opacity-5"
                animate={{
                  rotate: [0, -10, 10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                😞
              </motion.div>
            </motion.div>

            {/* Red-Flagged */}
            <motion.div 
              className="p-8 bg-gradient-to-br from-brand-50 to-white relative overflow-hidden"
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Animated Background */}
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
                  backgroundImage: 'radial-gradient(circle, #ef4444 1px, transparent 1px)',
                  backgroundSize: '30px 30px'
                }}
              />

              <h3 className="text-2xl font-bold text-brand mb-6 relative z-10">With Red-Flagged</h3>
              <ul className="space-y-4 relative z-10">
                {redHunt.map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                    whileHover={{ x: -5, scale: 1.02 }}
                  >
                    <motion.div 
                      className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 mt-0.5"
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      animate={{
                        boxShadow: [
                          '0 0 0 0 rgba(239, 68, 68, 0.4)',
                          '0 0 0 10px rgba(239, 68, 68, 0)',
                        ]
                      }}
                      transition={{
                        boxShadow: {
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.3
                        }
                      }}
                    >
                      <CheckCircle className="text-brand h-4 w-4" />
                    </motion.div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Happy Face Animation */}
              <motion.div
                className="absolute -bottom-10 -right-10 text-8xl opacity-10"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🎉
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

