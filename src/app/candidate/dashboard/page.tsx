"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function CandidateDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const getToken = () => localStorage.getItem('candidateToken') || sessionStorage.getItem('candidateToken')

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/candidate/login')
      return
    }
    setIsAuthenticated(true)
  }, [router])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getToken()
        if (!token) return
        const { data } = await axios.get(`${API_BASE_URL}/api/candidate/profile`, { headers: { Authorization: `Bearer ${token}` } })
        setProfile(data)
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || 'Failed to load profile'
        setError(msg)
      }
    }
    if (isAuthenticated) fetchProfile()
  }, [isAuthenticated])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }
  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      <header className="border-b bg-white/70 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-red-600">RedHunt</Link>
          <div className="text-sm text-gray-600">Welcome, <span className="font-semibold text-gray-900">{profile?.name || 'Candidate'}</span></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Summary Cards */}
          <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
            <div className="text-sm text-gray-500">Profile Status</div>
            <div className="mt-2 text-2xl font-bold text-gray-900">{profile?.status || 'Pending Approval'}</div>
            <p className="text-xs text-gray-500 mt-1">An admin must approve your account to access full features.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
            <div className="text-sm text-gray-500">Associated Offers</div>
            <div className="mt-2 text-2xl font-bold text-gray-900">{profile?.offersCount || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Employers that have recorded offers for you.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
            <div className="text-sm text-gray-500">Verification</div>
            <div className="mt-2 text-2xl font-bold text-gray-900">{profile?.verification || 'In Progress'}</div>
            <p className="text-xs text-gray-500 mt-1">Keep PAN/UAN updated for faster verification.</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="mt-8 bg-white rounded-lg shadow p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Profile</h3>
          {error && <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Name</div>
              <div className="text-gray-900 font-medium">{profile?.name || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">Email</div>
              <div className="text-gray-900 font-medium break-words">{profile?.email || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">Phone</div>
              <div className="text-gray-900 font-medium">{profile?.mobile || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">PAN</div>
              <div className="text-gray-900 font-medium">{profile?.pan || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">UAN</div>
              <div className="text-gray-900 font-medium">{profile?.uan || '-'}</div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Link href="/candidate/profile" className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700">Update Profile</Link>
            <Link href="/candidate/security" className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50">Security</Link>
          </div>
        </div>
      </main>
    </div>
  )
}


