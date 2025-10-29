'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, CheckCircle2, Loader2, ArrowRight, Calendar, MapPin, Building, GraduationCap, Briefcase } from 'lucide-react'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Dropdown options
const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' }
]

const SECTOR_OPTIONS = [
  { value: 'it', label: 'IT / Software' },
  { value: 'fmcg', label: 'FMCG' },
  { value: 'banking', label: 'Banking & Finance' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'retail', label: 'Retail' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'telecom', label: 'Telecom' },
  { value: 'education', label: 'Education' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'logistics', label: 'Logistics & Supply Chain' },
  { value: 'media', label: 'Media & Entertainment' },
  { value: 'pharmaceuticals', label: 'Pharmaceuticals' },
  { value: 'energy', label: 'Energy & Utilities' },
  { value: 'other', label: 'Other' }
]

const SKILLS_OPTIONS = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'react', label: 'React' },
  { value: 'angular', label: 'Angular' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'php', label: 'PHP' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'sql', label: 'SQL' },
  { value: 'mongodb', label: 'MongoDB' },
  { value: 'aws', label: 'AWS' },
  { value: 'azure', label: 'Azure' },
  { value: 'docker', label: 'Docker' },
  { value: 'kubernetes', label: 'Kubernetes' },
  { value: 'devops', label: 'DevOps' },
  { value: 'machine-learning', label: 'Machine Learning' },
  { value: 'data-analysis', label: 'Data Analysis' },
  { value: 'project-management', label: 'Project Management' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Finance' },
  { value: 'accounting', label: 'Accounting' },
  { value: 'design', label: 'Design' },
  { value: 'ui-ux', label: 'UI/UX Design' },
  { value: 'content-writing', label: 'Content Writing' },
  { value: 'digital-marketing', label: 'Digital Marketing' },
  { value: 'other', label: 'Other' }
]

const QUALIFICATION_OPTIONS = [
  { value: 'high-school', label: 'High School' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'bachelor', label: 'Bachelor\'s Degree' },
  { value: 'master', label: 'Master\'s Degree' },
  { value: 'phd', label: 'PhD' },
  { value: 'mba', label: 'MBA' },
  { value: 'other', label: 'Other' }
]

const RELOCATION_OPTIONS = [
  { value: 'yes', label: 'Yes, open to relocation' },
  { value: 'no', label: 'No, not open to relocation' },
  { value: 'maybe', label: 'Maybe, depends on opportunity' }
]

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
  const [isInvited, setIsInvited] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    fathersName: '',
    gender: '',
    dob: '',
    permanentAddress: '',
    currentAddress: '',
    mobileNumber: '',
    primaryEmail: '',
    secondaryEmail: '',
    
    // Professional Information
    panNumber: '',
    uanNumber: '',
    highestQualification: '',
    workExperience: '',
    sector: '',
    presentCompany: '',
    designation: '',
    latestRating: '',
    workLocation: '',
    openToRelocation: '',
    currentCtc: '',
    expectedHikePercentage: '',
    noticePeriod: '',
    negotiableDays: '',
    skillSets: [] as string[],
    
    // Account Information
    password: '',
    confirmPassword: ''
  })

  // Check for invitation parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const email = urlParams.get('email')
    const invited = urlParams.get('invited')
    
    if (email && invited === 'true') {
      setFormData(prev => ({ ...prev, primaryEmail: decodeURIComponent(email) }))
      setIsInvited(true)
    }
  }, [])

  const validateStep1 = () => {
    if (!formData.name.trim()) return 'Name is required'
    if (!formData.fathersName.trim()) return 'Father\'s name is required'
    if (!formData.gender) return 'Gender is required'
    if (!formData.dob) return 'Date of birth is required'
    if (!formData.permanentAddress.trim()) return 'Permanent address is required'
    if (!formData.currentAddress.trim()) return 'Current address is required'
    if (!formData.mobileNumber.trim()) return 'Mobile number is required'
    if (!/^[0-9+\-()\s]{10,15}$/.test(formData.mobileNumber.trim())) return 'Enter a valid mobile number'
    if (!formData.primaryEmail.trim()) return 'Primary email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.primaryEmail)) return 'Enter a valid primary email'
    if (formData.secondaryEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.secondaryEmail)) return 'Enter a valid secondary email'
    return null
  }

  const validateStep2 = () => {
    if (!formData.panNumber.trim()) return 'PAN number is required'
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.toUpperCase())) return 'Enter a valid PAN (e.g., ABCDE1234F)'
    if (formData.uanNumber && !/^[0-9]{12}$/.test(formData.uanNumber)) return 'Enter a valid UAN (12 digits)'
    if (!formData.highestQualification) return 'Highest qualification is required'
    if (!formData.workExperience.trim()) return 'Work experience is required'
    if (!/^[0-9]+(\.[0-9]+)?$/.test(formData.workExperience)) return 'Enter valid work experience in years'
    if (!formData.sector) return 'Sector is required'
    if (!formData.presentCompany.trim()) return 'Present company is required'
    if (!formData.designation.trim()) return 'Designation is required'
    if (!formData.workLocation.trim()) return 'Work location is required'
    if (!formData.openToRelocation) return 'Relocation preference is required'
    if (!formData.currentCtc.trim()) return 'Current CTC is required'
    if (!formData.expectedHikePercentage.trim()) return 'Expected hike percentage is required'
    if (!formData.noticePeriod.trim()) return 'Notice period is required'
    if (!formData.negotiableDays.trim()) return 'Negotiable days is required'
    if (formData.skillSets.length === 0) return 'At least one skill set is required'
    return null
  }

  const validateStep3 = () => {
    if (formData.password.length < 6) return 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match'
    return null
  }

  const handleNext = () => {
    setError(null)
    let validationError = null
    
    if (currentStep === 1) {
      validationError = validateStep1()
    } else if (currentStep === 2) {
      validationError = validateStep2()
    }
    
    if (validationError) {
      setError(validationError)
      return
    }
    
    setCurrentStep(currentStep + 1)
  }

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    
    const validationError = validateStep3()
    if (validationError) {
      setError(validationError)
      return
    }
    
    setIsSubmitting(true)
    try {
      await axios.post(
        `${API_BASE_URL}/api/auth/candidate/register`,
        {
          // Personal Information
          name: formData.name.trim(),
          fathersName: formData.fathersName.trim(),
          gender: formData.gender,
          dob: formData.dob,
          permanentAddress: formData.permanentAddress.trim(),
          currentAddress: formData.currentAddress.trim(),
          mobileNumber: formData.mobileNumber.trim(),
          primaryEmail: formData.primaryEmail.trim().toLowerCase(),
          secondaryEmail: formData.secondaryEmail?.trim().toLowerCase() || undefined,
          
          // Professional Information
          panNumber: formData.panNumber.trim().toUpperCase(),
          uanNumber: formData.uanNumber?.trim() || undefined,
          highestQualification: formData.highestQualification,
          workExperience: parseFloat(formData.workExperience),
          sector: formData.sector,
          presentCompany: formData.presentCompany.trim(),
          designation: formData.designation.trim(),
          latestRating: formData.latestRating?.trim() || undefined,
          workLocation: formData.workLocation.trim(),
          openToRelocation: formData.openToRelocation,
          currentCtc: formData.currentCtc.trim(),
          expectedHikePercentage: formData.expectedHikePercentage.trim(),
          noticePeriod: formData.noticePeriod.trim(),
          negotiableDays: formData.negotiableDays.trim(),
          skillSets: formData.skillSets,
          
          // Account Information
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          
          // Additional fields for backend compatibility
          email: formData.primaryEmail.trim().toLowerCase(),
          phone: formData.mobileNumber.trim(),
          pan: formData.panNumber.trim().toUpperCase(),
          uan: formData.uanNumber?.trim() || undefined
        },
        { headers: { 'Content-Type': 'application/json' } }
      )
      setSuccess('Account created. Enter the OTP sent to your primary email to verify.')
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
      setError('Enter the 6-digit OTP sent to your primary email')
      return
    }
    setVerifying(true)
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/auth/verify-email`,
        { role: 'candidate', email: formData.primaryEmail.trim().toLowerCase(), otp: cleanedOtp },
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
        { role: 'candidate', email: formData.primaryEmail.trim().toLowerCase() },
        { headers: { 'Content-Type': 'application/json' } }
      )
      if (data?.sent) {
        setSuccess('OTP resent. Please check your primary email.')
      } else {
        setSuccess('OTP resent. Please check your primary email.')
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to resend OTP'
      setError(message)
    } finally {
      setResending(false)
    }
  }

  const handleSkillChange = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skillSets: prev.skillSets.includes(skill)
        ? prev.skillSets.filter(s => s !== skill)
        : [...prev.skillSets, skill]
    }))
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        <p className="text-sm text-gray-600">Tell us about yourself</p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
          <label className="block text-sm font-medium text-gray-700">Name *</label>
              <input
                type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            placeholder="Enter your full name"
                required
              />
            </div>
            <div>
          <label className="block text-sm font-medium text-gray-700">Father's Name *</label>
          <input
            type="text"
            value={formData.fathersName}
            onChange={(e) => setFormData({ ...formData, fathersName: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            placeholder="Enter father's name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender *</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            required
          >
            <option value="">Select Gender</option>
            {GENDER_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth *</label>
              <input
            type="date"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Permanent Address *</label>
        <textarea
          value={formData.permanentAddress}
          onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
          placeholder="Enter your permanent address"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Current Address *</label>
        <textarea
          value={formData.currentAddress}
          onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
          rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
          placeholder="Enter your current address"
                required
              />
            </div>

            <div>
        <label className="block text-sm font-medium text-gray-700">Mobile Number *</label>
              <input
                type="tel"
          value={formData.mobileNumber}
          onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="+91 98765 43210"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Primary Email *</label>
          <input
            type="email"
            value={formData.primaryEmail}
            onChange={(e) => setFormData({ ...formData, primaryEmail: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            placeholder="primary@example.com"
            required
          />
          <p className="mt-1 text-xs text-gray-500">OTP verification will be done on this email</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Secondary Email</label>
          <input
            type="email"
            value={formData.secondaryEmail}
            onChange={(e) => setFormData({ ...formData, secondaryEmail: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            placeholder="secondary@example.com"
              />
            </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
        <p className="text-sm text-gray-600">Tell us about your work experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
          <label className="block text-sm font-medium text-gray-700">PAN Number *</label>
                <input
                  type="text"
            value={formData.panNumber}
            onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="ABCDE1234F"
                  required
                />
              </div>
              <div>
          <label className="block text-sm font-medium text-gray-700">UAN Number (Optional)</label>
          <input
            type="text"
            value={formData.uanNumber}
            onChange={(e) => setFormData({ ...formData, uanNumber: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            placeholder="123456789012"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Highest Qualification *</label>
          <select
            value={formData.highestQualification}
            onChange={(e) => setFormData({ ...formData, highestQualification: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            required
          >
            <option value="">Select Qualification</option>
            {QUALIFICATION_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Work Experience (Years) *</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={formData.workExperience}
            onChange={(e) => setFormData({ ...formData, workExperience: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            placeholder="2.5"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Sector *</label>
        <select
          value={formData.sector}
          onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
          required
        >
          <option value="">Select Sector</option>
          {SECTOR_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Present Company *</label>
          <input
            type="text"
            value={formData.presentCompany}
            onChange={(e) => setFormData({ ...formData, presentCompany: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            placeholder="Company Name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Designation *</label>
          <input
            type="text"
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            placeholder="Software Engineer"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Latest Rating</label>
          <input
            type="text"
            value={formData.latestRating}
            onChange={(e) => setFormData({ ...formData, latestRating: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            placeholder="Exceeds Expectations"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Work Location *</label>
          <input
            type="text"
            value={formData.workLocation}
            onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            placeholder="Bangalore, India"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Open to Relocation *</label>
        <select
          value={formData.openToRelocation}
          onChange={(e) => setFormData({ ...formData, openToRelocation: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
          required
        >
          <option value="">Select Option</option>
          {RELOCATION_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Current CTC *</label>
          <input
            type="text"
            value={formData.currentCtc}
            onChange={(e) => setFormData({ ...formData, currentCtc: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            placeholder="8.5 LPA"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Expected Hike % *</label>
                <input
                  type="text"
            value={formData.expectedHikePercentage}
            onChange={(e) => setFormData({ ...formData, expectedHikePercentage: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            placeholder="30%"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Notice Period (Days) *</label>
          <input
            type="number"
            min="0"
            value={formData.noticePeriod}
            onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            placeholder="60"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Negotiable (Days) *</label>
          <input
            type="number"
            min="0"
            value={formData.negotiableDays}
            onChange={(e) => setFormData({ ...formData, negotiableDays: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            placeholder="30"
            required
                />
              </div>
            </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Skill Sets *</label>
        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
          {SKILLS_OPTIONS.map(skill => (
            <label key={skill.value} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={formData.skillSets.includes(skill.value)}
                onChange={() => handleSkillChange(skill.value)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-gray-700">{skill.label}</span>
            </label>
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-500">Select all applicable skills</p>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Account Security</h3>
        <p className="text-sm text-gray-600">Create your secure password</p>
      </div>

            <div>
        <label className="block text-sm font-medium text-gray-700">Password *</label>
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
        <label className="block text-sm font-medium text-gray-700">Confirm Password *</label>
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

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Registration Summary</h4>
        <div className="text-xs text-blue-800 space-y-1">
          <p><strong>Name:</strong> {formData.name}</p>
          <p><strong>Email:</strong> {formData.primaryEmail}</p>
          <p><strong>Company:</strong> {formData.presentCompany}</p>
          <p><strong>Designation:</strong> {formData.designation}</p>
          <p><strong>Experience:</strong> {formData.workExperience} years</p>
          <p><strong>Skills:</strong> {formData.skillSets.length} selected</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="text-3xl font-bold text-red-600">Red-Flagged</Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create Candidate Account</h2>
          {isInvited ? (
            <div className="mt-2">
              <p className="text-sm text-green-600 font-medium">🎉 You've been invited to join Red-Flagged!</p>
              <p className="text-sm text-gray-600">Complete your registration to get started</p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-600">Get started with your job journey</p>
          )}
        </div>

        {/* Progress Bar */}
        {!awaitingOtp && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

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
            <>
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Creating account...
                      </span>
                    ) : (
                      'Create Account'
                    )}
            </button>
                )}
              </div>
            </>
          ) : (
          <form className="space-y-4" onSubmit={handleVerifyOtp}>
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Verify Your Email</h3>
                <p className="text-sm text-gray-600">We've sent a 6-digit code to your primary email</p>
              </div>
              
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
                <p className="mt-2 text-xs text-gray-600">We&apos;ve sent the code to {formData.primaryEmail}.</p>
            </div>
              
            <div className="flex items-center justify-between gap-3">
              <button type="submit" disabled={verifying} className="flex-1 flex justify-center py-2 px-4 rounded-lg text-white bg-red-600 hover:bg-red-700 disabled:opacity-70">
                  {verifying ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
                    </span>
                  ) : (
                    'Verify & Continue'
                  )}
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
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-red-600">
            <ArrowRight className="h-4 w-4 mr-1 rotate-180"/>Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}