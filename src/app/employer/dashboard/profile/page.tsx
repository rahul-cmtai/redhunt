"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Building2, MapPin, CreditCard, User, Briefcase, Phone, Mail, Shield, CheckCircle } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.red-flagged.com'

export default function EmployerProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const getToken = () => localStorage.getItem('employerToken') || sessionStorage.getItem('employerToken')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const token = getToken()
        if (!token) {
          setError('Not authenticated')
          return
        }
        const { data } = await axios.get(`${API_BASE_URL}/api/employer/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setProfile(data)
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'suspended':
        return 'bg-gray-100 text-gray-800 border-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    )
  }

  if (error && !profile) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Company Profile</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">View your company information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
        </div>

        <div className="space-y-4">
          {/* Company Name */}
          <div>
            <label className="flex text-sm font-medium text-gray-700 mb-1 items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-500" />
              Company Name
            </label>
            <p className="text-gray-900 font-medium">{profile?.companyName || '-'}</p>
          </div>

          {/* Address */}
          <div>
            <label className="flex text-sm font-medium text-gray-700 mb-1 items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              Address
            </label>
            <p className="text-gray-900">{profile?.address || '-'}</p>
          </div>

          {/* PAN Number */}
          <div>
            <label className="flex text-sm font-medium text-gray-700 mb-1 items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-500" />
              PAN Number
            </label>
            <p className="text-gray-900 font-medium">{profile?.panNumber || '-'}</p>
          </div>

          {/* HR Name */}
          <div>
            <label className="flex text-sm font-medium text-gray-700 mb-1 items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              HR Name
            </label>
            <p className="text-gray-900 font-medium">{profile?.hrName || '-'}</p>
          </div>

          {/* Designation */}
          <div>
            <label className="flex text-sm font-medium text-gray-700 mb-1 items-center gap-2">
              <Briefcase className="h-4 w-4 text-gray-500" />
              Designation
            </label>
            <p className="text-gray-900 font-medium">{profile?.designation || '-'}</p>
          </div>

          {/* Contact Number */}
          <div>
            <label className="flex text-sm font-medium text-gray-700 mb-1 items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              Contact Number
            </label>
            <p className="text-gray-900 font-medium">{profile?.contactNumber || '-'}</p>
          </div>

          {/* Email */}
          <div>
            <label className="flex text-sm font-medium text-gray-700 mb-1 items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              Email
            </label>
            <div className="flex items-center gap-2">
              <p className="text-gray-900 font-medium">{profile?.email || '-'}</p>
              {profile?.emailVerified && (
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Verified
                </span>
              )}
            </div>
          </div>

          {/* Status */}
          {profile?.status && (
            <div>
              <label className="flex text-sm font-medium text-gray-700 mb-1 items-center gap-2">
                <Shield className="h-4 w-4 text-gray-500" />
                Account Status
              </label>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border-2 ${getStatusColor(profile.status)}`}>
                {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
              </span>
            </div>
          )}

        
        </div>
      </div>
    </>
  )
}

