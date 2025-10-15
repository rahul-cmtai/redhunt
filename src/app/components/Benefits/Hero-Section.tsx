'use client'

import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

export default function BenefitsHeroSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80")',
        }}
      >
        {/* Dark Overlay with Gradient - Same as Features */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-900/85 to-pink-900/90"></div>
        
        {/* Hexagon Pattern Overlay - Same as Features */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M30 10 L45 20 L45 40 L30 50 L15 40 L15 20 Z" fill="none" stroke="%23ffffff" stroke-width="1"/%3E%3C/svg%3E")',
            backgroundSize: '60px 60px'
          }}
        ></div>
      </div>

      {/* Animated Elements - Same as Features */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.5, 1],
          x: [0, 50, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.6, 1],
          x: [0, -40, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            textShadow: '0 2px 20px rgba(0,0,0,0.5)'
          }}
        >
          <motion.div 
            className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium border border-white/30 shadow-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <TrendingUp className="h-5 w-5 mr-2 text-red-400" />
            The RedHunt Advantage
          </motion.div>

          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Transform Your Hiring with{' '}
            <motion.span 
              className="relative inline-block"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundImage: 'linear-gradient(90deg, #f87171, #ef4444, #f87171)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Verified Data
            </motion.span>
          </motion.h1>

          <motion.p 
            className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Discover how RedHunt transforms your recruitment process, saves costs, 
            and helps you make confident hiring decisions backed by verified data.
          </motion.p>

          {/* Feature Stats */}
          <motion.div 
            className="flex flex-wrap justify-center gap-6 pt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {[
              { icon: '📉', label: '70% Risk Reduction', gradientClass: 'gradient-red-pink' },
              { icon: '⏱️', label: '40hrs Time Saved', gradientClass: 'gradient-blue-cyan' },
              { icon: '💰', label: '60% Cost Savings', gradientClass: 'gradient-green-emerald' }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center px-8 py-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl relative overflow-hidden group"
                whileHover={{ scale: 1.1, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 ${item.gradientClass} opacity-0 group-hover:opacity-20 transition-opacity`}></div>
                
                <div className="text-4xl mb-2 relative z-10 drop-shadow-lg">{item.icon}</div>
                <div className="text-sm text-white font-medium relative z-10">{item.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
