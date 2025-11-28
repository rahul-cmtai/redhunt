"use client"

import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-red-400 mb-4">Red-Flagged</h3>
                <p className="text-gray-300 leading-relaxed">
                  The leading B2B verification platform that helps employers make smarter hiring decisions with verified candidate data.
                </p>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Product</h4>
              <ul className="space-y-3">
                <li><Link href="/How-Its-Work" className="text-gray-300 hover:text-white transition-colors">How it works</Link></li>
                <li><Link href="/benefits" className="text-gray-300 hover:text-white transition-colors">Benefits</Link></li>
                <li><Link href="/features" className="text-gray-300 hover:text-white transition-colors">Features</Link></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/blogs" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/employer/login" className="text-gray-300 hover:text-white transition-colors">Employer Login</Link></li>
                <li><Link href="/candidate/login" className="text-gray-300 hover:text-white transition-colors">Candidate Login</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Contact</h4>
              <div className="space-y-4">
               
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-red-400" />
                  <span className="text-gray-300">support@red-flagged.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-red-400" />
                  <span className="text-gray-300">Delhi</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm">
                © 2025 Red-Flagged. All rights reserved.
              </div>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
                <Link href="/cookie-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-500 text-sm">
                <span className="text-red-400 font-semibold">Red-Flagged</span> - Transparency. Trust. Talent.
              </p>
            </div>
          </div>
        </div>
      </footer>
  )
}