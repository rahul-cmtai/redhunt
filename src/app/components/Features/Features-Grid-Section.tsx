'use client'

import {
  Shield,
  Zap,
  BarChart3,
  Users,
  Lock,
  Search,
  FileCheck,
  Globe,
  Clock,
  Target,
  Award,
  TrendingUp
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'

export default function FeaturesGridSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const features = [
    {
      icon: Zap,
      title: 'Instant Verification',
      description: 'Get real-time candidate verification results in seconds. Our automated system checks multiple databases simultaneously for instant insights.',
      gradient: 'from-yellow-500 to-orange-500',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: '256-bit encryption, SOC2 compliant, and GDPR ready. Your data is protected with military-grade security protocols.',
      gradient: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive dashboards with real-time insights, custom reports, and predictive analytics for smarter hiring decisions.',
      gradient: 'from-purple-500 to-pink-500',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      icon: Users,
      title: 'Network Effect',
      description: 'Access verified data from thousands of employers. The more companies join, the more comprehensive our database becomes.',
      gradient: 'from-green-500 to-emerald-500',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Advanced search filters with AI-powered recommendations. Find exactly what you need with intelligent query suggestions.',
      gradient: 'from-indigo-500 to-purple-500',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'Complete control over your data with granular permissions. We never share data without explicit consent.',
      gradient: 'from-red-500 to-pink-500',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    {
      icon: FileCheck,
      title: 'Automated Reports',
      description: 'Generate comprehensive verification reports automatically. Export in multiple formats with customizable templates.',
      gradient: 'from-teal-500 to-cyan-500',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600'
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Verify candidates across 50+ countries with localized compliance and multi-language support.',
      gradient: 'from-blue-500 to-indigo-500',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: Clock,
      title: 'Real-Time Updates',
      description: 'Get instant notifications when new data becomes available. Never miss important candidate updates.',
      gradient: 'from-orange-500 to-red-500',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      icon: Target,
      title: 'Precision Matching',
      description: 'AI-powered candidate matching based on historical patterns and behavior. Reduce no-shows by 70%.',
      gradient: 'from-pink-500 to-rose-500',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600'
    },
    {
      icon: Award,
      title: 'Quality Scores',
      description: 'Proprietary algorithm rates candidate reliability based on employment history and employer feedback.',
      gradient: 'from-violet-500 to-purple-500',
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600'
    },
    {
      icon: TrendingUp,
      title: 'Trend Analysis',
      description: 'Identify hiring patterns and market trends with historical data analysis and predictive modeling.',
      gradient: 'from-emerald-500 to-green-500',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    }
  ]

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <motion.div
        className="absolute top-40 right-20 w-64 h-64 bg-brand/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Feature Set
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to make confident, data-driven hiring decisions
          </p>
        </motion.div>

        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden group border border-gray-100"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -15,
                scale: 1.03,
                transition: { duration: 0.3 }
              }}
            >
              {/* Gradient Background on Hover */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />

              {/* Rotating Border Effect */}
              <motion.div
                className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 blur-3xl`}
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />

              <motion.div 
                className={`w-14 h-14 ${feature.iconBg} rounded-xl flex items-center justify-center mb-6 relative z-10`}
                whileHover={{ 
                  rotate: [0, -15, 15, -15, 0],
                  scale: 1.15
                }}
                animate={{
                  y: [0, -10, 0]
                }}
                transition={{
                  duration: 3 + index * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                >
                  <feature.icon className={`h-7 w-7 ${feature.iconColor}`} />
                </motion.div>
              </motion.div>

              <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">
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

              {/* Corner Decoration */}
              <motion.div
                className={`absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.gradient} opacity-5 rounded-tl-full`}
                whileHover={{ scale: 1.5, opacity: 0.1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Shine Effect */}
              <motion.div
                className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 group-hover:left-full transition-all duration-1000"
                style={{ transform: 'skewX(-20deg)' }}
              />

              {/* Particle Effects */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-1 h-1 bg-gradient-to-br ${feature.gradient} rounded-full opacity-0 group-hover:opacity-70`}
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${15 + i * 20}%`
                  }}
                  animate={{
                    y: [0, -40, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                />
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

