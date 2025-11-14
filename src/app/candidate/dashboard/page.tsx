"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CandidateDashboard() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to overview page
    router.replace('/candidate/dashboard/overview')
  }, [router])

  return null
}


