import { Clock, Lock } from 'lucide-react'
import {
  AuthLink,
  AuthPrimaryButton,
  AuthSecondaryButton,
  AuthTitle,
} from '../auth-ui'

interface LockedStepProps {
  email: string
  lockSeconds: number
  onResetPassword: () => void
  onBackToSignIn: () => void
}

function formatCountdown(total: number) {
  const m = String(Math.floor(total / 60)).padStart(2, '0')
  const s = String(total % 60).padStart(2, '0')
  return `${m}:${s}`
}

export function LockedStep({
  email,
  lockSeconds,
  onResetPassword,
  onBackToSignIn,
}: LockedStepProps) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
        <Lock className="h-6 w-6 text-red-500" strokeWidth={1.75} />
      </div>
      <AuthTitle>This account is locked</AuthTitle>
      <p className="mt-3 text-[15px] leading-relaxed text-slate-500">
        Too many failed sign-in attempts. For your security,{' '}
        <span className="font-semibold text-[#0a0e27]">{email}</span> has been
        temporarily locked for 15 minutes.
      </p>

      <div className="mt-6 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 text-left text-sm text-amber-900">
        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
        <p>
          Try again in <strong>{formatCountdown(lockSeconds)}</strong>. Or reset
          your password now to regain access immediately.
        </p>
      </div>

      <div className="mt-8 space-y-2.5">
        <AuthPrimaryButton type="button" onClick={onResetPassword}>
          Reset password
        </AuthPrimaryButton>
        <AuthSecondaryButton onClick={onBackToSignIn}>
          Back to sign in
        </AuthSecondaryButton>
      </div>

      <p className="mt-8 text-sm text-slate-500">
        This lockout was recorded in the security audit log ·{' '}
        <AuthLink>Contact support</AuthLink>
      </p>
    </div>
  )
}
