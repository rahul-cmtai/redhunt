"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.red-flagged.com'

export default function CandidateLogin() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [remember, setRemember] = useState(false)
  const [agreeDisclaimer, setAgreeDisclaimer] = useState(false)
  const [isMobileDisclaimerExpanded, setIsMobileDisclaimerExpanded] = useState(false)

  const disclaimerPoints = [
    'Information is submitted by companies and may not be accurate or up to date. Red-Flagged.com does not verify the accuracy of any submission.',
    'The platform is provided “as is” without warranties of accuracy, completeness, or usefulness.',
    'Red-Flagged.com shall not be liable for any damages of any kind arising from the use of information on the platform.',
    'Red-Flagged.com does not endorse or verify reports submitted by any company.',
    'You are responsible for your own actions and decisions and should not rely solely on information provided here.'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!agreeDisclaimer) {
      setError('Please read and agree to the disclaimer before continuing.')
      return
    }
    setLoading(true)
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/auth/candidate/login`,
        { email: formData.email.trim().toLowerCase(), password: formData.password },
        { headers: { 'Content-Type': 'application/json' } }
      )
      const token = data?.token || data?.accessToken
      if (token) {
        localStorage.setItem('candidateToken', token)
        sessionStorage.setItem('candidateToken', token)
      }
      router.push('/candidate/dashboard')
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Login failed. Note: Your account must be approved by Admin.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl mx-auto space-y-8 px-4 sm:px-0">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="text-3xl font-bold text-red-600">Red-Flagged</Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Candidate Login</h2>
          <p className="mt-2 text-sm text-gray-600">Approved candidates can sign in to access the dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white py-10 px-8 shadow-lg rounded-lg w-full">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Enter your password"
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
            <div className="space-y-3">
              <label className="flex items-start gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 mt-0.5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  checked={agreeDisclaimer}
                  onChange={(e) => setAgreeDisclaimer(e.target.checked)}
                />
                <span>I agree to the disclaimer and acknowledge that information on Red-Flagged.com is provided by companies and may not be independently verified.</span>
              </label>
              <p className="text-xs text-gray-500">
                Please review the full “Disclaimer for Candidate” section below before confirming.
              </p>
            </div>
            <button type="submit" disabled={loading || !agreeDisclaimer} className="w-full flex justify-center py-2 px-4 rounded-lg text-white bg-red-600 hover:bg-red-700 disabled:opacity-70">
              {loading ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</span> : 'Sign in'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">New to Red-Flagged?</span></div>
            </div>
            <div className="mt-6">
              <Link href="/candidate/register" className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">Sign Up</Link>
            </div>
            <div className="mt-6 space-y-3">
              <div className="hidden sm:block rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-gray-700">
                <p className="font-semibold text-red-700 mb-2">Disclaimer for Candidate:</p>
                <p className="mb-2">
                  By using Red-Flagged.com to view information about companies or reports submitted by companies, you acknowledge and agree to the following:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  {disclaimerPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-gray-600">
                  By accessing this information you confirm you understand and accept these terms.
                </p>
              </div>
              <div className="sm:hidden rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-gray-700">
                <p className="font-semibold text-red-700 mb-2">Disclaimer for Candidate:</p>
                {isMobileDisclaimerExpanded ? (
                  <>
                    <p className="mb-2">
                      By using Red-Flagged.com to view information about companies or reports submitted by companies, you acknowledge and agree to the following:
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                      {disclaimerPoints.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-gray-600">
                      By accessing this information you confirm you understand and accept these terms.
                    </p>
                  </>
                ) : (
                  <p className="text-gray-700">
                    Review Red-Flagged.com candidate terms before accessing company submissions.
                  </p>
                )}
                <button
                  type="button"
                  className="mt-3 text-xs font-semibold text-red-600"
                  onClick={() => setIsMobileDisclaimerExpanded((prev) => !prev)}
                >
                  {isMobileDisclaimerExpanded ? 'Show less' : 'Show more'}
                </button>
              </div>
            </div>
          <p className="mt-4 text-xs font-semibold text-black text-center bg-white border border-red-200 rounded px-3 py-2">
            Offer declined, have you been Red-flagged?
          </p>
          </div>
        </div>

        {/* Trust Messages */}
        <div className="text-center">
          <p className="text-sm text-gray-600">Accounts must be approved by an admin before login.</p>
          <p className="text-sm text-gray-500 mt-2">Your data is encrypted and protected on Red-Flagged.</p>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-red-600"><ArrowRight className="h-4 w-4 mr-1 rotate-180"/>Back to Home</Link>
        </div>
      </div>
    </div>
  )
}


