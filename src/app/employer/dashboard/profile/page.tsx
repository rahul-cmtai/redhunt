"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Building2, MapPin, CreditCard, User, Briefcase, Phone, Mail, Shield, CheckCircle, XCircle } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function EmployerProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    companyName: '',
    address: '',
    panNumber: '',
    hrName: '',
    designation: '',
    contactNumber: '',
    email: ''
  })

  const getToken = () => localStorage.getItem('employerToken') || sessionStorage.getItem('employerToken')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const token = getToken()
        if (!token) {
          setError('Not authenticated')
          return
        }
        const { data } = await axios.get(`${API_BASE_URL}/api/employer/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setProfile(data)
        setEditForm({
          companyName: data.companyName || '',
          address: data.address || '',
          panNumber: data.panNumber || '',
          hrName: data.hrName || '',
          designation: data.designation || '',
          contactNumber: data.contactNumber || '',
          email: data.email || ''
        })
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      setSaveError(null)
      setSaveSuccess(null)
      const token = getToken()
      if (!token) throw new Error('Not authenticated')

      const { data } = await axios.put(
        `${API_BASE_URL}/api/employer/profile`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setProfile(data)
      setSaveSuccess('Profile updated successfully!')
      setIsEditing(false)
      setTimeout(() => setSaveSuccess(null), 3000)
    } catch (err: any) {
      setSaveError(err?.response?.data?.message || err?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'suspended':
        return 'bg-gray-100 text-gray-800 border-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    )
  }

  if (error && !profile) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Company Profile</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your company information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {saveSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            {saveSuccess}
          </div>
        )}

        {saveError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {saveError}
          </div>
        )}

        <div className="space-y-4">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-500" />
              Company Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.companyName}
                onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            ) : (
              <p className="text-gray-900 font-medium">{profile?.companyName || '-'}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              Address
            </label>
            {isEditing ? (
              <textarea
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            ) : (
              <p className="text-gray-900">{profile?.address || '-'}</p>
            )}
          </div>

          {/* PAN Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-500" />
              PAN Number
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.panNumber}
                onChange={(e) => setEditForm({ ...editForm, panNumber: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 uppercase"
                maxLength={10}
              />
            ) : (
              <p className="text-gray-900 font-medium">{profile?.panNumber || '-'}</p>
            )}
          </div>

          {/* HR Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              HR Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.hrName}
                onChange={(e) => setEditForm({ ...editForm, hrName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            ) : (
              <p className="text-gray-900 font-medium">{profile?.hrName || '-'}</p>
            )}
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-gray-500" />
              Designation
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.designation}
                onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            ) : (
              <p className="text-gray-900 font-medium">{profile?.designation || '-'}</p>
            )}
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              Contact Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={editForm.contactNumber}
                onChange={(e) => setEditForm({ ...editForm, contactNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                maxLength={10}
              />
            ) : (
              <p className="text-gray-900 font-medium">{profile?.contactNumber || '-'}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-gray-900 font-medium">{profile?.email || '-'}</p>
                {profile?.emailVerified && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Status */}
          {profile?.status && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-500" />
                Account Status
              </label>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border-2 ${getStatusColor(profile.status)}`}>
                {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
              </span>
            </div>
          )}

          {/* Trust Score */}
          {profile?.trustScore !== undefined && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trust Score</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{ width: `${(profile.trustScore / 10) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-900">{profile.trustScore}/10</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditForm({
                    companyName: profile?.companyName || '',
                    address: profile?.address || '',
                    panNumber: profile?.panNumber || '',
                    hrName: profile?.hrName || '',
                    designation: profile?.designation || '',
                    contactNumber: profile?.contactNumber || '',
                    email: profile?.email || ''
                  })
                  setSaveError(null)
                  setSaveSuccess(null)
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

