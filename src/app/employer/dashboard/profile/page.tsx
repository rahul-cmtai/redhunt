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
    <div className="min-h-[80vh] bg-gradient-to-br from-red-50 via-white to-slate-50 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 sm:py-6">
      <div className="max-w-5xl mx-auto">
        {/* Premium Header */}
        <div className="mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold mb-3">
            <Shield className="h-3 w-3" />
            Company Profile
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            {profile?.companyName || 'Your Company'}
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-2xl">
            View your verified employer profile and key details used across the Red‑Flagged platform.
          </p>
        </div>

        {/* 2‑column premium layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left: Highlight card */}
          <div className="lg:col-span-1">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border border-slate-800/60">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-red-500/30 blur-2xl" />
              <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
              <div className="relative p-6 sm:p-7 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-slate-300">Company</p>
                    <p className="text-lg font-semibold truncate max-w-[14rem]">
                      {profile?.companyName || 'Not set'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 text-xs sm:text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-300">PAN Number</span>
                    <span className="font-semibold text-slate-50">
                      {profile?.panNumber || '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-300">HR Name</span>
                    <span className="font-medium text-slate-50 truncate max-w-[10rem]">
                      {profile?.hrName || '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-300">Contact</span>
                    <span className="font-medium text-slate-50">
                      {profile?.contactNumber || '—'}
                    </span>
                  </div>
                </div>

                {profile?.status && (
                  <div className="pt-1 border-t border-white/10 mt-2">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 mb-2">
                      Account Status
                    </p>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        profile.status
                      )}`}
                    >
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" />
                      {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Detailed information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-6">
              <h2 className="text-sm font-semibold text-slate-900 tracking-wide mb-4">
                Company Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Company Name */}
                <div>
                  <p className="flex items-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 mb-1 gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                    Company Name
                  </p>
                  <p className="text-sm sm:text-base font-medium text-slate-900">
                    {profile?.companyName || '—'}
                  </p>
                </div>

                {/* PAN Number */}
                <div>
                  <p className="flex items-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 mb-1 gap-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                    PAN Number
                  </p>
                  <p className="text-sm sm:text-base font-medium text-slate-900">
                    {profile?.panNumber || '—'}
                  </p>
                </div>

                {/* HR Name */}
                <div>
                  <p className="flex items-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 mb-1 gap-1.5">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    HR Name
                  </p>
                  <p className="text-sm sm:text-base font-medium text-slate-900">
                    {profile?.hrName || '—'}
                  </p>
                </div>

                {/* Designation */}
                <div>
                  <p className="flex items-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 mb-1 gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                    Designation
                  </p>
                  <p className="text-sm sm:text-base font-medium text-slate-900">
                    {profile?.designation || '—'}
                  </p>
                </div>
              </div>

              {/* Address full width */}
              <div className="mt-5">
                <p className="flex items-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 mb-1 gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  Registered Address
                </p>
                <p className="text-sm sm:text-base text-slate-900">
                  {profile?.address || '—'}
                </p>
              </div>
            </div>

            {/* Contact & security section */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-6">
              <h2 className="text-sm font-semibold text-slate-900 tracking-wide mb-4">
                Contact &amp; Security
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Contact Number */}
                <div>
                  <p className="flex items-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 mb-1 gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    Contact Number
                  </p>
                  <p className="text-sm sm:text-base font-medium text-slate-900">
                    {profile?.contactNumber || '—'}
                  </p>
                </div>

                {/* Email */}
                <div>
                  <p className="flex items-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 mb-1 gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    Email
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm sm:text-base font-medium text-slate-900 break-all">
                      {profile?.email || '—'}
                    </p>
                    {profile?.emailVerified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-100">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

