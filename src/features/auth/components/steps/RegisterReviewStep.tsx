import { useState } from 'react'
import {
  AuthLink,
  AuthPrimaryButton,
  AuthStepLabel,
  AuthSubtitle,
  AuthTitle,
} from '../auth-ui'

export interface ReviewAgreements {
  terms: boolean
  authorized: boolean
  dpa: boolean
  marketing: boolean
}

interface RegisterReviewStepProps {
  orgName: string
  isLoading?: boolean
  onSubmit: (agreements: ReviewAgreements) => void
  onBackToSignIn: () => void
}

export function RegisterReviewStep({
  orgName,
  isLoading,
  onSubmit,
  onBackToSignIn,
}: RegisterReviewStepProps) {
  const [agreements, setAgreements] = useState<ReviewAgreements>({
    terms: false,
    authorized: false,
    dpa: false,
    marketing: false,
  })
  const [errors, setErrors] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreements.terms || !agreements.authorized || !agreements.dpa) {
      setErrors('Please accept all required agreements to complete registration.')
      return
    }
    setErrors('')
    onSubmit(agreements)
  }

  return (
    <div>
      <AuthStepLabel>STEP 3 OF 3 · TERMS & AUTHORIZATION</AuthStepLabel>
      <AuthTitle>Review and confirm</AuthTitle>
      <AuthSubtitle>
        One last step before we create {orgName || 'your organization'}&apos;s workspace.
      </AuthSubtitle>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {/* Checkbox group card */}
        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreements.terms}
              onChange={(e) => {
                setAgreements({ ...agreements, terms: e.target.checked })
                if (errors) setErrors('')
              }}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb]"
            />
            <span className="text-xs text-slate-600 leading-relaxed">
              I have read and agree to the{' '}
              <a href="#" onClick={(e) => e.preventDefault()} className="font-semibold text-[#2563eb] hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" onClick={(e) => e.preventDefault()} className="font-semibold text-[#2563eb] hover:underline">
                Privacy Policy
              </a>
              .
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreements.authorized}
              onChange={(e) => {
                setAgreements({ ...agreements, authorized: e.target.checked })
                if (errors) setErrors('')
              }}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb]"
            />
            <span className="text-xs text-slate-600 leading-relaxed">
              I confirm that I am authorized to register <strong className="font-semibold text-slate-900">{orgName || 'this organization'}</strong> on One Enterprise, and I accept responsibility as its Super Administrator.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreements.dpa}
              onChange={(e) => {
                setAgreements({ ...agreements, dpa: e.target.checked })
                if (errors) setErrors('')
              }}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb]"
            />
            <span className="text-xs text-slate-600 leading-relaxed">
              I agree to the{' '}
              <a href="#" onClick={(e) => e.preventDefault()} className="font-semibold text-[#2563eb] hover:underline">
                Data Processing Agreement
              </a>{' '}
              governing how organization data is stored and processed.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer pt-1 border-t border-slate-200/60">
            <input
              type="checkbox"
              checked={agreements.marketing}
              onChange={(e) => setAgreements({ ...agreements, marketing: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb]"
            />
            <span className="text-xs text-slate-600 leading-relaxed">
              Send me product updates and security notices by email{' '}
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">OPTIONAL</span>
            </span>
          </label>
        </div>

        {errors && <p className="text-xs text-red-600 font-medium">{errors}</p>}

        <AuthPrimaryButton type="submit" disabled={isLoading} className="mt-6">
          {isLoading ? 'Creating account...' : 'Create account'}
        </AuthPrimaryButton>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        Already have an organization?{' '}
        <AuthLink onClick={onBackToSignIn}>Sign in</AuthLink>
      </p>
    </div>
  )
}
