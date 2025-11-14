"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function EmployerDashboard() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to overview page
    router.replace('/employer/dashboard/overview')
  }, [router])

  return null
}
