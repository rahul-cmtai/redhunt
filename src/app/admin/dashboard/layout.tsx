"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { LogOut, LayoutDashboard, Building2, Users, UserCheck, FileText, Bell, Mail, BookOpen } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.red-flagged.com'

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [profile, setProfile] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [notifications, setNotifications] = useState<any[]>([])

  const getToken = () => localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/admin/login')
      return
    }
    setIsAuthenticated(true)
    
    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem('adminNotifications')
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications))
      } catch (e) {
        console.error('Failed to load notifications', e)
      }
    }
  }, [router])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getToken()
        if (!token) return
        // Admin profile endpoint - adjust if needed
        const { data } = await axios.get(`${API_BASE_URL}/api/admin/profile`, { 
          headers: { Authorization: `Bearer ${token}` } 
        })
        setProfile(data || { name: 'Admin' })
      } catch (err) {
        // If profile endpoint doesn't exist, just set default
        setProfile({ name: 'Admin' })
      }
    }
    if (isAuthenticated) fetchProfile()
  }, [isAuthenticated])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    sessionStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  const navItems = [
    { href: '/admin/dashboard/overview', label: 'Dashboard', shortLabel: 'Home', icon: LayoutDashboard },
    { href: '/admin/dashboard/employers', label: 'Employers', shortLabel: 'Employers', icon: Building2 },
    { href: '/admin/dashboard/candidates', label: 'Candidates added by Employer', shortLabel: 'Candidates added by Employer', icon: Users },
    { href: '/admin/dashboard/candidate-users', label: 'Registered Candidates', shortLabel: 'Registered Candidates', icon: UserCheck },
    { href: '/admin/dashboard/update-history', label: 'Updated Red-Flagged', shortLabel: 'Red-Flagged', icon: FileText },
    { href: '/admin/dashboard/contact-leads', label: 'Contact Leads', shortLabel: 'Contact', icon: Mail },
    { href: '/admin/dashboard/blogs', label: 'Blogs', shortLabel: 'Blogs', icon: BookOpen },
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
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 truncate">
              <span>
                <span className="hidden sm:inline">Welcome, </span>
                <span className="font-semibold text-gray-900">{profile?.name || 'Admin'}</span>
              </span>
              <span className="inline-block border-l border-gray-300 h-5 mx-2"></span>
              <span className="text-[11px] sm:text-xs text-gray-500 font-normal">Admin Console</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              
              <button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors flex items-center gap-1.5 text-[11px] sm:text-xs font-medium shadow-sm"
                title="You want to logout?"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Logout</span>
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

