'use client'

import { Shield, Zap, BarChart3, Users, Target, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'

export default function WhyChooseSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const features = [
    {
      icon: Shield,
      title: '100% Secure & Encrypted',
      description: 'All candidate data is encrypted and accessible only to verified employers. Your data privacy is our top priority.',
      color: 'green',
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'Instant Verification',
      description: 'Get candidate verification results in seconds, not days. Make informed hiring decisions quickly.',
      color: 'yellow',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive insights into hiring patterns, candidate behavior, and recruitment trends.',
      color: 'blue',
      gradient: 'from-blue-400 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Network Effect',
      description: 'Leverage verified data from thousands of employers to make better hiring decisions.',
      color: 'purple',
      gradient: 'from-purple-400 to-pink-500'
    },
    {
      icon: Target,
      title: 'Reduce No-Shows',
      description: 'Prevent repeated offer dropouts and save time and resources on unreliable candidates.',
      color: 'red',
      gradient: 'from-red-400 to-rose-500'
    },
    {
      icon: Award,
      title: 'Industry Recognition',
      description: 'Trusted by leading companies and recognized for innovation in HR technology.',
      color: 'indigo',
      gradient: 'from-indigo-400 to-purple-500'
    }
  ]

  return (
    <section id="features" className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose RedHunt?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built for modern HR teams who value transparency, efficiency, and data-driven decisions
          </p>
        </motion.div>
        
        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-2xl transition-shadow relative overflow-hidden group"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
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
                className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-6 relative z-10`}
                whileHover={{ 
                  rotate: [0, -10, 10, -10, 0],
                  scale: 1.1
                }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  animate={{
                    y: [0, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: "easeInOut"
                  }}
                >
                  <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                </motion.div>
              </motion.div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4 relative z-10">
                {feature.title}
              </h3>
              
              <motion.p 
                className="text-gray-600 leading-relaxed relative z-10"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
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

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 right-10 w-32 h-32 bg-brand/10 rounded-full blur-3xl"
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
      </div>
    </section>
  )
}
