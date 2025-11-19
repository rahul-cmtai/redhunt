"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'
import { FileText, Building2, User, Calendar, Clock, MessageSquare, Search, Filter, Sparkles, Activity, Briefcase, ChevronDown, ChevronUp } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.red-flagged.com'

export default function RemarksPage() {
  const [allRemarks, setAllRemarks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterByRole, setFilterByRole] = useState<'all' | 'employer' | 'admin'>('all')
  const [expandedRemarks, setExpandedRemarks] = useState<Record<string, boolean>>({})

  const getToken = () => localStorage.getItem('employerToken') || sessionStorage.getItem('employerToken')

  const fetchAllRemarks = async () => {
    try {
      setLoading(true)
      const token = getToken()
      if (!token) {
        console.error('No token found')
        return
      }

      // Fetch all candidates (including verified candidate users)
      // Use /candidates/all to get both invited and verified candidates
      const { data } = await axios.get(`${API_BASE_URL}/api/employer/candidates/all`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const candidates = Array.isArray(data) ? data : (data?.candidates || data?.data || [])
      console.log('Fetched candidates:', candidates.length)
      console.log('Sample candidate:', candidates[0])
      
      // Filter only verified candidates - must be type 'verified' (CandidateUser)
      // These are the ones that have updateHistory
      const verifiedCandidates = candidates.filter((c: any) => {
        // Must be type 'verified' - these are CandidateUser records
        if (c.type !== 'verified') return false
        
        // Additional checks to ensure it's a verified candidate user
        // The API should only return approved candidate users, but double-check
        return true
      })
      
      console.log('Verified candidates (type=verified):', verifiedCandidates.length)

      // Fetch update history for each verified candidate
      const remarksPromises = verifiedCandidates.map(async (candidate: any) => {
        try {
          const candidateId = candidate.id || candidate._id
          if (!candidateId) {
            console.warn('Candidate missing ID:', candidate)
            return []
          }
          
          console.log(`Fetching history for candidate ${candidateId} (${candidate.name || candidate.fullName})`)
          
          const historyRes = await axios.get(
            `${API_BASE_URL}/api/employer/candidate-users/${candidateId}/update-history`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
          
          const history = historyRes.data?.updateHistory || []
          console.log(`Found ${history.length} history entries for candidate ${candidateId}`)
          
          // Attach full candidate info to each remark
          return history.map((entry: any) => ({
            ...entry,
            candidateId: candidateId,
            candidateName: candidate.name || candidate.fullName || 'Unknown',
            candidateEmail: candidate.email || candidate.primaryEmail || '',
            candidatePan: candidate.pan || candidate.panNumber || '',
            // Additional candidate details for profile display
            workExperience: candidate.workExperience,
            currentCtc: candidate.currentCtc,
            workLocation: candidate.workLocation,
            designation: candidate.designation,
            presentCompany: candidate.presentCompany,
            highestQualification: candidate.highestQualification,
            skillSets: candidate.skillSets,
            sector: candidate.sector,
            openToRelocation: candidate.openToRelocation
          }))
        } catch (err: any) {
          // Log all errors for debugging
          const status = err?.response?.status
          const message = err?.response?.data?.message || err?.message
          console.warn(`Failed to fetch history for candidate ${candidate.id || candidate._id}:`, {
            status,
            message,
            candidateName: candidate.name || candidate.fullName
          })
          
          // Return empty array if 404 or 403 (candidate not approved or not found)
          if (status === 404 || status === 403) {
            return []
          }
          
          // For other errors, also return empty but log
          return []
        }
      })

      const remarksArrays = await Promise.all(remarksPromises)
      const allRemarksFlat = remarksArrays.flat()
      
      console.log('Total remarks fetched:', allRemarksFlat.length)
      
      // Sort by date (newest first)
      allRemarksFlat.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0
        const dateB = b.date ? new Date(b.date).getTime() : 0
        return dateB - dateA
      })

      setAllRemarks(allRemarksFlat)
    } catch (err: any) {
      console.error('Failed to fetch remarks:', err?.response?.data || err?.message || err)
      setAllRemarks([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllRemarks()
  }, [])

  const filteredRemarks = allRemarks.filter((remark) => {
    const searchLower = searchQuery.toLowerCase().trim()
    
    // If search query exists, prioritize candidate name/email/PAN matching
    // Only show remarks for candidates that match the search
    let matchesSearch = true
    if (searchQuery) {
      // Check if this remark belongs to a candidate that matches the search
      const candidateMatches = 
        (remark.candidateName || '').toLowerCase().includes(searchLower) ||
        (remark.candidateEmail || '').toLowerCase().includes(searchLower) ||
        (remark.candidatePan || '').toLowerCase().includes(searchLower)
      
      // Only include if candidate matches (not notes or company name)
      matchesSearch = candidateMatches
    }
    
    const matchesFilter = filterByRole === 'all' || remark.updatedByRole === filterByRole
    
    return matchesSearch && matchesFilter
  })
  
  // Group remarks by candidate for better organization
  const remarksByCandidate = filteredRemarks.reduce((acc: any, remark: any) => {
    const candidateKey = remark.candidateEmail || remark.candidateName || 'Unknown'
    if (!acc[candidateKey]) {
      acc[candidateKey] = {
        candidateName: remark.candidateName || 'Unknown',
        candidateEmail: remark.candidateEmail || '',
        candidatePan: remark.candidatePan || '',
        workExperience: remark.workExperience,
        currentCtc: remark.currentCtc,
        workLocation: remark.workLocation,
        designation: remark.designation,
        presentCompany: remark.presentCompany,
        highestQualification: remark.highestQualification,
        skillSets: remark.skillSets,
        sector: remark.sector,
        openToRelocation: remark.openToRelocation,
        remarks: []
      }
    }
    acc[candidateKey].remarks.push(remark)
    return acc
  }, {})
  
  const candidateGroups = Object.values(remarksByCandidate)
  
  // If searching, only show the first matching candidate (single candidate view)
  const displayGroups = searchQuery && candidateGroups.length > 0 
    ? [candidateGroups[0]] 
    : candidateGroups

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
              <h1 className="text-2xl sm:text-4xl font-bold">Red-Flagged Status</h1>
            </div>
            <p className="text-red-50 text-sm sm:text-base mt-2">View all Red-Flagged and updates from verified candidates</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by candidate name, email, PAN, or notes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterByRole}
              onChange={(e) => setFilterByRole(e.target.value as 'all' | 'employer' | 'admin')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">All Roles</option>
              <option value="employer">Employer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="text-xs text-gray-500 font-medium mb-1">Total Red-Flagged</div>
          <div className="text-2xl font-bold text-gray-900">{allRemarks.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="text-xs text-gray-500 font-medium mb-1">Filtered Results</div>
          <div className="text-2xl font-bold text-red-600">{filteredRemarks.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="text-xs text-gray-500 font-medium mb-1">By Employers</div>
          <div className="text-2xl font-bold text-blue-600">
            {allRemarks.filter(r => r.updatedByRole === 'employer').length}
          </div>
        </div>
      </div>

      {/* Remarks List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-600">Loading Red-Flagged...</div>
        </div>
      ) : !searchQuery ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 sm:p-12 max-w-md mx-auto">
            <div className="bg-red-100 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-10 w-10 sm:h-12 sm:w-12 text-red-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Search to View Red-Flagged</h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
              Enter a candidate name, email, or PAN in the search box above to view their Red-Flagged timeline.
            </p>
          </div>
        </div>
      ) : filteredRemarks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">
            No Red-Flagged found matching your search. Try a different candidate name, email, or PAN.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Red-Flagged Timeline</h3>
            </div>
          </div>
          
          <div className="space-y-4">
            {displayGroups.map((group: any, groupIdx: number) => (
              <div key={groupIdx} className="space-y-4">
                {/* Simple Candidate Header - only name and email */}
                {(searchQuery || candidateGroups.length > 1) && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600 p-2 rounded-lg">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-base sm:text-lg font-bold text-gray-900">{group.candidateName}</div>
                        {group.candidateEmail && (
                          <div className="text-xs sm:text-sm text-gray-600 mt-1">{group.candidateEmail}</div>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 font-semibold bg-white px-3 py-1 rounded-full">
                        {group.remarks.length} {group.remarks.length === 1 ? 'Red-Flagged' : 'Red-Flagged'}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Accordion Style Red-Flagged */}
                <div className="space-y-3">
                  {group.remarks.map((remark: any, idx: number) => {
                    const remarkKey = remark._id || remark.id || `Red-Flagged-${idx}`
                    const isExpanded = expandedRemarks[remarkKey] || false
                    
                    return (
                      <div key={remarkKey} className="bg-white rounded-xl border-2 border-gray-200 hover:border-red-300 transition-all duration-300 overflow-hidden">
                        {/* Accordion Header - Clickable */}
                        <button
                          onClick={() => setExpandedRemarks(prev => ({
                            ...prev,
                            [remarkKey]: !prev[remarkKey]
                          }))}
                          className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            {/* Company Name */}
                            {remark.companyName && (
                              <div className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                                <span className="text-lg sm:text-xl font-bold text-gray-900">{remark.companyName}</span>
                              </div>
                            )}
                            
                            {/* Remark Number */}
                            <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                              Red-Flagged {remark.points ?? idx + 1}
                            </div>
                            
                            {/* Updated By */}
                            <div className="text-sm text-gray-600">
                              By: {remark.updatedByName || '-'} ({remark.updatedByRole || '-'})
                            </div>
                            
                            {/* Date */}
                            <div className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
                              <Clock className="h-3 w-3" />
                              {remark.date ? new Date(remark.date).toLocaleDateString() : ''}
                            </div>
                          </div>
                          
                          {/* Expand/Collapse Icon */}
                          <div className="ml-4">
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                        </button>

                        {/* Accordion Content - Expandable */}
                        {isExpanded && (
                          <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-200">
                            {/* Notes - The Red-Flagged */}
                            {remark.notes && (
                              <div className="mt-4 mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                                <div className="flex items-start gap-2">
                                  <FileText className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{remark.notes}</p>
                                </div>
                              </div>
                            )}

                            {/* Candidate Justification Section */}
                            <div className="mt-4 pt-4 border-t-2 border-gray-200">
                              <div className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                                <MessageSquare className="h-4 w-4 mr-2 text-red-600" />
                                Candidate Red-Flagged Justification
                              </div>
                              {Array.isArray(remark.comments) && remark.comments.length > 0 ? (
                                <div className="space-y-3">
                                  {remark.comments.map((c: any, cIdx: number) => (
                                    <div key={c._id || cIdx} className="flex items-start justify-between bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 border border-gray-200 hover:border-red-200 transition-colors">
                                      <div className="text-sm text-gray-800 flex-1">
                                        <div className="whitespace-pre-wrap break-words mb-1">{c.text}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          {c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-sm text-gray-500 italic">No Red-Flagged justification yet.</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

