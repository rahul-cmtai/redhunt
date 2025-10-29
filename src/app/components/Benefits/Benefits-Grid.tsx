'use client'

import { 
  TrendingDown, 
  Clock, 
  DollarSign, 
  BarChart3, 
  Shield, 
  Zap,
  CheckCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'

export default function BenefitsGrid() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const benefits = [
    {
      icon: TrendingDown,
      title: '70% Reduction in Hiring Risks',
      description: 'Identify candidates with a history of no-shows and offer dropouts before making an offer.',
      gradient: 'from-red-500 to-pink-500',
      bgGradient: 'from-brand-50 to-white',
      iconBg: 'bg-brand-100',
      iconColor: 'text-brand',
      checkColor: 'text-brand',
      features: [
        'Verified offer acceptance data',
        'Historical joining records',
        'Employer feedback scores'
      ]
    },
    {
      icon: Clock,
      title: 'Save 40+ Hours Per Hire',
      description: 'Streamline your verification process with instant access to candidate history.',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-white',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      checkColor: 'text-blue-600',
      features: [
        'Instant verification results',
        'Automated background checks',
        'Real-time data updates'
      ]
    },
    {
      icon: DollarSign,
      title: 'Reduce Costs by 60%',
      description: 'Lower recruitment costs by avoiding bad hires and reducing time-to-hire.',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-white',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      checkColor: 'text-green-600',
      features: [
        'Fewer failed hires',
        'Lower turnover rates',
        'Optimized recruitment spend'
      ]
    },
    {
      icon: BarChart3,
      title: 'Data-Driven Insights',
      description: 'Make informed decisions with comprehensive analytics and reporting.',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-white',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      checkColor: 'text-purple-600',
      features: [
        'Advanced analytics dashboard',
        'Custom reports and metrics',
        'Trend analysis and forecasting'
      ]
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and compliance with global data protection standards.',
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-50 to-white',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      checkColor: 'text-yellow-600',
      features: [
        '256-bit encryption',
        'GDPR & SOC2 compliant',
        'Regular security audits'
      ]
    },
    {
      icon: Zap,
      title: 'Instant Verification',
      description: 'Get verification results in seconds, not days or weeks.',
      gradient: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-50 to-white',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      checkColor: 'text-indigo-600',
      features: [
        'Real-time database checks',
        'Automated verification',
        'API integration available'
      ]
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Red-Flagged?
          </h2>
          <p className="text-xl text-gray-600">Comprehensive benefits designed for modern HR teams</p>
        </motion.div>

        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className={`bg-gradient-to-br ${benefit.bgGradient} p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden group`}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              {/* Animated Gradient Background */}
              <motion.div
                className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-30 blur-3xl transition-opacity duration-500`}
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
                className={`w-14 h-14 ${benefit.iconBg} rounded-xl flex items-center justify-center mb-6 relative z-10`}
                whileHover={{ scale: 1.2 }}
                animate={{
                  y: [0, -8, 0]
                }}
                transition={{
                  duration: 2 + index * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <benefit.icon className={`h-7 w-7 ${benefit.iconColor}`} />
              </motion.div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4 relative z-10">
                {benefit.title}
              </h3>

              <p className="text-gray-600 leading-relaxed mb-4 relative z-10">
                {benefit.description}
              </p>

              <ul className="space-y-2 text-sm text-gray-600 relative z-10">
                {benefit.features.map((feature, featureIndex) => (
                  <motion.li
                    key={featureIndex}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.1 + featureIndex * 0.1 + 0.3 }}
                    whileHover={{ x: 5 }}
                  >
                    <CheckCircle className={`h-4 w-4 ${benefit.checkColor} flex-shrink-0`} />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>

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

