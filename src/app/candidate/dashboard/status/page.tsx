"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Activity, MessageSquare, Building2, User, Briefcase, MapPin, DollarSign, TrendingUp, Calendar, Clock, CheckCircle2, FileText, Sparkles } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function StatusPage() {
  const [profile, setProfile] = useState<any>(null)
  const [timeline, setTimeline] = useState<any[]>([])
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
      id: candidate._id || candidate.id,
      updateHistory: candidate.updateHistory || []
    }
  }

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
    fetchTimeline()
  }, [])

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

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || ''
    if (statusLower.includes('selected') || statusLower.includes('approved') || statusLower.includes('accepted')) {
      return 'bg-green-100 text-green-800 border-green-300'
    }
    if (statusLower.includes('rejected') || statusLower.includes('declined')) {
      return 'bg-red-100 text-red-800 border-red-300'
    }
    if (statusLower.includes('pending') || statusLower.includes('review')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    }
    if (statusLower.includes('interview') || statusLower.includes('shortlisted')) {
      return 'bg-blue-100 text-blue-800 border-blue-300'
    }
    return 'bg-gray-100 text-gray-800 border-gray-300'
  }

  return (
    <>
      {/* Attractive Header with Gradient */}
      <div className="mb-6 sm:mb-8">
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-xl shadow-lg p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold">Your Red-Flagged from companies</h1>
            </div>
            <p className="text-red-50 text-sm sm:text-base mt-2">Track your journey and application updates</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Red-Flagged History</h3>
          </div>
        </div>
        {Array.isArray(timeline) && timeline.length > 0 ? (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-200 via-red-300 to-red-200 hidden sm:block"></div>
            
            <div className="space-y-6 sm:space-y-8">
              {timeline.map((h: any, idx: number) => (
                <div key={idx} className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute left-4 sm:left-6 top-6 z-10 hidden sm:block">
                    <div className="w-4 h-4 bg-red-600 rounded-full border-4 border-white shadow-lg"></div>
                  </div>

                  <div className="ml-0 sm:ml-12 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 hover:border-red-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
                    {/* Company Name Header - Very Prominent */}
                    {h.companyName && (
                      <div className="bg-gradient-to-r from-red-600 to-red-500 p-4 sm:p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-2">
                            <Building2 className="h-6 w-6 sm:h-8 sm:w-8" />
                            <h2 className="text-xl sm:text-3xl font-bold">{h.companyName}</h2>
                          </div>
                          {/* Employer Position - Prominently Displayed */}
                          {h.updatedByRole && (
                            <div className="flex items-center gap-2 mt-2 text-red-50">
                              <Briefcase className="h-4 w-4" />
                              <span className="text-sm sm:text-base font-semibold">{h.updatedByRole}</span>
                            </div>
                          )}
                          {h.updatedByName && (
                            <div className="flex items-center gap-2 mt-1 text-red-100">
                              <User className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="text-xs sm:text-sm">{h.updatedByName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="p-4 sm:p-6">
                      {/* Status Badge */}
                      {h.status && (
                        <div className="mb-4">
                          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(h.status)}`}>
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="capitalize">{h.status}</span>
                          </span>
                        </div>
                      )}

                      {/* Point Number and Date */}
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                            Red-Flagged {h.points ?? idx + 1}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span className="text-xs sm:text-sm">{h.date ? new Date(h.date).toLocaleString() : ''}</span>
                        </div>
                      </div>

                      {/* Notes */}
                      {h.notes && (
                        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                          <div className="flex items-start gap-2">
                            <FileText className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-800">{h.notes}</p>
                          </div>
                        </div>
                      )}

                      {/* Updated Fields Grid */}
                      {(h.presentCompany || h.designation || h.workLocation || h.currentCtc || h.expectedHikePercentage || h.noticePeriod || h.negotiableDays || (Array.isArray(h.skillSets) && h.skillSets.length) || h.verificationNotes) && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-red-600" />
                            Updated Information
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {h.presentCompany && (
                              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2 mb-1">
                                  <Building2 className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs text-gray-500 font-medium">Present Company</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{h.presentCompany}</span>
                              </div>
                            )}
                            {h.designation && (
                              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2 mb-1">
                                  <Briefcase className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs text-gray-500 font-medium">Designation</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{h.designation}</span>
                              </div>
                            )}
                            {h.workLocation && (
                              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2 mb-1">
                                  <MapPin className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs text-gray-500 font-medium">Work Location</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{h.workLocation}</span>
                              </div>
                            )}
                            {h.currentCtc && (
                              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2 mb-1">
                                  <DollarSign className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs text-gray-500 font-medium">Current CTC</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{h.currentCtc}</span>
                              </div>
                            )}
                            {h.expectedHikePercentage && (
                              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2 mb-1">
                                  <TrendingUp className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs text-gray-500 font-medium">Expected Hike %</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{h.expectedHikePercentage}%</span>
                              </div>
                            )}
                            {h.noticePeriod && (
                              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2 mb-1">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs text-gray-500 font-medium">Notice Period</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{h.noticePeriod}</span>
                              </div>
                            )}
                            {h.negotiableDays && (
                              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2 mb-1">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs text-gray-500 font-medium">Negotiable Days</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{h.negotiableDays}</span>
                              </div>
                            )}
                            {Array.isArray(h.skillSets) && h.skillSets.length > 0 && (
                              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 sm:col-span-2">
                                <div className="flex items-center gap-2 mb-2">
                                  <Sparkles className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs text-gray-500 font-medium">Skill Sets</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {h.skillSets.map((skill: string, skillIdx: number) => (
                                    <span key={skillIdx} className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs font-medium">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {h.verificationNotes && (
                              <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400 sm:col-span-2">
                                <div className="flex items-center gap-2 mb-1">
                                  <FileText className="h-4 w-4 text-yellow-600" />
                                  <span className="text-xs text-yellow-700 font-medium">Verification Notes</span>
                                </div>
                                <span className="text-sm text-gray-900">{h.verificationNotes}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Comments Section */}
                      <div className="mt-4 pt-4 border-t-2 border-gray-200">
                        <div className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                          <MessageSquare className="h-4 w-4 mr-2 text-red-600" />
                          Your Red-Flagged Justification
                        </div>
                        {Array.isArray(h.comments) && h.comments.length > 0 ? (
                          <div className="space-y-3 mb-4">
                            {h.comments.map((c: any) => {
                              const authorId = (c?.createdBy?._id || c?.createdBy || '').toString()
                              const canDelete = (profile?.id || '').toString() === authorId
                              return (
                                <div key={c._id || `${authorId}-${c.createdAt}`} className="flex items-start justify-between bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 border border-gray-200 hover:border-red-200 transition-colors">
                                  <div className="text-sm text-gray-800 flex-1">
                                    <div className="whitespace-pre-wrap break-words mb-1">{c.text}</div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}
                                    </div>
                                  </div>
                                  {canDelete && (
                                    <button
                                      onClick={() => handleDeleteComment(h._id, c._id, c.createdBy)}
                                      disabled={!!deletingComment[c._id]}
                                      className="ml-3 text-xs text-red-600 hover:text-red-800 font-medium transition-colors px-2 py-1 hover:bg-red-50 rounded"
                                    >
                                      {deletingComment[c._id] ? 'Deleting...' : 'Delete'}
                                    </button>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 mb-4 italic">No justification yet. Add your justification!</div>
                        )}

                        <div className="flex items-start gap-2">
                          <input
                            type="text"
                            value={commentInputs[h._id] || ''}
                            onChange={(e) => setCommentInputs(prev => ({ ...prev, [h._id]: e.target.value }))}
                            placeholder="Add your Red-Flagged justification..."
                            className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !commentSubmitting[h._id] && commentInputs[h._id]?.trim()) {
                                handleAddComment(h._id)
                              }
                            }}
                          />
                          <button
                            onClick={() => handleAddComment(h._id)}
                            disabled={!!commentSubmitting[h._id] || !(commentInputs[h._id]?.trim())}
                            className={`px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all shadow-md hover:shadow-lg ${commentSubmitting[h._id] ? 'bg-red-400 cursor-not-allowed' : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600'}`}
                          >
                            {commentSubmitting[h._id] ? 'Posting...' : 'Red-Flagged Justify'}
                          </button>
                        </div>
                        {commentErrors[h._id] && (
                          <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">{commentErrors[h._id]}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 sm:p-12 max-w-md mx-auto">
              <div className="bg-red-100 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="h-10 w-10 sm:h-12 sm:w-12 text-red-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No Updates Yet</h3>
              <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
                Your status updates and timeline will appear here once available. Stay tuned!
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

