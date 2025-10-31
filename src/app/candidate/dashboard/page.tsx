"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { 
  User, 
  Briefcase, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Building2, 
  Mail, 
  Phone, 
  CreditCard, 
  LogOut,
  TrendingUp,
  Calendar,
  Eye
} from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

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

export default function CandidateDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'offers' | 'profile' | 'status'>('overview')
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
  const [timeline, setTimeline] = useState<any[]>([])
  const [otp, setOtp] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verifyMsg, setVerifyMsg] = useState<string | null>(null)
  const [resending, setResending] = useState(false)
  const [resendMsg, setResendMsg] = useState<string | null>(null)
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})
  const [commentSubmitting, setCommentSubmitting] = useState<Record<string, boolean>>({})
  const [commentErrors, setCommentErrors] = useState<Record<string, string | null>>({})
  const [deletingComment, setDeletingComment] = useState<Record<string, boolean>>({})

  const getToken = () => localStorage.getItem('candidateToken') || sessionStorage.getItem('candidateToken')

  const normalizeProfile = (raw: any) => {
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
      updateHistory: candidate.updateHistory || [],
      id: candidate._id || candidate.id
    }
  }

  const normalizeOffers = (raw: any) => {
    if (!raw) return []
    const list = raw.offers || raw.data || raw.results || raw
    return Array.isArray(list) ? list : []
  }

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
        const { data } = await axios.get(`${API_BASE_URL}/api/candidate/me`, { headers: { Authorization: `Bearer ${token}` } })
        const normalized = normalizeProfile(data)
        setProfile(normalized)
        if (Array.isArray(normalized?.updateHistory)) {
          setTimeline(normalized.updateHistory)
        }
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || 'Failed to load profile'
        setError(msg)
      }
    }
    if (isAuthenticated) fetchProfile()
  }, [isAuthenticated])

  useEffect(() => {
    if (profile) {
      setProfileDraft({
        phone: profile.mobile || profile.mobileNumber || '',
        secondaryEmail: profile.secondaryEmail || '',
        currentAddress: profile.currentAddress || ''
      })
    }
  }, [profile, activeTab])

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
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update profile'
      setSaveError(msg)
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true)
        const token = getToken()
        if (!token) return
        
        // Try to fetch offers from the API
        const { data } = await axios.get(`${API_BASE_URL}/api/candidate/offers`, { 
          headers: { Authorization: `Bearer ${token}` } 
        })
        setOffers(normalizeOffers(data))
      } catch (err: any) {
        console.log('Could not fetch offers:', err?.response?.data?.message || err?.message)
        // Don't show error if endpoint doesn't exist yet
        setOffers([])
      } finally {
        setLoading(false)
      }
    }
    if (isAuthenticated) fetchOffers()
  }, [isAuthenticated])

  const fetchTimeline = async () => {
    try {
      const token = getToken()
      if (!token) return
      const { data } = await axios.get(`${API_BASE_URL}/api/candidate/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const normalized = normalizeProfile(data)
      const list = Array.isArray(normalized?.updateHistory) ? normalized.updateHistory : []
      setProfile(normalized)
      setTimeline(list)
    } catch {
      setTimeline([])
    }
  }

  useEffect(() => {
    if (isAuthenticated) fetchTimeline()
  }, [isAuthenticated])

  useEffect(() => {
    if (Array.isArray(profile?.updateHistory)) {
      setTimeline(profile.updateHistory)
    }
  }, [profile])

  const handleAddComment = async (entryId: string) => {
    const text = commentInputs[entryId]?.trim()
    if (!text) return
    setCommentSubmitting(prev => ({ ...prev, [entryId]: true }))
    setCommentErrors(prev => ({ ...prev, [entryId]: null }))
    try {
      const token = getToken()
      if (!token) throw new Error('Not authenticated')
      await axios.post(
        `${API_BASE_URL}/api/candidate/update-history/${entryId}/comments`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setCommentInputs(prev => ({ ...prev, [entryId]: '' }))
      await fetchTimeline()
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to add comment'
      setCommentErrors(prev => ({ ...prev, [entryId]: msg }))
    } finally {
      setCommentSubmitting(prev => ({ ...prev, [entryId]: false }))
    }
  }

  const handleDeleteComment = async (
    entryId: string,
    commentId: string,
    createdBy: any
  ) => {
    const currentId = (profile?.id || '').toString()
    const authorId = (createdBy?._id || createdBy || '').toString()
    if (!currentId || currentId !== authorId) return
    setDeletingComment(prev => ({ ...prev, [commentId]: true }))
    try {
      const token = getToken()
      if (!token) throw new Error('Not authenticated')
      await axios.delete(
        `${API_BASE_URL}/api/candidate/update-history/${entryId}/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      await fetchTimeline()
    } catch (err) {
      // no-op
    } finally {
      setDeletingComment(prev => ({ ...prev, [commentId]: false }))
    }
  }

  const handleViewOffer = (offer: Offer) => {
    setSelectedOffer(offer)
    setShowOfferModal(true)
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

  const handleLogout = () => {
    localStorage.removeItem('candidateToken')
    sessionStorage.removeItem('candidateToken')
    router.push('/candidate/login')
  }

  // Calculate stats
  const totalOffers = offers.length
  const joinedCount = offers.filter(o => o.joiningStatus === 'joined' || o.offerStatus === 'Joined').length
  const notJoinedCount = offers.filter(o => o.joiningStatus === 'not_joined' || o.offerStatus === 'Not Joined').length
  const pendingCount = offers.filter(o => !o.joiningStatus || o.joiningStatus === 'pending').length

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
      {/* Header */}
      <header className="border-b bg-white/70 backdrop-blur sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center min-w-0">
          <Link href="/" className="text-lg sm:text-xl font-bold text-red-600">Red-Flagged</Link>
              <span className="hidden sm:inline ml-3 text-xs text-gray-500">Candidate Portal</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-xs sm:text-sm text-gray-600 truncate">
            <span className="hidden sm:inline">Welcome, </span>
            <span className="font-semibold text-gray-900">{profile?.name || 'Candidate'}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-600 p-1.5 sm:p-2"
                title="Logout"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>

        
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">View your profile and offers from employers</p>
        </div>

        {/* Candidate Awareness Section removed as per request */}

        {/* Tabs */}
        <div className="mb-4 sm:mb-6 border-b border-gray-200">
          <nav className="flex overflow-x-auto no-scrollbar" aria-label="Tabs">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'offers', label: 'Offers' },
              { key: 'profile', label: 'Profile' },
              { key: 'status', label: 'Status' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`whitespace-nowrap px-3 sm:px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  activeTab === tab.key
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Stats Cards (Overview) */}
        {activeTab === 'overview' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs sm:text-sm text-gray-500">Total Offers</div>
              <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{totalOffers}</div>
            <p className="text-xs text-gray-500 mt-1">From employers</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs sm:text-sm text-gray-500">Joined</div>
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-green-600">{joinedCount}</div>
            <p className="text-xs text-gray-500 mt-1">Successfully joined</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs sm:text-sm text-gray-500">Not Joined</div>
              <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-red-600">{notJoinedCount}</div>
            <p className="text-xs text-gray-500 mt-1">Didn't join</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs sm:text-sm text-gray-500">Pending</div>
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-gray-500 mt-1">In progress</p>
          </div>
        </div>
        )}

        {/* Status (Update History) Tab */}
        {activeTab === 'status' && (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100 mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Status Timeline</h3>
          </div>
          {Array.isArray(timeline) && timeline.length > 0 ? (
            <div className="space-y-3">
              {timeline.map((h: any, idx: number) => (
                <div key={idx} className="rounded-lg border border-gray-200 p-3 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900">Point {h.points ?? idx + 1}</div>
                    <div className="text-xs text-gray-500">{h.date ? new Date(h.date).toLocaleString() : ''}</div>
                  </div>
                  <div className="mt-1 text-xs text-gray-600">
                    <span className="mr-2">By: {h.updatedByName || '-'} ({h.updatedByRole || '-'})</span>
                    {h.companyName && <span className="mr-2">Company: {h.companyName}</span>}
                  </div>
                  {h.notes && (
                    <div className="mt-1 text-sm text-gray-800">{h.notes}</div>
                  )}
                  {/* Show updated fields if present on this history entry */}
                  {(h.presentCompany || h.designation || h.workLocation || h.currentCtc || h.expectedHikePercentage || h.noticePeriod || h.negotiableDays || (Array.isArray(h.skillSets) && h.skillSets.length) || h.verificationNotes || h.status) && (
                    <div className="mt-2 text-xs text-gray-700">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {h.presentCompany && (
                          <div><span className="text-gray-500">Present Company:</span> <span className="text-gray-900">{h.presentCompany}</span></div>
                        )}
                        {h.designation && (
                          <div><span className="text-gray-500">Designation:</span> <span className="text-gray-900">{h.designation}</span></div>
                        )}
                        {h.workLocation && (
                          <div><span className="text-gray-500">Work Location:</span> <span className="text-gray-900">{h.workLocation}</span></div>
                        )}
                        {h.currentCtc && (
                          <div><span className="text-gray-500">Current CTC:</span> <span className="text-gray-900">{h.currentCtc}</span></div>
                        )}
                        {h.expectedHikePercentage && (
                          <div><span className="text-gray-500">Expected Hike %:</span> <span className="text-gray-900">{h.expectedHikePercentage}</span></div>
                        )}
                        {h.noticePeriod && (
                          <div><span className="text-gray-500">Notice Period:</span> <span className="text-gray-900">{h.noticePeriod}</span></div>
                        )}
                        {h.negotiableDays && (
                          <div><span className="text-gray-500">Negotiable Days:</span> <span className="text-gray-900">{h.negotiableDays}</span></div>
                        )}
                        {Array.isArray(h.skillSets) && h.skillSets.length > 0 && (
                          <div><span className="text-gray-500">Skill Sets:</span> <span className="text-gray-900">{h.skillSets.join(', ')}</span></div>
                        )}
                        {h.status && (
                          <div><span className="text-gray-500">Status:</span> <span className="text-gray-900 capitalize">{h.status}</span></div>
                        )}
                        {h.verificationNotes && (
                          <div className="sm:col-span-2"><span className="text-gray-500">Verification Notes:</span> <span className="text-gray-900">{h.verificationNotes}</span></div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Comments */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs font-medium text-gray-800 mb-2">Comments</div>
                    {Array.isArray(h.comments) && h.comments.length > 0 ? (
                      <div className="space-y-2">
                        {h.comments.map((c: any) => {
                          const authorId = (c?.createdBy?._id || c?.createdBy || '').toString()
                          const canDelete = (profile?.id || '').toString() === authorId
                          return (
                            <div key={c._id || `${authorId}-${c.createdAt}`} className="flex items-start justify-between bg-gray-50 rounded p-2">
                              <div className="text-xs text-gray-800">
                                <div className="whitespace-pre-wrap break-words">{c.text}</div>
                                <div className="text-[10px] text-gray-500 mt-1">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</div>
                              </div>
                              {canDelete && (
                                <button
                                  onClick={() => handleDeleteComment(h._id, c._id, c.createdBy)}
                                  disabled={!!deletingComment[c._id]}
                                  className="ml-2 text-xs text-red-600 hover:text-red-800"
                                >
                                  {deletingComment[c._id] ? 'Deleting...' : 'Delete'}
                                </button>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500">No comments yet.</div>
                    )}

                    <div className="mt-2 flex items-start gap-2">
                      <input
                        type="text"
                        value={commentInputs[h._id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [h._id]: e.target.value }))}
                        placeholder="Add a comment..."
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <button
                        onClick={() => handleAddComment(h._id)}
                        disabled={!!commentSubmitting[h._id] || !(commentInputs[h._id]?.trim())}
                        className={`px-3 py-2 rounded-md text-xs font-medium text-white ${commentSubmitting[h._id] ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'}`}
                      >
                        {commentSubmitting[h._id] ? 'Posting...' : 'Comment'}
                      </button>
                    </div>
                    {commentErrors[h._id] && (
                      <div className="mt-1 text-[11px] text-red-600">{commentErrors[h._id]}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-600">No updates yet.</div>
          )}
        </div>
        )}

        {/* Overview: What You Can Do */}
        {activeTab === 'overview' && (
        <div className="mb-6 sm:mb-10">
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="px-4 sm:px-6 py-4 sm:py-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">What you can do</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 rounded-md bg-red-50/60 border border-red-100">
                  <div className="text-sm font-medium text-gray-900 mb-1">Employers Check Your History</div>
                  <p className="text-xs sm:text-sm text-gray-600">Employers use Red-Flagged.com to verify your history of offers rejected and credentials.</p>
                </div>
                <div className="p-3 rounded-md bg-blue-50/60 border border-blue-100">
                  <div className="text-sm font-medium text-gray-900 mb-1">Get Transparency</div>
                  <p className="text-xs sm:text-sm text-gray-600">You'll know if an employer has Red-Flagged you and why.</p>
                </div>
                <div className="p-3 rounded-md bg-green-50/60 border border-green-100">
                  <div className="text-sm font-medium text-gray-900 mb-1">Build Trust</div>
                  <p className="text-xs sm:text-sm text-gray-600">Be upfront about your history to build trust with potential employers.</p>
                </div>
                <div className="p-3 rounded-md bg-amber-50/60 border border-amber-100">
                  <div className="text-sm font-medium text-gray-900 mb-1">Take Control</div>
                  <p className="text-xs sm:text-sm text-gray-600">Understand what employers see when they check your history.</p>
                </div>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Link href="#" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700">Review My Record</Link>
                <Link href="#" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">Dispute/Clarify a Record</Link>
              </div>
            </div>
          </div>
        </div>
        )}


        {/* Offers from Employers (Offers Tab) */}
        {activeTab === 'offers' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Offers & Records</h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Employers have submitted these records about you</p>
              </div>
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-sm">Loading offers...</p>
              </div>
            ) : offers.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <Briefcase className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Offers Yet</h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                  When employers submit information about offers or candidates, they will appear here.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Position
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Offer Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joining Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {offers.map((offer, index) => (
                        <tr key={offer._id || offer.id || index} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                              <div className="text-sm font-medium text-gray-900">
                                {offer.employerName || offer.companyName || 'Unknown Company'}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{offer.position || offer.jobRole || '-'}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {offer.offerDate ? new Date(offer.offerDate).toLocaleDateString() : '-'}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {offer.joiningDate ? new Date(offer.joiningDate).toLocaleDateString() : '-'}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              offer.joiningStatus === 'joined' || offer.offerStatus === 'Joined'
                                ? 'bg-green-100 text-green-800'
                                : offer.joiningStatus === 'not_joined' || offer.offerStatus === 'Not Joined'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {offer.joiningStatus === 'joined' ? 'Joined' :
                               offer.joiningStatus === 'not_joined' ? 'Not Joined' :
                               offer.offerStatus || 'Pending'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleViewOffer(offer)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4">
                  {offers.map((offer, index) => (
                    <div key={offer._id || offer.id || index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center mb-1">
                            <Building2 className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                            <h3 className="font-medium text-gray-900 text-sm truncate">
                              {offer.employerName || offer.companyName || 'Unknown Company'}
                            </h3>
                          </div>
                          <p className="text-xs text-gray-600">{offer.position || offer.jobRole || '-'}</p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${
                          offer.joiningStatus === 'joined' || offer.offerStatus === 'Joined'
                            ? 'bg-green-100 text-green-800'
                            : offer.joiningStatus === 'not_joined' || offer.offerStatus === 'Not Joined'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {offer.joiningStatus === 'joined' ? 'Joined' :
                           offer.joiningStatus === 'not_joined' ? 'Not Joined' :
                           offer.offerStatus || 'Pending'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                        <div>
                          <span className="text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Offer Date
                          </span>
                          <p className="text-gray-900 mt-0.5">
                            {offer.offerDate ? new Date(offer.offerDate).toLocaleDateString() : '-'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Joining Date
                          </span>
                          <p className="text-gray-900 mt-0.5">
                            {offer.joiningDate ? new Date(offer.joiningDate).toLocaleDateString() : '-'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleViewOffer(offer)}
                        className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-xs font-medium flex items-center justify-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        )}

        {/* Profile Details (Profile Tab) */}
        {activeTab === 'profile' && (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Your Profile</h3>
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
                <button type="submit" disabled={verifying} className={`px-4 py-2 rounded-md text-sm font-medium text-white ${verifying ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'}`}>
                  {verifying ? 'Verifying...' : 'Verify Email'}
                </button>
                <button type="button" onClick={handleResendOtp} disabled={resending} className="px-4 py-2 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-100">
                  {resending ? 'Sending...' : 'Resend OTP'}
                </button>
              </form>
              {(verifyMsg || resendMsg) && (
                <div className="mt-3 text-xs text-gray-600">{verifyMsg || resendMsg}</div>
              )}
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700" onClick={() => setIsEditing(true)}>
              Edit Details
            </button>
            <button className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50" onClick={() => { setChangingPwd(v => !v); setPwdMsg(null); }}>
              Change Password
            </button>
          </div>

          {changingPwd && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Change Password</h4>
              {pwdMsg && <div className="mb-3 text-sm text-gray-700">{pwdMsg}</div>}
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
                  setChangingPwd(false)
                } catch (err: any) {
                  const msg = err?.response?.data?.message || err?.message || 'Failed to change password'
                  setPwdMsg(msg)
                }
              }} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm text-gray-600 mb-1">Current Password</label>
                  <input type="password" value={pwdForm.currentPassword} onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-gray-600 mb-1">New Password</label>
                  <input type="password" value={pwdForm.newPassword} onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div className="sm:col-span-2 flex gap-3 pt-2">
                  <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700">Update Password</button>
                  <button type="button" onClick={() => { setChangingPwd(false); setPwdMsg(null); }} className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50">Cancel</button>
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
                  <input type="tel" value={profileDraft.phone} onChange={(e) => setProfileDraft({ ...profileDraft, phone: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-gray-600 mb-1">Secondary Email</label>
                  <input type="email" value={profileDraft.secondaryEmail} onChange={(e) => setProfileDraft({ ...profileDraft, secondaryEmail: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-gray-600 mb-1">Current Address</label>
                  <input type="text" value={profileDraft.currentAddress} onChange={(e) => setProfileDraft({ ...profileDraft, currentAddress: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div className="sm:col-span-2 flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${saving ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'}`}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={() => { setIsEditing(false); setSaveError(null); setSaveSuccess(null); }} className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        )}

      </main>

      {/* Offer Details Modal */}
      {showOfferModal && selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Offer Details</h3>
              <button
                onClick={() => setShowOfferModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Company Name</div>
                    <div className="text-base font-medium text-gray-900">
                      {selectedOffer.employerName || selectedOffer.companyName || '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Position</div>
                    <div className="text-base font-medium text-gray-900">
                      {selectedOffer.position || selectedOffer.jobRole || '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Offer Date</div>
                    <div className="text-base font-medium text-gray-900">
                      {selectedOffer.offerDate ? new Date(selectedOffer.offerDate).toLocaleDateString() : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Joining Date</div>
                    <div className="text-base font-medium text-gray-900">
                      {selectedOffer.joiningDate ? new Date(selectedOffer.joiningDate).toLocaleDateString() : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Offer Status</div>
                    <div className="text-base font-medium text-gray-900">
                      {selectedOffer.offerStatus || '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Joining Status</div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedOffer.joiningStatus === 'joined' || selectedOffer.offerStatus === 'Joined'
                        ? 'bg-green-100 text-green-800'
                        : selectedOffer.joiningStatus === 'not_joined' || selectedOffer.offerStatus === 'Not Joined'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedOffer.joiningStatus === 'joined' ? 'Joined' :
                       selectedOffer.joiningStatus === 'not_joined' ? 'Not Joined' :
                       selectedOffer.joiningStatus || selectedOffer.offerStatus || 'Pending'}
                    </span>
                  </div>
                </div>

                {selectedOffer.reason && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Reason</div>
                    <div className="text-base text-gray-900 bg-gray-50 rounded p-3">
                      {selectedOffer.reason}
                    </div>
                  </div>
                )}

                {selectedOffer.notes && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Additional Notes</div>
                    <div className="text-base text-gray-900 bg-gray-50 rounded p-3">
                      {selectedOffer.notes}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Record created: {selectedOffer.createdAt ? new Date(selectedOffer.createdAt).toLocaleString() : '-'}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowOfferModal(false)}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


