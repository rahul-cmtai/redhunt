"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Users, UserCheck, Shield, Clock, TrendingUp, CheckCircle, AlertTriangle, Building2, ArrowRight } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface DashboardStat {
  title: string
  value: string
  icon: any
  color: string
  change: string
}

export default function AdminOverviewPage() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStat[]>([
    { title: 'Total Employers', value: '0', icon: Users, color: 'blue', change: '+0%' },
    { title: 'Total Candidates', value: '0', icon: UserCheck, color: 'green', change: '+0%' },
    { title: 'Verified Records', value: '0', icon: Shield, color: 'purple', change: '+0%' },
    { title: 'Pending Verifications', value: '0', icon: Clock, color: 'yellow', change: '+0%' }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getToken = () => localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')

  const normalizeStatus = (status?: string) => {
    const s = (status || '').toLowerCase()
    if (s === 'active' || s === 'approved') return 'approved'
    if (s === 'suspended') return 'suspended'
    if (s === 'rejected') return 'rejected'
    if (s === 'pending') return 'pending'
    return s
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const token = getToken()
        if (!token) {
          setError('No authentication token found')
          return
        }

        // Fetch all data in parallel
        const [employersRes, candidatesRes, candidateUsersRes, metricsRes] = await Promise.allSettled([
          axios.get(`${API_BASE_URL}/api/admin/employers`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_BASE_URL}/api/admin/candidates`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_BASE_URL}/api/admin/candidate-users`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_BASE_URL}/api/admin/metrics`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ])

        const employers = employersRes.status === 'fulfilled' ? employersRes.value.data : []
        const candidates = candidatesRes.status === 'fulfilled' ? candidatesRes.value.data : []
        const candidateUsers = candidateUsersRes.status === 'fulfilled' ? candidateUsersRes.value.data : []
        const metrics = metricsRes.status === 'fulfilled' ? metricsRes.value.data : null

        const approvedEmployers = Array.isArray(employers) 
          ? employers.filter((emp: any) => normalizeStatus(emp.status) === 'approved').length 
          : 0

        const verifiedUsers = Array.isArray(candidateUsers)
          ? candidateUsers.filter((u: any) => normalizeStatus(u.status) === 'approved').length
          : 0

        const pendingUsers = Array.isArray(candidateUsers)
          ? candidateUsers.filter((u: any) => normalizeStatus(u.status) === 'pending').length
          : 0

        setDashboardStats([
          { 
            title: 'Total Employers', 
            value: metrics?.totalEmployers?.toString() || approvedEmployers.toString(), 
            icon: Users, 
            color: 'blue', 
            change: metrics?.employerGrowth || '+0%' 
          },
          { 
            title: 'Total Candidates', 
            value: metrics?.totalCandidates?.toString() || (Array.isArray(candidates) ? candidates.length.toString() : '0'), 
            icon: UserCheck, 
            color: 'green', 
            change: metrics?.candidateGrowth || '+0%' 
          },
          { 
            title: 'Verified Records', 
            value: metrics?.verifiedRecords?.toString() || verifiedUsers.toString(), 
            icon: Shield, 
            color: 'purple', 
            change: metrics?.verificationGrowth || '+0%' 
          },
          { 
            title: 'Pending Verifications', 
            value: metrics?.pendingVerifications?.toString() || pendingUsers.toString(), 
            icon: Clock, 
            color: 'yellow', 
            change: metrics?.pendingChange || '+0%' 
          }
        ])
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Manage employers, candidates, and system analytics</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs sm:text-sm text-gray-500">{stat.title}</div>
                <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`h-4 w-4 sm:h-5 sm:w-5 text-${stat.color}-600`} />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{loading ? '...' : stat.value}</div>
              
            </div>
          )
        })}
      </div>

      {/* System Health */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-600" />
            System Health Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                Healthy
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Services</span>
              <span className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                Running
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Encryption</span>
              <span className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                Active
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span>New employers registered today</span>
            </div>
            <div className="flex items-center text-sm">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
              <span>Pending verifications</span>
            </div>
            <div className="flex items-center text-sm">
              <Shield className="h-4 w-4 text-blue-500 mr-2" />
              <span>Records verified this week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 sm:mb-10">
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
          <div className="px-4 sm:px-6 py-4 sm:py-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <Link
                href="/admin/dashboard/employers"
                className="p-4 rounded-md bg-blue-50/60 border border-blue-100 hover:bg-blue-50 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-900">Manage Employers</div>
                  <Building2 className="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs sm:text-sm text-gray-600">View and manage employer accounts, approve or reject registrations.</p>
                <div className="mt-2 flex items-center text-xs text-blue-600 group-hover:underline">
                  Go to Employers <ArrowRight className="h-3 w-3 ml-1" />
                </div>
              </Link>

              <Link
                href="/admin/dashboard/candidates"
                className="p-4 rounded-md bg-green-50/60 border border-green-100 hover:bg-green-50 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-900">View Candidates</div>
                  <Users className="h-5 w-5 text-green-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs sm:text-sm text-gray-600">Browse all candidate records submitted by employers.</p>
                <div className="mt-2 flex items-center text-xs text-green-600 group-hover:underline">
                  Go to Candidates <ArrowRight className="h-3 w-3 ml-1" />
                </div>
              </Link>

              <Link
                href="/admin/dashboard/candidate-users"
                className="p-4 rounded-md bg-purple-50/60 border border-purple-100 hover:bg-purple-50 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-900">Candidate Users</div>
                  <UserCheck className="h-5 w-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs sm:text-sm text-gray-600">Manage candidate account approvals and Red-Flagged.</p>
                <div className="mt-2 flex items-center text-xs text-purple-600 group-hover:underline">
                  Go to Users <ArrowRight className="h-3 w-3 ml-1" />
                </div>
              </Link>

              <Link
                href="/admin/dashboard/update-history"
                className="p-4 rounded-md bg-amber-50/60 border border-amber-100 hover:bg-amber-50 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-900">Updated Red-Flagged</div>
                  <Clock className="h-5 w-5 text-amber-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs sm:text-sm text-gray-600">Manage candidate updated Red-Flagged and timeline entries.</p>
                <div className="mt-2 flex items-center text-xs text-amber-600 group-hover:underline">
                  Go to Red-Flagged <ArrowRight className="h-3 w-3 ml-1" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

