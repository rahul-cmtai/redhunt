'use client'

import { motion } from 'framer-motion'
import { Star, Building2, Users } from 'lucide-react'

export default function ClientSection() {
  const companies = [
    { name: 'HCL', logo: 'https://logo.clearbit.com/hcltech.com' },
    { name: 'Microsoft', logo: 'https://logo.clearbit.com/microsoft.com' },
    { name: 'Bajaj', logo: 'https://logo.clearbit.com/bajajfinserv.in' },
    { name: 'TCS', logo: 'https://logo.clearbit.com/tcs.com' },
    { name: 'Infosys', logo: 'https://logo.clearbit.com/infosys.com' },
    { name: 'Wipro', logo: 'https://logo.clearbit.com/wipro.com' },
    { name: 'Amazon', logo: 'https://logo.clearbit.com/amazon.com' },
    { name: 'Google', logo: 'https://logo.clearbit.com/google.com' },
    { name: 'IBM', logo: 'https://logo.clearbit.com/ibm.com' },
    { name: 'Accenture', logo: 'https://logo.clearbit.com/accenture.com' }
  ]

  return (
    <section className="py-20 bg-gray-900 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5" />
      
      {/* Floating Elements */}
      <motion.div
        className="absolute top-10 left-20 w-24 h-24 bg-red-500/10 rounded-full blur-2xl"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-10 right-20 w-32 h-32 bg-red-600/10 rounded-full blur-3xl"
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-red-500/10 text-red-600 border border-red-500/20 rounded-full text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Building2 className="h-4 w-4 mr-2" />
            Trusted by Industry Leaders
          </motion.div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Join{' '}
            <span className="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
              200+ Companies
            </span>
            {' '}Already Using Red-Flagged
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Verification network across enterprise HR teams worldwide
          </p>
        </motion.div>
        
        <div className="relative">
          {/* Enhanced Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-900 via-gray-900/80 to-transparent z-10" />
          
          <div className="flex overflow-hidden">
            <motion.div
              className="flex gap-8"
              animate={{
                x: [0, -1200],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {[...Array(3)].map((_, setIndex) => (
                <div key={setIndex} className="flex gap-8">
                  {companies.map((company, index) => (
                    <motion.div
                      key={`${setIndex}-${index}`}
                      className="flex-shrink-0 group"
                      whileHover={{ 
                        y: -5,
                        scale: 1.05,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <div className="relative">
                        {/* Glow Effect */}
                        <motion.div
                          className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          animate={{
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        
                        {/* Main Card */}
                        <div className="relative w-48 h-28 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-500 border border-red-100/50 overflow-hidden group-hover:border-red-200/80">
                          {/* Shine Effect */}
                          <motion.div
                            className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:left-full transition-all duration-1000"
                            style={{ transform: 'skewX(-20deg)' }}
                          />
                          
                          {/* Company Logo */}
                          <motion.img
                            src={company.logo}
                            alt={company.name}
                            className="w-full h-full object-contain p-2 relative z-10"
                            loading="lazy"
                            whileHover={{ 
                              scale: 1.1,
                              transition: { duration: 0.3 }
                            }}
                          />
                          
                          {/* Hover Overlay */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Stats Row */}
        <motion.div 
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">200+</h3>
            <p className="text-gray-300">Companies Trust Us</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">99%</h3>
            <p className="text-gray-300">Satisfaction Rate</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">5K+</h3>
            <p className="text-gray-300">Candidates Verified</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
