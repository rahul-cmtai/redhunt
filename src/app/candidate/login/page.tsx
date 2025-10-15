'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function CandidateLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/candidate/login`, { email: email.trim(), password }, { headers: { 'Content-Type': 'application/json' } })
      const token = data?.token || data?.accessToken
      if (token) {
        localStorage.setItem('candidateToken', token)
        sessionStorage.setItem('candidateToken', token)
      }
      router.push('/candidate/dashboard')
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Login failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Candidate Login</h1>
        {error && <div className="mb-3 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-70">{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
        <div className="mt-4 text-sm text-gray-600">New here? <Link className="text-red-600 hover:text-red-700" href="/candidate/register">Create account</Link></div>
      </div>
    </div>
  )
}


