"use client"

import { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  Eye, 
  Ban, 
  CheckCircle, 
  X,
  ChevronDown,
  Loader2
} from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.red-flagged.com'

interface CandidateUser {
  _id?: string
  id?: string
  name?: string
  fullName?: string
  fathersName?: string
  gender?: string
  dob?: string
  permanentAddress?: string
  currentAddress?: string
  mobileNumber?: string
  mobile?: string
  phone?: string
  primaryEmail?: string
  email: string
  secondaryEmail?: string
  panNumber?: string
  pan?: string
  uanNumber?: string
  uan?: string
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
  status: string
  emailVerified?: boolean
  profileCompleteness?: number
  verifiedAt?: string | Date
  verificationNotes?: string
  isInvited?: boolean
  updateHistory?: any[]
  createdAt?: string
  updatedAt?: string
}

export default function AdminCandidateUsersPage() {
  const [candidateUsers, setCandidateUsers] = useState<CandidateUser[]>([])
  const [candidateUsersLoading, setCandidateUsersLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [selectedCandidateUser, setSelectedCandidateUser] = useState<CandidateUser | null>(null)
  const [showCandidateUserModal, setShowCandidateUserModal] = useState(false)

  const getToken = () => localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')

  const fetchCandidateUsers = async () => {
    try {
      setCandidateUsersLoading(true)
      const token = getToken()
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
      } else {
        setError('Failed to fetch candidate users')
      }
    } finally {
      setCandidateUsersLoading(false)
    }
  }

  const approveCandidateUser = async (candidateUserId: string) => {
    try {
      const token = getToken()
      await axios.patch(`${API_BASE_URL}/api/admin/candidate-users/${candidateUserId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchCandidateUsers()
      setShowCandidateUserModal(false)
    } catch (err) {
      setError('Failed to approve candidate user')
      console.error('Approve candidate user error:', err)
    }
  }

  const rejectCandidateUser = async (candidateUserId: string) => {
    try {
      const token = getToken()
      await axios.patch(`${API_BASE_URL}/api/admin/candidate-users/${candidateUserId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchCandidateUsers()
      setShowCandidateUserModal(false)
    } catch (err) {
      setError('Failed to reject candidate user')
      console.error('Reject candidate user error:', err)
    }
  }

  const suspendCandidateUser = async (candidateUserId: string) => {
    try {
      const token = getToken()
      await axios.patch(`${API_BASE_URL}/api/admin/candidate-users/${candidateUserId}/suspend`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchCandidateUsers()
      setShowCandidateUserModal(false)
    } catch (err) {
      setError('Failed to suspend candidate user')
      console.error('Suspend candidate user error:', err)
    }
  }

  const unsuspendCandidateUser = async (candidateUserId: string) => {
    try {
      const token = getToken()
      await axios.patch(`${API_BASE_URL}/api/admin/candidate-users/${candidateUserId}/unsuspend`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchCandidateUsers()
      setShowCandidateUserModal(false)
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

  useEffect(() => {
    fetchCandidateUsers()
  }, [])

  return (
    <>
      <div className="mb-6 sm:mb-8">
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Red-Flagged</th>
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
              )
            })}
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
          )
        })}
      </div>

      {candidateUsers.length === 0 && !candidateUsersLoading && (
        <div className="text-center py-8 text-gray-500">No candidate users found</div>
      )}

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
                  {/* Basic Information */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <p className="text-gray-900">{displayName || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="text-gray-900 text-sm break-all">{selectedCandidateUser.email || selectedCandidateUser.primaryEmail || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="text-gray-900">{selectedCandidateUser.phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Father&apos;s Name</label>
                        <p className="text-gray-900">{displayFatherName || 'N/A'}</p>
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Secondary Email</label>
                        <p className="text-gray-900 text-sm break-all">{selectedCandidateUser.secondaryEmail || 'N/A'}</p>
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
                        <p className="text-gray-900 capitalize">{selectedCandidateUser.highestQualification?.replace(/-/g, ' ') || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Work Experience</label>
                        <p className="text-gray-900">{selectedCandidateUser.workExperience !== undefined ? `${selectedCandidateUser.workExperience} years` : 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Sector</label>
                        <p className="text-gray-900 capitalize">{selectedCandidateUser.sector?.replace(/-/g, ' ') || 'N/A'}</p>
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
                        <p className="text-gray-900">{selectedCandidateUser.noticePeriod !== undefined ? `${selectedCandidateUser.noticePeriod} days` : 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Negotiable Days</label>
                        <p className="text-gray-900">{selectedCandidateUser.negotiableDays !== undefined ? `${selectedCandidateUser.negotiableDays} days` : 'N/A'}</p>
                      </div>
                    </div>
                    {selectedCandidateUser.skillSets && selectedCandidateUser.skillSets.length > 0 && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Skill Sets</label>
                        <div className="flex flex-wrap gap-2">
                          {selectedCandidateUser.skillSets.map((skill: string, index: number) => (
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

                  {/* Account & Verification Information */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account & Verification Information</h3>
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
                        <label className="block text-sm font-medium text-gray-700">Email Verified</label>
                        <p className="text-gray-900">{selectedCandidateUser.emailVerified ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Profile Completeness</label>
                        <p className="text-gray-900">{selectedCandidateUser.profileCompleteness !== undefined ? `${selectedCandidateUser.profileCompleteness}%` : 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Verified At</label>
                        <p className="text-gray-900">
                          {selectedCandidateUser.verifiedAt ? new Date(selectedCandidateUser.verifiedAt).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Verification Notes</label>
                        <p className="text-gray-900">{selectedCandidateUser.verificationNotes || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Is Invited</label>
                        <p className="text-gray-900">{selectedCandidateUser.isInvited ? 'Yes' : 'No'}</p>
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Red-Flagged Count</label>
                        <p className="text-gray-900">
                          {Array.isArray(selectedCandidateUser.updateHistory) ? selectedCandidateUser.updateHistory.length : 0} entries
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
                        }}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => {
                          rejectCandidateUser(selectedCandidateUser._id || selectedCandidateUser.id!)
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
    </>
  )
}

