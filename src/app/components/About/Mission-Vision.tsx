'use client'

import { Target, Zap, Shield, Users, TrendingUp, Globe, Award, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'

export default function MissionVision() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const sections = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To empower employers with data-driven insights that eliminate hiring uncertainties. We believe every organization deserves to make informed decisions backed by verified candidate histories.',
      iconBg: 'bg-brand-100',
      iconColor: 'text-brand',
      gradient: 'from-red-500 to-orange-500',
      items: [
        { icon: Shield, text: 'Build trust between employers and candidates', color: 'text-brand' },
        { icon: Users, text: 'Create a transparent hiring ecosystem', color: 'text-brand' },
        { icon: TrendingUp, text: 'Reduce hiring costs and time-to-hire', color: 'text-brand' }
      ]
    },
    {
      icon: Zap,
      title: 'Our Vision',
      description: 'To become the world\'s most trusted B2B verification platform, where every hiring decision is supported by comprehensive, accurate, and ethically sourced candidate data.',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500',
      items: [
        { icon: Globe, text: 'Global network of verified employers', color: 'text-blue-600' },
        { icon: Award, text: 'Industry-leading accuracy and reliability', color: 'text-blue-600' },
        { icon: Heart, text: 'Ethical data practices and privacy protection', color: 'text-blue-600' }
      ]
    }
  ]

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-grid-gray-100 opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={ref} className="grid md:grid-cols-2 gap-12">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              className="space-y-6 bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow relative overflow-hidden group"
              initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index === 0 ? -50 : 50 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
            >
              {/* Gradient Background */}
              <motion.div
                className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${section.gradient} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500`}
              />

              <motion.div 
                className={`inline-flex items-center justify-center w-16 h-16 ${section.iconBg} rounded-2xl relative z-10`}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  animate={{
                    y: [0, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.5,
                    ease: "easeInOut"
                  }}
                >
                  <section.icon className={`h-8 w-8 ${section.iconColor}`} />
                </motion.div>
              </motion.div>

              <h2 className="text-3xl font-bold text-gray-900 relative z-10">{section.title}</h2>
              
              <p className="text-lg text-gray-600 leading-relaxed relative z-10">
                {section.description}
              </p>

              <ul className="space-y-3 relative z-10">
                {section.items.map((item, itemIndex) => (
                  <motion.li
                    key={itemIndex}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.2 + itemIndex * 0.1 + 0.3 }}
                    whileHover={{ x: 5 }}
                  >
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      <item.icon className={`h-6 w-6 ${item.color} mt-1 flex-shrink-0`} />
                    </motion.div>
                    <span className="text-gray-700">{item.text}</span>
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

