'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }
  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Candidate Dashboard</h1>
        {error && <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Profile</h2>
          {profile ? (
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Name</div>
                <div className="text-gray-900 font-medium">{profile.name || '-'}</div>
              </div>
              <div>
                <div className="text-gray-500">Email</div>
                <div className="text-gray-900 font-medium break-words">{profile.email || '-'}</div>
              </div>
              <div>
                <div className="text-gray-500">Phone</div>
                <div className="text-gray-900 font-medium">{profile.mobile || '-'}</div>
              </div>
            </div>
          ) : (
            <div className="text-gray-600">Loading profile...</div>
          )}
        </div>
      </div>
    </div>
  )
}


