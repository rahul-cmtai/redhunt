'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, CheckCircle2, Loader2, ArrowRight, Calendar, MapPin, Building, GraduationCap, Briefcase } from 'lucide-react'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.red-flagged.com'

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
  const [skillInput, setSkillInput] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [checkingDuplicates, setCheckingDuplicates] = useState<Record<string, boolean>>({})

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
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

  // Check for duplicate email, mobile, PAN, UAN
  const checkDuplicate = async (field: string, value: string) => {
    if (!value || !value.trim()) return null
    
    setCheckingDuplicates(prev => ({ ...prev, [field]: true }))
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/candidate/check-duplicate`,
        { field, value: value.trim() },
        { headers: { 'Content-Type': 'application/json' } }
      )
      if (response.data.exists) {
        setFieldErrors(prev => ({
          ...prev,
          [field]: `${field === 'primaryEmail' ? 'Email' : field === 'mobileNumber' ? 'Mobile number' : field === 'panNumber' ? 'PAN' : 'UAN'} already exists. Please use a different one.`
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
      case 'firstName':
        if (!trimmedValue) error = 'First name is required'
        break
      case 'lastName':
        if (!trimmedValue) error = 'Last name is required'
        break
      case 'fathersName':
        if (!trimmedValue) error = 'Father\'s name is required'
        break
      case 'gender':
        if (!value) error = 'Gender is required'
        break
      case 'dob':
        if (!value) {
          error = 'Date of birth is required'
        } else {
          const dob = new Date(value)
          const today = new Date()
          const age = today.getFullYear() - dob.getFullYear()
          if (age < 18) {
            error = 'Not eligible under 18 years'
          }
        }
        break
      case 'permanentAddress':
        if (!trimmedValue) error = 'Permanent address is required'
        break
      case 'currentAddress':
        if (!trimmedValue) error = 'Current address is required'
        break
      case 'mobileNumber':
        if (!trimmedValue) {
          error = 'Mobile number is required'
        } else if (!/^[0-9+\-()\s]{10,15}$/.test(trimmedValue)) {
          error = 'Enter a valid mobile number (10-15 digits)'
        }
        break
      case 'primaryEmail':
        if (!trimmedValue) {
          error = 'Primary email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
          error = 'Enter a valid email address'
        }
        break
      case 'secondaryEmail':
        if (trimmedValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
          error = 'Enter a valid email address'
        }
        break
      case 'panNumber':
        if (!trimmedValue) {
          error = 'PAN number is required'
        } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(trimmedValue)) {
          error = 'Enter a valid PAN (e.g., ABCDE1234F)'
        }
        break
      case 'uanNumber':
        if (trimmedValue && !/^[0-9]{12}$/.test(trimmedValue)) {
          error = 'Enter a valid UAN (12 digits)'
        }
        break
      case 'highestQualification':
        if (!value) error = 'Highest qualification is required'
        break
      case 'workExperience':
        if (!trimmedValue) {
          error = 'Work experience is required'
        } else if (!/^[0-9]+(\.[0-9]+)?$/.test(trimmedValue)) {
          error = 'Enter valid work experience in years'
        } else if (parseFloat(trimmedValue) < 0 || parseFloat(trimmedValue) > 50) {
          error = 'Work experience must be between 0 and 50 years'
        }
        break
      case 'sector':
        if (!value) error = 'Sector is required'
        break
      case 'presentCompany':
        if (!trimmedValue) error = 'Present company is required'
        break
      case 'designation':
        if (!trimmedValue) error = 'Designation is required'
        break
      case 'workLocation':
        if (!trimmedValue) error = 'Work location is required'
        break
      case 'openToRelocation':
        if (!value) error = 'Relocation preference is required'
        break
      case 'currentCtc':
        if (!trimmedValue) error = 'Current CTC is required'
        break
      case 'expectedHikePercentage':
        if (!trimmedValue) error = 'Expected hike percentage is required'
        break
      case 'noticePeriod':
        if (!trimmedValue) {
          error = 'Notice period is required'
        } else if (!/^[0-9]+$/.test(trimmedValue)) {
          error = 'Notice period must be a number'
        } else if (parseInt(trimmedValue) < 0) {
          error = 'Notice period cannot be negative'
        }
        break
      case 'negotiableDays':
        if (!trimmedValue) {
          error = 'Negotiable days is required'
        } else if (!/^[0-9]+$/.test(trimmedValue)) {
          error = 'Negotiable days must be a number'
        } else if (parseInt(trimmedValue) < 0) {
          error = 'Negotiable days cannot be negative'
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
      case 'password':
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
    if (field === 'primaryEmail' && value.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      await checkDuplicate('primaryEmail', value)
    } else if (field === 'mobileNumber' && value.trim() && /^[0-9+\-()\s]{10,15}$/.test(value.trim())) {
      await checkDuplicate('mobileNumber', value)
    } else if (field === 'panNumber' && value.trim() && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(value.trim())) {
      await checkDuplicate('panNumber', value)
    } else if (field === 'uanNumber' && value.trim() && /^[0-9]{12}$/.test(value.trim())) {
      await checkDuplicate('uanNumber', value)
    }
  }

  const validateStep1 = () => {
    if (!formData.firstName.trim()) return 'First name is required'
    if (!formData.lastName.trim()) return 'Last name is required'
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
    
    // Validate all fields in current step
    if (currentStep === 1) {
      const fields = ['firstName', 'lastName', 'fathersName', 'gender', 'dob', 'permanentAddress', 'currentAddress', 'mobileNumber', 'primaryEmail', 'secondaryEmail']
      let hasError = false
      fields.forEach(field => {
        const value = formData[field as keyof typeof formData] as string
        if (!validateField(field, value || '')) {
          hasError = true
        }
      })
      if (hasError) {
        setError('Please fix the errors in the form before proceeding')
        return
      }
    } else if (currentStep === 2) {
      const fields = ['panNumber', 'uanNumber', 'highestQualification', 'workExperience', 'sector', 'presentCompany', 'designation', 'workLocation', 'openToRelocation', 'currentCtc', 'expectedHikePercentage', 'noticePeriod', 'negotiableDays']
      let hasError = false
      fields.forEach(field => {
        const value = formData[field as keyof typeof formData] as string
        if (!validateField(field, value || '')) {
          hasError = true
        }
      })
      if (formData.skillSets.length === 0) {
        setFieldErrors(prev => ({ ...prev, skillSets: 'At least one skill set is required' }))
        hasError = true
      }
      if (hasError) {
        setError('Please fix the errors in the form before proceeding')
        return
      }
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
    
    // Validate password fields
    if (!validateField('password', formData.password) || !validateField('confirmPassword', formData.confirmPassword)) {
      setError('Please fix the password errors before submitting')
      return
    }
    
    setIsSubmitting(true)
    try {
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim()

      await axios.post(
        `${API_BASE_URL}/api/auth/candidate/register`,
        {
          // Personal Information
          name: fullName,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          fullName,
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
      const conflicts = err?.response?.data?.conflicts || []
      
      // Handle duplicate field errors
      if (conflicts.length > 0 || message.includes('already exists') || message.includes('Already registered')) {
        conflicts.forEach((field: string) => {
          if (field === 'email' || field === 'primaryEmail') {
            setFieldErrors(prev => ({ ...prev, primaryEmail: 'This email is already registered' }))
          } else if (field === 'mobile' || field === 'mobileNumber') {
            setFieldErrors(prev => ({ ...prev, mobileNumber: 'This mobile number is already registered' }))
          } else if (field === 'pan' || field === 'panNumber') {
            setFieldErrors(prev => ({ ...prev, panNumber: 'This PAN number is already registered' }))
          } else if (field === 'uan' || field === 'uanNumber') {
            setFieldErrors(prev => ({ ...prev, uanNumber: 'This UAN number is already registered' }))
          }
        })
        
        // Scroll to first error field
        const firstErrorField = conflicts[0] || 'primaryEmail'
        const fieldMap: Record<string, string> = {
          email: 'primaryEmail',
          primaryEmail: 'primaryEmail',
          mobile: 'mobileNumber',
          mobileNumber: 'mobileNumber',
          pan: 'panNumber',
          panNumber: 'panNumber',
          uan: 'uanNumber',
          uanNumber: 'uanNumber'
        }
        const fieldName = fieldMap[firstErrorField] || 'primaryEmail'
        const element = document.querySelector(`[name="${fieldName}"], input[placeholder*="${fieldName}"]`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          ;(element as HTMLElement).focus()
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

  const handleAddSkill = () => {
    const newSkill = skillInput.trim()
    if (!newSkill) return
    setFormData(prev => {
      if (prev.skillSets.some(skill => skill.toLowerCase() === newSkill.toLowerCase())) {
        return prev
      }
      return {
        ...prev,
        skillSets: [...prev.skillSets, newSkill]
      }
    })
    setSkillInput('')
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skillSets: prev.skillSets.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleSkillInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleAddSkill()
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        <p className="text-sm text-gray-600">Tell us about yourself</p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
          <label className="block text-sm font-medium text-gray-700">First Name *</label>
              <input
                type="text"
            value={formData.firstName}
            onChange={(e) => handleFieldChange('firstName', e.target.value)}
            onBlur={(e) => validateField('firstName', e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${fieldErrors.firstName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your first name"
                required
              />
              {fieldErrors.firstName && <p className="mt-1 text-xs text-red-600">{fieldErrors.firstName}</p>}
            </div>
            <div>
          <label className="block text-sm font-medium text-gray-700">Last Name *</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleFieldChange('lastName', e.target.value)}
            onBlur={(e) => validateField('lastName', e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${fieldErrors.lastName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your last name"
            required
          />
          {fieldErrors.lastName && <p className="mt-1 text-xs text-red-600">{fieldErrors.lastName}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Father's Name *</label>
        <input
          type="text"
          value={formData.fathersName}
          onChange={(e) => handleFieldChange('fathersName', e.target.value)}
          onBlur={(e) => validateField('fathersName', e.target.value)}
          className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${fieldErrors.fathersName ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter father's name"
          required
        />
        {fieldErrors.fathersName && <p className="mt-1 text-xs text-red-600">{fieldErrors.fathersName}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender *</label>
          <select
            value={formData.gender}
            onChange={(e) => handleFieldChange('gender', e.target.value)}
            onBlur={(e) => validateField('gender', e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${fieldErrors.gender ? 'border-red-500' : 'border-gray-300'}`}
            required
          >
            <option value="">Select Gender</option>
            {GENDER_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {fieldErrors.gender && <p className="mt-1 text-xs text-red-600">{fieldErrors.gender}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth *</label>
              <input
            type="date"
            value={formData.dob}
            onChange={(e) => handleFieldChange('dob', e.target.value)}
            onBlur={(e) => validateField('dob', e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${fieldErrors.dob ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {fieldErrors.dob && <p className="mt-1 text-xs text-red-600">{fieldErrors.dob}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Permanent Address *</label>
        <textarea
          value={formData.permanentAddress}
          onChange={(e) => handleFieldChange('permanentAddress', e.target.value)}
          onBlur={(e) => validateField('permanentAddress', e.target.value)}
          rows={3}
          className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${fieldErrors.permanentAddress ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter your permanent address"
          required
        />
        {fieldErrors.permanentAddress && <p className="mt-1 text-xs text-red-600">{fieldErrors.permanentAddress}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Current Address *</label>
        <textarea
          value={formData.currentAddress}
          onChange={(e) => handleFieldChange('currentAddress', e.target.value)}
          onBlur={(e) => validateField('currentAddress', e.target.value)}
          rows={3}
                className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${fieldErrors.currentAddress ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter your current address"
                required
              />
        {fieldErrors.currentAddress && <p className="mt-1 text-xs text-red-600">{fieldErrors.currentAddress}</p>}
            </div>

            <div>
        <label className="block text-sm font-medium text-gray-700">Mobile Number *</label>
              <input
                type="tel"
          value={formData.mobileNumber}
          onChange={(e) => handleFieldChange('mobileNumber', e.target.value)}
          onBlur={(e) => handleFieldBlur('mobileNumber', e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${fieldErrors.mobileNumber ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="+91 98765 43210"
          required
        />
        {checkingDuplicates.mobileNumber && <p className="mt-1 text-xs text-gray-500">Checking...</p>}
        {fieldErrors.mobileNumber && <p className="mt-1 text-xs text-red-600">{fieldErrors.mobileNumber}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Primary Email *</label>
          <input
            type="email"
            value={formData.primaryEmail}
            onChange={(e) => handleFieldChange('primaryEmail', e.target.value)}
            onBlur={(e) => handleFieldBlur('primaryEmail', e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${fieldErrors.primaryEmail ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="primary@example.com"
            required
          />
          {checkingDuplicates.primaryEmail && <p className="mt-1 text-xs text-gray-500">Checking...</p>}
          {fieldErrors.primaryEmail && <p className="mt-1 text-xs text-red-600">{fieldErrors.primaryEmail}</p>}
          <p className="mt-1 text-xs text-gray-500">OTP verification will be done on this email</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Secondary Email</label>
          <input
            type="email"
            value={formData.secondaryEmail}
            onChange={(e) => handleFieldChange('secondaryEmail', e.target.value)}
            onBlur={(e) => validateField('secondaryEmail', e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${fieldErrors.secondaryEmail ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="secondary@example.com"
              />
          {fieldErrors.secondaryEmail && <p className="mt-1 text-xs text-red-600">{fieldErrors.secondaryEmail}</p>}
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
            onChange={(e) => handleFieldChange('panNumber', e.target.value.toUpperCase())}
            onBlur={(e) => handleFieldBlur('panNumber', e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${fieldErrors.panNumber ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="ABCDE1234F"
                  required
                />
        {checkingDuplicates.panNumber && <p className="mt-1 text-xs text-gray-500">Checking...</p>}
        {fieldErrors.panNumber && <p className="mt-1 text-xs text-red-600">{fieldErrors.panNumber}</p>}
              </div>
              <div>
          <label className="block text-sm font-medium text-gray-700">UAN Number (Optional)</label>
          <input
            type="text"
            value={formData.uanNumber}
            onChange={(e) => handleFieldChange('uanNumber', e.target.value)}
            onBlur={(e) => handleFieldBlur('uanNumber', e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${fieldErrors.uanNumber ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="123456789012"
          />
        {checkingDuplicates.uanNumber && <p className="mt-1 text-xs text-gray-500">Checking...</p>}
        {fieldErrors.uanNumber && <p className="mt-1 text-xs text-red-600">{fieldErrors.uanNumber}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Highest Qualification *</label>
          <select
            value={formData.highestQualification}
            onChange={(e) => handleFieldChange('highestQualification', e.target.value)}
            onBlur={(e) => validateField('highestQualification', e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${fieldErrors.highestQualification ? 'border-red-500' : 'border-gray-300'}`}
            required
          >
            <option value="">Select Qualification</option>
            {QUALIFICATION_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {fieldErrors.highestQualification && <p className="mt-1 text-xs text-red-600">{fieldErrors.highestQualification}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Work Experience (Years) *</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="50"
            value={formData.workExperience}
            onChange={(e) => handleFieldChange('workExperience', e.target.value)}
            onBlur={(e) => validateField('workExperience', e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${fieldErrors.workExperience ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="2.5"
            required
          />
          {fieldErrors.workExperience && <p className="mt-1 text-xs text-red-600">{fieldErrors.workExperience}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Sector *</label>
        <select
          value={formData.sector}
          onChange={(e) => handleFieldChange('sector', e.target.value)}
          onBlur={(e) => validateField('sector', e.target.value)}
          className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${fieldErrors.sector ? 'border-red-500' : 'border-gray-300'}`}
          required
        >
          <option value="">Select Sector</option>
          {SECTOR_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        {fieldErrors.sector && <p className="mt-1 text-xs text-red-600">{fieldErrors.sector}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Present Company *</label>
          <input
            type="text"
            value={formData.presentCompany}
            onChange={(e) => handleFieldChange('presentCompany', e.target.value)}
            onBlur={(e) => validateField('presentCompany', e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${fieldErrors.presentCompany ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Company Name"
            required
          />
          {fieldErrors.presentCompany && <p className="mt-1 text-xs text-red-600">{fieldErrors.presentCompany}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Designation *</label>
          <input
            type="text"
            value={formData.designation}
            onChange={(e) => handleFieldChange('designation', e.target.value)}
            onBlur={(e) => validateField('designation', e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${fieldErrors.designation ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Software Engineer"
            required
          />
          {fieldErrors.designation && <p className="mt-1 text-xs text-red-600">{fieldErrors.designation}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Latest Rating</label>
          <input
            type="text"
            value={formData.latestRating}
            onChange={(e) => handleFieldChange('latestRating', e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            placeholder="Exceeds Expectations"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Work Location *</label>
          <input
            type="text"
            value={formData.workLocation}
            onChange={(e) => handleFieldChange('workLocation', e.target.value)}
            onBlur={(e) => validateField('workLocation', e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${fieldErrors.workLocation ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Bangalore, India"
            required
          />
          {fieldErrors.workLocation && <p className="mt-1 text-xs text-red-600">{fieldErrors.workLocation}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Open to Relocation *</label>
        <select
          value={formData.openToRelocation}
          onChange={(e) => handleFieldChange('openToRelocation', e.target.value)}
          onBlur={(e) => validateField('openToRelocation', e.target.value)}
          className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${fieldErrors.openToRelocation ? 'border-red-500' : 'border-gray-300'}`}
          required
        >
          <option value="">Select Option</option>
          {RELOCATION_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        {fieldErrors.openToRelocation && <p className="mt-1 text-xs text-red-600">{fieldErrors.openToRelocation}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Current CTC *</label>
          <input
            type="text"
            value={formData.currentCtc}
            onChange={(e) => handleFieldChange('currentCtc', e.target.value)}
            onBlur={(e) => validateField('currentCtc', e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${fieldErrors.currentCtc ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="8.5 LPA"
            required
          />
          {fieldErrors.currentCtc && <p className="mt-1 text-xs text-red-600">{fieldErrors.currentCtc}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Expected Hike % *</label>
                <input
                  type="text"
            value={formData.expectedHikePercentage}
            onChange={(e) => handleFieldChange('expectedHikePercentage', e.target.value)}
            onBlur={(e) => validateField('expectedHikePercentage', e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${fieldErrors.expectedHikePercentage ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="30%"
            required
          />
          {fieldErrors.expectedHikePercentage && <p className="mt-1 text-xs text-red-600">{fieldErrors.expectedHikePercentage}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Notice Period (Days) *</label>
          <input
            type="number"
            min="0"
            value={formData.noticePeriod}
            onChange={(e) => handleFieldChange('noticePeriod', e.target.value)}
            onBlur={(e) => validateField('noticePeriod', e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${fieldErrors.noticePeriod ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="60"
            required
          />
          {fieldErrors.noticePeriod && <p className="mt-1 text-xs text-red-600">{fieldErrors.noticePeriod}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Negotiable (Days) *</label>
          <input
            type="number"
            min="0"
            value={formData.negotiableDays}
            onChange={(e) => handleFieldChange('negotiableDays', e.target.value)}
            onBlur={(e) => validateField('negotiableDays', e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${fieldErrors.negotiableDays ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="30"
            required
                />
          {fieldErrors.negotiableDays && <p className="mt-1 text-xs text-red-600">{fieldErrors.negotiableDays}</p>}
              </div>
            </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Skill Sets *</label>
        <div className="mt-2 space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillInputKeyDown}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="Type a skill and press Enter"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Add
            </button>
          </div>
          {formData.skillSets.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.skillSets.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-red-50 text-red-700 border border-red-200 rounded-full"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-red-600 hover:text-red-800"
                    aria-label={`Remove ${skill}`}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        {fieldErrors.skillSets && <p className="mt-1 text-xs text-red-600">{fieldErrors.skillSets}</p>}
        <p className="mt-1 text-xs text-gray-500">Add all applicable skills. Press Enter or click Add to include a skill.</p>
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
                  onChange={(e) => handleFieldChange('password', e.target.value)}
                  onBlur={(e) => validateField('password', e.target.value)}
                  className={`block w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Create a password"
                  required
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
              {fieldErrors.password && <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>}
            </div>

            <div>
        <label className="block text-sm font-medium text-gray-700">Confirm Password *</label>
              <div className="mt-1 relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                  onBlur={(e) => validateField('confirmPassword', e.target.value)}
                  className={`block w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Re-enter your password"
                  required
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>}
            </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Registration Summary</h4>
        <div className="text-xs text-blue-800 space-y-1">
          <p><strong>Name:</strong> {[formData.firstName, formData.lastName].filter(Boolean).join(' ')}</p>
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