"use client"

import { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  Search, 
  Filter, 
  Eye, 
  Ban, 
  CheckCircle, 
  Building2, 
  X, 
  ChevronDown,
  Loader2,
  Mail,
  Phone,
  MapPin,
  User,
  Briefcase,
  Shield,
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.red-flagged.com'

interface Employer {
  _id?: string
  id?: string
  companyName?: string
  company?: string
  address?: string
  panNumber?: string
  hrName?: string
  designation?: string
  contactNumber?: string
  email: string
  status: string
  role?: string
  trustScore?: number
  emailVerified?: boolean
  industry?: string
  companyCode?: string
  candidateCount?: number
  candidates?: number
  createdAt?: string
  updatedAt?: string
  joinedOn?: string
  lastActivity?: string
}

export default function AdminEmployersPage() {
  const [employers, setEmployers] = useState<Employer[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [openEmployerDropdownId, setOpenEmployerDropdownId] = useState<string | null>(null)
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)

  const getToken = () => localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')

  const normalizeStatus = (status?: string) => {
    const s = (status || '').toLowerCase()
    if (s === 'active' || s === 'approved') return 'approved'
    if (s === 'suspended') return 'suspended'
    if (s === 'rejected') return 'rejected'
    if (s === 'pending') return 'pending'
    return s
  }

  const fetchEmployers = async () => {
    try {
      setLoading(true)
      const token = getToken()
      if (!token) {
        setError('No authentication token found. Please login again.')
        return
      }
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/employers`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setEmployers(data)
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

  const approveEmployer = async (employerId: string) => {
    try {
      const token = getToken()
      await axios.patch(`${API_BASE_URL}/api/admin/employers/${employerId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchEmployers()
      setIsViewOpen(false)
    } catch (err) {
      setError('Failed to approve employer')
      console.error('Approve employer error:', err)
    }
  }

  const rejectEmployer = async (employerId: string) => {
    try {
      const token = getToken()
      await axios.patch(`${API_BASE_URL}/api/admin/employers/${employerId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchEmployers()
      setIsViewOpen(false)
    } catch (err) {
      setError('Failed to reject employer')
      console.error('Reject employer error:', err)
    }
  }

  const suspendEmployer = async (employerId: string) => {
    try {
      const token = getToken()
      await axios.patch(`${API_BASE_URL}/api/admin/employers/${employerId}/suspend`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchEmployers()
      setIsViewOpen(false)
    } catch (err) {
      setError('Failed to suspend employer')
      console.error('Suspend employer error:', err)
    }
  }

  const unsuspendEmployer = async (employerId: string) => {
    try {
      const token = getToken()
      await axios.patch(`${API_BASE_URL}/api/admin/employers/${employerId}/unsuspend`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchEmployers()
      setIsViewOpen(false)
    } catch (err) {
      setError('Failed to unsuspend employer')
      console.error('Unsuspend employer error:', err)
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

  const openView = async (employer: Employer) => { 
    setSelectedEmployer(employer)
    setIsViewOpen(true)
    
    // Fetch fresh candidate count
    try {
      const token = getToken()
      if (!token) return
      
      const { data: candidatesData } = await axios.get(`${API_BASE_URL}/api/admin/candidates`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { employerId: employer._id || employer.id }
      })
      
      const count = Array.isArray(candidatesData) ? candidatesData.length : (candidatesData?.candidates?.length || candidatesData?.length || 0)
      setSelectedEmployer({ ...employer, candidateCount: count })
    } catch (err) {
      console.error('Failed to fetch candidate count:', err)
    }
  }
  const closeView = () => { 
    setIsViewOpen(false)
    setSelectedEmployer(null) 
  }

  useEffect(() => {
    fetchEmployers()
  }, [])

  const filteredEmployers = employers.filter(employer => {
    const matchesSearch = employer.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employer.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const employerStatus = normalizeStatus(employer.status)
    const matchesStatus = filterStatus === 'all' || employerStatus === filterStatus.toLowerCase()
    return matchesSearch && matchesStatus
  })

  return (
    <>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Employer Accounts</h2>
        <p className="text-gray-600">Manage employer registrations and account status.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidates</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined On</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployers.map((employer) => (
              <tr key={employer._id || employer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{employer.companyName || employer.company}</div>
                  <div className="text-sm text-gray-500">{employer.lastActivity || 'Recently active'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employer.email}</td>
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
          <div className="text-center py-8 text-gray-500">No employers found</div>
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

      {/* View Modal */}
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
              {/* Company Information - Matching Registration Form Order */}
              <div className="border-b pb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                  Company Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      Company Name
                    </div>
                    <div className="text-gray-900 font-medium">{selectedEmployer.companyName || selectedEmployer.company || 'N/A'}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Company Address
                    </div>
                    <div className="text-gray-900 whitespace-pre-wrap">{selectedEmployer.address || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      PAN Number of the Company
                    </div>
                    <div className="text-gray-900 font-mono text-lg">{selectedEmployer.panNumber || 'N/A'}</div>
                  </div>
                  {selectedEmployer.industry && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        Industry
                      </div>
                      <div className="text-gray-900">{selectedEmployer.industry}</div>
                    </div>
                  )}
                  {selectedEmployer.companyCode && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        Company Code
                      </div>
                      <div className="text-gray-900">{selectedEmployer.companyCode}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* HR Contact Information - Matching Registration Form Order */}
              <div className="border-b pb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-green-600" />
                  HR Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Your Name (HR Name)
                    </div>
                    <div className="text-gray-900 font-medium">{selectedEmployer.hrName || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      Designation
                    </div>
                    <div className="text-gray-900">{selectedEmployer.designation || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      Mobile Number
                    </div>
                    <div className="text-gray-900">{selectedEmployer.contactNumber || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      Corporate Mail ID
                    </div>
                    <div className="text-gray-900 break-all">{selectedEmployer.email || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Account Status & Security */}
              <div className="border-b pb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-purple-600" />
                  Account Status & Security
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div className="text-sm text-gray-500 mb-1">Role</div>
                    <div className="text-gray-900 capitalize">{selectedEmployer.role || 'employer'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      Email Verification Status
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedEmployer.emailVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          <CheckCircle2 className="h-3 w-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          <XCircle className="h-3 w-3" />
                          Not Verified
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Trust Score</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${((selectedEmployer.trustScore || 0) / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{selectedEmployer.trustScore || 0}/10</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="border-b pb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h4>
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
                    <div className="text-sm text-purple-600 mb-1">Trust Score</div>
                    <div className="text-lg font-bold text-purple-900">
                      {selectedEmployer.trustScore || 0}/10
                    </div>
                  </div>
                </div>
              </div>

              {/* System Information */}
              <div className="border-b pb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-gray-600" />
                  System Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Created At
                    </div>
                    <div className="text-gray-900">
                      {selectedEmployer.createdAt 
                        ? new Date(selectedEmployer.createdAt).toLocaleString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : selectedEmployer.joinedOn || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Last Updated
                    </div>
                    <div className="text-gray-900">
                      {selectedEmployer.updatedAt 
                        ? new Date(selectedEmployer.updatedAt).toLocaleString('en-US', { 
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
                    <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      Record ID
                    </div>
                    <div className="text-gray-900 text-xs font-mono break-all">{selectedEmployer._id || selectedEmployer.id || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Last Activity</div>
                    <div className="text-gray-900">{selectedEmployer.lastActivity || 'Recently active'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="border-t px-6 py-4 flex justify-between items-center sticky bottom-0 bg-gray-50">
              <div className="text-sm text-gray-600">
                Last updated: {selectedEmployer.updatedAt ? new Date(selectedEmployer.updatedAt).toLocaleString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : (selectedEmployer.createdAt ? new Date(selectedEmployer.createdAt).toLocaleDateString() : 'N/A')}
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
                      }}
                      className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center space-x-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => {
                        rejectEmployer(selectedEmployer._id || selectedEmployer.id!)
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
    </>
  )
}

