"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'
import { User, Mail, Phone, CreditCard } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.red-flagged.com'

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [profileDraft, setProfileDraft] = useState({
    phone: '',
    secondaryEmail: '',
    currentAddress: ''
  })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [otp, setOtp] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verifyMsg, setVerifyMsg] = useState<string | null>(null)
  const [resending, setResending] = useState(false)
  const [resendMsg, setResendMsg] = useState<string | null>(null)

  const getToken = () => localStorage.getItem('candidateToken') || sessionStorage.getItem('candidateToken')

  const normalizeProfile = (raw: any): any => {
    if (!raw) return null
    const candidate = raw.candidate || raw.user || raw.profile || raw.data || raw
    return {
      name: candidate.name || candidate.fullName || '',
      email: candidate.email || candidate.primaryEmail || '',
      primaryEmail: candidate.primaryEmail,
      mobile: candidate.mobile || candidate.mobileNumber || '',
      mobileNumber: candidate.mobileNumber,
      pan: candidate.pan || candidate.panNumber || '',
      panNumber: candidate.panNumber,
      uan: candidate.uan || candidate.uanNumber || '',
      uanNumber: candidate.uanNumber,
      status: candidate.status || candidate.accountStatus || 'pending',
      emailVerified: candidate.emailVerified ?? candidate.isEmailVerified ?? false,
      id: candidate._id || candidate.id,
      secondaryEmail: candidate.secondaryEmail || '',
      currentAddress: candidate.currentAddress || ''
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getToken()
        if (!token) return
        const { data } = await axios.get(`${API_BASE_URL}/api/candidate/me`, { 
          headers: { Authorization: `Bearer ${token}` } 
        })
        const normalized = normalizeProfile(data)
        setProfile(normalized)
        setProfileDraft({
          phone: normalized?.mobile || normalized?.mobileNumber || '',
          secondaryEmail: normalized?.secondaryEmail || '',
          currentAddress: normalized?.currentAddress || ''
        })
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || 'Failed to load profile'
        setError(msg)
      }
    }
    fetchProfile()
  }, [])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(null)
    try {
      const token = getToken()
      if (!token) throw new Error('Not authenticated')
      // Only allow updating secondaryEmail and currentAddress (phone is view-only)
      const payload = {
        secondaryEmail: profileDraft.secondaryEmail,
        currentAddress: profileDraft.currentAddress
      }
      const { data } = await axios.put(`${API_BASE_URL}/api/candidate/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProfile(normalizeProfile(data))
      setSaveSuccess('Profile updated successfully')
      setIsEditing(false)
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update profile'
      setSaveError(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setVerifying(true)
    setVerifyMsg(null)
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/verify-email`, {
        role: 'candidate',
        email: profile?.email || profile?.primaryEmail,
        otp
      })
      if (data?.emailVerified) {
        setProfile({ ...profile, emailVerified: true })
        setVerifyMsg('Email verified successfully')
        setOtp('')
      } else {
        setVerifyMsg('Verification submitted')
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Verification failed'
      setVerifyMsg(msg)
    } finally {
      setVerifying(false)
    }
  }

  const handleResendOtp = async () => {
    setResending(true)
    setResendMsg(null)
    try {
      const body: any = { role: 'candidate' }
      if (profile?.email || profile?.primaryEmail) body.email = profile.email || profile.primaryEmail
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/resend-otp`, body)
      if (data?.emailVerified) {
        setProfile({ ...profile, emailVerified: true })
        setResendMsg('Email already verified')
      } else if (data?.sent) {
        setResendMsg('OTP sent to your email')
      } else {
        setResendMsg('Request processed')
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to resend OTP'
      setResendMsg(msg)
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-red-50 via-white to-slate-50 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 sm:py-6">
      <div className="max-w-5xl mx-auto">
        {/* Premium Header */}
        <div className="mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold mb-3">
            <User className="h-3 w-3" />
            Candidate Profile
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            {profile?.name || 'Your Profile'}
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-2xl">
            View and keep your candidate information up to date so employers can trust your profile.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left highlight card */}
          <div className="lg:col-span-1">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border border-slate-800/60">
              <div className="absolute -right-12 -top-10 h-40 w-40 rounded-full bg-red-500/30 blur-2xl" />
              <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
              <div className="relative p-6 sm:p-7 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-slate-300">Candidate</p>
                    <p className="text-lg font-semibold truncate max-w-[14rem]">
                      {profile?.name || 'Not set'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 text-xs sm:text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-300">Primary Email</span>
                    <span className="font-semibold text-slate-50 truncate max-w-[10rem]">
                      {profile?.email || profile?.primaryEmail || '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-300">PAN</span>
                    <span className="font-medium text-slate-50">
                      {profile?.pan || profile?.panNumber || '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-300">UAN</span>
                    <span className="font-medium text-slate-50">
                      {profile?.uan || profile?.uanNumber || '—'}
                    </span>
                  </div>
                </div>

                {profile?.status && (
                  <div className="pt-1 border-t border-white/10 mt-2">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 mb-2">
                      Account Status
                    </p>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                        profile?.status === 'approved' || profile?.status === 'active'
                          ? 'bg-emerald-100/20 text-emerald-200 border-emerald-300/40'
                          : profile?.status === 'suspended'
                          ? 'bg-red-100/20 text-red-200 border-red-300/40'
                          : 'bg-yellow-100/20 text-yellow-200 border-yellow-300/40'
                      }`}
                    >
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1.5" />
                      {profile?.status || 'Pending'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right detail + forms */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base font-semibold text-slate-900 tracking-wide">
                  Profile Information
                </h3>
              </div>

              {profile?.status !== 'approved' && (
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-xs sm:text-sm text-amber-800">
                  Your account is pending approval by an admin. You can still review and edit your details
                  below.
                </div>
              )}

              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 mb-1">
                    Name
                  </p>
                  <p className="text-slate-900 font-medium">{profile?.name || '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 mb-1">
                    Email
                  </p>
                  <p className="text-slate-900 font-medium break-words">
                    {profile?.email || profile?.primaryEmail || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 mb-1">
                    Phone
                  </p>
                  <p className="text-slate-900 font-medium">
                    {profile?.mobile || profile?.mobileNumber || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 mb-1">
                    PAN Number
                  </p>
                  <p className="text-slate-900 font-medium">
                    {profile?.pan || profile?.panNumber || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 mb-1">
                    UAN Number
                  </p>
                  <p className="text-slate-900 font-medium">
                    {profile?.uan || profile?.uanNumber || '—'}
                  </p>
                </div>
                 <div>
                   <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 mb-1">
                     Secondary Email
                   </p>
                   <p className="text-slate-900 font-medium break-words">
                     {profile?.secondaryEmail || '—'}
                   </p>
                 </div>
                 <div>
                   <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 mb-1">
                     Current Address
                   </p>
                   <p className="text-slate-900 font-medium">
                     {profile?.currentAddress || '—'}
                   </p>
                 </div>
              </div>

              {/* Email verification */}
              {profile && profile.email && !profile.emailVerified && (
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-slate-900">Verify your email</div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                      Not verified
                    </span>
                  </div>
                  <form
                    onSubmit={handleVerifyEmail}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button
                      type="submit"
                      disabled={verifying}
                      className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors ${
                        verifying ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {verifying ? 'Verifying...' : 'Verify Email'}
                    </button>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resending}
                      className="px-4 py-2 rounded-md text-sm font-medium border border-slate-300 hover:bg-slate-100 transition-colors"
                    >
                      {resending ? 'Sending...' : 'Resend OTP'}
                    </button>
                  </form>
                  {(verifyMsg || resendMsg) && (
                    <div className="mt-3 text-xs text-slate-600">{verifyMsg || resendMsg}</div>
                  )}
                </div>
              )}

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Details
                </button>
              </div>

              {isEditing && (
                <div className="mt-6 border-t border-slate-200 pt-6">
                  <h4 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">
                    Update Your Details
                  </h4>
                  {saveError && (
                    <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      {saveError}
                    </div>
                  )}
                  {saveSuccess && (
                    <div className="mb-4 rounded border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                      {saveSuccess}
                    </div>
                  )}
                  <form
                    onSubmit={handleSaveProfile}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
                  >
                    <div>
                      <label className="block text-xs sm:text-sm text-slate-600 mb-1">
                        Secondary Email
                      </label>
                      <input
                        type="email"
                        value={profileDraft.secondaryEmail}
                        onChange={(e) =>
                          setProfileDraft({ ...profileDraft, secondaryEmail: e.target.value })
                        }
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-slate-600 mb-1">
                        Current Address
                      </label>
                      <input
                        type="text"
                        value={profileDraft.currentAddress}
                        onChange={(e) =>
                          setProfileDraft({ ...profileDraft, currentAddress: e.target.value })
                        }
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div className="sm:col-span-2 flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={saving}
                        className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
                          saving ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
                        }`}
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false)
                          setSaveError(null)
                          setSaveSuccess(null)
                        }}
                        className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-300 hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

