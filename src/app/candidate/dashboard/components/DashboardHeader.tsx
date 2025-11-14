"use client"

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LogOut, LayoutDashboard, Briefcase, User, Activity } from 'lucide-react'

interface DashboardHeaderProps {
  profileName?: string
}

export default function DashboardHeader({ profileName }: DashboardHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem('candidateToken')
    sessionStorage.removeItem('candidateToken')
    router.push('/candidate/login')
  }

  const navItems = [
    { href: '/candidate/dashboard/overview', label: 'Overview', icon: LayoutDashboard },
    { href: '/candidate/dashboard/offers', label: 'Offers', icon: Briefcase },
    { href: '/candidate/dashboard/profile', label: 'Profile', icon: User },
    { href: '/candidate/dashboard/status', label: 'Status', icon: Activity }
  ]

  return (
    <header className="border-b bg-white/70 backdrop-blur sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center min-w-0">
            <Link href="/" className="text-lg sm:text-xl font-bold text-red-600">Red-Flagged</Link>
            <span className="hidden sm:inline ml-3 text-xs text-gray-500">Candidate Portal</span>
          </div>
          
          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="text-xs sm:text-sm text-gray-600 truncate">
              <span className="hidden sm:inline">Welcome, </span>
              <span className="font-semibold text-gray-900">{profileName || 'Candidate'}</span>
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

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3 border-t border-gray-200 mt-2">
          <nav className="flex overflow-x-auto space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}

