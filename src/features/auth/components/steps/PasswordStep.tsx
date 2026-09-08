import { useState } from 'react'
import { AlertTriangle, Eye, EyeOff, User } from 'lucide-react'
import {
  AuthBackButton,
  AuthFieldLabel,
  AuthLink,
  AuthPrimaryButton,
  AuthStepLabel,
  AuthSubtitle,
  AuthTitle,
} from '../auth-ui'
import { cn } from '@/lib/utils/cn'

interface PasswordStepProps {
  workspace: string
  email: string
  attemptsRemaining: number
  showError?: boolean
  isLoading?: boolean
  onBack: () => void
  onSwitchAccount: () => void
  onForgotPassword: () => void
  onSubmit: (password: string, remember: boolean) => void
}

export function PasswordStep({
  workspace,
  email,
  attemptsRemaining,
  showError,
  isLoading,
  onBack,
  onSwitchAccount,
  onForgotPassword,
  onSubmit,
}: PasswordStepProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [fieldError, setFieldError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) {
      setFieldError(true)
      return
    }
    setFieldError(false)
    onSubmit(password, remember)
  }

  const hasError = showError || fieldError

  return (
    <div>
      <AuthBackButton onClick={onBack} />
      <AuthStepLabel>Step 2 of 3 · Password</AuthStepLabel>
      <AuthTitle>Enter your password</AuthTitle>
      <AuthSubtitle>
        Signing in to <span className="font-semibold text-[#0a0e27]">{workspace}.</span>
      </AuthSubtitle>

      {showError && (
        <div className="mt-4 flex gap-3 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Incorrect email or password. You have{' '}
            <strong>{attemptsRemaining}</strong> attempt
            {attemptsRemaining === 1 ? '' : 's'} remaining before this account is
            temporarily locked.
          </p>
        </div>
      )}

      <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 px-3.5 py-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-blue-500 text-white">
          <User className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#0a0e27]">{email}</p>
          <p className="text-xs text-slate-500">Not you? Use a different account</p>
        </div>
        <AuthLink onClick={onSwitchAccount} className="shrink-0 text-sm">
          Switch
        </AuthLink>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <AuthFieldLabel htmlFor="password">Password</AuthFieldLabel>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setFieldError(false)
              }}
              placeholder="Enter your password"
              className={cn(
                'h-10 w-full rounded-lg border bg-white px-3 pr-10 text-sm text-[#0a0e27] outline-none placeholder:text-slate-400 focus:ring-2 sm:h-11',
                hasError
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15'
                  : 'border-slate-200 focus:border-[#0a0e27] focus:ring-[#0a0e27]/10'
              )}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[#0a0e27] focus:ring-[#0a0e27]/20"
            />
            Remember this device for 30 days
          </label>
          <AuthLink onClick={onForgotPassword} className="shrink-0 text-sm">
            Forgot password?
          </AuthLink>
        </div>

        <AuthPrimaryButton disabled={isLoading}>
          {isLoading ? 'Signing in…' : 'Sign in'}
        </AuthPrimaryButton>
      </form>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="text-center text-xs text-slate-400">
          Protected by enterprise password policy · 5 attempts before lockout
        </p>
      </div>
    </div>
  )
}
