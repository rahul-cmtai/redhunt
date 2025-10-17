'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, CheckCircle2, Loader2, ArrowRight } from 'lucide-react'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function CandidateRegister() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [awaitingOtp, setAwaitingOtp] = useState(false)
  const [otp, setOtp] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    pan: '',
    uan: '',
    password: '',
    confirmPassword: ''
  })

  const validate = () => {
    if (!formData.fullName.trim()) return 'Full name is required'
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) return 'Enter a valid email'
    if (!formData.pan.trim()) return 'PAN is required'
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan.toUpperCase())) return 'Enter a valid PAN (e.g., ABCDE1234F)'
    if (formData.uan && !/^UAN-\d{5}$/.test(formData.uan.toUpperCase())) return 'Enter a valid UAN (e.g., UAN-12345)'
    if (formData.password.length < 6) return 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    const validationError = validate()
    if (validationError) { setError(validationError); return }
    setIsSubmitting(true)
    try {
      await axios.post(
        `${API_BASE_URL}/api/auth/candidate/register`,
        {
          // Minimal payload per API contract + backend-required extras
          name: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          pan: formData.pan.trim().toUpperCase(),
          // Optional extras (ignored if backend doesn't use them)
          uan: formData.uan?.trim().toUpperCase() || undefined,
          phone: formData.phone?.trim() || undefined
        },
        { headers: { 'Content-Type': 'application/json' } }
      )
      setSuccess('Account created. Enter the OTP sent to your email to verify.')
      setAwaitingOtp(true)
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Registration failed'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    const cleanedOtp = otp.trim()
    if (!/^\d{6}$/.test(cleanedOtp)) {
      setError('Enter the 6-digit OTP sent to your email')
      return
    }
    setVerifying(true)
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/auth/verify-email`,
        { role: 'candidate', email: formData.email.trim().toLowerCase(), otp: cleanedOtp },
        { headers: { 'Content-Type': 'application/json' } }
      )
      if (data?.emailVerified) {
        setSuccess('Email verified. Redirecting to sign in...')
      } else {
        setSuccess('Email verified. Redirecting to sign in...')
      }
      setTimeout(() => router.push('/candidate/login'), 1200)
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'OTP verification failed'
      setError(message)
    } finally {
      setVerifying(false)
    }
  }

  const handleResendOtp = async () => {
    setError(null)
    setSuccess(null)
    setResending(true)
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/auth/resend-otp`,
        { role: 'candidate', email: formData.email.trim().toLowerCase() },
        { headers: { 'Content-Type': 'application/json' } }
      )
      if (data?.sent) {
        setSuccess('OTP resent. Please check your email.')
      } else {
        setSuccess('OTP resent. Please check your email.')
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to resend OTP'
      setError(message)
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="text-3xl font-bold text-red-600">RedHunt</Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create Candidate Account</h2>
          <p className="mt-2 text-sm text-gray-600">Get started with your job journey</p>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}
          {success && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />{success}
            </div>
          )}

          {!awaitingOtp ? (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="e.g. John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone (optional)</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="+91 98765 43210"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">PAN (required)</label>
                <input
                  type="text"
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="ABCDE1234F"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">UAN (optional)</label>
                <input
                  type="text"
                  value={formData.uan}
                  onChange={(e) => setFormData({ ...formData, uan: e.target.value.toUpperCase() })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="UAN-12345"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Create a password"
                  required
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="mt-1 relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Re-enter your password"
                  required
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-2 px-4 rounded-lg text-white bg-red-600 hover:bg-red-700 disabled:opacity-70">
              {isSubmitting ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</span> : 'Create account'}
            </button>
          </form>
          ) : (
          <form className="space-y-4" onSubmit={handleVerifyOtp}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm tracking-widest text-center"
                placeholder="6-digit code"
                required
              />
              <p className="mt-2 text-xs text-gray-600">We&apos;ve sent the code to {formData.email}.</p>
            </div>
            <div className="flex items-center justify-between gap-3">
              <button type="submit" disabled={verifying} className="flex-1 flex justify-center py-2 px-4 rounded-lg text-white bg-red-600 hover:bg-red-700 disabled:opacity-70">
                {verifying ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Verifying...</span> : 'Verify & Continue'}
              </button>
              <button type="button" onClick={handleResendOtp} disabled={resending} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-70">
                {resending ? 'Resending...' : 'Resend OTP'}
              </button>
            </div>
          </form>
          )}

          <div className="mt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"/></div>
              <div className="relative inline-block bg-white px-2 text-sm text-gray-500">Already have an account?</div>
            </div>
            <div className="mt-4">
              <Link href="/candidate/login" className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">Sign in</Link>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-red-600"><ArrowRight className="h-4 w-4 mr-1 rotate-180"/>Back to Home</Link>
        </div>
      </div>
    </div>
  )
}


