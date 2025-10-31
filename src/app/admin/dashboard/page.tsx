'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  UserCheck, 
  Shield, 
  Clock, 
  TrendingUp,
  Search,
  Filter,
  Download,
  Eye,
  Ban,
  CheckCircle,
  AlertTriangle,
  Settings,
  LogOut,
  Bell,
  Loader2,
  Building2,
  X,
  ChevronDown
} from 'lucide-react'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Type definitions
interface Employer {
  _id?: string
  id?: string
  companyName?: string
  company?: string
  email: string
  status: string
  candidateCount?: number
  candidates?: number
  createdAt?: string
  joinedOn?: string
  lastActivity?: string
}

interface Candidate {
  _id?: string
  id?: string
  name: string
  email: string
  mobile?: string
  uan?: string
  position?: string
  offerDate?: string
  offerStatus?: string
  joiningDate?: string
  joiningStatus?: string
  reason?: string
  notes?: string
  employerId?: string
  employerName?: string
  createdAt?: string
  updatedAt?: string
}

interface CandidateUser {
  _id?: string
  id?: string
  // Personal Information
  name?: string
  fathersName?: string
  gender?: string
  dob?: string
  permanentAddress?: string
  currentAddress?: string
  mobileNumber?: string
  mobile?: string  // For backward compatibility
  primaryEmail?: string
  email: string  // For backward compatibility
  secondaryEmail?: string
  
  // Professional Information
  panNumber?: string
  pan?: string  // For backward compatibility
  uanNumber?: string
  uan?: string  // For backward compatibility
  highestQualification?: string
  workExperience?: number
  sector?: string
  presentCompany?: string
  designation?: string
  latestRating?: string
  workLocation?: string
  openToRelocation?: string
  currentCtc?: string
  expectedHikePercentage?: string
  noticePeriod?: string
  negotiableDays?: string
  skillSets?: string[]
  
  // Account Information
  status: string
  createdAt?: string
  updatedAt?: string
}

interface DashboardStat {
  title: string
  value: string
  icon: any
  color: string
  change: string
}

interface Metrics {
  totalEmployers?: number
  totalCandidates?: number
  verifiedRecords?: number
  pendingVerifications?: number
  employerGrowth?: string
  candidateGrowth?: string
  verificationGrowth?: string
  pendingChange?: string
}

interface Reports {
  monthlyEmployers?: Record<string, number>
  industryRates?: Record<string, number>
  topEmployers?: Record<string, number>
  apiStats?: {
    totalRequests?: string
    successRate?: string
    failureRate?: string
  }
  rejectionHeatmap?: Record<string, string>
}

interface Notification {
  id: string
  type: 'success' | 'warning' | 'info'
  message: string
  time: string
  timestamp: number
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterEmployer, setFilterEmployer] = useState('all') // stores employerId or 'all'
  const [candidateUsers, setCandidateUsers] = useState<CandidateUser[]>([])
  const [candidateUsersLoading, setCandidateUsersLoading] = useState(false)
  const [selectedCandidateUser, setSelectedCandidateUser] = useState<CandidateUser | null>(null)
  const [showCandidateUserModal, setShowCandidateUserModal] = useState(false)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [openEmployerDropdownId, setOpenEmployerDropdownId] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  
  // Data states
  const [dashboardStats, setDashboardStats] = useState<DashboardStat[]>([
    { title: 'Total Employers', value: '0', icon: Users, color: 'blue', change: '+0%' },
    { title: 'Total Candidates', value: '0', icon: UserCheck, color: 'green', change: '+0%' },
    { title: 'Verified Records', value: '0', icon: Shield, color: 'purple', change: '+0%' },
    { title: 'Pending Verifications', value: '0', icon: Clock, color: 'yellow', change: '+0%' }
  ])
  const [employers, setEmployers] = useState<Employer[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [reports, setReports] = useState<Reports | null>(null)
  const [loading, setLoading] = useState(false)
  const [candidatesLoading, setCandidatesLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // History management (Admin)
  const [historySearchQuery, setHistorySearchQuery] = useState('')
  const [historySearchLoading, setHistorySearchLoading] = useState(false)
  const [historyResults, setHistoryResults] = useState<any[]>([])
  const [historyCandidate, setHistoryCandidate] = useState<any | null>(null)
  const [historyNote, setHistoryNote] = useState('')
  const [historySaving, setHistorySaving] = useState(false)
  const [historyMsg, setHistoryMsg] = useState<string | null>(null)
  const [historyErr, setHistoryErr] = useState<string | null>(null)
  const [historyEditingIdx, setHistoryEditingIdx] = useState<number | null>(null)
  const [historyEditingText, setHistoryEditingText] = useState('')

  // View modal state for Employer
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const openView = (employer: Employer) => { setSelectedEmployer(employer); setIsViewOpen(true) }
  const closeView = () => { setIsViewOpen(false); setSelectedEmployer(null) }

  // View modal state for Candidate
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [isCandidateViewOpen, setIsCandidateViewOpen] = useState(false)
  const openCandidateView = (candidate: Candidate) => { setSelectedCandidate(candidate); setIsCandidateViewOpen(true) }
  const closeCandidateView = () => { setIsCandidateViewOpen(false); setSelectedCandidate(null) }

  // Get auth token from localStorage or session
  const getAuthToken = () => {
    return localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')
  }

  // Add notification function
  const addNotification = (type: 'success' | 'warning' | 'info', message: string) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      type,
      message,
      time: 'Just now',
      timestamp: Date.now()
    }
    setNotifications(prev => [newNotification, ...prev].slice(0, 50)) // Keep last 50 notifications
  }

  // Admin history handlers
  const handleAdminHistorySearch = async () => {
    setHistorySearchLoading(true)
    setHistoryErr(null)
    setHistoryResults([])
    try {
      const token = getAuthToken()
      if (!token) throw new Error('Authentication required')
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/candidate-users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const q = historySearchQuery.trim().toLowerCase()
      const filtered = Array.isArray(data) ? data : (data?.users || data?.data || [])
      const results = (filtered || []).filter((u: any) => {
        const email = (u.email || u.primaryEmail || '').toLowerCase()
        const uan = (u.uan || u.uanNumber || '').toLowerCase()
        const name = (u.name || u.fullName || '').toLowerCase()
        return !q || email.includes(q) || uan.includes(q) || name.includes(q)
      })
      setHistoryResults(results)
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Search failed'
      setHistoryErr(msg)
    } finally {
      setHistorySearchLoading(false)
    }
  }

  const selectHistoryCandidate = async (cu: any) => {
    setHistoryCandidate(null)
    setHistoryMsg(null)
    setHistoryErr(null)
    setHistoryEditingIdx(null)
    setHistoryEditingText('')
    try {
      const token = getAuthToken()
      if (!token) throw new Error('Authentication required')
      const id = cu._id || cu.id
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/candidate-users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setHistoryCandidate(data || cu)
    } catch (err: any) {
      setHistoryCandidate(cu)
    }
  }

  const adminAddHistoryEntry = async () => {
    if (!historyCandidate) return
    if (!historyNote.trim()) return
    setHistorySaving(true)
    setHistoryMsg(null)
    setHistoryErr(null)
    try {
      const token = getAuthToken()
      if (!token) throw new Error('Authentication required')
      const id = historyCandidate._id || historyCandidate.id
      // Use status API to append a history point with notes
      await axios.patch(`${API_BASE_URL}/api/admin/candidate-users/${id}/status`, { status: historyCandidate.status || 'approved', notes: historyNote.trim() }, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      })
      const newEntry = {
        points: (historyCandidate.updateHistory?.length || 0) + 1,
        date: new Date().toISOString(),
        updatedByRole: 'admin',
        updatedByName: 'Admin',
        notes: historyNote.trim()
      }
      setHistoryCandidate({ ...historyCandidate, updateHistory: [...(historyCandidate.updateHistory || []), newEntry] })
      setHistoryNote('')
      setHistoryMsg('Note added')
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to add note'
      setHistoryErr(msg)
    } finally {
      setHistorySaving(false)
    }
  }

  const adminPatchHistoryEntry = async (entryId: string, newText: string) => {
    if (!historyCandidate) return
    setHistorySaving(true)
    setHistoryMsg(null)
    setHistoryErr(null)
    try {
      const token = getAuthToken()
      if (!token) throw new Error('Authentication required')
      const id = historyCandidate._id || historyCandidate.id
      await axios.patch(`${API_BASE_URL}/api/admin/candidate-users/${id}/update-history/${entryId}`, { notes: newText }, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      })
      const updated = (historyCandidate.updateHistory || []).map((it: any) => (it._id === entryId || it.id === entryId) ? { ...it, notes: newText } : it)
      setHistoryCandidate({ ...historyCandidate, updateHistory: updated })
      setHistoryMsg('History updated')
      setHistoryEditingIdx(null)
      setHistoryEditingText('')
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update history'
      setHistoryErr(msg)
    } finally {
      setHistorySaving(false)
    }
  }

  const adminDeleteHistoryEntry = async (entryId: string) => {
    if (!historyCandidate) return
    setHistorySaving(true)
    setHistoryMsg(null)
    setHistoryErr(null)
    try {
      const token = getAuthToken()
      if (!token) throw new Error('Authentication required')
      const id = historyCandidate._id || historyCandidate.id
      await axios.delete(`${API_BASE_URL}/api/admin/candidate-users/${id}/update-history/${entryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const filtered = (historyCandidate.updateHistory || []).filter((it: any) => (it._id || it.id) !== entryId)
      setHistoryCandidate({ ...historyCandidate, updateHistory: filtered })
      setHistoryMsg('History entry deleted')
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to delete history'
      setHistoryErr(msg)
    } finally {
      setHistorySaving(false)
    }
  }

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('adminNotifications')
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications))
      } catch (e) {
        console.error('Failed to load notifications', e)
      }
    }
  }, [])

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('adminNotifications', JSON.stringify(notifications))
    }
  }, [notifications])

  // Normalize backend status values to UI filter values
  const normalizeStatus = (status?: string) => {
    const s = (status || '').toLowerCase()
    if (s === 'active' || s === 'approved') return 'approved'
    if (s === 'suspended') return 'suspended'
    if (s === 'rejected') return 'rejected'
    if (s === 'pending') return 'pending'
    return s
  }

  // Get approved employers
  const getApprovedEmployers = () => {
    return employers.filter(emp => normalizeStatus(emp.status) === 'approved')
  }

  // Get unique APPROVED employer names only for dropdown
  const getApprovedEmployerNames = () => {
    const approvedEmployers = getApprovedEmployers()
    const uniqueNames = Array.from(new Set(
      approvedEmployers.map(emp => emp.companyName || emp.company).filter(Boolean)
    ))
    return uniqueNames.sort()
  }

  // API functions
  const fetchEmployers = async () => {
    try {
      setLoading(true)
      const token = getAuthToken()
      if (!token) {
        setError('No authentication token found. Please login again.')
        return
      }
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/employers`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Check for new employers
      const previousCount = employers.length
      if (previousCount > 0 && data.length > previousCount) {
        const newCount = data.length - previousCount
        addNotification('info', `${newCount} new employer${newCount > 1 ? 's' : ''} registered`)
      }
      
      setEmployers(data)
      
      // Update approved employers count
      const approvedCount = data.filter((emp: Employer) => normalizeStatus(emp.status) === 'approved').length
      setDashboardStats(prev => prev.map(stat => 
        stat.title === 'Total Employers' 
          ? { ...stat, value: approvedCount.toString() }
          : stat
      ))
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.')
        localStorage.removeItem('adminToken')
        sessionStorage.removeItem('adminToken')
        setTimeout(() => {
          window.location.href = '/admin/login'
        }, 2000)
      } else {
        setError('Failed to fetch employers')
        console.error('Fetch employers error:', err)
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchCandidateUsers = async () => {
    try {
      setCandidateUsersLoading(true)
      const token = getAuthToken()
      if (!token) {
        setError('No authentication token found. Please login again.')
        return
      }
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/candidate-users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Check for new candidate users
      const previousCount = candidateUsers.length
      if (previousCount > 0 && data.length > previousCount) {
        const newCount = data.length - previousCount
        addNotification('info', `${newCount} new candidate${newCount > 1 ? 's' : ''} registered`)
      }
      
      setCandidateUsers(data || [])
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.')
        localStorage.removeItem('adminToken')
        sessionStorage.removeItem('adminToken')
        setTimeout(() => {
          window.location.href = '/admin/login'
        }, 2000)
      } else if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
        setError('Unable to connect to server. Please check if the API server is running.')
      } else {
        setError('Failed to fetch candidate users')
      }
    } finally {
      setCandidateUsersLoading(false)
    }
  }

  const fetchCandidates = async (opts?: { employerId?: string; search?: string }) => {
    try {
      setCandidatesLoading(true)
      const token = getAuthToken()
      if (!token) {
        setError('No authentication token found. Please login again.')
        return
      }

      let data = null
      try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/candidates`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            employerId: opts?.employerId && opts.employerId !== 'all' ? opts.employerId : undefined,
            search: opts?.search?.trim() || undefined
          }
        })
        data = response.data
      } catch (adminErr: any) {
        console.log('Admin candidates endpoint failed, trying alternative...', adminErr.response?.status)
        
        try {
          const employersResponse = await axios.get(`${API_BASE_URL}/api/admin/employers`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          
          const employers = employersResponse.data
          const allCandidates: Candidate[] = []
          
          employers.forEach((employer: any) => {
            if (employer.candidates && Array.isArray(employer.candidates)) {
              employer.candidates.forEach((candidate: any) => {
                allCandidates.push({
                  ...candidate,
                  employerName: employer.companyName || employer.company,
                  employerId: employer._id || employer.id
                })
              })
            }
          })
          
          data = allCandidates
        } catch (fallbackErr: any) {
          console.log('Fallback also failed, using mock data for demo purposes')
          data = [
            {
              _id: 'mock1',
              name: 'Rajesh Kumar',
              email: 'rajesh@example.com',
              mobile: '+91 98765 43210',
              uan: 'UAN-854392',
              position: 'Software Engineer',
              offerDate: '2024-01-15',
              offerStatus: 'Not Joined',
              joiningStatus: 'not_joined',
              employerName: 'AlphaTech',
              createdAt: '2024-01-15'
            },
            {
              _id: 'mock2',
              name: 'Priya Sharma',
              email: 'priya@example.com',
              mobile: '+91 98765 43211',
              uan: 'UAN-923847',
              position: 'Data Analyst',
              offerDate: '2024-01-10',
              offerStatus: 'Joined',
              joiningStatus: 'joined',
              employerName: 'BetaCorp',
              createdAt: '2024-01-10'
            }
          ]
        }
      }

      setCandidates(data || [])
      
      setDashboardStats(prev => prev.map(stat => 
        stat.title === 'Total Candidates' 
          ? { ...stat, value: (data || []).length.toString() }
          : stat
      ))
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.')
        localStorage.removeItem('adminToken')
        sessionStorage.removeItem('adminToken')
        setTimeout(() => {
          window.location.href = '/admin/login'
        }, 2000)
      } else if (err.response?.status === 403) {
        setError('Access denied. Admin permissions required to view candidates.')
        console.error('403 Forbidden - Admin access required:', err)
      } else if (err.response?.status === 404) {
        setError('Candidates endpoint not found. Please check API configuration.')
        console.error('404 Not Found - API endpoint issue:', err)
      } else if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
        setError('Unable to connect to server. Please check if the API server is running.')
        console.error('Network error:', err)
      } else {
        setError(`Failed to fetch candidates: ${err.response?.data?.message || err.message || 'Unknown error'}`)
        console.error('Fetch candidates error:', err)
      }
    } finally {
      setCandidatesLoading(false)
    }
  }

  const fetchMetrics = async () => {
    try {
      const token = getAuthToken()
      if (!token) return
      
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/metrics`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMetrics(data)
      
      setDashboardStats(prev => {
        const approvedCount = employers.filter(emp => normalizeStatus(emp.status) === 'approved').length
        return [
          { title: 'Approved Employers', value: data.totalEmployers?.toString() || approvedCount.toString(), icon: Users, color: 'blue', change: data.employerGrowth || '+0%' },
          { title: 'Total Candidates', value: data.totalCandidates?.toString() || candidates.length.toString(), icon: UserCheck, color: 'green', change: data.candidateGrowth || '+0%' },
          { title: 'Verified Records', value: data.verifiedRecords?.toString() || '0', icon: Shield, color: 'purple', change: data.verificationGrowth || '+0%' },
          { title: 'Pending Verifications', value: data.pendingVerifications?.toString() || '0', icon: Clock, color: 'yellow', change: data.pendingChange || '+0%' }
        ]
      })
    } catch (err: any) {
      if (err.response?.status === 401) {
        console.error('Session expired for metrics')
        localStorage.removeItem('adminToken')
        sessionStorage.removeItem('adminToken')
      } else {
        console.error('Fetch metrics error:', err)
      }
    }
  }

  const fetchReports = async () => {
    try {
      const token = getAuthToken()
      if (!token) return
      
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/reports`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReports(data)
    } catch (err: any) {
      if (err.response?.status === 401) {
        console.error('Session expired for reports')
        localStorage.removeItem('adminToken')
        sessionStorage.removeItem('adminToken')
      } else {
        console.error('Fetch reports error:', err)
      }
    }
  }

  const approveEmployer = async (employerId: string) => {
    try {
      const token = getAuthToken()
      const employer = employers.find(e => (e._id || e.id) === employerId)
      await axios.patch(`${API_BASE_URL}/api/admin/employers/${employerId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      addNotification('success', `Employer ${employer?.companyName || employer?.company || 'account'} approved`)
      fetchEmployers()
    } catch (err) {
      setError('Failed to approve employer')
      console.error('Approve employer error:', err)
    }
  }

  const rejectEmployer = async (employerId: string) => {
    try {
      const token = getAuthToken()
      const employer = employers.find(e => (e._id || e.id) === employerId)
      await axios.patch(`${API_BASE_URL}/api/admin/employers/${employerId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      addNotification('warning', `Employer ${employer?.companyName || employer?.company || 'account'} rejected`)
      fetchEmployers()
    } catch (err) {
      setError('Failed to reject employer')
      console.error('Reject employer error:', err)
    }
  }

  const approveCandidateUser = async (candidateUserId: string) => {
    try {
      const token = getAuthToken()
      const candidate = candidateUsers.find(c => (c._id || c.id) === candidateUserId)
      await axios.patch(`${API_BASE_URL}/api/admin/candidate-users/${candidateUserId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      addNotification('success', `Candidate ${candidate?.name || 'account'} approved`)
      fetchCandidateUsers()
    } catch (err) {
      setError('Failed to approve candidate user')
      console.error('Approve candidate user error:', err)
    }
  }

  const rejectCandidateUser = async (candidateUserId: string) => {
    try {
      const token = getAuthToken()
      const candidate = candidateUsers.find(c => (c._id || c.id) === candidateUserId)
      await axios.patch(`${API_BASE_URL}/api/admin/candidate-users/${candidateUserId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      addNotification('warning', `Candidate ${candidate?.name || 'account'} rejected`)
      fetchCandidateUsers()
    } catch (err) {
      setError('Failed to reject candidate user')
      console.error('Reject candidate user error:', err)
    }
  }

  const suspendCandidateUser = async (candidateUserId: string) => {
    try {
      const token = getAuthToken()
      const candidate = candidateUsers.find(c => (c._id || c.id) === candidateUserId)
      await axios.patch(`${API_BASE_URL}/api/admin/candidate-users/${candidateUserId}/suspend`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      addNotification('warning', `Candidate ${candidate?.name || 'account'} suspended`)
      fetchCandidateUsers()
    } catch (err) {
      setError('Failed to suspend candidate user')
      console.error('Suspend candidate user error:', err)
    }
  }

  const unsuspendCandidateUser = async (candidateUserId: string) => {
    try {
      const token = getAuthToken()
      const candidate = candidateUsers.find(c => (c._id || c.id) === candidateUserId)
      await axios.patch(`${API_BASE_URL}/api/admin/candidate-users/${candidateUserId}/unsuspend`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      addNotification('success', `Candidate ${candidate?.name || 'account'} unsuspended`)
      fetchCandidateUsers()
    } catch (err) {
      setError('Failed to unsuspend candidate user')
      console.error('Unsuspend candidate user error:', err)
    }
  }

  const handleViewCandidateUser = (candidateUser: CandidateUser) => {
    setSelectedCandidateUser(candidateUser)
    setShowCandidateUserModal(true)
  }

  const handleActionFromDropdown = async (action: 'approve' | 'reject' | 'suspend' | 'unsuspend', candidateUserId: string) => {
    setOpenDropdownId(null)
    switch(action) {
      case 'approve':
        await approveCandidateUser(candidateUserId)
        break
      case 'reject':
        await rejectCandidateUser(candidateUserId)
        break
      case 'suspend':
        await suspendCandidateUser(candidateUserId)
        break
      case 'unsuspend':
        await unsuspendCandidateUser(candidateUserId)
        break
    }
  }

  const handleEmployerActionFromDropdown = async (action: 'approve' | 'reject' | 'suspend' | 'unsuspend', employerId: string) => {
    setOpenEmployerDropdownId(null)
    switch(action) {
      case 'approve':
        await approveEmployer(employerId)
        break
      case 'reject':
        await rejectEmployer(employerId)
        break
      case 'suspend':
        await suspendEmployer(employerId)
        break
      case 'unsuspend':
        await unsuspendEmployer(employerId)
        break
    }
  }

  const suspendEmployer = async (employerId: string) => {
    try {
      const token = getAuthToken()
      await axios.patch(`${API_BASE_URL}/api/admin/employers/${employerId}/suspend`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchEmployers()
    } catch (err) {
      setError('Failed to suspend employer')
      console.error('Suspend employer error:', err)
    }
  }

  const unsuspendEmployer = async (employerId: string) => {
    try {
      const token = getAuthToken()
      await axios.patch(`${API_BASE_URL}/api/admin/employers/${employerId}/unsuspend`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchEmployers()
    } catch (err) {
      setError('Failed to unsuspend employer')
      console.error('Unsuspend employer error:', err)
    }
  }

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      window.location.href = '/admin/login'
      return
    }
    
    fetchEmployers()
    fetchCandidates()
    fetchMetrics()
    fetchReports()
    fetchCandidateUsers()
  }, [])

  // Refetch candidates when employer filter or search changes on Candidates tab
  useEffect(() => {
    if (activeTab !== 'candidates') return
    fetchCandidates({ employerId: filterEmployer, search: searchQuery })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, filterEmployer])

  const filteredEmployers = employers.filter(employer => {
    const matchesSearch = employer.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employer.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const employerStatus = normalizeStatus(employer.status)
    const matchesStatus = filterStatus === 'all' || employerStatus === filterStatus.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         candidate.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         candidate.uan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         candidate.employerName?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const candidateStatus = candidate.joiningStatus || candidate.offerStatus || ''
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'joined' && (candidateStatus === 'joined' || candidateStatus === 'Joined')) ||
                         (filterStatus === 'not_joined' && (candidateStatus === 'not_joined' || candidateStatus === 'Not Joined')) ||
                         (filterStatus === 'pending' && !candidateStatus)
    
    const matchesEmployer = filterEmployer === 'all' || candidate.employerName === filterEmployer
    
    return matchesSearch && matchesStatus && matchesEmployer
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-red-600 truncate">Red-Flagged</h1>
              <span className="hidden sm:inline ml-2 sm:ml-4 text-xs sm:text-sm text-gray-500 whitespace-nowrap">Admin Console</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-3">
              <button 
                onClick={() => setActiveTab('notifications')}
                className="relative text-gray-700 hover:text-red-600 p-1.5 sm:p-2"
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-red-500 text-white text-[10px] sm:text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                    {notifications.length > 9 ? '9+' : notifications.length}
                  </span>
                )}
              </button>
             
              <button 
                onClick={() => {
                  localStorage.removeItem('adminToken')
                  sessionStorage.removeItem('adminToken')
                  window.location.href = '/admin/login'
                }}
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
                { id: 'employers', label: 'Employers', shortLabel: 'Employers' },
                { id: 'candidates', label: 'Candidates', shortLabel: 'Candidates' },
                { id: 'candidate-users', label: 'Candidate Users', shortLabel: 'Users' },
                { id: 'history', label: 'Update History', shortLabel: 'History' },
                { id: 'notifications', label: 'Notifications', shortLabel: 'Alerts' }
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Red-Flagged Admin Console</h2>
              <p className="text-gray-600">Manage employers, data integrity, and analytics.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {dashboardStats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                        <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${
                      stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* System Health */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Database</span>
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Healthy
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">API Services</span>
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Running
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Encryption</span>
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>3 new employers registered today</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                    <span>5 pending verifications</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Shield className="h-4 w-4 text-blue-500 mr-2" />
                    <span>127 records verified this week</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Employers Tab */}
        {activeTab === 'employers' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Employer Accounts</h2>
              <p className="text-gray-600">Manage employer registrations and account status.</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search employers..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-red-600" />
                <span className="ml-2 text-gray-600">Loading employers...</span>
              </div>
            )}

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined On
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployers.map((employer) => (
                    <tr key={employer._id || employer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{employer.companyName || employer.company}</div>
                        <div className="text-sm text-gray-500">{employer.lastActivity || 'Recently active'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          normalizeStatus(employer.status) === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : normalizeStatus(employer.status) === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : normalizeStatus(employer.status) === 'suspended'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {normalizeStatus(employer.status) === 'approved' ? 'Approved' :
                           normalizeStatus(employer.status) === 'pending' ? 'Pending' :
                           normalizeStatus(employer.status) === 'suspended' ? 'Suspended' : 'Rejected'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employer.candidateCount || employer.candidates || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employer.createdAt ? new Date(employer.createdAt).toLocaleDateString() : employer.joinedOn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2 items-center">
                          <button
                            onClick={() => openView(employer)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          {(employer._id || employer.id) && (
                            <div className="relative">
                              <button
                                onClick={() => setOpenEmployerDropdownId(openEmployerDropdownId === (employer._id || employer.id) ? null : (employer._id || employer.id!))}
                                className="flex items-center space-x-1 px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                              >
                                <span>Action</span>
                                <ChevronDown className="h-3 w-3" />
                              </button>
                              
                              {openEmployerDropdownId === (employer._id || employer.id) && (
                                <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                  {normalizeStatus(employer.status) === 'pending' && (
                                    <>
                                      <button
                                        onClick={() => handleEmployerActionFromDropdown('approve', employer._id || employer.id!)}
                                        className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center space-x-2"
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                        <span>Approve</span>
                                      </button>
                                      <button
                                        onClick={() => handleEmployerActionFromDropdown('reject', employer._id || employer.id!)}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                      >
                                        <Ban className="h-4 w-4" />
                                        <span>Reject</span>
                                      </button>
                                    </>
                                  )}
                                  {normalizeStatus(employer.status) === 'approved' && (
                                    <button
                                      onClick={() => handleEmployerActionFromDropdown('suspend', employer._id || employer.id!)}
                                      className="w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 flex items-center space-x-2"
                                    >
                                      <Ban className="h-4 w-4" />
                                      <span>Suspend</span>
                                    </button>
                                  )}
                                  {normalizeStatus(employer.status) === 'suspended' && (
                                    <button
                                      onClick={() => handleEmployerActionFromDropdown('unsuspend', employer._id || employer.id!)}
                                      className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center space-x-2"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                      <span>Unsuspend</span>
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredEmployers.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  No employers found
                </div>
              )}
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {filteredEmployers.map((employer) => (
                <div key={employer._id || employer.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        <h3 className="font-semibold text-gray-900 truncate">{employer.companyName || employer.company}</h3>
                      </div>
                      <p className="text-sm text-gray-600 break-all mt-1">{employer.email}</p>
                    </div>
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                      normalizeStatus(employer.status) === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : normalizeStatus(employer.status) === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : normalizeStatus(employer.status) === 'suspended'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {normalizeStatus(employer.status) === 'approved' ? 'Approved' :
                       normalizeStatus(employer.status) === 'pending' ? 'Pending' :
                       normalizeStatus(employer.status) === 'suspended' ? 'Suspended' : 'Rejected'}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Candidates:</span>
                      <span>{employer.candidateCount || employer.candidates || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Joined:</span>
                      <span>{employer.createdAt ? new Date(employer.createdAt).toLocaleDateString() : employer.joinedOn || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Activity:</span>
                      <span className="text-right">{employer.lastActivity || 'Recently active'}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t">
                    <button
                      onClick={() => openView(employer)}
                      className="flex-1 px-3 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 flex items-center justify-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                    {(employer._id || employer.id) && normalizeStatus(employer.status) === 'pending' && (
                      <>
                        <button
                          onClick={() => handleEmployerActionFromDropdown('approve', employer._id || employer.id!)}
                          className="flex-1 px-3 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleEmployerActionFromDropdown('reject', employer._id || employer.id!)}
                          className="flex-1 px-3 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {(employer._id || employer.id) && normalizeStatus(employer.status) === 'approved' && (
                      <button
                        onClick={() => handleEmployerActionFromDropdown('suspend', employer._id || employer.id!)}
                        className="flex-1 px-3 py-2 text-sm text-white bg-orange-600 rounded-lg hover:bg-orange-700"
                      >
                        Suspend
                      </button>
                    )}
                    {(employer._id || employer.id) && normalizeStatus(employer.status) === 'suspended' && (
                      <button
                        onClick={() => handleEmployerActionFromDropdown('unsuspend', employer._id || employer.id!)}
                        className="flex-1 px-3 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
                      >
                        Unsuspend
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {filteredEmployers.length === 0 && !loading && (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
                  No employers found
                </div>
              )}
            </div>
            
            {isViewOpen && selectedEmployer && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b px-6 py-4 sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-semibold text-gray-900">Employer Details</h3>
                    <button onClick={closeView} className="text-gray-500 hover:text-gray-700">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="px-6 py-4 space-y-6">
                    {/* Company Information */}
                    <div className="border-b pb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                        Company Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Company Name</div>
                          <div className="text-gray-900 font-medium">{selectedEmployer.companyName || selectedEmployer.company || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Email Address</div>
                          <div className="text-gray-900 break-all">{selectedEmployer.email || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Account Status</div>
                          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                            normalizeStatus(selectedEmployer.status) === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : normalizeStatus(selectedEmployer.status) === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : normalizeStatus(selectedEmployer.status) === 'suspended'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {normalizeStatus(selectedEmployer.status) === 'approved' ? 'Approved' :
                             normalizeStatus(selectedEmployer.status) === 'pending' ? 'Pending' :
                             normalizeStatus(selectedEmployer.status) === 'suspended' ? 'Suspended' : 'Rejected'}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Last Activity</div>
                          <div className="text-gray-900">{selectedEmployer.lastActivity || 'Recently active'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Statistics */}
                    <div className="border-b pb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                        Statistics
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-sm text-blue-600 mb-1">Total Candidates</div>
                          <div className="text-2xl font-bold text-blue-900">
                            {selectedEmployer.candidateCount || selectedEmployer.candidates || 0}
                          </div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="text-sm text-green-600 mb-1">Account Status</div>
                          <div className="text-lg font-bold text-green-900 capitalize">
                            {normalizeStatus(selectedEmployer.status)}
                          </div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="text-sm text-purple-600 mb-1">Member Since</div>
                          <div className="text-sm font-bold text-purple-900">
                            {selectedEmployer.createdAt 
                              ? new Date(selectedEmployer.createdAt).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })
                              : selectedEmployer.joinedOn || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Account Timeline */}
                    <div className="border-b pb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-orange-600" />
                        Account Timeline
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Registration Date</div>
                          <div className="text-gray-900">
                            {selectedEmployer.createdAt 
                              ? new Date(selectedEmployer.createdAt).toLocaleString('en-US', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : 'N/A'}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Joined On</div>
                          <div className="text-gray-900">{selectedEmployer.joinedOn || 'N/A'}</div>
                        </div>
                      </div>
                    </div>

                    {/* System Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-indigo-600" />
                        System Information
                      </h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Employer ID</div>
                          <div className="text-gray-900 text-xs font-mono bg-gray-100 p-2 rounded break-all">
                            {selectedEmployer._id || selectedEmployer.id || 'N/A'}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Account Type</div>
                            <div className="text-gray-900">Employer Account</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Verification Status</div>
                            <div className="text-gray-900 capitalize flex items-center">
                              {normalizeStatus(selectedEmployer.status) === 'approved' ? (
                                <>
                                  <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                                  <span className="text-green-600">Verified</span>
                                </>
                              ) : normalizeStatus(selectedEmployer.status) === 'pending' ? (
                                <>
                                  <Clock className="h-4 w-4 text-yellow-600 mr-1" />
                                  <span className="text-yellow-600">Pending Verification</span>
                                </>
                              ) : normalizeStatus(selectedEmployer.status) === 'suspended' ? (
                                <>
                                  <AlertTriangle className="h-4 w-4 text-orange-600 mr-1" />
                                  <span className="text-orange-600">Suspended</span>
                                </>
                              ) : (
                                <>
                                  <Ban className="h-4 w-4 text-red-600 mr-1" />
                                  <span className="text-red-600">Rejected</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="border-t px-6 py-4 flex justify-between items-center sticky bottom-0 bg-gray-50">
                    <div className="text-sm text-gray-600">
                      Last updated: {selectedEmployer.createdAt ? new Date(selectedEmployer.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={closeView} 
                        className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100"
                      >
                        Close
                      </button>
                      {normalizeStatus(selectedEmployer.status) === 'pending' && (
                        <>
                          <button
                            onClick={() => {
                              approveEmployer(selectedEmployer._id || selectedEmployer.id!)
                              closeView()
                            }}
                            className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center space-x-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => {
                              rejectEmployer(selectedEmployer._id || selectedEmployer.id!)
                              closeView()
                            }}
                            className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 flex items-center space-x-1"
                          >
                            <Ban className="h-4 w-4" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                      {normalizeStatus(selectedEmployer.status) === 'approved' && (
                        <button
                          onClick={() => {
                            suspendEmployer(selectedEmployer._id || selectedEmployer.id!)
                            closeView()
                          }}
                          className="px-4 py-2 text-sm text-white bg-orange-600 rounded-lg hover:bg-orange-700 flex items-center space-x-1"
                        >
                          <Ban className="h-4 w-4" />
                          <span>Suspend</span>
                        </button>
                      )}
                      {normalizeStatus(selectedEmployer.status) === 'suspended' && (
                        <button
                          onClick={() => {
                            unsuspendEmployer(selectedEmployer._id || selectedEmployer.id!)
                            closeView()
                          }}
                          className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center space-x-1"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Unsuspend</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      
        {/* Candidates Tab */}
        {activeTab === 'candidates' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Master Candidate Records</h2>
              <p className="text-gray-600">Unified list of all records submitted by employers.</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, email, UAN, or employer..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="all">All Status</option>
                    <option value="joined">Joined</option>
                    <option value="not_joined">Not Joined</option>
                    <option value="pending">Pending</option>
                  </select>
                  <select
                    value={filterEmployer}
                    onChange={(e) => setFilterEmployer(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="all">All Employers</option>
                    {getApprovedEmployers().map((emp) => (
                      <option key={emp._id || emp.id} value={emp._id || emp.id}>
                        {emp.companyName || emp.company}
                      </option>
                    ))}
                  </select>
                  <button 
                    onClick={() => {
                      setSearchQuery('')
                      setFilterStatus('all')
                      setFilterEmployer('all')
                    }}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {(searchQuery || filterStatus !== 'all' || filterEmployer !== 'all') && (
              <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-blue-900">Active Filters:</span>
                    {searchQuery && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Search: "{searchQuery}"
                      </span>
                    )}
                    {filterStatus !== 'all' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Status: {filterStatus}
                      </span>
                    )}
                    {filterEmployer !== 'all' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Employer: {filterEmployer}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setFilterStatus('all')
                      setFilterEmployer('all')
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {candidatesLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-red-600" />
                <span className="ml-2 text-gray-600">Loading candidates...</span>
              </div>
            )}

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCandidates.map((candidate) => (
                    <tr key={candidate._id || candidate.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                            <div className="text-sm text-gray-500">{candidate.uan || 'No UAN'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{candidate.email}</div>
                        <div className="text-sm text-gray-500">{candidate.mobile || 'No phone'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {candidate.position || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {candidate.employerName || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {candidate.offerDate ? new Date(candidate.offerDate).toLocaleDateString() : 
                         candidate.createdAt ? new Date(candidate.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openCandidateView(candidate)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="text-green-600 hover:text-green-900"
                            title="Verify"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredCandidates.length === 0 && !candidatesLoading && (
                <div className="text-center py-8 text-gray-500">
                  No candidates found
                </div>
              )}
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {filteredCandidates.map((candidate) => (
                <div key={candidate._id || candidate.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                      <p className="text-sm text-gray-600 break-all">{candidate.email}</p>
                      <p className="text-xs text-gray-500 mt-1">{candidate.uan || 'No UAN'}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
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
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Mobile:</span>
                      <span>{candidate.mobile || 'No phone'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Position:</span>
                      <span className="text-right">{candidate.position || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Employer:</span>
                      <span className="text-right">{candidate.employerName || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Date:</span>
                      <span>
                        {candidate.offerDate ? new Date(candidate.offerDate).toLocaleDateString() : 
                         candidate.createdAt ? new Date(candidate.createdAt).toLocaleDateString() : '-'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t">
                    <button
                      onClick={() => openCandidateView(candidate)}
                      className="flex-1 px-3 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 flex items-center justify-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                    <button
                      className="flex-1 px-3 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Verify</span>
                    </button>
                  </div>
                </div>
              ))}

              {filteredCandidates.length === 0 && !candidatesLoading && (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
                  No candidates found
                </div>
              )}
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-gray-900">{filteredCandidates.length}</div>
                <div className="text-sm text-gray-600">
                  {filteredCandidates.length === candidates.length ? 'Total Candidates' : 'Filtered Results'}
                </div>
                {filteredCandidates.length !== candidates.length && (
                  <div className="text-xs text-gray-500">of {candidates.length} total</div>
                )}
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-green-600">
                  {filteredCandidates.filter(c => c.joiningStatus === 'joined' || c.offerStatus === 'Joined').length}
                </div>
                <div className="text-sm text-gray-600">Joined</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-red-600">
                  {filteredCandidates.filter(c => c.joiningStatus === 'not_joined' || c.offerStatus === 'Not Joined').length}
                </div>
                <div className="text-sm text-gray-600">Not Joined</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-yellow-600">
                  {filteredCandidates.filter(c => !c.joiningStatus && !c.offerStatus).length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </div>
        )}

        {/* Candidate Users Tab */}
        {activeTab === 'candidate-users' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Candidate Users</h2>
              <p className="text-gray-600">Manage candidate account approvals and status.</p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {candidateUsersLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-red-600" />
                <span className="ml-2 text-gray-600">Loading candidate users...</span>
              </div>
            )}

            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {candidateUsers.map((u) => {
                    const displayName = u.name || (u as any).fullName || (u as any).candidateName || (u.primaryEmail || u.email)?.split('@')[0] || '-'
                    return (
                    <tr key={u._id || u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-900">{displayName}</td>
                      <td className="px-4 py-4 text-sm text-gray-900 max-w-[200px] truncate">{u.primaryEmail || u.email}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{u.mobileNumber || u.mobile || '-'}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{u.presentCompany || '-'}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          (u.status || '').toLowerCase() === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : (u.status || '').toLowerCase() === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : (u.status || '').toLowerCase() === 'suspended'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {(u.status || '').charAt(0).toUpperCase() + (u.status || '').slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium">
                        <div className="flex space-x-2 items-center">
                          <button
                            onClick={() => handleViewCandidateUser(u)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          {(u._id || u.id) && (
                            <div className="relative">
                              <button
                                onClick={() => setOpenDropdownId(openDropdownId === (u._id || u.id) ? null : (u._id || u.id!))}
                                className="flex items-center space-x-1 px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                              >
                                <span>Action</span>
                                <ChevronDown className="h-3 w-3" />
                              </button>
                              
                              {openDropdownId === (u._id || u.id) && (
                                <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                  {(u.status || '').toLowerCase() === 'pending' && (
                                    <>
                                      <button
                                        onClick={() => handleActionFromDropdown('approve', u._id || u.id!)}
                                        className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center space-x-2"
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                        <span>Approve</span>
                                      </button>
                                      <button
                                        onClick={() => handleActionFromDropdown('reject', u._id || u.id!)}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                      >
                                        <Ban className="h-4 w-4" />
                                        <span>Reject</span>
                                      </button>
                                    </>
                                  )}
                                  {(u.status || '').toLowerCase() === 'approved' && (
                                    <button
                                      onClick={() => handleActionFromDropdown('suspend', u._id || u.id!)}
                                      className="w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 flex items-center space-x-2"
                                    >
                                      <Ban className="h-4 w-4" />
                                      <span>Suspend</span>
                                    </button>
                                  )}
                                  {(u.status || '').toLowerCase() === 'suspended' && (
                                    <button
                                      onClick={() => handleActionFromDropdown('unsuspend', u._id || u.id!)}
                                      className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center space-x-2"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                      <span>Unsuspend</span>
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {candidateUsers.map((u) => {
                const displayName = u.name || (u as any).fullName || (u as any).candidateName || (u.primaryEmail || u.email)?.split('@')[0] || '-'
                return (
                <div key={u._id || u.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{displayName}</h3>
                      <p className="text-sm text-gray-600 break-all">{u.primaryEmail || u.email}</p>
                    </div>
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                      (u.status || '').toLowerCase() === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : (u.status || '').toLowerCase() === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : (u.status || '').toLowerCase() === 'suspended'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {(u.status || '').charAt(0).toUpperCase() + (u.status || '').slice(1)}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Mobile:</span>
                      <span>{u.mobileNumber || u.mobile || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Company:</span>
                      <span className="text-right">{u.presentCompany || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Designation:</span>
                      <span className="text-right">{u.designation || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Experience:</span>
                      <span>{u.workExperience ? `${u.workExperience} yrs` : '-'}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-3 border-t">
                    <button
                      onClick={() => handleViewCandidateUser(u)}
                      className="flex-1 px-3 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
                    >
                      View Details
                    </button>
                    {(u._id || u.id) && (u.status || '').toLowerCase() === 'pending' && (
                      <>
                        <button
                          onClick={() => handleActionFromDropdown('approve', u._id || u.id!)}
                          className="flex-1 px-3 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleActionFromDropdown('reject', u._id || u.id!)}
                          className="flex-1 px-3 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {(u._id || u.id) && (u.status || '').toLowerCase() === 'approved' && (
                      <button
                        onClick={() => handleActionFromDropdown('suspend', u._id || u.id!)}
                        className="flex-1 px-3 py-2 text-sm text-white bg-orange-600 rounded-lg hover:bg-orange-700"
                      >
                        Suspend
                      </button>
                    )}
                    {(u._id || u.id) && (u.status || '').toLowerCase() === 'suspended' && (
                      <button
                        onClick={() => handleActionFromDropdown('unsuspend', u._id || u.id!)}
                        className="flex-1 px-3 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
                      >
                        Unsuspend
                      </button>
                    )}
                  </div>
                </div>
              )})}
            </div>

            {candidateUsers.length === 0 && !candidateUsersLoading && (
              <div className="text-center py-8 text-gray-500">No candidate users found</div>
            )}
          </div>
        )}


        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div>
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">System Notifications</h2>
                <p className="text-gray-600">Monitor system alerts and important updates.</p>
              </div>
              {notifications.length > 0 && (
                <button
                  onClick={() => {
                    setNotifications([])
                    localStorage.removeItem('adminNotifications')
                  }}
                  className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                >
                  Clear All
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications</h3>
                <p className="text-gray-500">You&apos;re all caught up! Notifications will appear here when there&apos;s activity.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        notification.type === 'success' 
                          ? 'bg-green-100' 
                          : notification.type === 'warning'
                          ? 'bg-yellow-100'
                          : 'bg-blue-100'
                      }`}>
                        {notification.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                        {notification.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                        {notification.type === 'info' && <Bell className="h-5 w-5 text-blue-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-medium">{notification.message}</p>
                        <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
                      </div>
                      <button 
                        onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                        className="text-gray-400 hover:text-red-600 flex-shrink-0"
                        title="Remove notification"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Update History Tab */}
        {activeTab === 'history' && (
          <div>
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Manage Candidate Update History</h2>
              <p className="text-sm sm:text-base text-gray-600">Search a verified candidate user and maintain their timeline. You can add notes or edit/delete entries you created.</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Candidate Users</label>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <input
                    type="text"
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    placeholder="Filter by email / UAN / name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base"
                    onKeyPress={(e) => e.key === 'Enter' && handleAdminHistorySearch()}
                  />
                  <button
                    onClick={handleAdminHistorySearch}
                    disabled={historySearchLoading}
                    className="bg-red-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center disabled:opacity-70 text-sm sm:text-base"
                  >
                    {historySearchLoading ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </div>

              {historyErr && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{historyErr}</div>
              )}

              {historyResults.length > 0 && (
                <div className="space-y-3">
                  {historyResults.map((cu: any, index) => (
                    <div key={cu._id || cu.id || index} className="border border-gray-200 rounded-lg p-3 sm:p-4 flex items-center justify-between">
                      <div className="min-w-0">
                        <h5 className="font-medium text-gray-900 text-sm sm:text-base truncate">{cu.name || cu.fullName || 'Candidate'}</h5>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">{cu.email || cu.primaryEmail || '-'}</p>
                      </div>
                      <button
                        onClick={() => selectHistoryCandidate(cu)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-blue-700"
                      >
                        Manage History
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {historyCandidate && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{historyCandidate.name || 'Candidate'} — Status History</h3>
                </div>

                <div className="space-y-3">
                  {(historyCandidate.updateHistory || []).length > 0 ? (
                    (historyCandidate.updateHistory || []).map((h: any, idx: number) => (
                      <div key={h._id || h.id || idx} className="rounded-lg border border-gray-200 p-3 bg-white">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-900">Point {h.points ?? idx + 1}</div>
                          <div className="text-xs text-gray-500">{h.date ? new Date(h.date).toLocaleString() : ''}</div>
                        </div>
                        <div className="mt-1 text-xs text-gray-600">
                          <span className="mr-2">By: {h.updatedByName || '-'} ({h.updatedByRole || '-'})</span>
                          {h.companyName && <span className="mr-2">Company: {h.companyName}</span>}
                        </div>
                        {historyEditingIdx === idx ? (
                          <div className="mt-2 space-y-2">
                            <textarea
                              value={historyEditingText}
                              onChange={(e) => setHistoryEditingText(e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => adminPatchHistoryEntry(h._id || h.id, historyEditingText)}
                                disabled={historySaving}
                                className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:opacity-70"
                              >
                                {historySaving ? 'Saving...' : 'Save Edit'}
                              </button>
                              <button
                                onClick={() => { setHistoryEditingIdx(null); setHistoryEditingText('') }}
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
                                onClick={() => { setHistoryEditingIdx(idx); setHistoryEditingText(h.notes || '') }}
                                className="px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => adminDeleteHistoryEntry(h._id || h.id)}
                                disabled={historySaving}
                                className="px-3 py-1 border border-red-300 text-red-700 rounded text-xs hover:bg-red-50 disabled:opacity-70"
                              >
                                {historySaving ? 'Working...' : 'Delete'}
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
                  {historyMsg && <div className="mb-2 text-xs text-green-700">{historyMsg}</div>}
                  {historyErr && <div className="mb-2 text-xs text-red-700">{historyErr}</div>}
                  <div className="space-y-2">
                    <textarea
                      value={historyNote}
                      onChange={(e) => setHistoryNote(e.target.value)}
                      rows={3}
                      placeholder="Add admin note or context..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                    />
                    <div>
                      <button
                        onClick={adminAddHistoryEntry}
                        disabled={historySaving}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-70"
                      >
                        {historySaving ? 'Saving...' : 'Add Note'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Candidate User Details Modal */}
      {showCandidateUserModal && selectedCandidateUser && (() => {
        const displayName = selectedCandidateUser.name || (selectedCandidateUser as any).fullName || (selectedCandidateUser as any).candidateName || (selectedCandidateUser.primaryEmail || selectedCandidateUser.email)?.split('@')[0] || 'N/A'
        const displayFatherName = selectedCandidateUser.fathersName || (selectedCandidateUser as any).fatherName || (selectedCandidateUser as any).father_name || 'N/A'
        
        return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Candidate User Details</h2>
                <button
                  onClick={() => setShowCandidateUserModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Personal Information */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <p className="text-gray-900">{displayName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Father&apos;s Name</label>
                      <p className="text-gray-900">{displayFatherName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Gender</label>
                      <p className="text-gray-900 capitalize">{selectedCandidateUser.gender || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                      <p className="text-gray-900">
                        {selectedCandidateUser.dob ? new Date(selectedCandidateUser.dob).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                      <p className="text-gray-900">{selectedCandidateUser.mobileNumber || selectedCandidateUser.mobile || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Primary Email</label>
                      <p className="text-gray-900 text-sm break-all">{selectedCandidateUser.primaryEmail || selectedCandidateUser.email || 'N/A'}</p>
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">Secondary Email</label>
                      <p className="text-gray-900 text-sm">{selectedCandidateUser.secondaryEmail || 'N/A'}</p>
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">Permanent Address</label>
                      <p className="text-gray-900">{selectedCandidateUser.permanentAddress || 'N/A'}</p>
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">Current Address</label>
                      <p className="text-gray-900">{selectedCandidateUser.currentAddress || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">PAN Number</label>
                      <p className="text-gray-900">{selectedCandidateUser.panNumber || selectedCandidateUser.pan || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">UAN Number</label>
                      <p className="text-gray-900">{selectedCandidateUser.uanNumber || selectedCandidateUser.uan || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Highest Qualification</label>
                      <p className="text-gray-900 capitalize">{selectedCandidateUser.highestQualification?.replace('-', ' ') || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Work Experience</label>
                      <p className="text-gray-900">{selectedCandidateUser.workExperience ? `${selectedCandidateUser.workExperience} years` : 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Sector</label>
                      <p className="text-gray-900 capitalize">{selectedCandidateUser.sector?.replace('-', ' ') || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Present Company</label>
                      <p className="text-gray-900">{selectedCandidateUser.presentCompany || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Designation</label>
                      <p className="text-gray-900">{selectedCandidateUser.designation || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Latest Rating</label>
                      <p className="text-gray-900">{selectedCandidateUser.latestRating || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Work Location</label>
                      <p className="text-gray-900">{selectedCandidateUser.workLocation || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Open to Relocation</label>
                      <p className="text-gray-900 capitalize">{selectedCandidateUser.openToRelocation || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Current CTC</label>
                      <p className="text-gray-900">{selectedCandidateUser.currentCtc || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Expected Hike %</label>
                      <p className="text-gray-900">{selectedCandidateUser.expectedHikePercentage || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Notice Period</label>
                      <p className="text-gray-900">{selectedCandidateUser.noticePeriod ? `${selectedCandidateUser.noticePeriod} days` : 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Negotiable Days</label>
                      <p className="text-gray-900">{selectedCandidateUser.negotiableDays ? `${selectedCandidateUser.negotiableDays} days` : 'N/A'}</p>
                    </div>
                  </div>
                  {selectedCandidateUser.skillSets && selectedCandidateUser.skillSets.length > 0 && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Skill Sets</label>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidateUser.skillSets.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Account Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Account Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        (selectedCandidateUser.status || '').toLowerCase() === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : (selectedCandidateUser.status || '').toLowerCase() === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : (selectedCandidateUser.status || '').toLowerCase() === 'suspended'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {(selectedCandidateUser.status || '').charAt(0).toUpperCase() + (selectedCandidateUser.status || '').slice(1)}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Registration Date</label>
                      <p className="text-gray-900">
                        {selectedCandidateUser.createdAt ? new Date(selectedCandidateUser.createdAt).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                      <p className="text-gray-900">
                        {selectedCandidateUser.updatedAt ? new Date(selectedCandidateUser.updatedAt).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">Account ID</label>
                      <p className="text-gray-900 text-xs break-all font-mono">{selectedCandidateUser._id || selectedCandidateUser.id || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end space-x-4 border-t pt-4">
                <button
                  onClick={() => setShowCandidateUserModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                {(selectedCandidateUser.status || '').toLowerCase() === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        approveCandidateUser(selectedCandidateUser._id || selectedCandidateUser.id!)
                        setShowCandidateUserModal(false)
                      }}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => {
                        rejectCandidateUser(selectedCandidateUser._id || selectedCandidateUser.id!)
                        setShowCandidateUserModal(false)
                      }}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
                    >
                      <Ban className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                  </>
                )}
                {(selectedCandidateUser.status || '').toLowerCase() === 'approved' && (
                  <button
                    onClick={() => {
                      suspendCandidateUser(selectedCandidateUser._id || selectedCandidateUser.id!)
                      setShowCandidateUserModal(false)
                    }}
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center space-x-2"
                  >
                    <Ban className="h-4 w-4" />
                    <span>Suspend</span>
                  </button>
                )}
                {(selectedCandidateUser.status || '').toLowerCase() === 'suspended' && (
                  <button
                    onClick={() => {
                      unsuspendCandidateUser(selectedCandidateUser._id || selectedCandidateUser.id!)
                      setShowCandidateUserModal(false)
                    }}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Unsuspend</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        )
      })()}

      {/* Candidate View Modal */}
      {isCandidateViewOpen && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b px-6 py-4 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">Candidate Details</h3>
              <button onClick={closeCandidateView} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              {/* Candidate Information */}
              <div className="border-b pb-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Name</div>
                    <div className="text-gray-900 font-medium">{selectedCandidate.name || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="text-gray-900 break-all">{selectedCandidate.email || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Mobile</div>
                    <div className="text-gray-900">{selectedCandidate.mobile || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">UAN Number</div>
                    <div className="text-gray-900">{selectedCandidate.uan || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div className="border-b pb-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Employment Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Position/Role</div>
                    <div className="text-gray-900">{selectedCandidate.position || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Employer</div>
                    <div className="text-gray-900">{selectedCandidate.employerName || 'Unknown'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Offer Date</div>
                    <div className="text-gray-900">
                      {selectedCandidate.offerDate ? new Date(selectedCandidate.offerDate).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Joining Date</div>
                    <div className="text-gray-900">
                      {selectedCandidate.joiningDate ? new Date(selectedCandidate.joiningDate).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Offer Status</div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedCandidate.joiningStatus === 'joined' || selectedCandidate.offerStatus === 'Joined'
                        ? 'bg-green-100 text-green-800'
                        : selectedCandidate.joiningStatus === 'not_joined' || selectedCandidate.offerStatus === 'Not Joined'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedCandidate.joiningStatus === 'joined' ? 'Joined' :
                       selectedCandidate.joiningStatus === 'not_joined' ? 'Not Joined' :
                       selectedCandidate.offerStatus || 'Pending'}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Joining Status</div>
                    <div className="text-gray-900 capitalize">{selectedCandidate.joiningStatus || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {(selectedCandidate.reason || selectedCandidate.notes) && (
                <div className="border-b pb-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Additional Information</h4>
                  {selectedCandidate.reason && (
                    <div className="mb-3">
                      <div className="text-sm text-gray-500">Reason</div>
                      <div className="text-gray-900">{selectedCandidate.reason}</div>
                    </div>
                  )}
                  {selectedCandidate.notes && (
                    <div>
                      <div className="text-sm text-gray-500">Notes</div>
                      <div className="text-gray-900">{selectedCandidate.notes}</div>
                    </div>
                  )}
                </div>
              )}

              {/* System Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">System Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Record ID</div>
                    <div className="text-gray-900 text-xs font-mono break-all">{selectedCandidate._id || selectedCandidate.id || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Employer ID</div>
                    <div className="text-gray-900 text-xs font-mono break-all">{selectedCandidate.employerId || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Created At</div>
                    <div className="text-gray-900">
                      {selectedCandidate.createdAt ? new Date(selectedCandidate.createdAt).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Last Updated</div>
                    <div className="text-gray-900">
                      {selectedCandidate.updatedAt ? new Date(selectedCandidate.updatedAt).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t px-6 py-4 flex justify-end gap-2 sticky bottom-0 bg-white">
              <button onClick={closeCandidateView} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
