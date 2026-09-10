import { useState } from 'react'
import { Upload } from 'lucide-react'
import {
  AuthFieldLabel,
  AuthLink,
  AuthPrimaryButton,
  AuthStepLabel,
  AuthSubtitle,
  AuthTitle,
} from '../auth-ui'

export interface OrgFormData {
  orgName: string
  orgCode: string
  orgType: string
  industry: string
  companySize: string
  country: string
  state: string
  city: string
  timeZone: string
  logo?: File | null
}

interface RegisterOrgStepProps {
  initialData: OrgFormData
  onContinue: (data: OrgFormData) => void
  onBackToSignIn: () => void
}

export function RegisterOrgStep({ initialData, onContinue, onBackToSignIn }: RegisterOrgStepProps) {
  const [formData, setFormData] = useState<OrgFormData>(initialData)
  const [manualCode, setManualCode] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [logoName, setLogoName] = useState<string>('')

  const handleNameChange = (val: string) => {
    const nextData = { ...formData, orgName: val }
    if (!manualCode) {
      nextData.orgCode = val
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 16)
    }
    setFormData(nextData)
    if (errors.orgName) setErrors((prev) => ({ ...prev, orgName: '' }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!formData.orgName.trim()) errs.orgName = 'Organization name is required'
    if (!formData.orgCode.trim()) errs.orgCode = 'Organization code is required'
    if (!formData.orgType) errs.orgType = 'Select organization type'
    if (!formData.industry) errs.industry = 'Select industry'
    if (!formData.companySize) errs.companySize = 'Select company size'
    if (!formData.country) errs.country = 'Select country'
    if (!formData.state.trim()) errs.state = 'State / Province is required'
    if (!formData.city.trim()) errs.city = 'City is required'
    if (!formData.timeZone) errs.timeZone = 'Select time zone'

    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    onContinue(formData)
  }

  return (
    <div>
      <AuthStepLabel>STEP 1 OF 3 · ORGANIZATION DETAILS</AuthStepLabel>
      <AuthTitle>Tell us about your organization</AuthTitle>
      <AuthSubtitle>This creates your organization&apos;s workspace on One Enterprise.</AuthSubtitle>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {/* Organization Name */}
        <div>
          <AuthFieldLabel htmlFor="orgName">Organization Name *</AuthFieldLabel>
          <input
            id="orgName"
            type="text"
            value={formData.orgName}
            onChange={(e) => handleNameChange(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-[#0a0e27] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10"
          />
          {errors.orgName && <p className="mt-1 text-xs text-red-600">{errors.orgName}</p>}
        </div>

        {/* Organization Code */}
        <div>
          <AuthFieldLabel htmlFor="orgCode">Organization Code *</AuthFieldLabel>
          <input
            id="orgCode"
            type="text"
            value={formData.orgCode}
            readOnly={!manualCode}
            onChange={(e) => {
              setFormData({ ...formData, orgCode: e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '') })
              if (errors.orgCode) setErrors((prev) => ({ ...prev, orgCode: '' }))
            }}
            className={`h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-[#0a0e27] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 ${
              manualCode ? 'bg-white' : 'bg-slate-50'
            }`}
          />
          <p className="mt-1 text-xs text-slate-500">
            Auto-generated from your organization name —{' '}
            <button
              type="button"
              onClick={() => setManualCode(!manualCode)}
              className="font-medium text-[#2563eb] hover:underline"
            >
              {manualCode ? 'auto-generate' : 'edit manually'}
            </button>
          </p>
          {errors.orgCode && <p className="mt-1 text-xs text-red-600">{errors.orgCode}</p>}
        </div>

        {/* Organization Type */}
        <div>
          <AuthFieldLabel htmlFor="orgType">Organization Type *</AuthFieldLabel>
          <select
            id="orgType"
            value={formData.orgType}
            onChange={(e) => {
              setFormData({ ...formData, orgType: e.target.value })
              if (errors.orgType) setErrors((prev) => ({ ...prev, orgType: '' }))
            }}
            className={`h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 ${
              formData.orgType ? 'text-[#0a0e27]' : 'text-slate-400'
            }`}
          >
            <option value="" disabled>Organization Type</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Small Business">Small Business</option>
            <option value="Mid-Market">Mid-Market</option>
            <option value="Startup">Startup</option>
            <option value="Non-Profit">Non-Profit</option>
            <option value="Government">Government</option>
          </select>
          {errors.orgType && <p className="mt-1 text-xs text-red-600">{errors.orgType}</p>}
        </div>

        {/* Industry */}
        <div>
          <AuthFieldLabel htmlFor="industry">Industry *</AuthFieldLabel>
          <select
            id="industry"
            value={formData.industry}
            onChange={(e) => {
              setFormData({ ...formData, industry: e.target.value })
              if (errors.industry) setErrors((prev) => ({ ...prev, industry: '' }))
            }}
            className={`h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 ${
              formData.industry ? 'text-[#0a0e27]' : 'text-slate-400'
            }`}
          >
            <option value="" disabled>Industry Sector</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Financial Services">Financial Services</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Retail & E-commerce">Retail &amp; E-commerce</option>
            <option value="Education">Education</option>
            <option value="Services">Services</option>
            <option value="Other">Other</option>
          </select>
          {errors.industry && <p className="mt-1 text-xs text-red-600">{errors.industry}</p>}
        </div>

        {/* Company Size */}
        <div>
          <AuthFieldLabel htmlFor="companySize">Company Size *</AuthFieldLabel>
          <select
            id="companySize"
            value={formData.companySize}
            onChange={(e) => {
              setFormData({ ...formData, companySize: e.target.value })
              if (errors.companySize) setErrors((prev) => ({ ...prev, companySize: '' }))
            }}
            className={`h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 ${
              formData.companySize ? 'text-[#0a0e27]' : 'text-slate-400'
            }`}
          >
            <option value="" disabled>Number of Employees</option>
            <option value="1-10">1–10</option>
            <option value="11-50">11–50</option>
            <option value="51-200">51–200</option>
            <option value="201-500">201–500</option>
            <option value="501-1000">501–1000</option>
            <option value="1001-5000">1001–5000</option>
            <option value="5000+">5000+</option>
          </select>
          {errors.companySize && <p className="mt-1 text-xs text-red-600">{errors.companySize}</p>}
        </div>

        {/* Country & State */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <AuthFieldLabel htmlFor="country">Country *</AuthFieldLabel>
            <select
              id="country"
              value={formData.country}
              onChange={(e) => {
                setFormData({ ...formData, country: e.target.value })
                if (errors.country) setErrors((prev) => ({ ...prev, country: '' }))
              }}
              className={`h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 ${
                formData.country ? 'text-[#0a0e27]' : 'text-slate-400'
              }`}
            >
              <option value="" disabled>Country / Region</option>
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Singapore">Singapore</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
            </select>
            {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country}</p>}
          </div>
          <div>
            <AuthFieldLabel htmlFor="state">State / Province *</AuthFieldLabel>
            <input
              id="state"
              type="text"
              value={formData.state}
              onChange={(e) => {
                setFormData({ ...formData, state: e.target.value })
                if (errors.state) setErrors((prev) => ({ ...prev, state: '' }))
              }}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-[#0a0e27] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10"
            />
            {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
          </div>
        </div>

        {/* City & Time Zone */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <AuthFieldLabel htmlFor="city">City *</AuthFieldLabel>
            <input
              id="city"
              type="text"
              value={formData.city}
              onChange={(e) => {
                setFormData({ ...formData, city: e.target.value })
                if (errors.city) setErrors((prev) => ({ ...prev, city: '' }))
              }}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-[#0a0e27] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10"
            />
            {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
          </div>
          <div>
            <AuthFieldLabel htmlFor="timeZone">Time Zone *</AuthFieldLabel>
            <select
              id="timeZone"
              value={formData.timeZone}
              onChange={(e) => {
                setFormData({ ...formData, timeZone: e.target.value })
                if (errors.timeZone) setErrors((prev) => ({ ...prev, timeZone: '' }))
              }}
              className={`h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 ${
                formData.timeZone ? 'text-[#0a0e27]' : 'text-slate-400'
              }`}
            >
              <option value="" disabled>Time Zone</option>
              <option value="Asia/Kolkata (UTC +05:30)">Asia/Kolkata (UTC +05:30)</option>
              <option value="America/New_York (UTC -05:00)">America/New_York (UTC -05:00)</option>
              <option value="America/Chicago (UTC -06:00)">America/Chicago (UTC -06:00)</option>
              <option value="America/Los_Angeles (UTC -08:00)">America/Los_Angeles (UTC -08:00)</option>
              <option value="Europe/London (UTC +00:00)">Europe/London (UTC +00:00)</option>
              <option value="Europe/Berlin (UTC +01:00)">Europe/Berlin (UTC +01:00)</option>
              <option value="Asia/Singapore (UTC +08:00)">Asia/Singapore (UTC +08:00)</option>
              <option value="Asia/Tokyo (UTC +09:00)">Asia/Tokyo (UTC +09:00)</option>
              <option value="UTC">UTC (UTC +00:00)</option>
            </select>
            {errors.timeZone && <p className="mt-1 text-xs text-red-600">{errors.timeZone}</p>}
          </div>
        </div>

        {/* Organization Logo */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <AuthFieldLabel htmlFor="logo">Organization Logo</AuthFieldLabel>
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">OPTIONAL</span>
          </div>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50">
            <Upload className="h-5 w-5 text-slate-400 mb-1" />
            <p className="text-xs font-medium text-slate-600">
              {logoName ? (
                <span className="text-[#2563eb] font-semibold">{logoName}</span>
              ) : (
                <>
                  <span className="text-[#2563eb]">Upload logo</span> or drag and drop — PNG, JPG up to 5MB
                </>
              )}
            </p>
            <input
              id="logo"
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setFormData({ ...formData, logo: file })
                  setLogoName(file.name)
                }
              }}
            />
          </label>
        </div>

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
