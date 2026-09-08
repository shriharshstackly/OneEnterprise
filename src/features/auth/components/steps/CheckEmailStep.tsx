import { Mail } from 'lucide-react'
import {
  AuthLink,
  AuthPrimaryButton,
  AuthSecondaryButton,
  AuthTitle,
} from '../auth-ui'

interface CheckEmailStepProps {
  email: string
  onResend: () => void
  onBackToSignIn: () => void
}

export function CheckEmailStep({
  email,
  onResend,
  onBackToSignIn,
}: CheckEmailStepProps) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
        <Mail className="h-6 w-6 text-emerald-600" strokeWidth={1.75} />
      </div>
      <AuthTitle>Check your email</AuthTitle>
      <p className="mt-3 text-[15px] leading-relaxed text-slate-500">
        We&apos;ve sent a password reset link to{' '}
        <span className="font-semibold text-[#0a0e27]">{email}</span>.
      </p>
      <p className="mt-1 text-sm text-slate-400">The link expires in 30 minutes.</p>

      <div className="mt-8 space-y-2.5">
        <AuthSecondaryButton onClick={onResend}>Resend email</AuthSecondaryButton>
        <AuthPrimaryButton type="button" onClick={onBackToSignIn}>
          Back to sign in
        </AuthPrimaryButton>
      </div>

      <p className="mt-8 text-sm text-slate-500">
        Didn&apos;t get it? Check spam, or{' '}
        <AuthLink>contact support</AuthLink>.
      </p>
    </div>
  )
}
