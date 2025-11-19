"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Home, User2, ChevronDown, UserCircle, Briefcase, Info, Sparkles, Grid3x3, Mail, Menu, X, Play } from 'lucide-react'

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <h1 className="text-2xl font-bold text-brand">Red-Flagged</h1>
              </Link>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors">
              <Home className="text-[#FF3B30] w-5 h-5" />
              Home
            </Link>
            <Link href="/How-Its-Work" className="flex items-center gap-2 text-gray-700 hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors">
              <Play className="text-[#FF3B30] w-5 h-5" />
              How it works
            </Link>

            <Link href="/about" className="flex items-center gap-2 text-gray-700 hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors">
              <Info className="text-[#FF3B30] w-5 h-5" />
              About Us
            </Link>

            <Link href="/benefits" className="flex items-center gap-2 text-gray-700 hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors">
              <Sparkles className="text-[#FF3B30] w-5 h-5" />
              Benefits
            </Link>
            {/* <Link href="/features" className="flex items-center gap-2 text-gray-700 hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors">
              <Grid3x3 className="text-[#FF3B30] w-5 h-5" />
              Features
            </Link> */}
            <Link href="/contact" className="flex items-center gap-2 text-gray-700 hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors">
              <Mail className="text-[#FF3B30] w-5 h-5" />
              Contact Us
            </Link>
          </div>
          
          {/* Desktop Login Dropdown */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative bg-brand-50 rounded-lg" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-gray-700 hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <User2 className="w-4 h-4" />
                Login / Signup
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-200 ease-out z-50"
                >
                  <Link
                    href="/candidate/login"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-brand-50 hover:text-brand transition-colors"
                  >
                    <UserCircle className="w-5 h-5" />
                    <span className="font-medium">Candidate</span>
                  </Link>
                  <div className="border-t border-gray-100"></div>
                  <Link
                    href="/employer/login"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-brand-50 hover:text-brand transition-colors"
                  >
                    <Briefcase className="w-5 h-5" />
                    <span className="font-medium">Employer</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-brand p-2 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Slide Down */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 pt-2 pb-6 space-y-3 bg-gradient-to-br from-brand-50/50 to-white backdrop-blur-lg border-t border-gray-100">
            {/* Navigation Links */}
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white hover:text-brand rounded-xl transition-all duration-200"
            >
              <Home className="text-[#FF3B30] w-5 h-5" />
              <span className="font-medium">Home</span>
            </Link>

            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white hover:text-brand rounded-xl transition-all duration-200"
            >
              <Info className="text-[#FF3B30] w-5 h-5" />
              <span className="font-medium">About Us</span>
            </Link>

            <Link
              href="/benefits"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white hover:text-brand rounded-xl transition-all duration-200"
            >
              <Sparkles className="text-[#FF3B30] w-5 h-5" />
              <span className="font-medium">Benefits</span>
            </Link>

            <Link
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white hover:text-brand rounded-xl transition-all duration-200"
            >
              <Grid3x3 className="text-[#FF3B30] w-5 h-5" />
              <span className="font-medium">Features</span>
            </Link>

            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white hover:text-brand rounded-xl transition-all duration-200"
            >
              <Mail className="text-[#FF3B30] w-5 h-5" />
              <span className="font-medium">Contact Us</span>
            </Link>

            {/* Login Section */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Login / Signup
              </p>
              
              <Link
                href="/candidate/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white hover:text-brand rounded-xl transition-all duration-200"
              >
                <UserCircle className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Candidate Login</span>
              </Link>

              <Link
                href="/employer/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white hover:text-brand rounded-xl transition-all duration-200"
              >
                <Briefcase className="w-5 h-5 text-green-600" />
                <span className="font-medium">Employer Login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
