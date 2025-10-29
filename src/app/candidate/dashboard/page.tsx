"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { 
  User, 
  Briefcase, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Building2, 
  Mail, 
  Phone, 
  CreditCard, 
  LogOut,
  AlertCircle,
  TrendingUp,
  Calendar,
  Eye
} from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface Offer {
  _id?: string
  id?: string
  employerName?: string
  companyName?: string
  position?: string
  jobRole?: string
  offerDate?: string
  offerStatus?: string
  joiningDate?: string
  joiningStatus?: string
  reason?: string
  notes?: string
  createdAt?: string
}

export default function CandidateDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [showOfferModal, setShowOfferModal] = useState(false)

  const getToken = () => localStorage.getItem('candidateToken') || sessionStorage.getItem('candidateToken')

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/candidate/login')
      return
    }
    setIsAuthenticated(true)
  }, [router])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getToken()
        if (!token) return
        const { data } = await axios.get(`${API_BASE_URL}/api/candidate/profile`, { headers: { Authorization: `Bearer ${token}` } })
        setProfile(data)
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || 'Failed to load profile'
        setError(msg)
      }
    }
    if (isAuthenticated) fetchProfile()
  }, [isAuthenticated])

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true)
        const token = getToken()
        if (!token) return
        
        // Try to fetch offers from the API
        const { data } = await axios.get(`${API_BASE_URL}/api/candidate/offers`, { 
          headers: { Authorization: `Bearer ${token}` } 
        })
        setOffers(data || [])
      } catch (err: any) {
        console.log('Could not fetch offers:', err?.response?.data?.message || err?.message)
        // Don't show error if endpoint doesn't exist yet
        setOffers([])
      } finally {
        setLoading(false)
      }
    }
    if (isAuthenticated) fetchOffers()
  }, [isAuthenticated])

  const handleViewOffer = (offer: Offer) => {
    setSelectedOffer(offer)
    setShowOfferModal(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('candidateToken')
    sessionStorage.removeItem('candidateToken')
    router.push('/candidate/login')
  }

  // Calculate stats
  const totalOffers = offers.length
  const joinedCount = offers.filter(o => o.joiningStatus === 'joined' || o.offerStatus === 'Joined').length
  const notJoinedCount = offers.filter(o => o.joiningStatus === 'not_joined' || o.offerStatus === 'Not Joined').length
  const pendingCount = offers.filter(o => !o.joiningStatus || o.joiningStatus === 'pending').length

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }
  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/70 backdrop-blur sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center min-w-0">
          <Link href="/" className="text-lg sm:text-xl font-bold text-red-600">Red-Flagged</Link>
              <span className="hidden sm:inline ml-3 text-xs text-gray-500">Candidate Portal</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-xs sm:text-sm text-gray-600 truncate">
            <span className="hidden sm:inline">Welcome, </span>
            <span className="font-semibold text-gray-900">{profile?.name || 'Candidate'}</span>
              </div>
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

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">View your profile and offers from employers</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs sm:text-sm text-gray-500">Total Offers</div>
              <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{totalOffers}</div>
            <p className="text-xs text-gray-500 mt-1">From employers</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs sm:text-sm text-gray-500">Joined</div>
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-green-600">{joinedCount}</div>
            <p className="text-xs text-gray-500 mt-1">Successfully joined</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs sm:text-sm text-gray-500">Not Joined</div>
              <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-red-600">{notJoinedCount}</div>
            <p className="text-xs text-gray-500 mt-1">Didn't join</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs sm:text-sm text-gray-500">Pending</div>
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-gray-500 mt-1">In progress</p>
          </div>
        </div>


        {/* Offers from Employers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Offers & Records</h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Employers have submitted these records about you</p>
              </div>
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-sm">Loading offers...</p>
              </div>
            ) : offers.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <Briefcase className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Offers Yet</h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                  When employers submit information about offers or candidates, they will appear here.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Position
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Offer Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joining Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {offers.map((offer, index) => (
                        <tr key={offer._id || offer.id || index} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                              <div className="text-sm font-medium text-gray-900">
                                {offer.employerName || offer.companyName || 'Unknown Company'}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{offer.position || offer.jobRole || '-'}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {offer.offerDate ? new Date(offer.offerDate).toLocaleDateString() : '-'}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {offer.joiningDate ? new Date(offer.joiningDate).toLocaleDateString() : '-'}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              offer.joiningStatus === 'joined' || offer.offerStatus === 'Joined'
                                ? 'bg-green-100 text-green-800'
                                : offer.joiningStatus === 'not_joined' || offer.offerStatus === 'Not Joined'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {offer.joiningStatus === 'joined' ? 'Joined' :
                               offer.joiningStatus === 'not_joined' ? 'Not Joined' :
                               offer.offerStatus || 'Pending'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleViewOffer(offer)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4">
                  {offers.map((offer, index) => (
                    <div key={offer._id || offer.id || index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center mb-1">
                            <Building2 className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                            <h3 className="font-medium text-gray-900 text-sm truncate">
                              {offer.employerName || offer.companyName || 'Unknown Company'}
                            </h3>
                          </div>
                          <p className="text-xs text-gray-600">{offer.position || offer.jobRole || '-'}</p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${
                          offer.joiningStatus === 'joined' || offer.offerStatus === 'Joined'
                            ? 'bg-green-100 text-green-800'
                            : offer.joiningStatus === 'not_joined' || offer.offerStatus === 'Not Joined'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {offer.joiningStatus === 'joined' ? 'Joined' :
                           offer.joiningStatus === 'not_joined' ? 'Not Joined' :
                           offer.offerStatus || 'Pending'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                        <div>
                          <span className="text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Offer Date
                          </span>
                          <p className="text-gray-900 mt-0.5">
                            {offer.offerDate ? new Date(offer.offerDate).toLocaleDateString() : '-'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Joining Date
                          </span>
                          <p className="text-gray-900 mt-0.5">
                            {offer.joiningDate ? new Date(offer.joiningDate).toLocaleDateString() : '-'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleViewOffer(offer)}
                        className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-xs font-medium flex items-center justify-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Your Profile</h3>
            <User className="h-5 w-5 text-gray-400" />
          </div>
          
          {error && <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-1">
                <User className="h-4 w-4 mr-1" />
                Name
              </div>
              <div className="text-sm sm:text-base text-gray-900 font-medium">{profile?.name || '-'}</div>
            </div>
            <div>
              <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-1">
                <Mail className="h-4 w-4 mr-1" />
                Email
              </div>
              <div className="text-sm sm:text-base text-gray-900 font-medium break-words">{profile?.email || profile?.primaryEmail || '-'}</div>
            </div>
            <div>
              <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-1">
                <Phone className="h-4 w-4 mr-1" />
                Phone
              </div>
              <div className="text-sm sm:text-base text-gray-900 font-medium">{profile?.mobile || profile?.mobileNumber || '-'}</div>
            </div>
            <div>
              <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-1">
                <CreditCard className="h-4 w-4 mr-1" />
                PAN Number
              </div>
              <div className="text-sm sm:text-base text-gray-900 font-medium">{profile?.pan || profile?.panNumber || '-'}</div>
            </div>
            <div>
              <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-1">
                <CreditCard className="h-4 w-4 mr-1" />
                UAN Number
              </div>
              <div className="text-sm sm:text-base text-gray-900 font-medium">{profile?.uan || profile?.uanNumber || '-'}</div>
            </div>
            <div>
              <div className="text-xs sm:text-sm text-gray-500 mb-1">
                Account Status
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                profile?.status === 'approved' || profile?.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : profile?.status === 'suspended'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {profile?.status || 'Pending'}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700">
              Update Profile
            </button>
            <button className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50">
              Change Password
            </button>
          </div>
        </div>
      </main>

      {/* Offer Details Modal */}
      {showOfferModal && selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Offer Details</h3>
              <button
                onClick={() => setShowOfferModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Company Name</div>
                    <div className="text-base font-medium text-gray-900">
                      {selectedOffer.employerName || selectedOffer.companyName || '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Position</div>
                    <div className="text-base font-medium text-gray-900">
                      {selectedOffer.position || selectedOffer.jobRole || '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Offer Date</div>
                    <div className="text-base font-medium text-gray-900">
                      {selectedOffer.offerDate ? new Date(selectedOffer.offerDate).toLocaleDateString() : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Joining Date</div>
                    <div className="text-base font-medium text-gray-900">
                      {selectedOffer.joiningDate ? new Date(selectedOffer.joiningDate).toLocaleDateString() : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Offer Status</div>
                    <div className="text-base font-medium text-gray-900">
                      {selectedOffer.offerStatus || '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Joining Status</div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedOffer.joiningStatus === 'joined' || selectedOffer.offerStatus === 'Joined'
                        ? 'bg-green-100 text-green-800'
                        : selectedOffer.joiningStatus === 'not_joined' || selectedOffer.offerStatus === 'Not Joined'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedOffer.joiningStatus === 'joined' ? 'Joined' :
                       selectedOffer.joiningStatus === 'not_joined' ? 'Not Joined' :
                       selectedOffer.joiningStatus || selectedOffer.offerStatus || 'Pending'}
                    </span>
                  </div>
                </div>

                {selectedOffer.reason && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Reason</div>
                    <div className="text-base text-gray-900 bg-gray-50 rounded p-3">
                      {selectedOffer.reason}
                    </div>
                  </div>
                )}

                {selectedOffer.notes && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Additional Notes</div>
                    <div className="text-base text-gray-900 bg-gray-50 rounded p-3">
                      {selectedOffer.notes}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Record created: {selectedOffer.createdAt ? new Date(selectedOffer.createdAt).toLocaleString() : '-'}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowOfferModal(false)}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


