'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "HR Director",
    company: "Tech Innovations Pvt Ltd",
    image: "👨‍💼",
    rating: 5,
    text: "Red-Flagged helped us identify a candidate who had accepted 3 offers in the past 6 months but never joined. This saved us from a costly hiring mistake!",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    name: "Priya Sharma",
    role: "Talent Acquisition Lead",
    company: "Digital Solutions Inc",
    image: "👩‍💼",
    rating: 5,
    text: "We discovered a candidate was Red-flagged by 2 companies for unprofessional conduct. Red-Flagged's database is a game-changer for recruitment!",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    name: "Amit Patel",
    role: "CEO",
    company: "StartupXYZ",
    image: "👨‍💻",
    rating: 5,
    text: "The transparency Red-Flagged provides is unmatched. We now verify every candidate's history before making an offer. Our hiring success rate improved by 70%!",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    name: "Sneha Reddy",
    role: "Recruitment Manager",
    company: "Global Tech Corp",
    image: "👩‍💼",
    rating: 5,
    text: "Found out a candidate had accepted offers from 5 companies in 4 months and ghosted all of them. Red-Flagged saved us time, money, and frustration!",
    gradient: "from-red-500 to-orange-500"
  },
  {
    name: "Vikram Singh",
    role: "HR Head",
    company: "Enterprise Solutions",
    image: "👨‍💼",
    rating: 5,
    text: "Red-Flagged's Red-flagged verification helped us avoid hiring someone with a history of data theft. This platform is essential for every HR team!",
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    name: "Kavita Desai",
    role: "Hiring Manager",
    company: "Innovation Labs",
    image: "👩‍💻",
    rating: 5,
    text: "We verified a candidate who had 4 no-show records. Red-Flagged's data prevented what would have been our worst hire. Absolutely worth it!",
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    name: "Arjun Mehta",
    role: "VP of HR",
    company: "Mega Corp Industries",
    image: "👨‍💼",
    rating: 5,
    text: "The platform revealed a pattern of offer-hoarding behavior we wouldn't have caught otherwise. Red-Flagged is now mandatory in our hiring process!",
    gradient: "from-teal-500 to-cyan-500"
  },
  {
    name: "Neha Gupta",
    role: "Talent Partner",
    company: "Growth Ventures",
    image: "👩‍💼",
    rating: 5,
    text: "Found a candidate Red-flagged for violating NDAs at previous companies. Red-Flagged's verification saved us from a potential legal nightmare!",
    gradient: "from-pink-500 to-red-500"
  }
]

// Duplicate testimonials for seamless loop
const leftTestimonials = [...testimonials, ...testimonials]
const rightTestimonials = [...testimonials.slice().reverse(), ...testimonials.slice().reverse()]

export default function Testimonial() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <motion.div
          className="text-center space-y-2 sm:space-y-3"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-brand-100 text-brand rounded-full text-xs sm:text-sm font-semibold mb-1 sm:mb-2"
            whileHover={{ scale: 1.05 }}
          >
            ⭐ Real Success Stories
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 px-4">
            Trusted by <span className="bg-gradient-to-r from-brand to-red-600 bg-clip-text text-transparent">200+ HR Leaders</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
            See how Red-Flagged is helping companies avoid bad hires and reduce recruitment risks
          </p>
        </motion.div>
      </div>

      {/* Marquee Container - Left to Right */}
      <div className="relative mb-4 sm:mb-6">
        <div className="flex gap-3 sm:gap-4 animate-marquee-left">
          {leftTestimonials.map((testimonial, index) => (
            <TestimonialCard key={`left-${index}`} testimonial={testimonial} />
          ))}
        </div>
      </div>

      {/* Marquee Container - Right to Left */}
      <div className="relative">
        <div className="flex gap-3 sm:gap-4 animate-marquee-right">
          {rightTestimonials.map((testimonial, index) => (
            <TestimonialCard key={`right-${index}`} testimonial={testimonial} />
          ))}
        </div>
      </div>

      {/* Gradient Overlays for fade effect */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
    </section>
  )
}

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="min-w-[240px] sm:min-w-[280px] md:min-w-[320px] bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-md hover:shadow-xl transition-all duration-500 border border-gray-200/50 relative group hover:scale-105 hover:-translate-y-1">
      {/* Quote Icon */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 opacity-5 group-hover:opacity-10 transition-opacity">
        <Quote className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-brand" />
      </div>

      {/* Rating Stars */}
      <div className="flex items-center gap-0.5 mb-2 sm:mb-3">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 text-yellow-400 fill-current drop-shadow-sm" />
        ))}
      </div>

      {/* Testimonial Text */}
      <p className="text-gray-600 text-xs sm:text-xs md:text-sm mb-3 sm:mb-4 leading-relaxed relative z-10 line-clamp-3 sm:line-clamp-4">
        &quot;{testimonial.text}&quot;
      </p>

      {/* Author Info */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-lg sm:text-xl md:text-2xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
          {testimonial.image}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 text-xs sm:text-xs md:text-sm">{testimonial.name}</h4>
          <p className="text-[10px] sm:text-xs text-gray-500">{testimonial.role}</p>
          <p className="text-[10px] sm:text-xs text-brand font-semibold">{testimonial.company}</p>
        </div>
      </div>

      {/* Hover Red Gradient Border Effect */}
      <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-br from-red-300 to-pink-300 opacity-0 group-hover:opacity-20 transition-all duration-500 -z-10"></div>
      
      {/* Glowing Red Border on Hover */}
      <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-br from-red-400 to-pink-400 opacity-0 group-hover:opacity-25 blur-md transition-all duration-500 -z-20"></div>
    </div>
  )
}

