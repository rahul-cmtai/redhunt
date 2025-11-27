"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Users, Search, Plus, User, Mail, Phone, Shield, CheckCircle, XCircle, Clock, X, FileText, Calendar, Briefcase, Building2, Eye, MapPin, DollarSign, TrendingUp, Edit, Save, MessageSquare, AlertCircle, Lock } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.red-flagged.com'

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [addSuccess, setAddSuccess] = useState<string | null>(null)
  const [searchByPanUan, setSearchByPanUan] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchResult, setSearchResult] = useState<any>(null)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [candidateDetails, setCandidateDetails] = useState<any>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [updateHistory, setUpdateHistory] = useState<any[]>([])
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [updateFormData, setUpdateFormData] = useState({
    presentCompany: '',
    designation: '',
    workLocation: '',
    currentCtc: '',
    expectedHikePercentage: '',
    noticePeriod: '',
    negotiableDays: '',
    skillSets: [] as string[],
    verificationNotes: '',
    notes: ''
  })
  const [editingHistoryId, setEditingHistoryId] = useState<string | null>(null)
  const [editingHistoryNotes, setEditingHistoryNotes] = useState('')
  const [editingHistoryLoading, setEditingHistoryLoading] = useState(false)
  const [editingHistoryError, setEditingHistoryError] = useState<string | null>(null)
  const [invitedNotesEditing, setInvitedNotesEditing] = useState(false)
  const [invitedNotesValue, setInvitedNotesValue] = useState('')
  const [invitedNotesSaving, setInvitedNotesSaving] = useState(false)
  const [invitedNotesMode, setInvitedNotesMode] = useState<'add' | 'edit'>('add')
 
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    panNumber: '',
    uan: '',
    position: '',
    offerDate: '',
    joiningDate: '',
    reason: '',
    notes: ''
  })

  const getToken = () => localStorage.getItem('employerToken') || sessionStorage.getItem('employerToken')

  const fetchCandidates = async () => {
    try {
      setLoading(true)
      const token = getToken()
      if (!token) return

      // Use /all endpoint to get both invited and verified candidates
      const { data } = await axios.get(`${API_BASE_URL}/api/employer/candidates/all`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Handle response structure - can be array or object with candidates array
      let list = []
      if (Array.isArray(data)) {
        list = data
      } else if (data?.candidates && Array.isArray(data.candidates)) {
        list = data.candidates
      } else if (data?.data && Array.isArray(data.data)) {
        list = data.data
      }
      
      setCandidates(list)
    } catch (err: any) {
      console.log('Could not fetch candidates:', err?.response?.data?.message || err?.message)
      setCandidates([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCandidates()
  }, [])

  useEffect(() => {
    if (showAddForm) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [showAddForm])

  const handleViewCandidate = async (candidate: any) => {
    if (!isCandidateVerified(candidate)) {
      // For invited candidates, just show basic info and enable inline notes editing
      setSelectedCandidate(candidate)
      setCandidateDetails(candidate)
      setUpdateHistory([])
      setInvitedNotesValue(candidate.notes || '')
      setInvitedNotesEditing(false)
      setShowViewModal(true)
      return
    }

    // For verified candidates, fetch full details
    setSelectedCandidate(candidate)
    setLoadingDetails(true)
    setShowViewModal(true)
    
    try {
      const token = getToken()
      if (!token) throw new Error('Not authenticated')
      
      const candidateId = candidate.id || candidate._id
      
      // Fetch Red-Flagged
      let historyData = { updateHistory: [] }
      try {
        const historyRes = await axios.get(`${API_BASE_URL}/api/employer/candidate-users/${candidateId}/update-history`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        historyData = historyRes.data
      } catch (err) {
        console.log('Could not fetch Red-Flagged:', err)
      }
      
      // Filter out approval-only entries (entries with just "approved" and no actual Red-Flagged)
      const filteredHistory = (historyData?.updateHistory || []).filter((entry: any) => {
        // If it's from an employer, always show it
        if (entry.updatedByRole === 'employer') {
          return true
        }
        
        // If it's from admin, check if it's just an approval status
        if (entry.updatedByRole === 'admin') {
          const notes = (entry.notes || '').toLowerCase().trim()
          
          // Check if there are any updated fields
          const hasUpdatedFields = !!(entry.presentCompany || entry.designation || 
            entry.workLocation || entry.currentCtc || entry.expectedHikePercentage ||
            entry.noticePeriod || entry.negotiableDays || 
            (Array.isArray(entry.skillSets) && entry.skillSets.length > 0) ||
            entry.verificationNotes)
          
          // If there are updated fields, show it
          if (hasUpdatedFields) {
            return true
          }
          
          // Filter out approval-only messages
          const approvalOnlyPatterns = [
            /^approved$/i,
            /^status:\s*approved$/i,
            /^status:approved$/i,
            /^candidate\s+approved$/i,
            /^profile\s+approved$/i
          ]
          
          const isApprovalOnly = approvalOnlyPatterns.some(pattern => pattern.test(notes))
          
          // If it's just an approval message with no updated fields, hide it
          if (isApprovalOnly && !hasUpdatedFields) {
            return false
          }
          
          // If notes has actual content, show it
          if (notes && notes.length > 0 && !isApprovalOnly) {
            return true
          }
          
          return false
        }
        
        return true
      })
      
      // Use candidate data from list (already has all details)
      setCandidateDetails(candidate)
      setUpdateHistory(filteredHistory)
      
      // Pre-fill update form with current values
      const details = candidate
      setUpdateFormData({
        presentCompany: details.presentCompany || '',
        designation: details.designation || '',
        workLocation: details.workLocation || '',
        currentCtc: details.currentCtc || '',
        expectedHikePercentage: details.expectedHikePercentage || '',
        noticePeriod: details.noticePeriod?.toString() || '',
        negotiableDays: details.negotiableDays?.toString() || '',
        skillSets: Array.isArray(details.skillSets) ? details.skillSets : [],
        verificationNotes: details.verificationNotes || '',
        notes: ''
      })
    } catch (err: any) {
      console.error('Failed to load candidate details:', err)
      setCandidateDetails(candidate)
      setUpdateHistory([])
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleUpdateCandidate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCandidate) return
    
    setUpdating(true)
    setAddError(null)
    setAddSuccess(null)
    
    try {
      const token = getToken()
      if (!token) throw new Error('Not authenticated')
      
      const candidateId = selectedCandidate.id || selectedCandidate._id
      
      const updatePayload: any = {}
      if (updateFormData.presentCompany) updatePayload.presentCompany = updateFormData.presentCompany
      if (updateFormData.designation) updatePayload.designation = updateFormData.designation
      if (updateFormData.workLocation) updatePayload.workLocation = updateFormData.workLocation
      if (updateFormData.currentCtc) updatePayload.currentCtc = updateFormData.currentCtc
      if (updateFormData.expectedHikePercentage) updatePayload.expectedHikePercentage = updateFormData.expectedHikePercentage
      if (updateFormData.noticePeriod) updatePayload.noticePeriod = parseInt(updateFormData.noticePeriod) || 0
      if (updateFormData.negotiableDays) updatePayload.negotiableDays = parseInt(updateFormData.negotiableDays) || 0
      if (updateFormData.skillSets.length > 0) updatePayload.skillSets = updateFormData.skillSets
      if (updateFormData.verificationNotes) updatePayload.verificationNotes = updateFormData.verificationNotes
      if (updateFormData.notes) updatePayload.notes = updateFormData.notes
      
      await axios.patch(
        `${API_BASE_URL}/api/employer/candidate-users/${candidateId}`,
        updatePayload,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      setAddSuccess('Candidate status updated successfully!')
      setShowUpdateForm(false)
      
      // Refresh candidate details
      await handleViewCandidate(selectedCandidate)
      await fetchCandidates()
      
      setTimeout(() => setAddSuccess(null), 3000)
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to update candidate'
      const errorCode = err?.response?.data?.error
      
      // Handle permission errors specifically
      if (err?.response?.status === 403 || errorCode === 'NOT_INVITED_BY_EMPLOYER') {
        setAddError('आप इस candidate को update नहीं कर सकते। केवल उन candidates को update कर सकते हैं जिन्हें आपने originally invite किया था।')
      } else {
        setAddError(errorMessage)
      }
      
      // If permission denied, refresh candidate details to update canUpdate flag
      if (err?.response?.status === 403) {
        await fetchCandidates()
        if (selectedCandidate) {
          await handleViewCandidate(selectedCandidate)
        }
      }
    } finally {
      setUpdating(false)
    }
  }

  const handleStartEditHistory = (entry: any) => {
    const id = entry._id || entry.id
    if (!id) return
    setEditingHistoryId(id)
    setEditingHistoryNotes(entry.notes || '')
    setEditingHistoryError(null)
  }

  const handleCancelEditHistory = () => {
    setEditingHistoryId(null)
    setEditingHistoryNotes('')
    setEditingHistoryLoading(false)
    setEditingHistoryError(null)
  }

  const handleSaveEditHistory = async () => {
    if (!selectedCandidate || !editingHistoryId) return
    try {
      setEditingHistoryLoading(true)
      setEditingHistoryError(null)

      const token = getToken()
      if (!token) throw new Error('Not authenticated')

      const candidateId = selectedCandidate.id || selectedCandidate._id

      await axios.patch(
        `${API_BASE_URL}/api/employer/candidate-users/${candidateId}/update-history/${editingHistoryId}`,
        { notes: editingHistoryNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      // Refresh history after successful update
      await handleViewCandidate(selectedCandidate)
      setEditingHistoryId(null)
      setEditingHistoryNotes('')
    } catch (err: any) {
      setEditingHistoryError(
        err?.response?.data?.message || err?.message || 'Failed to update remark'
      )
    } finally {
      setEditingHistoryLoading(false)
    }
  }

  const handleSaveInvitedNotes = async () => {
    if (!selectedCandidate) return
    try {
      setInvitedNotesSaving(true)
      setAddError(null)
      setAddSuccess(null)

      const token = getToken()
      if (!token) throw new Error('Not authenticated')

      const candidateId = selectedCandidate.id || selectedCandidate._id

      const { data } = await axios.patch(
        `${API_BASE_URL}/api/employer/candidates/${candidateId}`,
        { notes: invitedNotesValue, historyMode: invitedNotesMode },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const updatedCandidate = data?.candidate || null

      // Update local state so UI and timeline reflect latest data
      if (updatedCandidate) {
        setCandidateDetails(updatedCandidate)
        setSelectedCandidate(updatedCandidate)
        setCandidates((prev: any[]) =>
          Array.isArray(prev)
            ? prev.map((c: any) =>
                (c.id || c._id) === (updatedCandidate.id || updatedCandidate._id) ? updatedCandidate : c
              )
            : prev
        )
      } else {
        // Fallback: at least update notes field locally
        setCandidateDetails((prev: any) =>
          prev ? { ...prev, notes: invitedNotesValue } : prev
        )
        setSelectedCandidate((prev: any) =>
          prev ? { ...prev, notes: invitedNotesValue } : prev
        )
      }

      setAddSuccess('Red-Flagged remarks updated successfully!')
      setInvitedNotesEditing(false)
      // also refresh list in background
      fetchCandidates()
    } catch (err: any) {
      setAddError(
        err?.response?.data?.message || err?.message || 'Failed to update remarks'
      )
    } finally {
      setInvitedNotesSaving(false)
    }
  }

  const handleSearchByPanUan = async () => {
    if (!searchByPanUan.trim()) {
      setSearchError('Please enter PAN or UAN')
      return
    }
    
    setSearchLoading(true)
    setSearchResult(null)
    setSearchError(null)
    
    try {
      const token = getToken()
      if (!token) throw new Error('Not authenticated')
      
      const { data } = await axios.get(`${API_BASE_URL}/api/employer/candidates/search`, {
        params: { q: searchByPanUan.trim() },
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setSearchResult(data)
    } catch (err: any) {
      setSearchError(err?.response?.data?.message || err?.message || 'Search failed')
      setSearchResult(null)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setAddError(null)
    setAddSuccess(null)
    
    try {
      const token = getToken()
      if (!token) throw new Error('Not authenticated')
      
      const trimmedFirstName = formData.firstName.trim()
      const trimmedLastName = formData.lastName.trim()
      const combinedName = [trimmedFirstName, trimmedLastName].filter(Boolean).join(' ').trim()

      const payload = {
        ...formData,
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        name: combinedName,
        fullName: combinedName
      }

      const { data } = await axios.post(
        `${API_BASE_URL}/api/employer/candidates`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      setAddSuccess('Candidate added successfully!')
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        panNumber: '',
        uan: '',
        position: '',
        offerDate: '',
        joiningDate: '',
        reason: '',
        notes: ''
      })
      setTimeout(() => {
        setShowAddForm(false)
        setAddSuccess(null)
        fetchCandidates()
      }, 2000)
    } catch (err: any) {
      setAddError(err?.response?.data?.message || err?.message || 'Failed to add candidate')
    } finally {
      setSubmitting(false)
    }
  }

  // Helper function to check if candidate is verified
  const isCandidateVerified = (c: any) => {
    // Check type field first - 'verified' type means it's a CandidateUser that was verified
    if (c.type === 'verified') return true
    
    // Check status field - 'approved' means admin has verified
    if (c.status === 'approved') return true
    
    // Check verifiedBy field - if exists, admin has verified
    if (c.verifiedBy) return true
    
    // Check verified boolean field
    if (c.verified === true || c.verified === 'true') return true
    if (c.isVerified === true || c.isVerified === 'true') return true
    
    return false
  }

  const getCandidateDisplayName = (c: any) => {
    const parts = [c.firstName, c.lastName]
      .map((part: string) => (typeof part === 'string' ? part.trim() : ''))
      .filter(Boolean)
    if (parts.length) return parts.join(' ')
    if (typeof c.fullName === 'string' && c.fullName.trim()) return c.fullName
    if (typeof c.name === 'string' && c.name.trim()) return c.name
    return 'N/A'
  }

  // Helper function to check if employer can update this candidate
  const canUpdateCandidate = (c: any) => {
    // If candidate is not verified, they can't be updated (only invited candidates)
    if (!isCandidateVerified(c)) return false
    
    // If canUpdate flag is explicitly set, use it
    if (c.canUpdate !== undefined) return c.canUpdate
    
    // If wasInvitedByThisEmployer flag is set, use it
    if (c.wasInvitedByThisEmployer !== undefined) return c.wasInvitedByThisEmployer
    
    // Default: allow update if verified (backward compatibility)
    // But backend will still validate
    return true
  }

  const belongsToThisEmployer = (c: any) => {
    if (c.wasInvitedByThisEmployer !== undefined) return c.wasInvitedByThisEmployer
    if (c.invitedByThisEmployer !== undefined) return c.invitedByThisEmployer
    if (c.canUpdate !== undefined) return c.canUpdate
    // Non-verified candidates listed here are invitation drafts created by this employer
    if (!isCandidateVerified(c)) return true
    return false
  }

  const matchesSearchQuery = (c: any, query: string) => {
    const normalizedQuery = query.toLowerCase().trim()
    if (!normalizedQuery) return true

    const candidateName = getCandidateDisplayName(c).toLowerCase()
    const email = (c.email || c.primaryEmail || '').toLowerCase()
    const phone = (c.mobile || c.mobileNumber || c.phone || '').toLowerCase().replace(/[\s\-()]/g, '')
    const pan = (c.panNumber || c.pan || '').toLowerCase()
    const uan = (c.uanNumber || c.uan || '').toLowerCase()
    const normalizedPhoneQuery = normalizedQuery.replace(/[\s\-()]/g, '')

    return (
      candidateName.includes(normalizedQuery) ||
      email.includes(normalizedQuery) ||
      phone.includes(normalizedPhoneQuery) ||
      pan.includes(normalizedQuery) ||
      uan.includes(normalizedPhoneQuery)
    )
  }

  const ownedCandidates = candidates.filter((c: any) => belongsToThisEmployer(c))

  const filteredCandidates = candidates.filter((c: any) => {
    const hasSearch = searchQuery.trim().length > 0
    if (hasSearch) {
      return matchesSearchQuery(c, searchQuery)
    }
    return belongsToThisEmployer(c)
  })

  const stats = {
    total: ownedCandidates.length
  }

  return (
    <>
      <div className={showAddForm ? 'blur-sm pointer-events-none select-none transition duration-200' : 'transition duration-200'}>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Candidates Red-Flag</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Manage and view red-flag candidates</p>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white rounded-2xl shadow-xl p-6 flex items-center justify-between border border-red-500/30">
          <div>
            <p className="text-base sm:text-lg font-medium opacity-90 tracking-wide">Red-Flagged</p>
            <p className="text-4xl sm:text-5xl font-extrabold mt-2 drop-shadow-sm">{stats.total}</p>
          </div>
          <div className="p-4 sm:p-5 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
            <Users className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
        </div>
      </div>

      {/* Search by PAN/UAN */}
      {/* <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Candidate by PAN/UAN</h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter PAN or UAN..."
            value={searchByPanUan}
            onChange={(e) => setSearchByPanUan(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSearchByPanUan()}
          />
          <button
            onClick={handleSearchByPanUan}
            disabled={searchLoading}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed"
          >
            {searchLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {searchError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {searchError}
          </div>
        )}
        {searchResult && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">Search Result</h4>
              <button onClick={() => {
                setSearchResult(null)
                setSearchByPanUan('')
                setSearchError(null)
              }} className="text-gray-500 hover:text-gray-700">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="text-sm text-gray-700">
              {searchResult.success !== false && (searchResult.candidates?.length > 0 || searchResult.candidate) ? (
                <>
                  {Array.isArray(searchResult.candidates) && searchResult.candidates.length > 0 ? (
                    <div className="space-y-2">
                      <p><strong>Found {searchResult.candidates.length} candidate(s):</strong></p>
                      {searchResult.candidates.map((c: any, idx: number) => (
                        <div key={idx} className="bg-white p-3 rounded border border-blue-200">
                      <p><strong>Name:</strong> {getCandidateDisplayName(c)}</p>
                          <p><strong>Email:</strong> {c.email || 'N/A'}</p>
                          <p><strong>UAN:</strong> {c.uan || c.uanNumber || 'N/A'}</p>
                          {c.mobileNumber && <p><strong>Mobile:</strong> {c.mobileNumber}</p>}
                        </div>
                      ))}
                    </div>
                  ) : searchResult.candidate ? (
                    <>
                      <p><strong>Found:</strong> Yes</p>
                      <p><strong>Candidate:</strong> {getCandidateDisplayName(searchResult.candidate)}</p>
                      <p><strong>Email:</strong> {searchResult.candidate.email || 'N/A'}</p>
                      <p><strong>UAN:</strong> {searchResult.candidate.uan || searchResult.candidate.uanNumber || 'N/A'}</p>
                      {searchResult.offers !== undefined && <p><strong>Offers:</strong> {searchResult.offers}</p>}
                      {searchResult.notJoined !== undefined && <p><strong>Not Joined:</strong> {searchResult.notJoined}</p>}
                      {searchResult.lastCompany && <p><strong>Last Company:</strong> {searchResult.lastCompany}</p>}
                      {searchResult.lastDate && <p><strong>Last Date:</strong> {searchResult.lastDate}</p>}
                    </>
                  ) : null}
                </>
              ) : (
                <p className="text-gray-600">No candidate found with this PAN/UAN.</p>
              )}
            </div>
          </div>
        )}
      </div> */}

      {/* Add Candidate Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Candidate
        </button>
      </div>
      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100 mb-6">
        <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-2">
          Search
        </label>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Candidate "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </div>

      {/* Candidates List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {loading ? (
          <div className="p-12 text-center text-gray-600">Loading candidates...</div>
        ) : filteredCandidates.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
            <p className="text-sm text-gray-500">
              {searchQuery ? 'Try adjusting your search criteria' : 'Start by adding candidates to your database'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredCandidates.map((candidate: any) => (
              <div key={candidate._id || candidate.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                     <div className="flex items-center gap-3 mb-2 flex-wrap">
                       <h3 className="text-lg font-semibold text-gray-900">{getCandidateDisplayName(candidate)}</h3>
                       {isCandidateVerified(candidate) ? (
                         <>
                           <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                             <CheckCircle className="h-3 w-3" />
                             Red-Flag
                           </span>
                           {!canUpdateCandidate(candidate) && (
                             <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300">
                               <Lock className="h-3 w-3" />
                               View Only
                             </span>
                           )}
                         </>
                       ) : (
                         <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                           <Clock className="h-3 w-3" />
                           Red-Flag
                         </span>
                       )}
                     </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                      {candidate.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{candidate.email}</span>
                        </div>
                      )}
                      {candidate.mobileNumber && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{candidate.mobileNumber}</span>
                        </div>
                      )}
                      {candidate.panNumber && (
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-gray-400" />
                          <span>PAN: {candidate.panNumber}</span>
                        </div>
                      )}
                      {candidate.designation && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>{candidate.designation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewCandidate(candidate)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>

      {/* Add Candidate Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddForm(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-red-100 w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-white">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Add New Candidate</h3>
                <p className="text-sm text-gray-500">Fill in the details below to invite a candidate</p>
              </div>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-red-600 transition-colors"
                aria-label="Close add candidate modal"
                type="button"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="px-6 py-4 overflow-y-auto max-h-[80vh]">
              {addSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                  {addSuccess}
                </div>
              )}
              {addError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  {addError}
                </div>
              )}
              <form onSubmit={handleAddCandidate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 1. First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  {/* 2. Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  {/* 3. Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  {/* 4. Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  {/* 5. PAN */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                    <input
                      type="text"
                      value={formData.panNumber}
                      onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                      maxLength={10}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 uppercase"
                    />
                  </div>
                  {/* 6. UAN */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">UAN</label>
                    <input
                      type="text"
                      value={formData.uan}
                      onChange={(e) => setFormData({ ...formData, uan: e.target.value })}
                      maxLength={12}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  {/* 7. Position Job Role Add */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position Job Role Add *</label>
                    <input
                      type="text"
                      required
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  {/* 8. Offer Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Offer Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.offerDate}
                      onChange={(e) => setFormData({ ...formData, offerDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  {/* 9. Joining Date (Given By the Candidate) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date (Given By the Candidate)</label>
                    <input
                      type="date"
                      value={formData.joiningDate}
                      onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  {/* 10. Reason of Offer Rejection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason of Offer Rejection *</label>
                    <input
                      type="text"
                      required
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      placeholder="Explain briefly"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                {/* 11. Red-Flagged Remarks by the Employer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Red-Flagged Remarks by the Employer</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Adding...' : 'Add Candidate'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false)
                      setFormData({
                        firstName: '',
                        lastName: '',
                        email: '',
                        mobile: '',
                        panNumber: '',
                        uan: '',
                        position: '',
                        offerDate: '',
                        joiningDate: '',
                        reason: '',
                        notes: ''
                      })
                      setAddError(null)
                      setAddSuccess(null)
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Candidate Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {candidateDetails ? getCandidateDisplayName(candidateDetails) : 'Candidate Details'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {isCandidateVerified(selectedCandidate) ? 'Red-Flag Candidate' : 'Invited Candidate'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowViewModal(false)
                  setSelectedCandidate(null)
                  setCandidateDetails(null)
                  setUpdateHistory([])
                  setShowUpdateForm(false)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {loadingDetails ? (
                <div className="text-center py-12">
                  <div className="text-gray-600">Loading candidate details...</div>
                </div>
              ) : (
                <>
                  {addSuccess && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                      {addSuccess}
                    </div>
                  )}
                  {addError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                      {addError}
                    </div>
                  )}

                  {/* Candidate Information - All Fields */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Candidate Information</h3>
                    
                    {/* Basic Information Section */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-300">Basic Information</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {candidateDetails && (
                          <div className="sm:col-span-2">
                            <label className="text-xs text-gray-500 font-medium">Full Name</label>
                            <p className="text-sm font-semibold text-gray-900">{getCandidateDisplayName(candidateDetails)}</p>
                          </div>
                        )}
                        {candidateDetails?.firstName && (
                          <div>
                            <label className="text-xs text-gray-500 font-medium">First Name</label>
                            <p className="text-sm font-semibold text-gray-900">{candidateDetails.firstName}</p>
                          </div>
                        )}
                        {candidateDetails?.lastName && (
                          <div>
                            <label className="text-xs text-gray-500 font-medium">Last Name</label>
                            <p className="text-sm font-semibold text-gray-900">{candidateDetails.lastName}</p>
                          </div>
                        )}
                        {(candidateDetails?.email || candidateDetails?.primaryEmail) && (
                          <div>
                            <label className="text-xs text-gray-500 font-medium">Primary Email</label>
                            <p className="text-sm font-semibold text-gray-900">{candidateDetails.primaryEmail || candidateDetails.email}</p>
                          </div>
                        )}
                        {candidateDetails?.secondaryEmail && (
                          <div>
                            <label className="text-xs text-gray-500 font-medium">Secondary Email</label>
                            <p className="text-sm font-semibold text-gray-900">{candidateDetails.secondaryEmail}</p>
                          </div>
                        )}
                        {(candidateDetails?.mobileNumber || candidateDetails?.mobile || candidateDetails?.phone) && (
                          <div>
                            <label className="text-xs text-gray-500 font-medium">Mobile Number</label>
                            <p className="text-sm font-semibold text-gray-900">{candidateDetails.mobileNumber || candidateDetails.mobile || candidateDetails.phone}</p>
                          </div>
                        )}
                        {(candidateDetails?.panNumber || candidateDetails?.pan) && (
                          <div>
                            <label className="text-xs text-gray-500 font-medium">PAN Number</label>
                            <p className="text-sm font-semibold text-gray-900">{candidateDetails.panNumber || candidateDetails.pan}</p>
                          </div>
                        )}
                        {(candidateDetails?.uanNumber || candidateDetails?.uan) && (
                          <div>
                            <label className="text-xs text-gray-500 font-medium">UAN Number</label>
                            <p className="text-sm font-semibold text-gray-900">{candidateDetails.uanNumber || candidateDetails.uan || 'N/A'}</p>
                          </div>
                        )}
                        {/* {candidateDetails?.notes && (
                          <div className="sm:col-span-2">
                            <label className="text-xs text-red-500 font-medium">Red-Flagged Remarks</label>
                            <p className="text-sm font-semibold text-gray-900 whitespace-pre-line">{candidateDetails.notes}</p>
                          </div>
                        )} */}
                      </div>
                    </div>

                    {/* Personal Information Section - Only Once */}
                    {(candidateDetails?.fathersName || candidateDetails?.gender || candidateDetails?.dob || candidateDetails?.permanentAddress || candidateDetails?.currentAddress) && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-300">Personal Information</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {candidateDetails?.fathersName && (
                            <div>
                              <label className="text-xs text-gray-500 font-medium">Father's Name</label>
                              <p className="text-sm font-semibold text-gray-900">{candidateDetails.fathersName}</p>
                            </div>
                          )}
                          {candidateDetails?.gender && (
                            <div>
                              <label className="text-xs text-gray-500 font-medium">Gender</label>
                              <p className="text-sm font-semibold text-gray-900 capitalize">{candidateDetails.gender}</p>
                            </div>
                          )}
                          {candidateDetails?.dob && (
                            <div>
                              <label className="text-xs text-gray-500 font-medium">Date of Birth</label>
                              <p className="text-sm font-semibold text-gray-900">{new Date(candidateDetails.dob).toLocaleDateString()}</p>
                            </div>
                          )}
                          {candidateDetails?.permanentAddress && (
                            <div className="sm:col-span-2">
                              <label className="text-xs text-gray-500 font-medium">Permanent Address</label>
                              <p className="text-sm font-semibold text-gray-900">{candidateDetails.permanentAddress}</p>
                            </div>
                          )}
                          {candidateDetails?.currentAddress && (
                            <div className="sm:col-span-2">
                              <label className="text-xs text-gray-500 font-medium">Current Address</label>
                              <p className="text-sm font-semibold text-gray-900">{candidateDetails.currentAddress}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Professional Information Section */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-300">Professional Information</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(candidateDetails?.presentCompany || candidateDetails?.currentCompany) && (
                          <div>
                            <label className="text-xs text-gray-500 font-medium">Current Company of the candidate</label>
                            <p className="text-sm font-semibold text-gray-900">{candidateDetails.presentCompany || candidateDetails.currentCompany}</p>
                          </div>
                        )}
                        {candidateDetails?.designation && (
                          <div>
                            <label className="text-xs text-gray-500 font-medium">Designation</label>
                            <p className="text-sm font-semibold text-gray-900">{candidateDetails.designation}</p>
                          </div>
                        )}
                        {candidateDetails?.workLocation && (
                          <div>
                            <label className="text-xs text-gray-500 font-medium">Work Location</label>
                            <p className="text-sm font-semibold text-gray-900">{candidateDetails.workLocation}</p>
                          </div>
                        )}
                        {candidateDetails?.sector && (
                          <div>
                            <label className="text-xs text-gray-500 font-medium">Sector</label>
                            <p className="text-sm font-semibold text-gray-900 capitalize">{candidateDetails.sector}</p>
                          </div>
                        )}
                        {candidateDetails?.highestQualification && (
                          <div>
                            <label className="text-xs text-gray-500 font-medium">Highest Qualification</label>
                            <p className="text-sm font-semibold text-gray-900 capitalize">{candidateDetails.highestQualification}</p>
                          </div>
                        )}
                        {candidateDetails?.workExperience !== undefined && (
                          <div>
                            <label className="text-xs text-gray-500 font-medium">Work Experience</label>
                            <p className="text-sm font-semibold text-gray-900">{candidateDetails.workExperience} years</p>
                          </div>
                        )}
                        {candidateDetails?.currentCtc && (
                          <div>
                            <label className="text-xs text-gray-500 font-medium">Current CTC</label>
                            <p className="text-sm font-semibold text-gray-900">{candidateDetails.currentCtc}</p>
                          </div>
                        )}
                        {candidateDetails?.expectedHikePercentage && (
                          <div>
                            <label className="text-xs text-gray-500 font-medium">Expected Hike %</label>
                            <p className="text-sm font-semibold text-gray-900">{candidateDetails.expectedHikePercentage}%</p>
                          </div>
                        )}
                        {candidateDetails?.noticePeriod !== undefined && (
                          <div>
                            <label className="text-xs text-gray-500 font-medium">Notice Period</label>
                            <p className="text-sm font-semibold text-gray-900">{candidateDetails.noticePeriod} days</p>
                          </div>
                        )}
                        {candidateDetails?.negotiableDays !== undefined && (
                          <div>
                            <label className="text-xs text-gray-500 font-medium">Negotiable Days</label>
                            <p className="text-sm font-semibold text-gray-900">{candidateDetails.negotiableDays} days</p>
                          </div>
                        )}
                        {candidateDetails?.openToRelocation && (
                          <div>
                            <label className="text-xs text-gray-500 font-medium">Open to Relocation</label>
                            <p className="text-sm font-semibold text-gray-900 capitalize">{candidateDetails.openToRelocation}</p>
                          </div>
                        )}
                        {candidateDetails?.skillSets && Array.isArray(candidateDetails.skillSets) && candidateDetails.skillSets.length > 0 && (
                          <div className="sm:col-span-2">
                            <label className="text-xs text-gray-500 font-medium">Skill Sets</label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {candidateDetails.skillSets.map((skill: string, idx: number) => (
                                <span key={idx} className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Offer & Remarks Section */}
                    {(candidateDetails?.position || candidateDetails?.offerDate || candidateDetails?.reason || candidateDetails?.joiningDate || candidateDetails?.notes) && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-300">Offer & Remarks</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {candidateDetails?.position && (
                            <div>
                              <label className="text-xs text-gray-500 font-medium">Position / Role</label>
                              <p className="text-sm font-semibold text-gray-900">{candidateDetails.position}</p>
                            </div>
                          )}
                          {candidateDetails?.offerDate && (
                            <div>
                              <label className="text-xs text-gray-500 font-medium">Offer Date</label>
                              <p className="text-sm font-semibold text-gray-900">{new Date(candidateDetails.offerDate).toLocaleDateString()}</p>
                            </div>
                          )}
                          {candidateDetails?.reason && (
                            <div className="sm:col-span-2">
                              <label className="text-xs text-gray-500 font-medium">Reason (Red-Flag)</label>
                              <p className="text-sm font-semibold text-gray-900">{candidateDetails.reason}</p>
                            </div>
                          )}
                          {candidateDetails?.joiningDate && (
                            <div>
                              <label className="text-xs text-gray-500 font-medium">Joining Date</label>
                              <p className="text-sm font-semibold text-gray-900">{new Date(candidateDetails.joiningDate).toLocaleDateString()}</p>
                            </div>
                          )}
                          {/* {candidateDetails?.notes && (
                            <div className="sm:col-span-2">
                              <label className="text-xs text-red-500 font-medium">Red-Flag Remarks</label>
                              <p className="text-sm font-semibold text-gray-900 whitespace-pre-line">
                                {candidateDetails.notes}
                              </p>
                            </div>
                          )} */}
                        </div>
                      </div>
                    )}

                    {/* Account & Verification Information Section */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-300">Account & Verification Information</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {candidateDetails?.status && (
                          <div>
                            <label className="text-xs text-gray-500 font-medium">Account Status</label>
                            <p className="text-sm font-semibold text-gray-900 capitalize">{candidateDetails.status}</p>
                          </div>
                        )}
                        {candidateDetails?.emailVerified !== undefined && (
                          <div>
                            <label className="text-xs text-gray-500 font-medium">Email Verified</label>
                            <p className="text-sm font-semibold text-gray-900">{candidateDetails.emailVerified ? 'Yes' : 'No'}</p>
                          </div>
                        )}
                        {candidateDetails?.profileCompleteness !== undefined && (
                          <div>
                            <label className="text-xs text-gray-500 font-medium">Profile Completeness</label>
                            <p className="text-sm font-semibold text-gray-900">{candidateDetails.profileCompleteness}%</p>
                          </div>
                        )}
                        {candidateDetails?.verifiedAt && (
                          <div>
                            <label className="text-xs text-gray-500 font-medium">Verified At</label>
                            <p className="text-sm font-semibold text-gray-900">{new Date(candidateDetails.verifiedAt).toLocaleString()}</p>
                          </div>
                        )}
                        {candidateDetails?.createdAt && (
                          <div>
                            <label className="text-xs text-gray-500 font-medium">Account Created</label>
                            <p className="text-sm font-semibold text-gray-900">{new Date(candidateDetails.createdAt).toLocaleString()}</p>
                          </div>
                        )}
                        {candidateDetails?.updatedAt && (
                          <div>
                            <label className="text-xs text-gray-500 font-medium">Last Updated</label>
                            <p className="text-sm font-semibold text-gray-900">{new Date(candidateDetails.updatedAt).toLocaleString()}</p>
                          </div>
                        )}
                        {candidateDetails?.verificationNotes && (
                          <div className="sm:col-span-2">
                            <label className="text-xs text-gray-500 font-medium">Verification Notes</label>
                            <p className="text-sm text-gray-900 bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">{candidateDetails.verificationNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Update Status Button (only for verified candidates that can be updated) */}
                  {isCandidateVerified(selectedCandidate) && canUpdateCandidate(selectedCandidate) && (
                    <div className="mb-6">
                      <button
                        onClick={() => setShowUpdateForm(!showUpdateForm)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                        {showUpdateForm ? 'Cancel Update' : 'Update Status'}
                      </button>
                    </div>
                  )}

                  {/* View Only Message (for verified candidates that cannot be updated) */}
                  {isCandidateVerified(selectedCandidate) && !canUpdateCandidate(selectedCandidate) && (
                    <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Lock className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-yellow-900 mb-1">View Only Mode</h4>
                          <p className="text-sm text-yellow-800">
                            You can view this candidate's details, but you cannot update their status. Only candidates whom you originally invited are eligible to be updated by you.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Update Form */}
                  {showUpdateForm && isCandidateVerified(selectedCandidate) && canUpdateCandidate(selectedCandidate) && (
                    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Update Candidate Status</h4>
                      <form onSubmit={handleUpdateCandidate} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Present Company</label>
                            <input
                              type="text"
                              value={updateFormData.presentCompany}
                              onChange={(e) => setUpdateFormData({ ...updateFormData, presentCompany: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                            <input
                              type="text"
                              value={updateFormData.designation}
                              onChange={(e) => setUpdateFormData({ ...updateFormData, designation: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Work Location</label>
                            <input
                              type="text"
                              value={updateFormData.workLocation}
                              onChange={(e) => setUpdateFormData({ ...updateFormData, workLocation: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current CTC</label>
                            <input
                              type="text"
                              value={updateFormData.currentCtc}
                              onChange={(e) => setUpdateFormData({ ...updateFormData, currentCtc: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Hike %</label>
                            <input
                              type="text"
                              value={updateFormData.expectedHikePercentage}
                              onChange={(e) => setUpdateFormData({ ...updateFormData, expectedHikePercentage: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notice Period (days)</label>
                            <input
                              type="number"
                              value={updateFormData.noticePeriod}
                              onChange={(e) => setUpdateFormData({ ...updateFormData, noticePeriod: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Negotiable Days</label>
                            <input
                              type="number"
                              value={updateFormData.negotiableDays}
                              onChange={(e) => setUpdateFormData({ ...updateFormData, negotiableDays: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1"> Update Notes *</label>
                          <textarea
                            value={updateFormData.verificationNotes}
                            onChange={(e) => setUpdateFormData({ ...updateFormData, verificationNotes: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Add Verification Red-Flagged</label>
                          <textarea
                            required
                            value={updateFormData.notes}
                            onChange={(e) => setUpdateFormData({ ...updateFormData, notes: e.target.value })}
                            rows={2}
                            placeholder="Add notes for this update..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            type="submit"
                            disabled={updating}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            <Save className="h-4 w-4" />
                            {updating ? 'Updating...' : 'Update Status'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowUpdateForm(false)}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Red-Flagged Timeline for verified candidates */}
                  {isCandidateVerified(selectedCandidate) && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Red-Flagged Status</h3>
                      {updateHistory.length > 0 ? (
                        <div className="space-y-4">
                          {updateHistory.map((entry: any, idx: number) => (
                            <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-bold">
                                    {entry.points ? `${entry.points}. Red-Flagged` : 'Red-Flagged'}
                                  </span>
                                  <div className="text-sm font-semibold text-gray-900">
                                    Company - {entry.companyName || 'N/A'}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    HR: {entry.updatedByName || '-'}
                                    {entry.updatedByRole && ` (${entry.updatedByRole})`}
                                  </div>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {entry.date ? new Date(entry.date).toLocaleString() : ''}
                                </span>
                              </div>
                              {entry.notes && editingHistoryId !== (entry._id || entry.id) && (
                                <div className="text-sm text-gray-800 mb-2 bg-blue-50 p-2 rounded border-l-4 border-blue-400">
                                  {entry.notes}
                                </div>
                              )}
                              {editingHistoryId === (entry._id || entry.id) && (
                                <div className="mb-2">
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Edit Red-Flagged Remark
                                  </label>
                                  <textarea
                                    value={editingHistoryNotes}
                                    onChange={(e) => setEditingHistoryNotes(e.target.value)}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                                  />
                                  {editingHistoryError && (
                                    <p className="mt-1 text-xs text-red-600">{editingHistoryError}</p>
                                  )}
                                  <div className="mt-2 flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={handleSaveEditHistory}
                                      disabled={editingHistoryLoading}
                                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed flex items-center gap-1"
                                    >
                                      <Save className="h-3 w-3" />
                                      {editingHistoryLoading ? 'Saving...' : 'Save'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handleCancelEditHistory}
                                      className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}
                              {/* Show updated fields if present */}
                              {(entry.presentCompany || entry.designation || entry.workLocation || entry.currentCtc || entry.expectedHikePercentage || entry.noticePeriod || entry.negotiableDays || (Array.isArray(entry.skillSets) && entry.skillSets.length)) && (
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                  <div className="text-xs font-medium text-gray-700 mb-2">Updated Fields:</div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                    {entry.presentCompany && <div><span className="text-gray-500">Company:</span> <span className="text-gray-900 font-medium">{entry.presentCompany}</span></div>}
                                    {entry.designation && <div><span className="text-gray-500">Designation:</span> <span className="text-gray-900 font-medium">{entry.designation}</span></div>}
                                    {entry.workLocation && <div><span className="text-gray-500">Location:</span> <span className="text-gray-900 font-medium">{entry.workLocation}</span></div>}
                                    {entry.currentCtc && <div><span className="text-gray-500">CTC:</span> <span className="text-gray-900 font-medium">{entry.currentCtc}</span></div>}
                                    {entry.expectedHikePercentage && <div><span className="text-gray-500">Hike %:</span> <span className="text-gray-900 font-medium">{entry.expectedHikePercentage}%</span></div>}
                                    {entry.noticePeriod && <div><span className="text-gray-500">Notice Period:</span> <span className="text-gray-900 font-medium">{entry.noticePeriod} days</span></div>}
                                    {entry.negotiableDays && <div><span className="text-gray-500">Negotiable Days:</span> <span className="text-gray-900 font-medium">{entry.negotiableDays}</span></div>}
                                    {Array.isArray(entry.skillSets) && entry.skillSets.length > 0 && (
                                      <div className="sm:col-span-2">
                                        <span className="text-gray-500">Skills:</span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {entry.skillSets.map((skill: string, sIdx: number) => (
                                            <span key={sIdx} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">{skill}</span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              {entry.comments && Array.isArray(entry.comments) && entry.comments.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                  <div className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                                    <MessageSquare className="h-3 w-3 text-red-600" />
                                    Candidate Red-Flagged Justification:
                                  </div>
                                  {entry.comments.map((comment: any, cIdx: number) => (
                                    <div key={cIdx} className="text-xs text-gray-600 bg-gray-50 p-2 rounded mb-1">
                                      <div className="whitespace-pre-wrap">{comment.text}</div>
                                      {comment.createdAt && (
                                        <div className="text-[10px] text-gray-400 mt-1">
                                          {new Date(comment.createdAt).toLocaleString()}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">No Red-Flagged yet</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Red-Flagged Timeline for invited candidates (simple history array) */}
                  {!isCandidateVerified(selectedCandidate) &&
                    candidateDetails?.updateHistory &&
                    Array.isArray(candidateDetails.updateHistory) &&
                    candidateDetails.updateHistory.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">Red-Flagged Status</h3>
                          {belongsToThisEmployer(selectedCandidate) && (
                            <button
                              type="button"
                              onClick={() => {
                                setInvitedNotesEditing(true)
                                setInvitedNotesMode('add')
                                setInvitedNotesValue('')
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                            >
                              <Edit className="h-4 w-4" />
                              Add Red-Flag Remark
                            </button>
                          )}
                        </div>

                        {invitedNotesEditing && (
                          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Add Red-Flagged Remark
                            </label>
                            <textarea
                              value={invitedNotesValue}
                              onChange={(e) => setInvitedNotesValue(e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                            />
                            <div className="mt-2 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={handleSaveInvitedNotes}
                                disabled={invitedNotesSaving}
                                className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed flex items-center gap-1"
                              >
                                <Save className="h-3 w-3" />
                                {invitedNotesSaving ? 'Saving...' : 'Add Red-Flag Remark'}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setInvitedNotesEditing(false)
                                  setInvitedNotesValue(candidateDetails.notes || '')
                                }}
                                className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="space-y-4">
                          {candidateDetails.updateHistory.map((entry: any, idx: number) => (
                            <div
                              key={entry._id || idx}
                              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-bold">
                                    {entry.points ? `${entry.points}. Red-Flagged` : 'Red-Flagged'}
                                  </span>
                                  <div className="text-sm font-semibold text-gray-900">
                                    Company - {entry.companyName || 'N/A'}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    HR: {entry.updatedByName || candidateDetails.employerName || '-'}
                                    {entry.updatedByRole && ` (${entry.updatedByRole})`}
                                  </div>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {entry.date ? new Date(entry.date).toLocaleString() : ''}
                                </span>
                              </div>
                              {entry.notes && (
                                <div className="text-sm text-gray-800 mb-2 bg-blue-50 p-2 rounded border-l-4 border-blue-400">
                                  {entry.notes}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

