'use client'

import { motion } from 'framer-motion'
import { 
  Star, Building2, Users, Home, Wallet, ShoppingCart, Landmark, Paintbrush,
  Hospital, Laptop, Factory, GraduationCap, Hotel, Truck, Wrench, Pill,
  Car, Phone, Zap, Wheat, Shirt, Film, Utensils, Dumbbell, Plane
} from 'lucide-react'

export default function ClientSection() {
  const industries = [
    { 
      name: 'Real Estate', 
      icon: Home,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      name: 'Finance', 
      icon: Wallet,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      name: 'FMCG', 
      icon: ShoppingCart,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    },
    { 
      name: 'Banking', 
      icon: Landmark,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      name: 'Healthcare', 
      icon: Hospital,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50'
    },
    { 
      name: 'IT & Technology', 
      icon: Laptop,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    { 
      name: 'Manufacturing', 
      icon: Factory,
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-50'
    },
    { 
      name: 'Education', 
      icon: GraduationCap,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    { 
      name: 'Hospitality', 
      icon: Hotel,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50'
    },
    { 
      name: 'Logistics', 
      icon: Truck,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50'
    },
    { 
      name: 'Construction', 
      icon: Wrench,
      color: 'from-stone-500 to-stone-600',
      bgColor: 'bg-stone-50'
    },
    { 
      name: 'Pharmaceuticals', 
      icon: Pill,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50'
    },
    { 
      name: 'Automotive', 
      icon: Car,
      color: 'from-slate-500 to-slate-600',
      bgColor: 'bg-slate-50'
    },
    { 
      name: 'Telecommunications', 
      icon: Phone,
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-50'
    },
    { 
      name: 'Energy & Power', 
      icon: Zap,
      color: 'from-yellow-400 to-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    { 
      name: 'Agriculture', 
      icon: Wheat,
      color: 'from-lime-500 to-lime-600',
      bgColor: 'bg-lime-50'
    },
    { 
      name: 'Textiles', 
      icon: Shirt,
      color: 'from-rose-500 to-rose-600',
      bgColor: 'bg-rose-50'
    },
    { 
      name: 'Media & Entertainment', 
      icon: Film,
      color: 'from-fuchsia-500 to-fuchsia-600',
      bgColor: 'bg-fuchsia-50'
    },
    { 
      name: 'Food & Beverage', 
      icon: Utensils,
      color: 'from-orange-400 to-orange-500',
      bgColor: 'bg-orange-50'
    },
    { 
      name: 'Fitness & Sports', 
      icon: Dumbbell,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    { 
      name: 'Aviation', 
      icon: Plane,
      color: 'from-sky-500 to-sky-600',
      bgColor: 'bg-sky-50'
    },
    { 
      name: 'Paint Industry', 
      icon: Paintbrush,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50'
    }
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
              className="flex gap-4 md:gap-8"
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
                <div key={setIndex} className="flex gap-4 md:gap-8">
                  {industries.map((industry, index) => {
                    const IconComponent = industry.icon
                    return (
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
                          <div className={`relative w-32 md:w-48 bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl flex flex-col items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 overflow-hidden group-hover:border-red-300/80 ${industry.bgColor}`}>
                            {/* Shine Effect */}
                            <motion.div
                              className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:left-full transition-all duration-1000"
                              style={{ transform: 'skewX(-20deg)' }}
                            />
                            
                            {/* Industry Icon */}
                            <div className="py-2 px-3 md:py-4 md:px-6 flex items-center justify-center relative z-10">
                              <motion.div
                                className={`w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl bg-gradient-to-br ${industry.color} flex items-center justify-center shadow-md`}
                                whileHover={{ 
                                  scale: 1.1,
                                  rotate: [0, -5, 5, 0],
                                  transition: { duration: 0.3 }
                                }}
                              >
                                <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white" />
                              </motion.div>
                            </div>
                            
                            {/* Industry Name */}
                            <div className="pb-2 px-2 md:pb-4 md:px-4 relative z-10">
                              <p className="text-xs md:text-sm font-semibold text-gray-800 text-center">
                                {industry.name}
                              </p>
                            </div>
                            
                            {/* Hover Overlay */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
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
            <h3 className="text-2xl font-bold text-white mb-2">20K+</h3>
            <p className="text-gray-300">Candidates Verified</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
