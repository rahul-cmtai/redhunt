'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboardRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/admin/dashboard/overview')
  }, [router])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
      <div className="text-gray-600">Redirecting...</div>
    </div>
  )
}
