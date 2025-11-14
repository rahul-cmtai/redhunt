"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Users, Clock, User, Search, FileText } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function EmployerOverviewPage() {
  const [stats, setStats] = useState({
    totalCandidates: 0,
    pendingVerifications: 0
  })
  const [loading, setLoading] = useState(false)

  const getToken = () => localStorage.getItem('employerToken') || sessionStorage.getItem('employerToken')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const token = getToken()
        if (!token) return
        
        const { data } = await axios.get(`${API_BASE_URL}/api/employer/candidates`, { 
          headers: { Authorization: `Bearer ${token}` } 
        })
        
        const candidates = Array.isArray(data) ? data : (data?.candidates || data?.data || [])
        const total = candidates.length
        const pending = candidates.filter((c: any) => !c.verified || c.status === 'pending').length
        
        setStats({
          totalCandidates: total,
          pendingVerifications: pending
        })
      } catch (err: any) {
        console.log('Could not fetch stats:', err?.response?.data?.message || err?.message)
        setStats({ totalCandidates: 0, pendingVerifications: 0 })
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Manage candidates and verify their credentials</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs sm:text-sm text-gray-500">Total Candidates</div>
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalCandidates}</div>
          <p className="text-xs text-gray-500 mt-1">In your database</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs sm:text-sm text-gray-500">Pending</div>
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.pendingVerifications}</div>
          <p className="text-xs text-gray-500 mt-1">Awaiting verification</p>
        </div>
      </div>

      {/* What You Can Do */}
      <div className="mb-6 sm:mb-10">
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
          <div className="px-4 sm:px-6 py-4 sm:py-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">What you can do</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3 rounded-md bg-red-50/60 border border-red-100 hover:bg-red-50 transition-colors">
                <div className="text-sm font-medium text-gray-900 mb-1">Search Candidates</div>
                <p className="text-xs sm:text-sm text-gray-600">Search and verify candidate credentials using PAN, UAN, or email.</p>
              </div>
              <div className="p-3 rounded-md bg-blue-50/60 border border-blue-100 hover:bg-blue-50 transition-colors">
                <div className="text-sm font-medium text-gray-900 mb-1">Add Candidates</div>
                <p className="text-xs sm:text-sm text-gray-600">Add new candidates to your database and track their offer history.</p>
              </div>
              <div className="p-3 rounded-md bg-green-50/60 border border-green-100 hover:bg-green-50 transition-colors">
                <div className="text-sm font-medium text-gray-900 mb-1">Verify Credentials</div>
                <p className="text-xs sm:text-sm text-gray-600">Verify candidate information and update their status history.</p>
              </div>
              <div className="p-3 rounded-md bg-amber-50/60 border border-amber-100 hover:bg-amber-50 transition-colors">
                <div className="text-sm font-medium text-gray-900 mb-1">View Remarks</div>
                <p className="text-xs sm:text-sm text-gray-600">View all status timeline entries and remarks from verified candidates.</p>
              </div>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <Link 
                href="/employer/dashboard/candidates" 
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                View Candidates
              </Link>
              <Link 
                href="/employer/dashboard/remarks" 
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                View Remarks
              </Link>
              <Link 
                href="/employer/dashboard/profile" 
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Update Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <Link 
          href="/employer/dashboard/candidates"
          className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border border-gray-100 hover:shadow-md hover:border-red-200 transition-all group"
        >
          <div className="flex items-center mb-2">
            <Users className="h-5 w-5 text-red-600 mr-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">Manage Candidates</h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">Search, add, and verify candidate credentials</p>
        </Link>

        <Link 
          href="/employer/dashboard/remarks"
          className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group"
        >
          <div className="flex items-center mb-2">
            <FileText className="h-5 w-5 text-blue-600 mr-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">Status Timeline</h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">View all remarks and updates from verified candidates</p>
        </Link>

        <Link 
          href="/employer/dashboard/profile"
          className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border border-gray-100 hover:shadow-md hover:border-green-200 transition-all group"
        >
          <div className="flex items-center mb-2">
            <User className="h-5 w-5 text-green-600 mr-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">Company Profile</h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">Manage and update your company profile information</p>
        </Link>
      </div>
    </>
  )
}

