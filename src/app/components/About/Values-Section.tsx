'use client'

import { Shield, Users, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'

export default function ValuesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const values = [
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'We protect every piece of data with enterprise-grade security and maintain the highest standards of privacy.',
      iconBg: 'bg-brand-100',
      iconColor: 'text-brand',
      gradient: 'from-red-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Transparency',
      description: 'We believe in complete transparency in our processes, pricing, and the data we provide to our users.',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in everything - from our technology to customer support and data accuracy.',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      gradient: 'from-green-500 to-emerald-500'
    }
  ]

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 opacity-5"
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
          backgroundSize: '50px 50px'
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
          <p className="text-xl text-gray-600">The principles that guide everything we do</p>
        </motion.div>

        <div ref={ref} className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden group"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -15, scale: 1.05 }}
            >
              {/* Gradient Background on Hover */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />

              {/* Rotating Border */}
              <motion.div
                className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-20 blur-2xl`}
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
                className={`inline-flex items-center justify-center w-16 h-16 ${value.iconBg} rounded-2xl mb-6 relative z-10`}
                whileHover={{ 
                  rotate: [0, -10, 10, -10, 0],
                  scale: 1.2
                }}
                animate={{
                  y: [0, -10, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <value.icon className={`h-8 w-8 ${value.iconColor}`} />
                </motion.div>
              </motion.div>

              <motion.h3 
                className="text-xl font-semibold text-gray-900 mb-4 relative z-10"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: index * 0.2 + 0.3 }}
              >
                {value.title}
              </motion.h3>

              <motion.p 
                className="text-gray-600 leading-relaxed relative z-10"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: index * 0.2 + 0.4 }}
              >
                {value.description}
              </motion.p>

              {/* Particle Effect */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-1 h-1 bg-gradient-to-br ${value.gradient} rounded-full opacity-0 group-hover:opacity-60`}
                  style={{
                    left: `${30 + i * 20}%`,
                    top: `${20 + i * 15}%`
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                />
              ))}

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

