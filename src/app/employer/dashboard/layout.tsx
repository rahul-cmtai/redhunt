"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { LogOut, LayoutDashboard, Users, User, Building2, FileText } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function EmployerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [profile, setProfile] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  const getToken = () => localStorage.getItem('employerToken') || sessionStorage.getItem('employerToken')

  const normalizeProfile = (raw: any) => {
    if (!raw) return null
    const employer = raw.employer || raw.user || raw.profile || raw.data || raw
    return {
      name: employer.companyName || employer.name || '',
      id: employer._id || employer.id
    }
  }

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/employer/login')
      return
    }
    setIsAuthenticated(true)
  }, [router])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getToken()
        if (!token) return
        const { data } = await axios.get(`${API_BASE_URL}/api/employer/profile`, { 
          headers: { Authorization: `Bearer ${token}` } 
        })
        setProfile(normalizeProfile(data))
      } catch (err) {
        console.error('Failed to load profile:', err)
      }
    }
    if (isAuthenticated) fetchProfile()
  }, [isAuthenticated])

  const handleLogout = () => {
    localStorage.removeItem('employerToken')
    sessionStorage.removeItem('employerToken')
    router.push('/employer/login')
  }

  const navItems = [
    { href: '/employer/dashboard/overview', label: 'Overview', shortLabel: 'Overview', icon: LayoutDashboard },
    { href: '/employer/dashboard/candidates', label: 'Candidates', shortLabel: 'Candidates', icon: Users },
    { href: '/employer/dashboard/remarks', label: 'Remarks', shortLabel: 'Remarks', icon: FileText },
    { href: '/employer/dashboard/profile', label: 'Profile', shortLabel: 'Profile', icon: User }
  ]

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
              <span className="hidden sm:inline ml-3 text-xs text-gray-500">Employer Portal</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-xs sm:text-sm text-gray-600 truncate">
                <span className="hidden sm:inline">Welcome, </span>
                <span className="font-semibold text-gray-900">{profile?.name || 'Employer'}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-600 p-1.5 sm:p-2 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Bar */}
      <div className="border-b border-gray-200 bg-white sticky top-14 sm:top-16 z-30">
        <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8">
          <nav className="flex overflow-x-auto no-scrollbar" aria-label="Tabs" style={{ WebkitOverflowScrolling: 'touch' }}>
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-center whitespace-nowrap px-2.5 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-sm font-medium border-b-2 -mb-px transition-colors flex-shrink-0 min-w-fit ${
                    isActive
                      ? 'border-red-600 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden">{item.shortLabel}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {children}
      </main>
    </div>
  )
}

