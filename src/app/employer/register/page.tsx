'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function EmployerRegister() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    hrName: '',
    contactNumber: '',
    email: '',
    companyCode: '',
    password: '',
    confirmPassword: ''
  })

  const validate = () => {
    if (!formData.companyName.trim()) return 'Company name is required'
    if (!formData.industry.trim()) return 'Industry is required'
    if (!formData.hrName.trim()) return 'HR name is required'
    if (!formData.contactNumber.trim()) return 'Contact number is required'
    if (!/^[0-9+\-()\s]{7,20}$/.test(formData.contactNumber.trim())) return 'Enter a valid contact number'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Enter a valid email'
    if (!formData.companyCode.trim()) return 'Company code is required'
    if (formData.password.length < 6) return 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setIsSubmitting(true)
    try {   
      const { data } = await axios.post(
        `${API_BASE_URL}/api/auth/employer/register`,
        {
          companyName: formData.companyName.trim(),
          industry: formData.industry.trim(),
          hrName: formData.hrName.trim(),
          contactNumber: formData.contactNumber.trim(),
          email: formData.email.trim(),
          companyCode: formData.companyCode.trim(),
          password: formData.password,
          // Helpful defaults and aliases in case backend expects them
          status: 'pending',
          role: 'employer',
          // Aliases: some backends might use these keys instead
          hrContact: formData.hrName.trim(),
          phone: formData.contactNumber.trim(),
          company: formData.companyName.trim()
        },
        { headers: { 'Content-Type': 'application/json' } }
      )
      // Try to get a token from registration response or via login
      let token = (data && (data.token || data.accessToken)) as string | undefined
      if (!token) {
        try {
          const loginRes = await axios.post(
            `${API_BASE_URL}/api/auth/employer/login`,
            { email: formData.email.trim(), password: formData.password },
            { headers: { 'Content-Type': 'application/json' } }
          )
          token = loginRes?.data?.token || loginRes?.data?.accessToken
        } catch (e) {
          // proceed without profile auto-fill if login fails silently
        }
      }

      // If we have a token, immediately persist the profile details
      if (token) {
        try {
          await axios.put(
            `${API_BASE_URL}/api/employer/profile`,
            {
              companyName: formData.companyName.trim(),
              industry: formData.industry.trim(),
              hrName: formData.hrName.trim(),
              contactNumber: formData.contactNumber.trim(),
              email: formData.email.trim(),
              companyCode: formData.companyCode.trim()
            },
            { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
          )
        } catch (e) {
          // If profile update fails, still consider registration successful
        }
      }

      setSuccess('Account created successfully.')
      setTimeout(() => router.push('/employer/login'), 1200)
      return data
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Registration failed'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="text-3xl font-bold text-red-600">
            RedHunt
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create Employer Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Start hiring with confidence
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {success}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Your Company Pvt Ltd"
              />
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                Industry
              </label>
              <input
                id="industry"
                name="industry"
                type="text"
                required
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="IT / Software"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="hrName" className="block text-sm font-medium text-gray-700">
                  HR Contact Name
                </label>
                <input
                  id="hrName"
                  name="hrName"
                  type="text"
                  required
                  value={formData.hrName}
                  onChange={(e) => setFormData({ ...formData, hrName: e.target.value })}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                  placeholder="Suresh Nair"
                />
              </div>
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  id="contactNumber"
                  name="contactNumber"
                  type="tel"
                  required
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Work Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="hr@yourcompany.com"
              />
            </div>

            <div>
              <label htmlFor="companyCode" className="block text-sm font-medium text-gray-700">
                Company Code
              </label>
              <input
                id="companyCode"
                name="companyCode"
                type="text"
                required
                value={formData.companyCode}
                onChange={(e) => setFormData({ ...formData, companyCode: e.target.value })}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="RLT-09235"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Creating account...
                  </span>
                ) : (
                  'Create account'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/employer/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Messages */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Data shared on RedHunt is encrypted and visible only to verified employers.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            RedHunt helps you hire with confidence, backed by truth.
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-red-600"
          >
            <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}


