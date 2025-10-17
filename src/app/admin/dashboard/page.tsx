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
  Building2
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
  name?: string
  email: string
  mobile?: string
  uan?: string
  pan?: string
  status: string
  createdAt?: string
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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterEmployer, setFilterEmployer] = useState('all') // stores employerId or 'all'
  const [candidateUsers, setCandidateUsers] = useState<CandidateUser[]>([])
  const [candidateUsersLoading, setCandidateUsersLoading] = useState(false)
  
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

  // View modal state
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const openView = (employer: Employer) => { setSelectedEmployer(employer); setIsViewOpen(true) }
  const closeView = () => { setIsViewOpen(false); setSelectedEmployer(null) }

  // Get auth token from localStorage or session
  const getAuthToken = () => {
    return localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')
  }

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
      await axios.patch(`${API_BASE_URL}/api/admin/employers/${employerId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchEmployers()
    } catch (err) {
      setError('Failed to approve employer')
      console.error('Approve employer error:', err)
    }
  }

  const rejectEmployer = async (employerId: string) => {
    try {
      const token = getAuthToken()
      await axios.patch(`${API_BASE_URL}/api/admin/employers/${employerId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchEmployers()
    } catch (err) {
      setError('Failed to reject employer')
      console.error('Reject employer error:', err)
    }
  }

  const approveCandidateUser = async (candidateUserId: string) => {
    try {
      const token = getAuthToken()
      await axios.patch(`${API_BASE_URL}/api/admin/candidate-users/${candidateUserId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchCandidateUsers()
    } catch (err) {
      setError('Failed to approve candidate user')
      console.error('Approve candidate user error:', err)
    }
  }

  const rejectCandidateUser = async (candidateUserId: string) => {
    try {
      const token = getAuthToken()
      await axios.patch(`${API_BASE_URL}/api/admin/candidate-users/${candidateUserId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchCandidateUsers()
    } catch (err) {
      setError('Failed to reject candidate user')
      console.error('Reject candidate user error:', err)
    }
  }

  const suspendCandidateUser = async (candidateUserId: string) => {
    try {
      const token = getAuthToken()
      await axios.patch(`${API_BASE_URL}/api/admin/candidate-users/${candidateUserId}/suspend`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchCandidateUsers()
    } catch (err) {
      setError('Failed to suspend candidate user')
      console.error('Suspend candidate user error:', err)
    }
  }

  const unsuspendCandidateUser = async (candidateUserId: string) => {
    try {
      const token = getAuthToken()
      await axios.patch(`${API_BASE_URL}/api/admin/candidate-users/${candidateUserId}/unsuspend`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchCandidateUsers()
    } catch (err) {
      setError('Failed to unsuspend candidate user')
      console.error('Unsuspend candidate user error:', err)
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

  const notifications = [
    { id: 1, type: 'success', message: 'New employer registration pending approval.', time: '5 min ago' },
    { id: 2, type: 'warning', message: 'Employer AlphaTech reported 12 non-joins this week.', time: '1 hour ago' },
    { id: 3, type: 'info', message: 'Daily backup completed successfully.', time: '2 hours ago' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-red-600">RedHunt</h1>
              <span className="ml-4 text-sm text-gray-500">Admin Console</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative text-gray-700 hover:text-red-600 p-2">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>
              <button className="text-gray-700 hover:text-red-600 p-2">
                <Settings className="h-5 w-5" />
              </button>
              <button className="text-gray-700 hover:text-red-600 p-2">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'employers', label: 'Employers' },
                // { id: 'approved-employers', label: 'Approved Employers' },
                { id: 'candidates', label: 'Candidates' },
                { id: 'candidate-users', label: 'Candidate Users' },
                { id: 'reports', label: 'Reports' },
                { id: 'notifications', label: 'Notifications' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">RedHunt Admin Console</h2>
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

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openView(employer)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {normalizeStatus(employer.status) === 'pending' && (employer._id || employer.id) && (
                            <>
                              <button 
                                onClick={() => approveEmployer(employer._id || employer.id!)}
                                className="text-green-600 hover:text-green-900" 
                                title="Approve"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => rejectEmployer(employer._id || employer.id!)}
                                className="text-red-600 hover:text-red-900" 
                                title="Reject"
                              >
                                <Ban className="h-4 w-4" />
                              </button>
                            </>
                          )}

                          {normalizeStatus(employer.status) === 'approved' && (employer._id || employer.id) && (
                            <button 
                              onClick={() => suspendEmployer(employer._id || employer.id!)}
                              className="text-orange-600 hover:text-orange-900" 
                              title="Suspend"
                            >
                              <Ban className="h-4 w-4" />
                            </button>
                          )}

                          {normalizeStatus(employer.status) === 'suspended' && (employer._id || employer.id) && (
                            <button 
                              onClick={() => unsuspendEmployer(employer._id || employer.id!)}
                              className="text-green-600 hover:text-green-900" 
                              title="Unsuspend"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
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
            
            {isViewOpen && selectedEmployer && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                  <div className="flex items-center justify-between border-b px-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-900">Employer Details</h3>
                    <button onClick={closeView} className="text-gray-500 hover:text-gray-700">✕</button>
                  </div>
                  <div className="px-6 py-4 space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-gray-500">Company</div>
                      <div className="col-span-2 text-gray-900">{selectedEmployer.companyName || selectedEmployer.company}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-gray-500">Email</div>
                      <div className="col-span-2 text-gray-900 break-words">{selectedEmployer.email}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-gray-500">Status</div>
                      <div className="col-span-2 text-gray-900 capitalize">{normalizeStatus(selectedEmployer.status)}</div>
                    </div>
                    {selectedEmployer.candidateCount !== undefined && (
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-gray-500">Candidates</div>
                        <div className="col-span-2 text-gray-900">{selectedEmployer.candidateCount}</div>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-gray-500">Joined</div>
                      <div className="col-span-2 text-gray-900">{selectedEmployer.createdAt ? new Date(selectedEmployer.createdAt).toLocaleString() : '-'}</div>
                    </div>
                  </div>
                  <div className="border-t px-6 py-4 flex justify-end gap-2">
                    <button onClick={closeView} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">Close</button>
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

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UAN</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PAN</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {candidateUsers.map((u) => (
                    <tr key={u._id || u.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.name || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.uan || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.pan || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {(u.status || '').toLowerCase() === 'pending' && (u._id || u.id) && (
                            <>
                              <button
                                onClick={() => approveCandidateUser(u._id || u.id!)}
                                className="text-green-600 hover:text-green-900"
                                title="Approve"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => rejectCandidateUser(u._id || u.id!)}
                                className="text-red-600 hover:text-red-900"
                                title="Reject"
                              >
                                <Ban className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {(u.status || '').toLowerCase() === 'approved' && (u._id || u.id) && (
                            <button
                              onClick={() => suspendCandidateUser(u._id || u.id!)}
                              className="text-orange-600 hover:text-orange-900"
                              title="Suspend"
                            >
                              <Ban className="h-4 w-4" />
                            </button>
                          )}
                          {(u.status || '').toLowerCase() === 'suspended' && (u._id || u.id) && (
                            <button
                              onClick={() => unsuspendCandidateUser(u._id || u.id!)}
                              className="text-green-600 hover:text-green-900"
                              title="Unsuspend"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {candidateUsers.length === 0 && !candidateUsersLoading && (
                <div className="text-center py-8 text-gray-500">No candidate users found</div>
              )}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Reports & System Analytics</h2>
              <p className="text-gray-600">Comprehensive analytics and system insights.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Employers (Month-on-Month)</h3>
                <div className="space-y-2">
                  {reports?.monthlyEmployers ? Object.entries(reports.monthlyEmployers).map(([month, count]) => (
                    <div key={month} className="flex justify-between items-center">
                      <span className="text-gray-600">{month}</span>
                      <span className="font-medium">{count.toString()}</span>
                    </div>
                  )) : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-600">{month}</span>
                      <span className="font-medium">{120 + index * 8}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Non-Joining Rate by Industry</h3>
                <div className="space-y-2">
                  {reports?.industryRates ? Object.entries(reports.industryRates).map(([industry, rate]) => (
                    <div key={industry} className="flex justify-between items-center">
                      <span className="text-gray-600">{industry}</span>
                      <span className="font-medium">{rate.toString()}%</span>
                    </div>
                  )) : ['IT/Software', 'Finance', 'Healthcare', 'Manufacturing', 'Education'].map((industry, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-600">{industry}</span>
                      <span className="font-medium">{15 + index * 3}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Contributing Employers</h3>
                <div className="space-y-2">
                  {reports?.topEmployers ? Object.entries(reports.topEmployers).map(([company, count]) => (
                    <div key={company} className="flex justify-between items-center">
                      <span className="text-gray-600">{company}</span>
                      <span className="font-medium">{count.toString()}</span>
                    </div>
                  )) : ['AlphaTech', 'BetaCorp', 'GammaTech', 'DeltaInc', 'EpsilonLabs'].map((company, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-600">{company}</span>
                      <span className="font-medium">{245 - index * 40}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">System Analytics</h3>
                <div className="flex space-x-2">
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </button>
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">API Usage Stats</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Requests</span>
                      <span className="font-medium">{reports?.apiStats?.totalRequests || '12,847'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Successful</span>
                      <span className="font-medium text-green-600">{reports?.apiStats?.successRate || '98.2%'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Failed</span>
                      <span className="font-medium text-red-600">{reports?.apiStats?.failureRate || '1.8%'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Offer Rejection Heatmap</h4>
                  <div className="space-y-2">
                    {reports?.rejectionHeatmap ? Object.entries(reports.rejectionHeatmap).map(([role, level]) => (
                      <div key={role} className="flex justify-between items-center">
                        <span className="text-gray-600">{role}</span>
                        <span className={`font-medium ${
                          level === 'High' ? 'text-red-600' : 
                          level === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                        }`}>{level.toString()}</span>
                      </div>
                    )) : (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Software Engineer</span>
                          <span className="font-medium text-red-600">High</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Data Analyst</span>
                          <span className="font-medium text-yellow-600">Medium</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Marketing Manager</span>
                          <span className="font-medium text-green-600">Low</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">System Notifications</h2>
              <p className="text-gray-600">Monitor system alerts and important updates.</p>
            </div>

            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
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
                    <div className="flex-1">
                      <p className="text-gray-900">{notification.message}</p>
                      <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
