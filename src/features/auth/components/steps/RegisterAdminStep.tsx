import { useState } from 'react'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import {
  AuthFieldLabel,
  AuthLink,
  AuthPrimaryButton,
  AuthStepLabel,
  AuthSubtitle,
  AuthTitle,
} from '../auth-ui'

export interface AdminFormData {
  firstName: string
  lastName: string
  officialEmail: string
  mobileNumber: string
  username: string
  password: string
  confirmPassword: string
}

interface RegisterAdminStepProps {
  orgName: string
  initialData: AdminFormData
  onContinue: (data: AdminFormData) => void
  onBackToSignIn: () => void
}

export function RegisterAdminStep({
  orgName,
  initialData,
  onContinue,
  onBackToSignIn,
}: RegisterAdminStepProps) {
  const [formData, setFormData] = useState<AdminFormData>(initialData)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleEmailChange = (val: string) => {
    const nextData = { ...formData, officialEmail: val }
    if (!formData.username || formData.username === formData.officialEmail.split('@')[0]) {
      nextData.username = val.split('@')[0] || ''
    }
    setFormData(nextData)
    if (errors.officialEmail) setErrors((prev) => ({ ...prev, officialEmail: '' }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!formData.firstName.trim()) errs.firstName = 'First name is required'
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required'
    if (!formData.officialEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.officialEmail)) {
      errs.officialEmail = 'Enter a valid official email'
    }
    if (!formData.mobileNumber.trim()) errs.mobileNumber = 'Mobile number is required'
    if (!formData.username.trim()) errs.username = 'Username is required'
    if (!formData.password) {
      errs.password = 'Password is required'
    } else if (formData.password.length < 8) {
      errs.password = 'Minimum 8 characters required'
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match'
    }

    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    onContinue(formData)
  }

  return (
    <div>
      <AuthStepLabel>STEP 2 OF 3 · SUPER ADMIN ACCOUNT</AuthStepLabel>
      <AuthTitle>Create your admin account</AuthTitle>
      <AuthSubtitle>
        This is the account you&apos;ll use to manage {orgName || 'your organization'}.
      </AuthSubtitle>

      {/* Info Banner */}
      <div className="my-4 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-3.5 text-xs text-blue-900">
        <ShieldCheck className="h-4 w-4 shrink-0 text-[#2563eb] mt-0.5" />
        <p className="leading-relaxed">
          This account will automatically be assigned the <strong className="font-semibold">SUPER_ADMIN</strong> role, with full access to your organization&apos;s workspace.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First & Last Name */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <AuthFieldLabel htmlFor="firstName">First Name *</AuthFieldLabel>
            <input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => {
                setFormData({ ...formData, firstName: e.target.value })
                if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: '' }))
              }}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-[#0a0e27] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10"
            />
            {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
          </div>
          <div>
            <AuthFieldLabel htmlFor="lastName">Last Name *</AuthFieldLabel>
            <input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => {
                setFormData({ ...formData, lastName: e.target.value })
                if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: '' }))
              }}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-[#0a0e27] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10"
            />
            {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
          </div>
        </div>

        {/* Official Email */}
        <div>
          <AuthFieldLabel htmlFor="officialEmail">Official Email *</AuthFieldLabel>
          <input
            id="officialEmail"
            type="email"
            value={formData.officialEmail}
            onChange={(e) => handleEmailChange(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-[#0a0e27] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10"
          />
          {errors.officialEmail && <p className="mt-1 text-xs text-red-600">{errors.officialEmail}</p>}
        </div>

        {/* Mobile Number */}
        <div>
          <AuthFieldLabel htmlFor="mobileNumber">Mobile Number *</AuthFieldLabel>
          <input
            id="mobileNumber"
            type="tel"
            value={formData.mobileNumber}
            onChange={(e) => {
              setFormData({ ...formData, mobileNumber: e.target.value })
              if (errors.mobileNumber) setErrors((prev) => ({ ...prev, mobileNumber: '' }))
            }}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-[#0a0e27] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10"
          />
          {errors.mobileNumber && <p className="mt-1 text-xs text-red-600">{errors.mobileNumber}</p>}
        </div>

        {/* Username */}
        <div>
          <AuthFieldLabel htmlFor="username">Username *</AuthFieldLabel>
          <input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) => {
              setFormData({ ...formData, username: e.target.value })
              if (errors.username) setErrors((prev) => ({ ...prev, username: '' }))
            }}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-[#0a0e27] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10"
          />
          {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username}</p>}
        </div>

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <AuthFieldLabel htmlFor="password">Password *</AuthFieldLabel>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value })
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }))
                }}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-3 pr-9 text-sm text-[#0a0e27] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          <div>
            <AuthFieldLabel htmlFor="confirmPassword">Confirm Password *</AuthFieldLabel>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value })
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }))
                }}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-3 pr-9 text-sm text-[#0a0e27] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
          </div>
        </div>
        <p className="text-xs text-slate-500">Minimum 8 characters, with at least one number and one symbol.</p>

        <AuthPrimaryButton type="submit" className="mt-6">
          Continue
        </AuthPrimaryButton>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        Already have an organization?{' '}
        <AuthLink onClick={onBackToSignIn}>Sign in</AuthLink>
      </p>
    </div>
  )
}
