'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { 
  Building2, 
  User, 
  Search, 
  AlertTriangle, 
  Shield, 
  Eye, 
  Heart, 
  Target,
  CheckCircle,
  ArrowRight,
  Users,
  FileText,
  TrendingUp
} from 'lucide-react'

export default function FeaturesComparison() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const employerFeatures = [
    {
      icon: Search,
      title: "Hire a Right Candidate",
      description: "Search for a Red-Flag with the potential candidate. Check their history with Red-flagged.com",
      color: "from-red-500 to-red-600"
    },
    {
      icon: AlertTriangle,
      title: "Get Red Flag Alerts",
      description: "We'll alert you to potential risks associated with a candidate's background.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Target,
      title: "Make Informed Hiring Decisions",
      description: "With Red-Flagged's insights, you can make more informed decisions about who to hire.",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Shield,
      title: "Protect Your Organization",
      description: "Our platform helps you avoid costly hiring mistakes and reduce risk.",
      color: "from-green-500 to-emerald-600"
    }
  ]

  const candidateFeatures = [
    {
      icon: Eye,
      title: "Employers Check Your History",
      description: "Employers use Red-Flagged.com to verify your history of offers rejected and credentials.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: FileText,
      title: "Get Transparency",
      description: "You'll know if an employer has Red-Flagged you and why?",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: Heart,
      title: "Build Trust",
      description: "By being upfront about your history, you can build trust with potential employers and have a positive impact on future employers.",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Users,
      title: "Take Control",
      description: "Red-flagged.com helps you understand what employers see when they check your history.",
      color: "from-indigo-500 to-purple-600"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-red-100/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Benefits for{' '}
            <motion.span 
              className="text-brand"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundImage: 'linear-gradient(90deg, #ef4444, #dc2626, #ef4444)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Everyone
            </motion.span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Red-Flagged creates a transparent ecosystem where both employers and candidates benefit from verified information and trust-building features.
          </p>
        </motion.div>

        {/* Comparison Container */}
        <div className="grid lg:grid-cols-2 gap-8 relative">
          {/* Employer Side */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="text-center">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Building2 className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Employer</h3>
              <p className="text-gray-600">Make smarter hiring decisions with verified candidate data</p>
            </div>

            <div className="space-y-4">
              {employerFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className="group relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group-hover:border-red-200">
                    <div className="flex items-start space-x-4">
                      <motion.div
                        className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center`}
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <feature.icon className="h-5 w-5 text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">
                          {feature.title}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Hover Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Divider Line */}
          <div className="hidden lg:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 h-full">
            <motion.div
              className="w-px h-3/4 bg-gradient-to-b from-transparent via-gray-300 to-transparent"
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <motion.div
              className="absolute w-8 h-8 bg-white border-4 border-gray-300 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <ArrowRight className="h-4 w-4 text-gray-600 rotate-90" />
            </motion.div>
          </div>

          {/* Candidate Side */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="text-center">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <User className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Candidate</h3>
              <p className="text-gray-600">Build trust and transparency in your career journey</p>
            </div>

            <div className="space-y-4">
              {candidateFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className="group relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group-hover:border-blue-200">
                    <div className="flex items-start space-x-4">
                      <motion.div
                        className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center`}
                        whileHover={{ rotate: -5, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <feature.icon className="h-5 w-5 text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {feature.title}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Hover Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="bg-gradient-to-r from-red-500 to-blue-600 rounded-2xl p-8 text-white relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-blue-600/20"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Transform Your Hiring Process?
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Join thousands of companies and candidates building trust through transparency
              </p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <Link href="/employer/register">
                  <motion.button
                    className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started as Employer
                  </motion.button>
                </Link>
                <Link href="/candidate/register">
                  <motion.button
                    className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Join as Candidate
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
