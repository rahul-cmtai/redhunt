'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { 
  Users, 
  UserX, 
  Shield, 
  TrendingUp, 
  Plus, 
  Search, 
  Settings,
  LogOut,
  CheckCircle,
  AlertTriangle,
  X
} from 'lucide-react'

type EmployerSearchResult = {
  found: boolean
  candidate: string
  offers: number
  notJoined: number
  lastCompany: string
  lastDate: string
  verifiedBy: number
}

export default function EmployerDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResult, setSearchResult] = useState<EmployerSearchResult | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [emailSearchQuery, setEmailSearchQuery] = useState('')
  const [emailSearchResults, setEmailSearchResults] = useState<any[]>([])
  const [emailSearchLoading, setEmailSearchLoading] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null)
  const [showCandidateModal, setShowCandidateModal] = useState(false)
  const [allCandidates, setAllCandidates] = useState<any[]>([])
  const [candidatesLoading, setCandidatesLoading] = useState(false)
  const [candidateType, setCandidateType] = useState('all') // 'all', 'invited', 'verified'
  const [candidateStats, setCandidateStats] = useState({
    total: 0,
    invited: 0,
    verified: 0
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    // Essential Information Only
    fullName: '',
    email: '',
    phone: '',
    uan: '',
    panNumber: '',
    designation: '',
    currentCompany: '',
    
    // Offer Details
    jobRole: '',
    offerDate: '',
    offerStatus: '',
    joiningDate: '',
    reason: '',
    notes: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [csvData, setCsvData] = useState<any[]>([])
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [showCsvMapping, setShowCsvMapping] = useState(false)
  const [fieldMapping, setFieldMapping] = useState<{[key: string]: string}>({})
  const [mappedData, setMappedData] = useState<any[]>([])
  // Status history (verified candidates) state
  const [statusNote, setStatusNote] = useState('')
  const [statusSaving, setStatusSaving] = useState(false)
  const [statusMsg, setStatusMsg] = useState<string | null>(null)
  const [statusError, setStatusError] = useState<string | null>(null)
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [editingText, setEditingText] = useState('')
  // Company profile state
  const [profile, setProfile] = useState({
    companyName: '',
    address: '',
    panNumber: '',
    hrName: '',
    designation: '',
    contactNumber: '',
    email: '',
    status: '',
    role: '',
    trustScore: 0,
    createdAt: '',
    updatedAt: ''
  })
  const [profileLoading, setProfileLoading] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [editProfile, setEditProfile] = useState({
    companyName: '',
    address: '',
    panNumber: '',
    hrName: '',
    designation: '',
    contactNumber: '',
    email: ''
  })

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://redhunt-bknd.vercel.app'
  const getEmployerToken = () => localStorage.getItem('employerToken') || sessionStorage.getItem('employerToken')
  const bulkInputRef = useRef<HTMLInputElement | null>(null)

// Skills options for candidate form
const SKILLS_OPTIONS = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'react', label: 'React' },
  { value: 'angular', label: 'Angular' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'php', label: 'PHP' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'sql', label: 'SQL' },
  { value: 'mongodb', label: 'MongoDB' },
  { value: 'aws', label: 'AWS' },
  { value: 'azure', label: 'Azure' },
  { value: 'docker', label: 'Docker' },
  { value: 'kubernetes', label: 'Kubernetes' },
  { value: 'devops', label: 'DevOps' },
  { value: 'machine-learning', label: 'Machine Learning' },
  { value: 'data-analysis', label: 'Data Analysis' },
  { value: 'project-management', label: 'Project Management' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Finance' },
  { value: 'accounting', label: 'Accounting' },
  { value: 'design', label: 'Design' },
  { value: 'ui-ux', label: 'UI/UX Design' },
  { value: 'content-writing', label: 'Content Writing' },
  { value: 'digital-marketing', label: 'Digital Marketing' },
  { value: 'other', label: 'Other' }
]

const RELOCATION_OPTIONS = [
  { value: 'yes', label: 'Yes, open to relocation' },
  { value: 'no', label: 'No, not open to relocation' },
  { value: 'maybe', label: 'Maybe, depends on opportunity' }
]

// Block common free email providers to enforce corporate/work emails
const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.co.in',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',
  'icloud.com',
  'me.com',
  'aol.com',
  'proton.me',
  'protonmail.com',
  'yandex.com',
  'zoho.com',
  'gmx.com',
  'mail.com',
  'inbox.com',
  'rediffmail.com',
  'qq.com',
  '163.com',
  'hey.com',
  'duck.com'
])

function isCorporateEmail(email: string): boolean {
  const trimmed = email.trim()
  const atIndex = trimmed.lastIndexOf('@')
  if (atIndex === -1) return false
  const domain = trimmed.slice(atIndex + 1).toLowerCase()
  if (!domain) return false
  if (FREE_EMAIL_DOMAINS.has(domain)) return false
  // Basic domain shape like company.com or sub.company.co.in
  const domainLooksValid = /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)
  return domainLooksValid
}

  // Authentication check
  useEffect(() => {
    const token = getEmployerToken()
    if (!token) {
      router.push('/employer/login')
      return
    }
    setIsAuthenticated(true)
  }, [router])

  // Load profile when switching to Company Profile tab (must be before any early returns)
  useEffect(() => {
    if (activeTab === 'profile') {
      fetchEmployerProfile()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  // Load candidates when dashboard loads
  useEffect(() => {
    if (isAuthenticated && activeTab === 'dashboard') {
      fetchAllCandidates()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, activeTab])

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null
  }

  const dashboardStats = [
    { title: 'Total Candidates', value: candidateStats.total.toString(), icon: Users, color: 'blue' },
    { title: 'Invited Candidates', value: candidateStats.invited.toString(), icon: UserX, color: 'orange' },
    { title: 'Verified Candidates', value: candidateStats.verified.toString(), icon: Shield, color: 'green' },
    { title: 'Company Trust Score', value: `${profile.trustScore}/10`, icon: TrendingUp, color: 'purple' }
  ]

  const handleEmailSearch = async () => {
    if (!emailSearchQuery.trim()) {
      setError('Please enter an email address')
      return
    }

    setEmailSearchLoading(true)
    setError(null)
    setEmailSearchResults([])

    try {
      const token = getEmployerToken()
      if (!token) {
        setError('Authentication required. Please login again.')
        handleLogout()
        return
      }

      // Search by email in all candidates
      const { data } = await axios.get(`${API_BASE_URL}/api/employer/candidates/all`, {
        params: { search: emailSearchQuery.trim() },
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success && data.candidates && data.candidates.length > 0) {
        setEmailSearchResults(data.candidates)
      } else {
        setEmailSearchResults([])
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setError('Session expired. Please login again.')
        handleLogout()
      } else if (err?.code === 'ECONNREFUSED' || err?.message?.includes('Network Error')) {
        setError('Unable to connect to server. Please check if the API server is running.')
      } else {
        const msg = err?.response?.data?.message || err?.message || 'Email search failed'
        setError(msg)
      }
      setEmailSearchResults([])
    } finally {
      setEmailSearchLoading(false)
    }
  }

  const handleViewCandidate = (candidate: any) => {
    setSelectedCandidate(candidate)
    setShowCandidateModal(true)
    // reset status UI
    setStatusNote('')
    setStatusMsg(null)
    setStatusError(null)
    setEditingIdx(null)
    setEditingText('')
    const id = candidate?.id || candidate?._id
    if (id) fetchCandidateUpdateHistory(id)
  }

  const selectCandidateForHistory = (candidate: any) => {
    setSelectedCandidate(candidate)
    setShowCandidateModal(false)
    setStatusNote('')
    setStatusMsg(null)
    setStatusError(null)
    setEditingIdx(null)
    setEditingText('')
    const id = candidate?.id || candidate?._id
    if (id) fetchCandidateUpdateHistory(id)
  }

  const fetchCandidateUpdateHistory = async (id: string) => {
    try {
      const token = getEmployerToken()
      if (!token) return
      const { data } = await axios.get(`${API_BASE_URL}/api/employer/candidate-users/${id}/update-history`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const list = Array.isArray(data) ? data : (data?.updateHistory || data?.data || [])
      setSelectedCandidate((prev: any) => prev ? { ...prev, updateHistory: list } : prev)
    } catch (err) {
      // ignore fetch errors for history; keep UI responsive
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query')
      return
    }

    setSearchLoading(true)
    setError(null)
    setSearchResult(null)
    setEmailSearchResults([])

    try {
      const token = getEmployerToken()
      if (!token) {
        setError('Authentication required. Please login again.')
        handleLogout()
        return
      }

      // Search in all candidates first
      const { data: allData } = await axios.get(`${API_BASE_URL}/api/employer/candidates/all`, {
        params: { search: searchQuery.trim() },
        headers: { Authorization: `Bearer ${token}` }
      })

      if (allData.success && allData.candidates && allData.candidates.length > 0) {
        setEmailSearchResults(allData.candidates)
      }

      // Also search in the verification database
      const normalizedQuery = searchQuery.trim()
      const { data } = await axios.get(`${API_BASE_URL}/api/employer/candidates/search`, {
        params: { q: normalizedQuery },
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data && data.length > 0) {
        // Process the search results for verification info
        const candidate = data[0]
        const offers = data.length
        const notJoined = data.filter((c: any) => c.joiningStatus === 'not_joined' || c.offerStatus === 'Not Joined').length
        const lastOffer = data[data.length - 1]
        
        setSearchResult({
          found: true,
          candidate: candidate.name || 'Unknown',
          offers: offers,
          notJoined: notJoined,
          lastCompany: lastOffer?.employerName || 'Unknown',
          lastDate: lastOffer?.offerDate ? new Date(lastOffer.offerDate).toLocaleDateString() : 'Unknown',
          verifiedBy: new Set(data.map((c: any) => c.employerId || c.employerName)).size
        })
      } else if (!allData.success || !allData.candidates || allData.candidates.length === 0) {
        setSearchResult({
          found: false,
          candidate: '',
          offers: 0,
          notJoined: 0,
          lastCompany: '',
          lastDate: '',
          verifiedBy: 0
        })
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setError('Session expired. Please login again.')
        handleLogout()
      } else if (err?.code === 'ECONNREFUSED' || err?.message?.includes('Network Error')) {
        setError('Unable to connect to server. Please check if the API server is running.')
      } else {
        const msg = err?.response?.data?.message || err?.message || 'Search failed'
        setError(msg)
      }
      setSearchResult(null)
      setEmailSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  const mapOfferToJoining = (offerStatus: string) => {
    if (offerStatus === 'Joined') return 'joined'
    if (offerStatus === 'Not Joined') return 'not_joined'
    return 'pending'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setError(null)
    setSubmitting(true)
    try {
      const token = getEmployerToken()
      if (!token) {
        setError('Authentication required. Please login again.')
        handleLogout()
        return
      }

      const payload = {
        // Essential Information
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        mobile: formData.phone?.trim() || undefined,
        uan: formData.uan?.trim().toUpperCase() || undefined,
        panNumber: formData.panNumber?.trim().toUpperCase() || undefined,
        designation: formData.designation?.trim() || undefined,
        currentCompany: formData.currentCompany?.trim() || undefined,
        
        // Offer Details
        position: formData.jobRole.trim(),
        offerDate: formData.offerDate || undefined,
        offerStatus: formData.offerStatus || undefined,
        joiningDate: formData.joiningDate || undefined,
        reason: formData.reason?.trim() || undefined,
        notes: formData.notes?.trim() || undefined,
        joiningStatus: mapOfferToJoining(formData.offerStatus)
      }
      
      // First, add the candidate to the backend
      await axios.post(`${API_BASE_URL}/api/employer/candidates`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      // Then send invitation email
      try {
        const emailPayload = {
          candidateName: formData.fullName.trim(),
          candidateEmail: formData.email.trim(),
          employerName: 'Your Company', // You might want to get this from employer profile
          position: formData.jobRole.trim(),
          offerDate: formData.offerDate || undefined
        }

        const emailResponse = await axios.post('/api/send-candidate-invitation', emailPayload, {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (emailResponse.data.success) {
          setMessage('Non-joining candidate reported successfully and notification sent to candidate!')
        } else {
          setMessage('Non-joining candidate reported successfully, but failed to send notification email.')
        }
      } catch (emailError) {
        console.error('Email sending failed:', emailError)
        setMessage('Non-joining candidate reported successfully, but failed to send notification email.')
      }

      setShowAddForm(false)
      setFormData({
        // Essential Information Only
        fullName: '',
        email: '',
        phone: '',
        uan: '',
        panNumber: '',
        designation: '',
        currentCompany: '',
        
        // Offer Details
        jobRole: '',
        offerDate: '',
        offerStatus: '',
        joiningDate: '',
        reason: '',
        notes: ''
      })
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setError('Session expired. Please login again.')
        handleLogout()
      } else if (err?.code === 'ECONNREFUSED' || err?.message?.includes('Network Error')) {
        setError('Unable to connect to server. Please check if the API server is running.')
      } else {
        const msg = err?.response?.data?.message || err?.message || 'Failed to add record'
        setError(msg)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length === 0) return { headers: [], data: [] }
    
    // Handle different CSV formats (comma, semicolon, tab separated)
    const delimiter = text.includes(';') ? ';' : text.includes('\t') ? '\t' : ','
    
    const headers = lines[0].split(delimiter).map(h => h.trim().replace(/"/g, ''))
    const data = lines.slice(1).map(line => {
      const values = line.split(delimiter).map(v => v.trim().replace(/"/g, ''))
      const row: any = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })
      return row
    })
    
    console.log('Parsed CSV headers:', headers) // Debug log
    console.log('Parsed CSV data:', data) // Debug log
    
    return { headers, data }
  }

  const handleFileUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const { headers, data } = parseCSV(text)
      
      setCsvHeaders(headers)
      setCsvData(data)
      setShowCsvMapping(true)
      
      // Auto-map common field names
      const autoMapping: {[key: string]: string} = {}
      headers.forEach(header => {
        const lowerHeader = header.toLowerCase().trim()
        
        // More comprehensive mapping logic
        if (lowerHeader.includes('name') && !lowerHeader.includes('company')) {
          autoMapping[header] = 'fullName'
        } else if (lowerHeader.includes('uan') || lowerHeader.includes('unique id') || lowerHeader.includes('employee id')) {
          autoMapping[header] = 'uan'
        } else if (lowerHeader.includes('email') || lowerHeader.includes('mail')) {
          autoMapping[header] = 'email'
        } else if (lowerHeader.includes('phone') || lowerHeader.includes('mobile') || lowerHeader.includes('contact')) {
          autoMapping[header] = 'phone'
        } else if (lowerHeader.includes('role') || lowerHeader.includes('position') || lowerHeader.includes('job') || lowerHeader.includes('designation')) {
          autoMapping[header] = 'jobRole'
        } else if (lowerHeader.includes('offer date') || lowerHeader.includes('date of offer')) {
          autoMapping[header] = 'offerDate'
        } else if (lowerHeader.includes('offer status') || lowerHeader.includes('status') || lowerHeader.includes('joining status')) {
          autoMapping[header] = 'offerStatus'
        } else if (lowerHeader.includes('joining date') || lowerHeader.includes('date of joining')) {
          autoMapping[header] = 'joiningDate'
        } else if (lowerHeader.includes('reason') || lowerHeader.includes('remarks')) {
          autoMapping[header] = 'reason'
        } else if (lowerHeader.includes('note') || lowerHeader.includes('comment') || lowerHeader.includes('description')) {
          autoMapping[header] = 'notes'
        }
      })
      
      console.log('Auto mapping:', autoMapping) // Debug log
      setFieldMapping(autoMapping)
    }
    reader.readAsText(file)
  }

  const handleBulkUpload = async (file: File) => {
    setUploading(true)
    setMessage(null)
    setError(null)
    try {
      const token = getEmployerToken()
      if (!token) {
        setError('Authentication required. Please login again.')
        handleLogout()
        return
      }

      const form = new FormData()
      form.append('file', file)
      await axios.post(`${API_BASE_URL}/api/employer/candidates/bulk`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })
      setMessage('Bulk upload started. We\'ll notify you when processing completes.')
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setError('Session expired. Please login again.')
        handleLogout()
      } else if (err?.code === 'ECONNREFUSED' || err?.message?.includes('Network Error')) {
        setError('Unable to connect to server. Please check if the API server is running.')
      } else {
        const msg = err?.response?.data?.message || err?.message || 'Bulk upload failed'
        setError(msg)
      }
    } finally {
      setUploading(false)
    }
  }

  const applyMapping = () => {
    // Check if required fields are mapped
    const requiredFields = ['fullName', 'email']
    const mappedFields = Object.values(fieldMapping)
    const missingRequired = requiredFields.filter(field => !mappedFields.includes(field))
    
    if (missingRequired.length > 0) {
      setError(`Please map the following required fields: ${missingRequired.join(', ')}`)
      return
    }
    
    const mapped = csvData.map(row => {
      const mappedRow: any = {}
      Object.keys(fieldMapping).forEach(csvField => {
        const formField = fieldMapping[csvField]
        if (formField && row[csvField] !== undefined && row[csvField] !== '') {
          mappedRow[formField] = row[csvField]
        }
      })
      return mappedRow
    })
    
    console.log('Mapped data:', mapped) // Debug log
    setMappedData(mapped)
    setShowCsvMapping(false)
    setError(null) // Clear any previous errors
  }

  const submitBulkData = async () => {
    setSubmitting(true)
    setMessage(null)
    setError(null)
    
    try {
      const token = getEmployerToken()
      if (!token) {
        setError('Authentication required. Please login again.')
        handleLogout()
        return
      }

      let successCount = 0
      let emailSentCount = 0

      for (const candidate of mappedData) {
        const payload = {
          name: candidate.fullName?.trim() || '',
          uan: candidate.uan?.trim() || undefined,
          email: candidate.email?.trim() || '',
          mobile: candidate.phone?.trim() || undefined,
          position: candidate.jobRole?.trim() || '',
          offerDate: candidate.offerDate || undefined,
          offerStatus: candidate.offerStatus || undefined,
          joiningDate: candidate.joiningDate || undefined,
          reason: candidate.reason?.trim() || undefined,
          notes: candidate.notes?.trim() || undefined,
          joiningStatus: mapOfferToJoining(candidate.offerStatus)
        }
        
        // Add candidate to backend
        await axios.post(`${API_BASE_URL}/api/employer/candidates`, payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
        successCount++

        // Send invitation email if email is provided
        if (candidate.email?.trim()) {
          try {
            const emailPayload = {
              candidateName: candidate.fullName?.trim() || 'Candidate',
              candidateEmail: candidate.email.trim(),
              employerName: 'Your Company', // You might want to get this from employer profile
              position: candidate.jobRole?.trim() || 'Position',
              offerDate: candidate.offerDate || undefined
            }

            const emailResponse = await axios.post('/api/send-candidate-invitation', emailPayload, {
              headers: {
                'Content-Type': 'application/json'
              }
            })

            if (emailResponse.data.success) {
              emailSentCount++
            }
          } catch (emailError) {
            console.error('Email sending failed for candidate:', candidate.email, emailError)
          }
        }
      }
      
      setMessage(`Successfully added ${successCount} candidates. Invitation emails sent to ${emailSentCount} candidates.`)
      setMappedData([])
      setCsvData([])
      setCsvHeaders([])
      setFieldMapping({})
      setActiveTab('dashboard')
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setError('Session expired. Please login again.')
        handleLogout()
      } else if (err?.code === 'ECONNREFUSED' || err?.message?.includes('Network Error')) {
        setError('Unable to connect to server. Please check if the API server is running.')
      } else {
        const msg = err?.response?.data?.message || err?.message || 'Failed to add candidates'
        setError(msg)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const addStatusHistoryEntry = async (note: string) => {
    if (!selectedCandidate || !selectedCandidate.id && !selectedCandidate._id) {
      setStatusError('Candidate id not found')
      return
    }
    if (!note.trim()) return
    setStatusSaving(true)
    setStatusMsg(null)
    setStatusError(null)
    try {
      const token = getEmployerToken()
      if (!token) throw new Error('Authentication required')
      const id = selectedCandidate.id || selectedCandidate._id
      await axios.patch(`${API_BASE_URL}/api/employer/candidate-users/${id}`, {
        verificationNotes: note.trim()
      }, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } })
      // Optimistically append a local entry
      const newEntry = {
        points: (selectedCandidate.updateHistory?.length || 0) + 1,
        date: new Date().toISOString(),
        updatedByRole: 'employer',
        updatedByName: 'You',
        companyName: profile.companyName || undefined,
        notes: note.trim()
      }
      setSelectedCandidate({ ...selectedCandidate, updateHistory: [...(selectedCandidate.updateHistory || []), newEntry] })
      setStatusMsg('Status note added')
      setStatusNote('')
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to add status'
      setStatusError(msg)
    } finally {
      setStatusSaving(false)
    }
  }

  const patchHistoryEntry = async (entryId: string, newText: string) => {
    if (!selectedCandidate) return
    setStatusSaving(true)
    setStatusMsg(null)
    setStatusError(null)
    try {
      const token = getEmployerToken()
      if (!token) throw new Error('Authentication required')
      const id = selectedCandidate.id || selectedCandidate._id
      await axios.patch(`${API_BASE_URL}/api/employer/candidate-users/${id}/update-history/${entryId}`, {
        notes: newText
      }, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } })
      // Optimistically update local state
      const updated = (selectedCandidate.updateHistory || []).map((it: any) => it._id === entryId || it.id === entryId ? { ...it, notes: newText } : it)
      setSelectedCandidate({ ...selectedCandidate, updateHistory: updated })
      setStatusMsg('History updated')
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update history'
      setStatusError(msg)
    } finally {
      setStatusSaving(false)
    }
  }

  const deleteHistoryEntryById = async (entryId: string) => {
    if (!selectedCandidate) return
    setStatusSaving(true)
    setStatusMsg(null)
    setStatusError(null)
    try {
      const token = getEmployerToken()
      if (!token) throw new Error('Authentication required')
      const id = selectedCandidate.id || selectedCandidate._id
      await axios.delete(`${API_BASE_URL}/api/employer/candidate-users/${id}/update-history/${entryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const filtered = (selectedCandidate.updateHistory || []).filter((it: any) => (it._id || it.id) !== entryId)
      setSelectedCandidate({ ...selectedCandidate, updateHistory: filtered })
      setStatusMsg('History entry deleted')
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to delete history'
      setStatusError(msg)
    } finally {
      setStatusSaving(false)
    }
  }

  const fetchAllCandidates = async (type = 'all', search = '') => {
    setCandidatesLoading(true)
    setError(null)

    try {
      const token = getEmployerToken()
      if (!token) {
        setError('Authentication required. Please login again.')
        handleLogout()
        return
      }

      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (type !== 'all') params.append('type', type)

      const { data } = await axios.get(`${API_BASE_URL}/api/employer/candidates/all?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        setAllCandidates(data.candidates || [])
        setCandidateStats({
          total: data.total || 0,
          invited: data.invited || 0,
          verified: data.verified || 0
        })
      } else {
        setAllCandidates([])
        setCandidateStats({ total: 0, invited: 0, verified: 0 })
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setError('Session expired. Please login again.')
        handleLogout()
      } else if (err?.code === 'ECONNREFUSED' || err?.message?.includes('Network Error')) {
        setError('Unable to connect to server. Please check if the API server is running.')
      } else {
        const msg = err?.response?.data?.message || err?.message || 'Failed to fetch candidates'
        setError(msg)
      }
      setAllCandidates([])
      setCandidateStats({ total: 0, invited: 0, verified: 0 })
    } finally {
      setCandidatesLoading(false)
    }
  }

  const fetchEmployerProfile = async () => {
    setProfileLoading(true)
    setProfileError(null)
    setProfileSuccess(null)
    try {
      const token = getEmployerToken()
      if (!token) {
        setProfileError('Authentication required. Please login again.')
        handleLogout()
        return
      }
      const { data } = await axios.get(`${API_BASE_URL}/api/employer/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProfile({
        companyName: data.companyName || '',
        address: data.address || '',
        panNumber: data.panNumber || '',
        hrName: data.hrName || '',
        designation: data.designation || '',
        contactNumber: data.contactNumber || '',
        email: data.email || '',
        status: data.status || '',
        role: data.role || '',
        trustScore: typeof data.trustScore === 'number' ? data.trustScore : 0,
        createdAt: data.createdAt || '',
        updatedAt: data.updatedAt || ''
      })
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setProfileError('Session expired. Please login again.')
        handleLogout()
      } else if (err?.code === 'ECONNREFUSED' || err?.message?.includes('Network Error')) {
        setProfileError('Unable to connect to server. Please check if the API server is running.')
      } else {
        const msg = err?.response?.data?.message || err?.message || 'Failed to load profile'
        setProfileError(msg)
      }
    } finally {
      setProfileLoading(false)
    }
  }

  const updateEmployerProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError(null)
    setProfileSuccess(null)
    
    // Validation
    if (!editProfile.companyName.trim()) {
      setProfileError('Company name is required')
      return
    }
    if (!editProfile.address.trim()) {
      setProfileError('Company address is required')
      return
    }
    if (!editProfile.panNumber.trim()) {
      setProfileError('PAN number is required')
      return
    }
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(editProfile.panNumber.trim())) {
      setProfileError('Enter a valid PAN number (e.g., ABCDE1234F)')
      return
    }
    if (!editProfile.hrName.trim()) {
      setProfileError('Your name is required')
      return
    }
    if (!editProfile.designation.trim()) {
      setProfileError('Designation is required')
      return
    }
    if (!editProfile.contactNumber.trim()) {
      setProfileError('Mobile number is required')
      return
    }
    if (!/^[0-9+\-()\s]{7,20}$/.test(editProfile.contactNumber.trim())) {
      setProfileError('Enter a valid mobile number')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editProfile.email)) {
      setProfileError('Enter a valid corporate email')
      return
    }
    if (!isCorporateEmail(editProfile.email)) {
      setProfileError('Please use your corporate work email (e.g., name@yourcompany.com)')
      return
    }
    
    setSavingProfile(true)
    try {
      const token = getEmployerToken()
      if (!token) {
        setProfileError('Authentication required. Please login again.')
        handleLogout()
        return
      }
      const payload: any = {
        companyName: editProfile.companyName?.trim() || undefined,
        address: editProfile.address?.trim() || undefined,
        panNumber: editProfile.panNumber?.trim() || undefined,
        hrName: editProfile.hrName?.trim() || undefined,
        designation: editProfile.designation?.trim() || undefined,
        contactNumber: editProfile.contactNumber?.trim() || undefined,
        email: editProfile.email?.trim() || undefined
      }
      await axios.put(`${API_BASE_URL}/api/employer/profile`, payload, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      })
      setProfileSuccess('Profile updated successfully.')
      setIsEditProfileOpen(false)
      await fetchEmployerProfile()
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setProfileError('Session expired. Please login again.')
        handleLogout()
      } else if (err?.code === 'ECONNREFUSED' || err?.message?.includes('Network Error')) {
        setProfileError('Unable to connect to server. Please check if the API server is running.')
      } else {
        const msg = err?.response?.data?.message || err?.message || 'Failed to update profile'
        setProfileError(msg)
      }
    } finally {
      setSavingProfile(false)
    }
  }


  const handleLogout = () => {
    localStorage.removeItem('employerToken')
    sessionStorage.removeItem('employerToken')
    localStorage.removeItem('employerInfo')
    router.push('/employer/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-red-600 truncate">Red-Flagged</h1>
              <span className="hidden sm:inline ml-2 sm:ml-4 text-xs sm:text-sm text-gray-500 whitespace-nowrap">Employer Portal</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-3">
              <button className="hidden sm:block text-gray-700 hover:text-red-600 p-2">
                <Settings className="h-5 w-5" />
              </button>
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

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 sm:mb-8">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex space-x-4 sm:space-x-8 px-3 sm:px-6 min-w-max">
              {[
                { id: 'dashboard', label: 'Dashboard', shortLabel: 'Home' },
                { id: 'add', label: 'Add Candidate', shortLabel: 'Add' },
                { id: 'search', label: 'Verify Candidate', shortLabel: 'Verify' },
                { id: 'history', label: 'Update History', shortLabel: 'History' },
                { id: 'profile', label: 'Company Profile', shortLabel: 'Profile' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 sm:py-4 px-1 sm:px-2 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Red-Flagged Dashboard</h2>
              <p className="text-gray-600">Manage your candidate records and verify joining history.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {dashboardStats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                      <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setActiveTab('add')}
                    className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add New Candidate
                  </button>
                  <button 
                    onClick={() => setActiveTab('search')}
                    className="w-full flex items-center justify-center px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Verify Candidate
                  </button>
                  {/* Bulk Upload removed */}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Added 5 new candidates today</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                    <span>2 candidates marked as not joined</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Shield className="h-4 w-4 text-blue-500 mr-2" />
                    <span>3 records verified by network</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Update History Tab */}
        {activeTab === 'history' && (
          <div>
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Manage Update History</h2>
              <p className="text-sm sm:text-base text-gray-600">Search a verified candidate and update their timeline. You can add, edit, or delete entries you created.</p>
            </div>

            {/* Search Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Candidate</label>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <input
                    type="text"
                    value={emailSearchQuery}
                    onChange={(e) => setEmailSearchQuery(e.target.value)}
                    placeholder="Enter Email / UAN"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base"
                    onKeyPress={(e) => e.key === 'Enter' && handleEmailSearch()}
                  />
                  <button
                    onClick={handleEmailSearch}
                    disabled={emailSearchLoading}
                    className="bg-red-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center disabled:opacity-70 text-sm sm:text-base"
                  >
                    {emailSearchLoading ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
              )}

              {emailSearchResults.length > 0 && (
                <div className="space-y-3">
                  {emailSearchResults.map((candidate, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3 sm:p-4 flex items-center justify-between">
                      <div className="min-w-0">
                        <h5 className="font-medium text-gray-900 text-sm sm:text-base truncate">{candidate.name}</h5>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">{candidate.email || candidate.primaryEmail || '-'}</p>
                      </div>
                      <button
                        onClick={() => selectCandidateForHistory(candidate)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-blue-700"
                      >
                        Manage History
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Editor Section */}
            {selectedCandidate && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{selectedCandidate.name || 'Candidate'} — Status History</h3>
                </div>

                <div className="space-y-3">
                  {(selectedCandidate.updateHistory || []).length > 0 ? (
                    (selectedCandidate.updateHistory || []).map((h: any, idx: number) => (
                      <div key={h._id || h.id || idx} className="rounded-lg border border-gray-200 p-3 bg-white">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-900">Point {h.points ?? idx + 1}</div>
                          <div className="text-xs text-gray-500">{h.date ? new Date(h.date).toLocaleString() : ''}</div>
                        </div>
                        <div className="mt-1 text-xs text-gray-600">
                          <span className="mr-2">By: {h.updatedByName || '-'} ({h.updatedByRole || '-'})</span>
                          {h.companyName && <span className="mr-2">Company: {h.companyName}</span>}
                        </div>
                        {editingIdx === idx ? (
                          <div className="mt-2 space-y-2">
                            <textarea
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => patchHistoryEntry(h._id || h.id, editingText)}
                                disabled={statusSaving}
                                className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:opacity-70"
                              >
                                {statusSaving ? 'Saving...' : 'Save Edit'}
                              </button>
                              <button
                                onClick={() => { setEditingIdx(null); setEditingText('') }}
                                className="px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {h.notes && <div className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">{h.notes}</div>}
                            <div className="mt-2 flex gap-2">
                              <button
                                onClick={() => { setEditingIdx(idx); setEditingText(h.notes || '') }}
                                className="px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteHistoryEntryById(h._id || h.id)}
                                disabled={statusSaving}
                                className="px-3 py-1 border border-red-300 text-red-700 rounded text-xs hover:bg-red-50 disabled:opacity-70"
                              >
                                {statusSaving ? 'Working...' : 'Delete'}
                              </button>
                            </div>
                          </>
                        )}

                        {/* Read-only comments */}
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="text-xs font-medium text-gray-800 mb-2">Comments</div>
                          {Array.isArray(h.comments) && h.comments.length > 0 ? (
                            <div className="space-y-2">
                              {h.comments.map((c: any, cIdx: number) => (
                                <div key={c._id || cIdx} className="bg-gray-50 rounded p-2">
                                  <div className="text-xs text-gray-800 whitespace-pre-wrap break-words">{c.text}</div>
                                  <div className="text-[10px] text-gray-500 mt-1">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-gray-500">No comments yet.</div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-600">No history yet.</div>
                  )}
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Add Status Note</h4>
                  {statusMsg && <div className="mb-2 text-xs text-green-700">{statusMsg}</div>}
                  {statusError && <div className="mb-2 text-xs text-red-700">{statusError}</div>}
                  <div className="space-y-2">
                    <textarea
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      rows={3}
                      placeholder="Add verification note or context..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                    />
                    <div>
                      <button
                        onClick={() => addStatusHistoryEntry(statusNote)}
                        disabled={statusSaving}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-70"
                      >
                        {statusSaving ? 'Saving...' : 'Add Note'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add Candidate Tab */}
        {activeTab === 'add' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Non-Joining Candidate</h2>
              <p className="text-gray-600">Add details of candidates who took offer letters but didn't join or are blacklisted for not joining after accepting offers.</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              {message && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{message}</div>
              )}
              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Essential Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="e.g. rajesh.kumar@email.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      UAN Number
                    </label>
                    <input
                      type="text"
                      value={formData.uan}
                      onChange={(e) => setFormData({...formData, uan: e.target.value.toUpperCase()})}
                      placeholder="e.g. 123456789012"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PAN Number
                    </label>
                    <input
                      type="text"
                      value={formData.panNumber}
                      onChange={(e) => setFormData({...formData, panNumber: e.target.value.toUpperCase()})}
                      placeholder="e.g. ABCDE1234F"
                      maxLength={10}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Designation
                    </label>
                    <input
                      type="text"
                      value={formData.designation}
                      onChange={(e) => setFormData({...formData, designation: e.target.value})}
                      placeholder="e.g. Senior Software Engineer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Company
                    </label>
                    <input
                      type="text"
                      value={formData.currentCompany}
                      onChange={(e) => setFormData({...formData, currentCompany: e.target.value})}
                      placeholder="e.g. Tech Solutions Pvt Ltd"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Role / Position *
                    </label>
                    <input
                      type="text"
                      value={formData.jobRole}
                      onChange={(e) => setFormData({...formData, jobRole: e.target.value})}
                      placeholder="e.g. Software Engineer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Offer Date *
                    </label>
                    <input
                      type="date"
                      value={formData.offerDate}
                      onChange={(e) => setFormData({...formData, offerDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Offer Status *
                    </label>
                    <select
                      value={formData.offerStatus}
                      onChange={(e) => setFormData({...formData, offerStatus: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Offer Letter Given">Offer Letter Given</option>
                      <option value="Offer Accepted">Offer Accepted</option>
                      <option value="Offer Rejected">Offer Rejected</option>
                      <option value="Not Joined After Acceptance">Not Joined After Acceptance</option>
                      <option value="Ghosted After Offer">Ghosted After Offer</option>
                      <option value="Joined But Left Early">Joined But Left Early</option>
                      <option value="Blacklisted">Blacklisted</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Joining Date
                    </label>
                    <input
                      type="date"
                      value={formData.joiningDate}
                      onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Not Joining *
                  </label>
                  <select
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  >
                    <option value="">Select Reason</option>
                    <option value="Accepted Another Offer">Accepted Another Offer</option>
                    <option value="Counter Offer from Current Company">Counter Offer from Current Company</option>
                    <option value="Salary Expectations Not Met">Salary Expectations Not Met</option>
                    <option value="Location Not Suitable">Location Not Suitable</option>
                    <option value="Family Issues">Family Issues</option>
                    <option value="Health Issues">Health Issues</option>
                    <option value="No Response After Acceptance">No Response After Acceptance</option>
                    <option value="Ghosted Completely">Ghosted Completely</option>
                    <option value="Asked for More Time Then Disappeared">Asked for More Time Then Disappeared</option>
                    <option value="Joined But Left Within 1 Month">Joined But Left Within 1 Month</option>
                    <option value="Joined But Left Within 3 Months">Joined But Left Within 3 Months</option>
                    <option value="Performance Issues">Performance Issues</option>
                    <option value="Misrepresented Information">Misrepresented Information</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Provide additional details about the incident..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div className="flex space-x-4 items-center">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-70"
                  >
                    {submitting ? 'Saving...' : 'Save Record'}
                  </button>
                  {/* Accessible overlay upload control */}
                  <div className="relative inline-block">
                    <input
                      type="file"
                      accept=".csv"
                      title="Upload CSV"
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file)
                        // reset so selecting the same file again retriggers change
                        e.currentTarget.value = ''
                      }}
                    />
                    {/* <div className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50">
                      Upload CSV (Bulk)
                    </div> */}
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('dashboard')}
                    className="text-gray-500 px-6 py-2"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Bulk Upload removed */}

        {/* Search/Verify Tab */}
        {activeTab === 'search' && (
          <div>
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Verify Candidate Record</h2>
              <p className="text-sm sm:text-base text-gray-600">Check if a candidate has rejected previous offers or view all your candidates.</p>
            </div>

            {/* Search Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Candidate
                </label>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter UAN / Email / Phone Number"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button
                    onClick={handleSearch}
                    disabled={searchLoading}
                    className="bg-red-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center disabled:opacity-70 text-sm sm:text-base"
                  >
                    {searchLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        <span className="hidden sm:inline">Searching...</span>
                        <span className="sm:hidden">Search</span>
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        <span className="hidden sm:inline">Search</span>
                        <span className="sm:hidden">Search</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Search Results */}
              {emailSearchResults.length > 0 && (
                <div className="mt-6 mb-6">
                  <h4 className="text-sm sm:text-md font-semibold text-gray-900 mb-3">Search Results ({emailSearchResults.length})</h4>
                  <div className="space-y-3">
                    {emailSearchResults.map((candidate, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-gray-900 text-sm sm:text-base truncate">{candidate.name}</h5>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">{candidate.email}</p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              {candidate.position} • {candidate.offerStatus}
                            </p>
                            <p className="text-xs text-gray-400">
                              Added: {new Date(candidate.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleViewCandidate(candidate)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-green-700 self-start sm:self-auto"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResult && searchResult.found && (
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <div className="flex items-center mb-4">
                    <Search className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2" />
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">Candidate Found</span>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-gray-600 text-xs sm:text-sm">Name:</span>
                      <span className="font-medium text-xs sm:text-sm">{searchResult.candidate}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-gray-600 text-xs sm:text-sm">Previous Offers:</span>
                      <span className="font-medium text-xs sm:text-sm">{searchResult.offers} total, {searchResult.notJoined} not joined</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-gray-600 text-xs sm:text-sm">Last Offer:</span>
                      <span className="font-medium text-xs sm:text-sm">{searchResult.lastCompany} ({searchResult.lastDate})</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-gray-600 text-xs sm:text-sm">Verified by:</span>
                      <span className="font-medium text-xs sm:text-sm">{searchResult.verifiedBy} employers</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 sm:mt-6">
                    <button className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 text-xs sm:text-sm w-full sm:w-auto">
                      Add this candidate to your company records
                    </button>
                  </div>
                </div>
              )}

              {searchResult && !searchResult.found && searchQuery && (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <p className="text-gray-600">No matching record found in Red-Flagged database.</p>
                </div>
              )}
            </div>

            {/* All Candidates Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">All Candidates</h3>
                  <p className="text-xs sm:text-sm text-gray-600">View invited and verified candidates</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  <select
                    value={candidateType}
                    onChange={(e) => {
                      setCandidateType(e.target.value)
                      fetchAllCandidates(e.target.value)
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-xs sm:text-sm"
                  >
                    <option value="all">All Candidates</option>
                    <option value="invited">Invited Only</option>
                    <option value="verified">Verified Only</option>
                  </select>
                  <button
                    onClick={() => fetchAllCandidates(candidateType)}
                    disabled={candidatesLoading}
                    className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center disabled:opacity-70 text-xs sm:text-sm"
                  >
                    {candidatesLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-2"></div>
                        <span className="hidden sm:inline">Loading...</span>
                        <span className="sm:hidden">Load</span>
                      </>
                    ) : (
                      <>
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        <span className="hidden sm:inline">Refresh</span>
                        <span className="sm:hidden">Refresh</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {allCandidates.length > 0 && (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Mobile
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              UAN/PAN
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Details
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {allCandidates.map((candidate, index) => (
                            <tr key={candidate.id || candidate._id || index} className="hover:bg-gray-50">
                              <td className="px-3 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  candidate.type === 'verified' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {candidate.type === 'verified' ? 'Verified' : 'Invited'}
                                </span>
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 truncate">{candidate.name}</div>
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 truncate">{candidate.email || candidate.primaryEmail || '-'}</div>
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                {candidate.mobile || '-'}
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                {candidate.type === 'verified' ? (candidate.pan || '-') : (candidate.uan || '-')}
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                {candidate.type === 'verified' ? (
                                  <div>
                                    <div className="truncate">{candidate.designation || '-'}</div>
                                    <div className="text-xs text-gray-500 truncate">{candidate.presentCompany || '-'}</div>
                                  </div>
                                ) : (
                                  <div>
                                    <div className="truncate">{candidate.position || '-'}</div>
                                    <div className="text-xs text-gray-500">
                                      {candidate.offerDate ? new Date(candidate.offerDate).toLocaleDateString() : '-'}
                                    </div>
                                  </div>
                                )}
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap">
                                {candidate.type === 'verified' ? (
                                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                    Verified
                                  </span>
                                ) : (
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  candidate.joiningStatus === 'joined' || candidate.offerStatus === 'Joined'
                                    ? 'bg-green-100 text-green-800'
                                    : candidate.joiningStatus === 'not_joined' || candidate.offerStatus === 'Not Joined'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {candidate.joiningStatus === 'joined' ? 'Joined' :
                                   candidate.joiningStatus === 'not_joined' ? 'Not Joined' :
                                   candidate.offerStatus || 'Pending'}
                                </span>
                                )}
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => handleViewCandidate(candidate)}
                                  className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile Card View */}
                  <div className="lg:hidden space-y-3">
                    {allCandidates.map((candidate, index) => (
                      <div key={candidate.id || candidate._id || index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm truncate">{candidate.name}</h4>
                            <p className="text-xs text-gray-600 truncate">{candidate.email || candidate.primaryEmail || '-'}</p>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${
                            candidate.type === 'verified' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {candidate.type === 'verified' ? 'Verified' : 'Invited'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                          <div>
                            <span className="text-gray-500">Mobile:</span>
                            <p className="text-gray-900">{candidate.mobile || '-'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">UAN/PAN:</span>
                            <p className="text-gray-900">{candidate.type === 'verified' ? (candidate.pan || '-') : (candidate.uan || '-')}</p>
                          </div>
                        </div>
                        
                        <div className="text-xs mb-3">
                          <span className="text-gray-500">Details:</span>
                          <p className="text-gray-900">
                            {candidate.type === 'verified' 
                              ? `${candidate.designation || '-'} • ${candidate.presentCompany || '-'}`
                              : `${candidate.position || '-'} • ${candidate.offerDate ? new Date(candidate.offerDate).toLocaleDateString() : '-'}`
                            }
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            candidate.type === 'verified' 
                              ? 'bg-green-100 text-green-800'
                              : candidate.joiningStatus === 'joined' || candidate.offerStatus === 'Joined'
                              ? 'bg-green-100 text-green-800'
                              : candidate.joiningStatus === 'not_joined' || candidate.offerStatus === 'Not Joined'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {candidate.type === 'verified' 
                              ? 'Verified'
                              : candidate.joiningStatus === 'joined' 
                                ? 'Joined' 
                                : candidate.joiningStatus === 'not_joined' 
                                  ? 'Not Joined' 
                                  : candidate.offerStatus || 'Pending'
                            }
                          </span>
                          <button
                            onClick={() => handleViewCandidate(candidate)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {allCandidates.length === 0 && !candidatesLoading && (
                <div className="text-center py-6 sm:py-8 text-gray-500">
                  <Users className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base">No candidates found. Click "Refresh" to fetch your records.</p>
                </div>
              )}
            </div>
          </div>
        )}


        {/* Company Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Profile</h2>
              <p className="text-gray-600">Manage your company information and settings.</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              {profileLoading && (
                <div className="mb-4 text-gray-600">Loading profile...</div>
              )}
              {profileError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{profileError}</div>
              )}
              {profileSuccess && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{profileSuccess}</div>
              )}

              {/* Read-only profile with Edit button */}
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-500">Company Name</div>
                    <div className="text-gray-900 font-medium">{profile.companyName || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">PAN Number</div>
                    <div className="text-gray-900 font-medium">{profile.panNumber || '-'}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-sm text-gray-500">Company Address</div>
                    <div className="text-gray-900 font-medium">{profile.address || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Your Name</div>
                    <div className="text-gray-900 font-medium">{profile.hrName || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Designation</div>
                    <div className="text-gray-900 font-medium">{profile.designation || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Mobile Number</div>
                    <div className="text-gray-900 font-medium">{profile.contactNumber || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Corporate Mail ID</div>
                    <div className="text-gray-900 font-medium break-words">{profile.email || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="text-gray-900 font-medium capitalize">{profile.status || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Role</div>
                    <div className="text-gray-900 font-medium">{profile.role || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Trust Score</div>
                    <div className="text-gray-900 font-medium">{profile.trustScore ?? '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Created</div>
                    <div className="text-gray-900 font-medium">{profile.createdAt ? new Date(profile.createdAt).toLocaleString() : '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Updated</div>
                    <div className="text-gray-900 font-medium">{profile.updatedAt ? new Date(profile.updatedAt).toLocaleString() : '-'}</div>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => {
                      setEditProfile(profile)
                      setIsEditProfileOpen(true)
                    }}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditProfileOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                  <div className="flex items-center justify-between border-b px-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-900">Edit Company Profile</h3>
                    <button onClick={() => setIsEditProfileOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                  </div>
                  <form onSubmit={updateEmployerProfile} className="px-6 py-4 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                          value={editProfile.companyName}
                          onChange={(e) => setEditProfile({ ...editProfile, companyName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
                    <input
                      type="text"
                          value={editProfile.panNumber}
                          onChange={(e) => setEditProfile({ ...editProfile, panNumber: e.target.value.toUpperCase() })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 uppercase"
                          placeholder="ABCDE1234F"
                          maxLength={10}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Address</label>
                        <textarea
                          value={editProfile.address}
                          onChange={(e) => setEditProfile({ ...editProfile, address: e.target.value })}
                          rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="Complete company address with city, state, and pincode"
                    />
                  </div>
                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                    <input
                      type="text"
                          value={editProfile.hrName}
                          onChange={(e) => setEditProfile({ ...editProfile, hrName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                    <input
                          type="text"
                          value={editProfile.designation}
                          onChange={(e) => setEditProfile({ ...editProfile, designation: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                    <input
                          type="tel"
                          value={editProfile.contactNumber}
                          onChange={(e) => setEditProfile({ ...editProfile, contactNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Corporate Mail ID</label>
                    <input
                          type="email"
                          value={editProfile.email}
                          onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                <div className="border-t pt-4 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsEditProfileOpen(false)} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={savingProfile} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-70">
                    {savingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
          </div>
        )}
      </div>

      {/* Candidate Details Modal */}
      {showCandidateModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Candidate Details</h2>
                <button
                  onClick={() => setShowCandidateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <p className="text-gray-900">{selectedCandidate.name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{selectedCandidate.email || selectedCandidate.primaryEmail || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Mobile</label>
                      <p className="text-gray-900">{selectedCandidate.mobile || selectedCandidate.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">UAN Number</label>
                      <p className="text-gray-900">{selectedCandidate.uan || selectedCandidate.uanNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">PAN Number</label>
                      <p className="text-gray-900">{selectedCandidate.panNumber || selectedCandidate.pan || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Professional Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Current Designation</label>
                      <p className="text-gray-900">{selectedCandidate.designation || selectedCandidate.currentDesignation || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Current Company</label>
                      <p className="text-gray-900">{selectedCandidate.currentCompany || selectedCandidate.presentCompany || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Job Role/Position</label>
                      <p className="text-gray-900">{selectedCandidate.position || selectedCandidate.jobRole || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Offer Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedCandidate.offerStatus === 'Not Joined After Acceptance' || 
                        selectedCandidate.offerStatus === 'Ghosted After Offer' ||
                        selectedCandidate.offerStatus === 'Blacklisted'
                          ? 'bg-red-100 text-red-800'
                          : selectedCandidate.offerStatus === 'Joined'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedCandidate.offerStatus || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Offer Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Offer Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Offer Date</label>
                      <p className="text-gray-900">
                        {selectedCandidate.offerDate ? new Date(selectedCandidate.offerDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Joining Date</label>
                      <p className="text-gray-900">
                        {selectedCandidate.joiningDate ? new Date(selectedCandidate.joiningDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Reason for Not Joining</label>
                      <p className="text-gray-900">{selectedCandidate.reason || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Joining Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedCandidate.joiningStatus === 'not_joined'
                          ? 'bg-red-100 text-red-800'
                          : selectedCandidate.joiningStatus === 'joined'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedCandidate.joiningStatus || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Added By</label>
                      <p className="text-gray-900">{selectedCandidate.employerName || selectedCandidate.addedBy || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Verification Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedCandidate.verified || selectedCandidate.type === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedCandidate.verified || selectedCandidate.type === 'verified' ? 'Verified' : 'Pending Verification'}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Created Date</label>
                      <p className="text-gray-900">
                        {selectedCandidate.createdAt ? new Date(selectedCandidate.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                      <p className="text-gray-900">
                        {selectedCandidate.updatedAt ? new Date(selectedCandidate.updatedAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              {selectedCandidate.notes && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-3">Additional Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedCandidate.notes}</p>
                  </div>
                </div>
              )}

              {/* Status / Update History (visible for verified or when history exists) */}
              {(selectedCandidate?.type === 'verified' || selectedCandidate?.verified || (selectedCandidate?.updateHistory && selectedCandidate.updateHistory.length > 0)) && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-3">Status History</h3>
                  <div className="space-y-3">
                    {(selectedCandidate.updateHistory || []).length > 0 ? (
                      (selectedCandidate.updateHistory || []).map((h: any, idx: number) => (
                        <div key={idx} className="rounded-lg border border-gray-200 p-3 bg-white">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-gray-900">Point {h.points ?? idx + 1}</div>
                            <div className="text-xs text-gray-500">{h.date ? new Date(h.date).toLocaleString() : ''}</div>
                          </div>
                          <div className="mt-1 text-xs text-gray-600">
                            <span className="mr-2">By: {h.updatedByName || '-'} ({h.updatedByRole || '-'})</span>
                            {h.companyName && <span className="mr-2">Company: {h.companyName}</span>}
                          </div>
                          {editingIdx === idx ? (
                            <div className="mt-2 space-y-2">
                              <textarea
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => patchHistoryEntry(h._id || h.id, editingText)}
                                  disabled={statusSaving}
                                  className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:opacity-70"
                                >
                                  {statusSaving ? 'Saving...' : 'Save Edit'}
                                </button>
                                <button
                                  onClick={() => { setEditingIdx(null); setEditingText('') }}
                                  className="px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {h.notes && <div className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">{h.notes}</div>}
                              <div className="mt-2 flex gap-2">
                                <button
                                  onClick={() => { setEditingIdx(idx); setEditingText(h.notes || '') }}
                                  className="px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteHistoryEntryById(h._id || h.id)}
                                  disabled={statusSaving}
                                  className="px-3 py-1 border border-red-300 text-red-700 rounded text-xs hover:bg-red-50 disabled:opacity-70"
                                >
                                  {statusSaving ? 'Working...' : 'Delete'}
                                </button>
                              </div>
                            </>
                          )}

                          {/* Read-only comments */}
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="text-xs font-medium text-gray-800 mb-2">Comments</div>
                            {Array.isArray(h.comments) && h.comments.length > 0 ? (
                              <div className="space-y-2">
                                {h.comments.map((c: any, cIdx: number) => (
                                  <div key={c._id || cIdx} className="bg-gray-50 rounded p-2">
                                    <div className="text-xs text-gray-800 whitespace-pre-wrap break-words">{c.text}</div>
                                    <div className="text-[10px] text-gray-500 mt-1">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-xs text-gray-500">No comments yet.</div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-600">No history yet.</div>
                    )}
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Add Status Note</h4>
                    {statusMsg && <div className="mb-2 text-xs text-green-700">{statusMsg}</div>}
                    {statusError && <div className="mb-2 text-xs text-red-700">{statusError}</div>}
                    <div className="space-y-2">
                      <textarea
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                        rows={3}
                        placeholder="Add verification note or context..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                      />
                      <div>
                        <button
                          onClick={() => addStatusHistoryEntry(statusNote)}
                          disabled={statusSaving}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-70"
                        >
                          {statusSaving ? 'Saving...' : 'Add Note'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={() => setShowCandidateModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Add logic to add this candidate to current employer's records
                    console.log('Add candidate to records:', selectedCandidate)
                  }}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Add to My Records
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
