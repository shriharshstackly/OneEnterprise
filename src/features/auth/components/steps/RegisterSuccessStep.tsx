import { Check, Mail } from 'lucide-react'
import { AuthLink, AuthPrimaryButton, AuthTitle } from '../auth-ui'

interface RegisterSuccessStepProps {
  orgName: string
  workspaceCode: string
  onGoToSignIn: () => void
  onResendVerification?: () => void
}

export function RegisterSuccessStep({
  orgName,
  workspaceCode,
  onGoToSignIn,
  onResendVerification,
}: RegisterSuccessStepProps) {
  return (
    <div className="text-center py-2">
      {/* Green checkmark icon */}
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100/70">
        <Check className="h-7 w-7 text-emerald-600" strokeWidth={2.5} />
      </div>

      <AuthTitle>Welcome to One Enterprise</AuthTitle>

      <p className="mt-2 text-sm leading-relaxed text-slate-500 max-w-sm mx-auto">
        <strong className="font-semibold text-slate-800">{orgName || 'ABC Technologies Pvt Ltd'}</strong> is ready. Your Super Admin account has been created — verify your email to activate full access.
      </p>

      {/* Blue notification box */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-left text-xs text-blue-900">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100/80 text-[#2563eb]">
          <Mail className="h-4 w-4" />
        </div>
        <p className="leading-relaxed">
          We&apos;ve sent a verification link to your official email. Your workspace:{' '}
          <strong className="font-mono font-semibold text-slate-900">{workspaceCode.toLowerCase() || 'abc-tech'}.oneenterprise.io</strong>
        </p>
      </div>

      <AuthPrimaryButton type="button" onClick={onGoToSignIn} className="w-full">
        Go to sign in
      </AuthPrimaryButton>

      <p className="mt-6 text-center text-xs text-slate-500">
        Didn&apos;t get the email?{' '}
        <AuthLink onClick={onResendVerification}>Resend verification</AuthLink>
      </p>
    </div>
  )
}
