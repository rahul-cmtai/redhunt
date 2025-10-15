'use client'

import { motion } from 'framer-motion'

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
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trusted by Industry Leaders</h2>
          <p className="text-gray-600">Verification network across enterprise HR teams</p>
        </motion.div>
        
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10" />
          
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
                      className="flex-shrink-0"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-40 h-20 bg-white rounded-lg flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity shadow-sm hover:shadow-md overflow-hidden px-4">
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
