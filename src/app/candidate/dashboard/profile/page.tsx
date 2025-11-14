"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'
import { User, Mail, Phone, CreditCard } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

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
  const [changingPwd, setChangingPwd] = useState(false)
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '' })
  const [pwdMsg, setPwdMsg] = useState<string | null>(null)
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
      const payload = {
        phone: profileDraft.phone,
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
    <>
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Profile</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your profile information and settings</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Profile Information</h3>
            <User className="h-5 w-5 text-gray-400" />
          </div>
          
          {profile?.status !== 'approved' && (
            <div className="mb-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Your account is pending approval by an admin. You can still review and edit your details below.
            </div>
          )}

          {error && <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-1">
                <User className="h-4 w-4 mr-1" />
                Name
              </div>
              <div className="text-sm sm:text-base text-gray-900 font-medium">{profile?.name || '-'}</div>
            </div>
            <div>
              <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-1">
                <Mail className="h-4 w-4 mr-1" />
                Email
              </div>
              <div className="text-sm sm:text-base text-gray-900 font-medium break-words">{profile?.email || profile?.primaryEmail || '-'}</div>
            </div>
            <div>
              <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-1">
                <Phone className="h-4 w-4 mr-1" />
                Phone
              </div>
              <div className="text-sm sm:text-base text-gray-900 font-medium">{profile?.mobile || profile?.mobileNumber || '-'}</div>
            </div>
            <div>
              <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-1">
                <CreditCard className="h-4 w-4 mr-1" />
                PAN Number
              </div>
              <div className="text-sm sm:text-base text-gray-900 font-medium">{profile?.pan || profile?.panNumber || '-'}</div>
            </div>
            <div>
              <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-1">
                <CreditCard className="h-4 w-4 mr-1" />
                UAN Number
              </div>
              <div className="text-sm sm:text-base text-gray-900 font-medium">{profile?.uan || profile?.uanNumber || '-'}</div>
            </div>
            <div>
              <div className="text-xs sm:text-sm text-gray-500 mb-1">
                Account Status
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                profile?.status === 'approved' || profile?.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : profile?.status === 'suspended'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {profile?.status || 'Pending'}
              </span>
            </div>
          </div>

          {/* Email verification */}
          {profile && profile.email && !profile.emailVerified && (
            <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-gray-900">Verify your email</div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">Not verified</span>
              </div>
              <form onSubmit={handleVerifyEmail} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button type="submit" disabled={verifying} className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors ${verifying ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'}`}>
                  {verifying ? 'Verifying...' : 'Verify Email'}
                </button>
                <button type="button" onClick={handleResendOtp} disabled={resending} className="px-4 py-2 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-100 transition-colors">
                  {resending ? 'Sending...' : 'Resend OTP'}
                </button>
              </form>
              {(verifyMsg || resendMsg) && (
                <div className="mt-3 text-xs text-gray-600">{verifyMsg || resendMsg}</div>
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
            <button 
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors" 
              onClick={() => { setChangingPwd(v => !v); setPwdMsg(null); }}
            >
              Change Password
            </button>
          </div>

          {changingPwd && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Change Password</h4>
              {pwdMsg && <div className={`mb-3 text-sm ${pwdMsg.includes('success') ? 'text-green-700' : 'text-gray-700'}`}>{pwdMsg}</div>}
              <form onSubmit={async (e) => {
                e.preventDefault()
                setPwdMsg(null)
                try {
                  const token = getToken()
                  if (!token) throw new Error('Not authenticated')
                  await axios.patch(`${API_BASE_URL}/api/candidate/password`, {
                    currentPassword: pwdForm.currentPassword,
                    newPassword: pwdForm.newPassword
                  }, { headers: { Authorization: `Bearer ${token}` } })
                  setPwdMsg('Password updated successfully')
                  setPwdForm({ currentPassword: '', newPassword: '' })
                  setTimeout(() => {
                    setChangingPwd(false)
                    setPwdMsg(null)
                  }, 2000)
                } catch (err: any) {
                  const msg = err?.response?.data?.message || err?.message || 'Failed to change password'
                  setPwdMsg(msg)
                }
              }} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm text-gray-600 mb-1">Current Password</label>
                  <input 
                    type="password" 
                    value={pwdForm.currentPassword} 
                    onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })} 
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-gray-600 mb-1">New Password</label>
                  <input 
                    type="password" 
                    value={pwdForm.newPassword} 
                    onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })} 
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" 
                  />
                </div>
                <div className="sm:col-span-2 flex gap-3 pt-2">
                  <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors">Update Password</button>
                  <button type="button" onClick={() => { setChangingPwd(false); setPwdMsg(null); }} className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors">Cancel</button>
                </div>
              </form>
            </div>
          )}

          {isEditing && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Update Your Details</h4>
              {saveError && <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{saveError}</div>}
              {saveSuccess && <div className="mb-4 rounded border border-green-200 bg-green-50 p-3 text-sm text-green-700">{saveSuccess}</div>}
              <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm text-gray-600 mb-1">Phone</label>
                  <input 
                    type="tel" 
                    value={profileDraft.phone} 
                    onChange={(e) => setProfileDraft({ ...profileDraft, phone: e.target.value })} 
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-gray-600 mb-1">Secondary Email</label>
                  <input 
                    type="email" 
                    value={profileDraft.secondaryEmail} 
                    onChange={(e) => setProfileDraft({ ...profileDraft, secondaryEmail: e.target.value })} 
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-gray-600 mb-1">Current Address</label>
                  <input 
                    type="text" 
                    value={profileDraft.currentAddress} 
                    onChange={(e) => setProfileDraft({ ...profileDraft, currentAddress: e.target.value })} 
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" 
                  />
                </div>
                <div className="sm:col-span-2 flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${saving ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'}`}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={() => { setIsEditing(false); setSaveError(null); setSaveSuccess(null); }} className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
    </>
  )
}

