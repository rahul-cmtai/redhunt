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
  FileText, 
  Download,
  Settings,
  LogOut,
  CheckCircle,
  AlertTriangle
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
  const [allCandidates, setAllCandidates] = useState<any[]>([])
  const [candidatesLoading, setCandidatesLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    uan: '',
    email: '',
    phone: '',
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
  // Company profile state
  const [profile, setProfile] = useState({
    companyName: '',
    industry: '',
    hrName: '',
    contactNumber: '',
    email: '',
    companyCode: '',
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
    industry: '',
    hrName: '',
    contactNumber: '',
    email: '',
    companyCode: ''
  })

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
  const getEmployerToken = () => localStorage.getItem('employerToken') || sessionStorage.getItem('employerToken')
  const bulkInputRef = useRef<HTMLInputElement | null>(null)

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
    { title: 'Total Candidates Added', value: '245', icon: Users, color: 'blue' },
    { title: 'Non-Joining Cases', value: '23', icon: UserX, color: 'red' },
    { title: 'Verified Records', value: '198', icon: Shield, color: 'green' },
    { title: 'Company Trust Score', value: '8.7/10', icon: TrendingUp, color: 'purple' }
  ]

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query')
      return
    }

    setSearchLoading(true)
    setError(null)
    setSearchResult(null)

    try {
      const token = getEmployerToken()
      if (!token) {
        setError('Authentication required. Please login again.')
        handleLogout()
        return
      }

      // Use the dedicated search endpoint
      const { data } = await axios.get(`${API_BASE_URL}/api/employer/candidates/search`, {
        params: { q: searchQuery.trim() },
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data && data.length > 0) {
        // Process the search results
        const candidate = data[0] // Take the first match
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
      } else {
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
        name: formData.fullName.trim(),
        uan: formData.uan?.trim() || undefined,
        email: formData.email.trim(),
        mobile: formData.phone?.trim() || undefined,
        position: formData.jobRole.trim(),
        offerDate: formData.offerDate || undefined,
        offerStatus: formData.offerStatus || undefined,
        joiningDate: formData.joiningDate || undefined,
        reason: formData.reason?.trim() || undefined,
        notes: formData.notes?.trim() || undefined,
        joiningStatus: mapOfferToJoining(formData.offerStatus)
      }
      await axios.post(`${API_BASE_URL}/api/employer/candidates`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      setMessage('Record added successfully.')
      setShowAddForm(false)
      setFormData({
        fullName: '', uan: '', email: '', phone: '', jobRole: '',
        offerDate: '', offerStatus: '', joiningDate: '', reason: '', notes: ''
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
        
        await axios.post(`${API_BASE_URL}/api/employer/candidates`, payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
      }
      
      setMessage(`Successfully added ${mappedData.length} candidates.`)
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

  const fetchAllCandidates = async () => {
    setCandidatesLoading(true)
    setError(null)

    try {
      const token = getEmployerToken()
      if (!token) {
        setError('Authentication required. Please login again.')
        handleLogout()
        return
      }

      const { data } = await axios.get(`${API_BASE_URL}/api/employer/candidates`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setAllCandidates(data || [])
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
        industry: data.industry || '',
        hrName: data.hrName || '',
        contactNumber: data.contactNumber || '',
        email: data.email || '',
        companyCode: data.companyCode || '',
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
        industry: editProfile.industry?.trim() || undefined,
        hrName: editProfile.hrName?.trim() || undefined,
        contactNumber: editProfile.contactNumber?.trim() || undefined,
        email: editProfile.email?.trim() || undefined,
        companyCode: editProfile.companyCode?.trim() || undefined
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
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-red-600">RedHunt</h1>
              <span className="ml-4 text-sm text-gray-500">Employer Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-red-600 p-2">
                <Settings className="h-5 w-5" />
              </button>
              <button 
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-600 p-2"
                title="Logout"
              >
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
                { id: 'add', label: 'Add Candidate' },
                { id: 'bulk', label: 'Bulk Upload' },
                { id: 'search', label: 'Verify Candidate' },
                { id: 'reports', label: 'Reports' },
                { id: 'profile', label: 'Company Profile' }
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to RedHunt Dashboard</h2>
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
                  <button 
                    onClick={() => setActiveTab('bulk')}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    Bulk Upload CSV
                  </button>
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

        {/* Add Candidate Tab */}
        {activeTab === 'add' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Candidate Details</h2>
              <p className="text-gray-600">Enter candidate information for every job offer made.</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              {message && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{message}</div>
              )}
              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      UAN / Unique ID *
                    </label>
                    <input
                      type="text"
                      value={formData.uan}
                      onChange={(e) => setFormData({...formData, uan: e.target.value})}
                      placeholder="e.g. UAN-854392"
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
                      Job Role / Department *
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
                      <option value="Offered">Offered</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Joined">Joined</option>
                      <option value="Not Joined">Not Joined</option>
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
                    Reason for Not Joining (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    placeholder="e.g. Accepted another offer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="e.g. Candidate promised to join but didn't report"
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

        {/* Bulk Upload Tab */}
        {activeTab === 'bulk' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Bulk Upload Candidates</h2>
              <p className="text-gray-600">Upload a CSV file to add multiple candidates at once.</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              {message && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{message}</div>
              )}
              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
              )}

              {!showCsvMapping && mappedData.length === 0 && (
                <div className="text-center py-12">
                  <div className="mb-4">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Upload CSV File</h3>
                  <p className="text-gray-600 mb-6">Select a CSV file with candidate data to get started.</p>
                  
                  <div className="relative inline-block">
                    <input
                      type="file"
                      accept=".csv"
                      title="Upload CSV"
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file)
                        e.currentTarget.value = ''
                      }}
                    />
                    <div className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 cursor-pointer">
                      Choose CSV File
                    </div>
                  </div>
                  
                  <div className="mt-6 text-sm text-gray-500">
                    <p className="mb-2">CSV should contain columns like:</p>
                    <p>Name, Email, Phone, Job Role, Offer Date, Offer Status, etc.</p>
                    <button
                      onClick={() => {
                        const csvContent = "Name,Email,Phone,Job Role,Offer Date,Offer Status,Joining Date,Reason,Notes\nJohn Doe,john@example.com,+91 98765 43210,Software Engineer,2024-01-15,Accepted,2024-02-01,,Great candidate\nJane Smith,jane@example.com,+91 98765 43211,Data Analyst,2024-01-20,Not Joined,,Accepted another offer,Good technical skills"
                        const blob = new Blob([csvContent], { type: 'text/csv' })
                        const url = window.URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = 'candidate_template.csv'
                        a.click()
                        window.URL.revokeObjectURL(url)
                      }}
                      className="mt-2 text-red-600 hover:text-red-700 underline"
                    >
                      Download CSV Template
                    </button>
                  </div>
                </div>
              )}

              {showCsvMapping && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Map CSV Columns to Form Fields</h3>
                  <p className="text-gray-600 mb-6">Match your CSV columns to the appropriate form fields.</p>
                  
                  {/* CSV Preview */}
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-2">CSV Preview (First 3 rows):</h4>
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {csvHeaders.map((header, index) => (
                              <th key={index} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {csvData.slice(0, 3).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {csvHeaders.map((header, colIndex) => (
                                <td key={colIndex} className="px-3 py-2 text-sm text-gray-900">
                                  {row[header] || '-'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {csvHeaders.map((header, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CSV Column: <span className="font-bold">{header}</span>
                          </label>
                          <select
                            value={fieldMapping[header] || ''}
                            onChange={(e) => setFieldMapping({...fieldMapping, [header]: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          >
                            <option value="">-- Select Form Field --</option>
                            <option value="fullName">Full Name *</option>
                            <option value="uan">UAN / Unique ID</option>
                            <option value="email">Email *</option>
                            <option value="phone">Phone</option>
                            <option value="jobRole">Job Role / Department</option>
                            <option value="offerDate">Offer Date</option>
                            <option value="offerStatus">Offer Status</option>
                            <option value="joiningDate">Joining Date</option>
                            <option value="reason">Reason for Not Joining</option>
                            <option value="notes">Notes</option>
                          </select>
                        </div>
                        <div className="text-sm text-gray-500">
                          {csvData.length} rows
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Mapping Status */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Mapping Status:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                      {['fullName', 'email'].map(field => {
                        const isMapped = Object.values(fieldMapping).includes(field)
                        return (
                          <div key={field} className={`flex items-center ${isMapped ? 'text-green-600' : 'text-red-600'}`}>
                            <span className={`w-2 h-2 rounded-full mr-2 ${isMapped ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            {field === 'fullName' ? 'Full Name' : 'Email'} {isMapped ? '✓' : '✗'}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-4">
                    <button
                      onClick={applyMapping}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                    >
                      Apply Mapping
                    </button>
                    <button
                      onClick={() => {
                        setShowCsvMapping(false)
                        setCsvData([])
                        setCsvHeaders([])
                        setFieldMapping({})
                      }}
                      className="text-gray-500 px-6 py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {mappedData.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Mapped Data</h3>
                  <p className="text-gray-600 mb-6">Review the mapped data before submitting. Total records: {mappedData.length}</p>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offer Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UAN</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mappedData.slice(0, 10).map((row, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.fullName || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.email || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.phone || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.jobRole || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.offerDate || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.offerStatus || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.uan || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {mappedData.length > 10 && (
                    <p className="mt-4 text-sm text-gray-600">
                      Showing first 10 of {mappedData.length} records
                    </p>
                  )}
                  
                  {/* Show mapping summary */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Mapping Summary:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-blue-800">
                      {Object.keys(fieldMapping).map(csvField => (
                        <div key={csvField} className="flex justify-between">
                          <span>{csvField}:</span>
                          <span className="font-medium">{fieldMapping[csvField]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-4">
                    <button
                      onClick={submitBulkData}
                      disabled={submitting}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-70"
                    >
                      {submitting ? 'Adding Candidates...' : `Add ${mappedData.length} Candidates`}
                    </button>
                    <button
                      onClick={() => {
                        setMappedData([])
                        setCsvData([])
                        setCsvHeaders([])
                        setFieldMapping({})
                        setShowCsvMapping(false)
                      }}
                      className="text-gray-500 px-6 py-2"
                    >
                      Start Over
                    </button>
                    <button
                      onClick={() => setShowCsvMapping(true)}
                      className="text-blue-600 px-6 py-2 border border-blue-600 rounded-lg hover:bg-blue-50"
                    >
                      Edit Mapping
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search/Verify Tab */}
        {activeTab === 'search' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Candidate Record</h2>
              <p className="text-gray-600">Check if a candidate has rejected previous offers or view all your candidates.</p>
            </div>

            {/* Search Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Candidate
                </label>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter UAN / Email / Phone Number"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button
                    onClick={handleSearch}
                    disabled={searchLoading}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 flex items-center disabled:opacity-70"
                  >
                    {searchLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Searching...
                      </>
                    ) : (
                      <>
                    <Search className="h-5 w-5 mr-2" />
                    Search
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

              {searchResult && searchResult.found && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Search className="h-5 w-5 text-green-500 mr-2" />
                    <span className="font-semibold text-gray-900">Candidate Found</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{searchResult.candidate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Previous Offers:</span>
                      <span className="font-medium">{searchResult.offers} total, {searchResult.notJoined} not joined</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Offer:</span>
                      <span className="font-medium">{searchResult.lastCompany} ({searchResult.lastDate})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Verified by:</span>
                      <span className="font-medium">{searchResult.verifiedBy} employers</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                      Add this candidate to your company records
                    </button>
                  </div>
                </div>
              )}

              {searchResult && !searchResult.found && searchQuery && (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <p className="text-gray-600">No matching record found in RedHunt database.</p>
                </div>
              )}
            </div>

            {/* All Candidates Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Your Candidates</h3>
                  <p className="text-gray-600">View all candidates you've added to the system</p>
          </div>
                <button
                  onClick={fetchAllCandidates}
                  disabled={candidatesLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-70"
                >
                  {candidatesLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4 mr-2" />
                      Load Candidates
                    </>
                  )}
                </button>
              </div>

              {allCandidates.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Position
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Offer Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          UAN
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allCandidates.map((candidate, index) => (
                        <tr key={candidate._id || candidate.id || index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {candidate.email}
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
                            {candidate.offerDate ? new Date(candidate.offerDate).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {candidate.uan || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {allCandidates.length === 0 && !candidatesLoading && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p>No candidates found. Click "Load Candidates" to fetch your records.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Hiring Insights</h2>
              <p className="text-gray-600">Track offer trends and candidate joining behavior.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Offer Acceptance Rate</h3>
                <p className="text-3xl font-bold text-green-600">78%</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Non-Joining Percentage</h3>
                <p className="text-3xl font-bold text-red-600">22%</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Top Dropout Position</h3>
                <p className="text-lg font-bold text-gray-900">Software Engineer</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Trend</h3>
                <p className="text-lg font-bold text-blue-600">+12%</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h3>
                <div className="flex space-x-2">
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </button>
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <FileText className="h-4 w-4 mr-2" />
                    Export PDF
                  </button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Top 5 Positions with Most Dropouts</h4>
                  <div className="space-y-2">
                    {['Software Engineer', 'Data Analyst', 'Marketing Manager', 'Sales Executive', 'HR Specialist'].map((position, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-600">{position}</span>
                        <span className="font-medium">{15 - index}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Monthly Joining Trends</h4>
                  <div className="space-y-2">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-600">{month}</span>
                        <span className="font-medium">{65 + index * 5}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
                    <div className="text-sm text-gray-500">Industry</div>
                    <div className="text-gray-900 font-medium">{profile.industry || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">HR Contact</div>
                    <div className="text-gray-900 font-medium">{profile.hrName || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Official Email</div>
                    <div className="text-gray-900 font-medium break-words">{profile.email || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Contact Number</div>
                    <div className="text-gray-900 font-medium">{profile.contactNumber || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Company Code</div>
                    <div className="text-gray-900 font-medium">{profile.companyCode || '-'}</div>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <input
                      type="text"
                          value={editProfile.industry}
                          onChange={(e) => setEditProfile({ ...editProfile, industry: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">HR Contact</label>
                    <input
                      type="text"
                          value={editProfile.hrName}
                          onChange={(e) => setEditProfile({ ...editProfile, hrName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Official Email</label>
                    <input
                      type="email"
                          value={editProfile.email}
                          onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                    <input
                          type="tel"
                          value={editProfile.contactNumber}
                          onChange={(e) => setEditProfile({ ...editProfile, contactNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Code</label>
                    <input
                      type="text"
                          value={editProfile.companyCode}
                          onChange={(e) => setEditProfile({ ...editProfile, companyCode: e.target.value })}
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
    </div>
  )
}
