'use client'

import Link from 'next/link'
import { Target } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'

export default function ROICalculator() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const stats = [
    {
      value: '$5k+',
      label: 'Average Annual Savings',
      sublabel: 'Based on 100 hires per year',
      color: 'text-brand',
      gradient: 'from-red-500 to-pink-500'
    },
    {
      value: '40+',
      label: 'Hours Saved Per Hire',
      sublabel: 'Through automated verification',
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      value: '70%',
      label: 'Risk Reduction',
      sublabel: 'Fewer no-shows and dropouts',
      color: 'text-green-600',
      gradient: 'from-green-500 to-emerald-500'
    }
  ]

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 bg-brand/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Calculate Your Savings
          </h2>
          <p className="text-xl text-gray-600">See how much Red-Flagged can save your organization</p>
        </motion.div>

        <motion.div 
          ref={ref}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-50/30 via-transparent to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="grid md:grid-cols-3 gap-8 text-center relative z-10">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="space-y-4 relative"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.1 }}
              >
                {/* Gradient Circle Background */}
                <motion.div
                  className={`absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl`}
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.5
                  }}
                />

                <motion.div 
                  className={`text-5xl font-bold ${stat.color} relative z-10`}
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.5,
                    ease: "easeInOut"
                  }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
                <p className="text-sm text-gray-500">{stat.sublabel}</p>
              </motion.div>
            ))}
          </div>

          
        </motion.div>
      </div>
    </section>
  )
}

