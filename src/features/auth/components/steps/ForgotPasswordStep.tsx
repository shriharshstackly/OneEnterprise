import { useState } from 'react'
import {
  AuthBackButton,
  AuthFieldLabel,
  AuthLink,
  AuthPrimaryButton,
  AuthStepLabel,
  AuthSubtitle,
  AuthTitle,
} from '../auth-ui'

interface ForgotPasswordStepProps {
  email: string
  onBack: () => void
  onSend: (email: string) => void
  isLoading?: boolean
}

export function ForgotPasswordStep({
  email: initialEmail,
  onBack,
  onSend,
  isLoading,
}: ForgotPasswordStepProps) {
  const [email, setEmail] = useState(initialEmail)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid work email')
      return
    }
    setError('')
    onSend(email.trim())
  }

  return (
    <div>
      <AuthBackButton onClick={onBack} label="Back to sign in" />
      <AuthStepLabel>Password recovery</AuthStepLabel>
      <AuthTitle>Forgot your password?</AuthTitle>
      <AuthSubtitle>
        Enter your work email and we&apos;ll send you a link to reset it.
      </AuthSubtitle>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <AuthFieldLabel htmlFor="reset-email">Work email</AuthFieldLabel>
          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@acmecorp.com"
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-[#0a0e27] outline-none placeholder:text-slate-400 focus:border-[#0a0e27] focus:ring-2 focus:ring-[#0a0e27]/10"
            autoComplete="email"
          />
          {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        </div>

        <AuthPrimaryButton disabled={isLoading}>
          {isLoading ? 'Sending…' : 'Send reset link'}
        </AuthPrimaryButton>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Remembered your password? <AuthLink onClick={onBack}>Sign in</AuthLink>
      </p>
    </div>
  )
}
