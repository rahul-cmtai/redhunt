"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Briefcase, Activity, User } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.red-flagged.com'

interface Offer {
  _id?: string
  id?: string
  employerName?: string
  companyName?: string
  position?: string
  jobRole?: string
  offerDate?: string
  offerStatus?: string
  joiningDate?: string
  joiningStatus?: string
  reason?: string
  notes?: string
  createdAt?: string
}

export default function OverviewPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(false)

  const getToken = () => localStorage.getItem('candidateToken') || sessionStorage.getItem('candidateToken')

  const normalizeOffers = (raw: any) => {
    if (!raw) return []
    const list = raw.offers || raw.data || raw.results || raw
    return Array.isArray(list) ? list : []
  }

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true)
        const token = getToken()
        if (!token) return
        
        const { data } = await axios.get(`${API_BASE_URL}/api/candidate/offers`, { 
          headers: { Authorization: `Bearer ${token}` } 
        })
        setOffers(normalizeOffers(data))
      } catch (err: any) {
        console.log('Could not fetch offers:', err?.response?.data?.message || err?.message)
        setOffers([])
      } finally {
        setLoading(false)
      }
    }
    fetchOffers()
  }, [])

  // Calculate stats
  const totalOffers = offers.length

  return (
    <>
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">View your profile and offers from employers</p>
        </div>

        {/* Stats Card - Total Red-Flagged */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border border-red-100 hover:shadow-md hover:border-red-200 transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs sm:text-sm text-red-600 font-semibold">Total Red-Flagged</div>
              <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-red-600">{totalOffers}</div>
            <p className="text-xs text-gray-500 mt-1">Total red-flagged records from employers</p>
          </div>
        </div>

        {/* What You Can Do */}
        <div className="mb-6 sm:mb-10">
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="px-4 sm:px-6 py-4 sm:py-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">What you can do</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 rounded-md bg-red-50/60 border border-red-100 hover:bg-red-50 transition-colors">
                  <div className="text-sm font-medium text-gray-900 mb-1">Employers Check Your History</div>
                  <p className="text-xs sm:text-sm text-gray-600">Employers use Red-Flagged.com to verify your history of offers rejected and credentials.</p>
                </div>
                <div className="p-3 rounded-md bg-blue-50/60 border border-blue-100 hover:bg-blue-50 transition-colors">
                  <div className="text-sm font-medium text-gray-900 mb-1">Get Transparency</div>
                  <p className="text-xs sm:text-sm text-gray-600">You'll know if an employer has Red-Flagged you and why.</p>
                </div>
                <div className="p-3 rounded-md bg-green-50/60 border border-green-100 hover:bg-green-50 transition-colors">
                  <div className="text-sm font-medium text-gray-900 mb-1">Build Trust</div>
                  <p className="text-xs sm:text-sm text-gray-600">Be upfront about your history to build trust with potential employers.</p>
                </div>
                <div className="p-3 rounded-md bg-amber-50/60 border border-amber-100 hover:bg-amber-50 transition-colors">
                  <div className="text-sm font-medium text-gray-900 mb-1">Take Control</div>
                  <p className="text-xs sm:text-sm text-gray-600">Understand what employers see when they check your history.</p>
                </div>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Link 
                  href="/candidate/dashboard/status" 
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  View Red-Flagged & Records
                </Link>
                <Link 
                  href="/candidate/dashboard/profile" 
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Update Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Link 
            href="/candidate/dashboard/status"
            className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border border-gray-100 hover:shadow-md hover:border-red-200 transition-all group"
          >
            <div className="flex items-center mb-2">
              <Activity className="h-5 w-5 text-red-600 mr-2 group-hover:scale-110 transition-transform" />
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">Red-Flagged & Records</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">View Red-Flagged from companies and track your status timeline</p>
          </Link>

          <Link 
            href="/candidate/dashboard/profile"
            className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border border-gray-100 hover:shadow-md hover:border-red-200 transition-all group"
          >
            <div className="flex items-center mb-2">
              <User className="h-5 w-5 text-blue-600 mr-2 group-hover:scale-110 transition-transform" />
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">Update Profile</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Manage and update your profile information</p>
          </Link>
        </div>
    </>
  )
}

