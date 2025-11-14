"use client"

import { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  Users, 
  X,
  Loader2
} from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

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

interface Employer {
  _id?: string
  id?: string
  companyName?: string
  company?: string
  status: string
}

export default function AdminCandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [employers, setEmployers] = useState<Employer[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterEmployer, setFilterEmployer] = useState('all')
  const [candidatesLoading, setCandidatesLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [isCandidateViewOpen, setIsCandidateViewOpen] = useState(false)

  const getToken = () => localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')

  const normalizeStatus = (status?: string) => {
    const s = (status || '').toLowerCase()
    if (s === 'active' || s === 'approved') return 'approved'
    return s
  }

  const getApprovedEmployers = () => {
    return employers.filter(emp => normalizeStatus(emp.status) === 'approved')
  }

  const fetchEmployers = async () => {
    try {
      const token = getToken()
      if (!token) return
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/employers`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setEmployers(data)
    } catch (err) {
      console.error('Failed to fetch employers:', err)
    }
  }

  const fetchCandidates = async (opts?: { employerId?: string; search?: string }) => {
    try {
      setCandidatesLoading(true)
      const token = getToken()
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
          
          const employersData = employersResponse.data
          const allCandidates: Candidate[] = []
          
          employersData.forEach((employer: any) => {
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
          console.log('Fallback also failed')
          data = []
        }
      }

      setCandidates(data || [])
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.')
        localStorage.removeItem('adminToken')
        sessionStorage.removeItem('adminToken')
        setTimeout(() => {
          window.location.href = '/admin/login'
        }, 2000)
      } else {
        setError(`Failed to fetch candidates: ${err.response?.data?.message || err.message || 'Unknown error'}`)
        console.error('Fetch candidates error:', err)
      }
    } finally {
      setCandidatesLoading(false)
    }
  }

  const openCandidateView = (candidate: Candidate) => { 
    setSelectedCandidate(candidate)
    setIsCandidateViewOpen(true) 
  }
  const closeCandidateView = () => { 
    setIsCandidateViewOpen(false)
    setSelectedCandidate(null) 
  }

  useEffect(() => {
    fetchEmployers()
    fetchCandidates()
  }, [])

  useEffect(() => {
    fetchCandidates({ employerId: filterEmployer, search: searchQuery })
  }, [filterEmployer])

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
    <>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Master Candidate Records</h2>
        <p className="text-gray-600">Unified list of all records submitted by employers.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search Bar - Full Width */}
          <div className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, UAN, or employer..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base"
              />
            </div>
          </div>
          
          {/* Filters Row - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Status Filter */}
            <div className="w-full">
              <label className="block text-xs font-medium text-gray-700 mb-1.5 sm:hidden">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base bg-white"
              >
                <option value="all">All Status</option>
                <option value="joined">Joined</option>
                <option value="not_joined">Not Joined</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            
            {/* Employer Filter */}
            <div className="w-full">
              <label className="block text-xs font-medium text-gray-700 mb-1.5 sm:hidden">Employer</label>
              <select
                value={filterEmployer}
                onChange={(e) => setFilterEmployer(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base bg-white"
              >
                <option value="all">All Employers</option>
                {getApprovedEmployers().map((emp) => (
                  <option key={emp._id || emp.id} value={emp._id || emp.id}>
                    {emp.companyName || emp.company}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Clear Filters Button */}
            <div className="w-full sm:col-span-2 lg:col-span-1">
              <button 
                onClick={() => {
                  setSearchQuery('')
                  setFilterStatus('all')
                  setFilterEmployer('all')
                }}
                className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base font-medium text-gray-700"
              >
                <Filter className="h-4 w-4 mr-2" />
                <span className="sm:hidden">Clear</span>
                <span className="hidden sm:inline">Clear Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                  <button
                    onClick={() => openCandidateView(candidate)}
                    className="text-blue-600 hover:text-blue-900"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredCandidates.length === 0 && !candidatesLoading && (
          <div className="text-center py-8 text-gray-500">No candidates found</div>
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
                </div>
              </div>

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
    </>
  )
}

