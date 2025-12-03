'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.red-flagged.com'

// Block common free email providers to enforce corporate/work emails
const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.co.in',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',
  'icloud.com',
  'me.com',
  'aol.com',
  'proton.me',
  'protonmail.com',
  'yandex.com',
  'zoho.com',
  'gmx.com',
  'mail.com',
  'inbox.com',
  'rediffmail.com',
  'qq.com',
  '163.com',
  'hey.com',
  'duck.com'
])

function isCorporateEmail(email: string): boolean {
  const trimmed = email.trim()
  const atIndex = trimmed.lastIndexOf('@')
  if (atIndex === -1) return false
  const domain = trimmed.slice(atIndex + 1).toLowerCase()
  if (!domain) return false
  if (FREE_EMAIL_DOMAINS.has(domain)) return false
  // Basic domain shape like company.com or sub.company.co.in
  const domainLooksValid = /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)
  return domainLooksValid
}

export default function EmployerRegister() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOtpStep, setIsOtpStep] = useState(false)
  const [otp, setOtp] = useState('')
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [checkingDuplicates, setCheckingDuplicates] = useState<Record<string, boolean>>({})

  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    panNumber: '',
    hrFirstName: '',
    hrLastName: '',
    designation: '',
    contactNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // Check for duplicate email, mobile, PAN
  const checkDuplicate = async (field: string, value: string) => {
    if (!value || !value.trim()) return null
    
    setCheckingDuplicates(prev => ({ ...prev, [field]: true }))
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/employer/check-duplicate`,
        { field, value: value.trim() },
        { headers: { 'Content-Type': 'application/json' } }
      )
      if (response.data.exists) {
        setFieldErrors(prev => ({
          ...prev,
          [field]: `${field === 'email' ? 'Email' : field === 'contactNumber' ? 'Mobile number' : 'PAN'} already exists. Please use a different one.`
        }))
        return true
      } else {
        setFieldErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
        return false
      }
    } catch (err: any) {
      // If endpoint doesn't exist, skip duplicate check
      console.log('Duplicate check endpoint not available')
      return false
    } finally {
      setCheckingDuplicates(prev => ({ ...prev, [field]: false }))
    }
  }

  // Real-time field validation
  const validateField = (field: string, value: string) => {
    const trimmedValue = value.trim()
    let error = ''

    switch (field) {
      case 'companyName':
        if (!trimmedValue) error = 'Company name is required'
        break
      case 'address':
        if (!trimmedValue) error = 'Company address is required'
        break
      case 'panNumber':
        if (!trimmedValue) {
          error = 'PAN number is required'
        } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(trimmedValue)) {
          error = 'Enter a valid PAN number (e.g., ABCDE1234F)'
        }
        break
      case 'hrFirstName':
        if (!trimmedValue) error = 'First name is required'
        break
      case 'hrLastName':
        if (!trimmedValue) error = 'Last name is required'
        break
      case 'designation':
        if (!trimmedValue) error = 'Designation is required'
        break
      case 'contactNumber':
        if (!trimmedValue) {
          error = 'Mobile number is required'
        } else if (!/^[0-9+\-()\s]{7,20}$/.test(trimmedValue)) {
          error = 'Enter a valid mobile number (7-20 digits)'
        }
        break
      case 'email':
        if (!trimmedValue) {
          error = 'Corporate email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
          error = 'Enter a valid email address'
        } else if (!isCorporateEmail(trimmedValue)) {
          error = 'Please use your corporate work email (e.g., name@yourcompany.com)'
        }
        break
      case 'password':
        if (!value) {
          error = 'Password is required'
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters'
        }
        break
      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password'
        } else if (value !== formData.password) {
          error = 'Passwords do not match'
        }
        break
    }

    if (error) {
      setFieldErrors(prev => ({ ...prev, [field]: error }))
    } else {
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    return !error
  }

  // Handle field change with validation
  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      // If password changes, re-validate confirmPassword
      if (field === 'password' && prev.confirmPassword) {
        if (prev.confirmPassword !== value) {
          setFieldErrors(prevErrors => ({ ...prevErrors, confirmPassword: 'Passwords do not match' }))
        } else {
          setFieldErrors(prevErrors => {
            const newErrors = { ...prevErrors }
            delete newErrors.confirmPassword
            return newErrors
          })
        }
      }
      return newData
    })
    setError(null)
    
    // Validate immediately
    validateField(field, value)
  }

  // Handle field blur with duplicate check
  const handleFieldBlur = async (field: string, value: string) => {
    validateField(field, value)
    
    // Check duplicates for specific fields
    if (field === 'email' && value.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) && isCorporateEmail(value.trim())) {
      await checkDuplicate('email', value)
    } else if (field === 'contactNumber' && value.trim() && /^[0-9+\-()\s]{7,20}$/.test(value.trim())) {
      await checkDuplicate('contactNumber', value)
    } else if (field === 'panNumber' && value.trim() && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(value.trim())) {
      await checkDuplicate('panNumber', value)
    }
  }

  const validate = () => {
    if (!formData.companyName.trim()) return 'Company name is required'
    if (!formData.address.trim()) return 'Company address is required'
    if (!formData.panNumber.trim()) return 'PAN number is required'
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.trim())) return 'Enter a valid PAN number (e.g., ABCDE1234F)'
    if (!formData.hrFirstName.trim()) return 'Your first name is required'
    if (!formData.hrLastName.trim()) return 'Your last name is required'
    if (!formData.designation.trim()) return 'Designation is required'
    if (!formData.contactNumber.trim()) return 'Mobile number is required'
    if (!/^[0-9+\-()\s]{7,20}$/.test(formData.contactNumber.trim())) return 'Enter a valid mobile number'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Enter a valid corporate email'
    if (!isCorporateEmail(formData.email)) return 'Please use your corporate work email (e.g., name@yourcompany.com)'
    if (formData.password.length < 6) return 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    
    // Validate all fields before submitting
    const fields = ['companyName', 'address', 'panNumber', 'hrFirstName', 'hrLastName', 'designation', 'contactNumber', 'email', 'password', 'confirmPassword']
    let hasError = false
    fields.forEach(field => {
      const value = formData[field as keyof typeof formData] as string
      if (!validateField(field, value || '')) {
        hasError = true
      }
    })
    
    if (hasError) {
      setError('Please fix the errors in the form before submitting')
      return
    }
    
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setIsSubmitting(true)
    try {   
      const hrFullName = `${formData.hrFirstName.trim()} ${formData.hrLastName.trim()}`.trim()
      const { data } = await axios.post(
        `${API_BASE_URL}/api/auth/employer/register`,
        {
          companyName: formData.companyName.trim(),
          address: formData.address.trim(),
          panNumber: formData.panNumber.trim(),
          hrFirstName: formData.hrFirstName.trim(),
          hrLastName: formData.hrLastName.trim(),
          hrName: hrFullName,
          designation: formData.designation.trim(),
          contactNumber: formData.contactNumber.trim(),
          email: formData.email.trim(),
          password: formData.password,
          // Helpful defaults and aliases in case backend expects them
          status: 'pending',
          role: 'employer',
          // Aliases: some backends might use these keys instead
          hrContact: hrFullName,
          phone: formData.contactNumber.trim(),
          company: formData.companyName.trim()
        },
        { headers: { 'Content-Type': 'application/json' } }
      )
      // Move to OTP step after successful registration
      setIsOtpStep(true)
      setSuccess('Account created. OTP sent to your corporate email. After OTP verification and admin approval, you will be able to login.')
      return data
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Registration failed'
      const conflicts = err?.response?.data?.conflicts || []
      
      // Handle duplicate field errors
      if (conflicts.length > 0 || message.includes('already exists') || message.includes('Already registered')) {
        conflicts.forEach((field: string) => {
          if (field === 'email') {
            setFieldErrors(prev => ({ ...prev, email: 'This email is already registered' }))
          } else if (field === 'mobile' || field === 'contactNumber' || field === 'phone') {
            setFieldErrors(prev => ({ ...prev, contactNumber: 'This mobile number is already registered' }))
          } else if (field === 'pan' || field === 'panNumber') {
            setFieldErrors(prev => ({ ...prev, panNumber: 'This PAN number is already registered' }))
          }
        })
        
        // Scroll to first error field
        const firstErrorField = conflicts[0] || 'email'
        const fieldMap: Record<string, string> = {
          email: 'email',
          mobile: 'contactNumber',
          contactNumber: 'contactNumber',
          phone: 'contactNumber',
          pan: 'panNumber',
          panNumber: 'panNumber'
        }
        const fieldName = fieldMap[firstErrorField] || 'email'
        const element = document.getElementById(fieldName)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          element.focus()
        }
      }
      
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!otp || otp.trim().length < 4) {
      setError('Enter the OTP sent to your email')
      return
    }
    setIsSubmitting(true)
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/verify-email`,
        { role: 'employer', email: formData.email.trim(), otp: otp.trim() },
        { headers: { 'Content-Type': 'application/json' } }
      )
      if (res?.data?.emailVerified) {
        setSuccess('Email verified successfully. Your account is pending admin approval. You will be notified once approved.')
        setTimeout(() => router.push('/employer/login'), 2000)
      } else {
        setError('Verification failed. Please check the OTP and try again.')
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'OTP verification failed'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendOtp = async () => {
    setError(null)
    setSuccess(null)
    setIsResending(true)
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/resend-otp`,
        { role: 'employer', email: formData.email.trim() },
        { headers: { 'Content-Type': 'application/json' } }
      )
      if (res?.data?.emailVerified) {
        setSuccess('Email already verified. Your account is pending admin approval.')
        setTimeout(() => router.push('/employer/login'), 1000)
      } else if (res?.data?.sent) {
        setSuccess('OTP resent to your corporate email. Please check your inbox (and spam).')
      } else {
        setSuccess('If the email exists, a new OTP has been sent.')
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to resend OTP'
      setError(message)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="text-3xl font-bold text-red-600">
            Red-Flagged
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            HR Panel Registration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Register your company to start hiring with confidence
          </p>
        </div>

        {/* Register / OTP Form */}
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

          {!isOtpStep ? (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Company Name *
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => handleFieldChange('companyName', e.target.value)}
                onBlur={(e) => validateField('companyName', e.target.value)}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm ${fieldErrors.companyName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Your Company Pvt Ltd"
              />
              {fieldErrors.companyName && <p className="mt-1 text-xs text-red-600">{fieldErrors.companyName}</p>}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Company Address *
              </label>
              <textarea
                id="address"
                name="address"
                required
                rows={3}
                value={formData.address}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                onBlur={(e) => validateField('address', e.target.value)}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm ${fieldErrors.address ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Complete company address with city, state, and pincode"
              />
              {fieldErrors.address && <p className="mt-1 text-xs text-red-600">{fieldErrors.address}</p>}
            </div>

            <div>
              <label htmlFor="panNumber" className="block text-sm font-medium text-gray-700">
                PAN Number of the Company *
              </label>
              <input
                id="panNumber"
                name="panNumber"
                type="text"
                required
                value={formData.panNumber}
                onChange={(e) => handleFieldChange('panNumber', e.target.value.toUpperCase())}
                onBlur={(e) => handleFieldBlur('panNumber', e.target.value)}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm uppercase ${fieldErrors.panNumber ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="ABCDE1234F"
                maxLength={10}
              />
              {checkingDuplicates.panNumber && <p className="mt-1 text-xs text-gray-500">Checking...</p>}
              {fieldErrors.panNumber && <p className="mt-1 text-xs text-red-600">{fieldErrors.panNumber}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="hrFirstName" className="block text-sm font-medium text-gray-700">
                  Your First Name *
                </label>
                <input
                  id="hrFirstName"
                  name="hrFirstName"
                  type="text"
                  required
                  value={formData.hrFirstName}
                  onChange={(e) => handleFieldChange('hrFirstName', e.target.value)}
                  onBlur={(e) => validateField('hrFirstName', e.target.value)}
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm ${fieldErrors.hrFirstName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Suresh"
                />
                {fieldErrors.hrFirstName && <p className="mt-1 text-xs text-red-600">{fieldErrors.hrFirstName}</p>}
              </div>
              <div>
                <label htmlFor="hrLastName" className="block text-sm font-medium text-gray-700">
                  Your Last Name *
                </label>
                <input
                  id="hrLastName"
                  name="hrLastName"
                  type="text"
                  required
                  value={formData.hrLastName}
                  onChange={(e) => handleFieldChange('hrLastName', e.target.value)}
                  onBlur={(e) => validateField('hrLastName', e.target.value)}
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm ${fieldErrors.hrLastName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Nair"
                />
                {fieldErrors.hrLastName && <p className="mt-1 text-xs text-red-600">{fieldErrors.hrLastName}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
                  Designation *
                </label>
                <input
                  id="designation"
                  name="designation"
                  type="text"
                  required
                  value={formData.designation}
                  onChange={(e) => handleFieldChange('designation', e.target.value)}
                  onBlur={(e) => validateField('designation', e.target.value)}
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm ${fieldErrors.designation ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="HR Manager"
                />
                {fieldErrors.designation && <p className="mt-1 text-xs text-red-600">{fieldErrors.designation}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                Mobile Number *
              </label>
              <input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                required
                value={formData.contactNumber}
                onChange={(e) => handleFieldChange('contactNumber', e.target.value)}
                onBlur={(e) => handleFieldBlur('contactNumber', e.target.value)}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm ${fieldErrors.contactNumber ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="+91 98765 43210"
              />
              {checkingDuplicates.contactNumber && <p className="mt-1 text-xs text-gray-500">Checking...</p>}
              {fieldErrors.contactNumber && <p className="mt-1 text-xs text-red-600">{fieldErrors.contactNumber}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Corporate Mail ID *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                onBlur={(e) => handleFieldBlur('email', e.target.value)}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="hr@yourcompany.com"
              />
              {checkingDuplicates.email && <p className="mt-1 text-xs text-gray-500">Checking...</p>}
              {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={(e) => handleFieldChange('password', e.target.value)}
                  onBlur={(e) => validateField('password', e.target.value)}
                  className={`appearance-none relative block w-full px-3 py-2 pr-10 border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'}`}
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
              {fieldErrors.password && <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password *
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                  onBlur={(e) => validateField('confirmPassword', e.target.value)}
                  className={`appearance-none relative block w-full px-3 py-2 pr-10 border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
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
              {fieldErrors.confirmPassword && <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>}
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
          ) : (
          <form className="space-y-6" onSubmit={handleVerifyOtp}>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{4,6}"
                placeholder="6-digit code"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm tracking-widest"
              />
              <p className="mt-2 text-xs text-gray-500">We sent the code to {formData.email}.</p>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending}
                className="text-sm text-red-600 hover:text-red-700 disabled:opacity-70"
              >
                {isResending ? 'Resending…' : 'Resend OTP'}
              </button>
            </div>
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
                  </span>
                ) : (
                  'Verify Email'
                )}
              </button>
            </div>
          </form>
          )}

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
            Data shared on Red-Flagged is encrypted and visible only to verified HR professionals.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            After OTP verification and admin approval, you can access the HR Panel to hire with confidence.
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


