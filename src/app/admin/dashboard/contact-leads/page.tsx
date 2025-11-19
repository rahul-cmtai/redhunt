"use client"

import { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  Mail, 
  Phone, 
  Building2, 
  MessageSquare, 
  Search, 
  Filter,
  CheckCircle,
  Clock,
  Archive,
  Eye,
  EyeOff,
  X,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.red-flagged.com'

type ContactLead = {
  _id: string
  name: string
  email: string
  company?: string
  phone?: string
  subject: 'pricing' | 'partnership' | 'other'
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  adminNotes?: string
  createdAt: string
  updatedAt: string
}

export default function ContactLeadsPage() {
  const [leads, setLeads] = useState<ContactLead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [subjectFilter, setSubjectFilter] = useState<string>('all')
  const [selectedLead, setSelectedLead] = useState<ContactLead | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [stats, setStats] = useState<any>(null)

  const getToken = () => localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')

  const fetchLeads = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = getToken()
      if (!token) throw new Error('Authentication required')

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      })

      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      if (subjectFilter !== 'all') {
        params.append('subject', subjectFilter)
      }

      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim())
      }

      const { data } = await axios.get(`${API_BASE_URL}/api/contact-leads?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setLeads(data.leads || [])
      setTotalPages(data.pagination?.pages || 1)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch contact leads')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const token = getToken()
      if (!token) return

      const { data } = await axios.get(`${API_BASE_URL}/api/contact-leads/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setStats(data)
    } catch (err) {
      console.error('Failed to fetch stats', err)
    }
  }

  useEffect(() => {
    fetchLeads()
    fetchStats()
  }, [page, statusFilter, subjectFilter])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (page === 1) {
        fetchLeads()
      } else {
        setPage(1)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handleStatusUpdate = async (leadId: string, newStatus: string) => {
    setUpdatingStatus(true)
    try {
      const token = getToken()
      if (!token) throw new Error('Authentication required')

      await axios.patch(
        `${API_BASE_URL}/api/contact-leads/${leadId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setLeads(leads.map(lead => 
        lead._id === leadId ? { ...lead, status: newStatus as any } : lead
      ))

      if (selectedLead?._id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus as any })
      }

      fetchStats()
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleSaveNotes = async () => {
    if (!selectedLead) return
    setSavingNotes(true)
    try {
      const token = getToken()
      if (!token) throw new Error('Authentication required')

      await axios.patch(
        `${API_BASE_URL}/api/contact-leads/${selectedLead._id}/notes`,
        { adminNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setLeads(leads.map(lead => 
        lead._id === selectedLead._id ? { ...lead, adminNotes } : lead
      ))

      setSelectedLead({ ...selectedLead, adminNotes })
      alert('Notes saved successfully')
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save notes')
    } finally {
      setSavingNotes(false)
    }
  }

  const openLeadDetails = (lead: ContactLead) => {
    setSelectedLead(lead)
    setAdminNotes(lead.adminNotes || '')
    if (lead.status === 'new') {
      handleStatusUpdate(lead._id, 'read')
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      new: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      read: 'bg-blue-100 text-blue-800 border-blue-200',
      replied: 'bg-green-100 text-green-800 border-green-200',
      archived: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return styles[status as keyof typeof styles] || styles.new
  }

  const getSubjectLabel = (subject: string) => {
    const labels: Record<string, string> = {
      pricing: 'Pricing Inquiry',
      partnership: 'Partnership Opportunity',
      other: 'Other'
    }
    return labels[subject] || subject
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Contact Leads</h1>
          <p className="text-sm text-gray-600 mt-1">Manage inquiries from the contact form</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-sm text-gray-600">Total Leads</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{stats.total || 0}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-sm text-gray-600">New</div>
            <div className="text-2xl font-bold text-yellow-600 mt-1">{stats.byStatus?.new || 0}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-sm text-gray-600">Replied</div>
            <div className="text-2xl font-bold text-green-600 mt-1">{stats.byStatus?.replied || 0}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-sm text-gray-600">Archived</div>
            <div className="text-2xl font-bold text-gray-600 mt-1">{stats.byStatus?.archived || 0}</div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, company, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">All Subjects</option>
              <option value="pricing">Pricing</option>
              <option value="partnership">Partnership</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="p-12 text-center text-gray-600">Loading contact leads...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-600">{error}</div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contact leads found</h3>
            <p className="text-sm text-gray-500">No leads match your search criteria</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {leads.map((lead) => (
                <div
                  key={lead._id}
                  className="p-4 sm:p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => openLeadDetails(lead)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(lead.status)}`}>
                          {lead.status === 'new' && <Clock className="h-3 w-3" />}
                          {lead.status === 'read' && <Eye className="h-3 w-3" />}
                          {lead.status === 'replied' && <CheckCircle className="h-3 w-3" />}
                          {lead.status === 'archived' && <Archive className="h-3 w-3" />}
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {getSubjectLabel(lead.subject)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="truncate">{lead.email}</span>
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                        {lead.company && (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <span className="truncate">{lead.company}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{lead.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-gray-200">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Lead Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedLead(null)}>
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Lead Details</h2>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Lead Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-gray-900">{selectedLead.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <a href={`mailto:${selectedLead.email}`} className="text-red-600 hover:underline">
                    {selectedLead.email}
                  </a>
                </div>
                {selectedLead.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <a href={`tel:${selectedLead.phone}`} className="text-red-600 hover:underline">
                      {selectedLead.phone}
                    </a>
                  </div>
                )}
                {selectedLead.company && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <p className="text-gray-900">{selectedLead.company}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {getSubjectLabel(selectedLead.subject)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleStatusUpdate(selectedLead._id, e.target.value)}
                    disabled={updatingStatus}
                    className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Submitted</label>
                  <p className="text-gray-600 text-sm">{new Date(selectedLead.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedLead.message}</p>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Add internal notes about this lead..."
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingNotes ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

