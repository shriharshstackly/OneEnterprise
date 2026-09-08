import { Check } from 'lucide-react'
import { AuthTitle } from '../auth-ui'

export function SuccessStep() {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
        <Check className="h-7 w-7 text-emerald-600" strokeWidth={2.5} />
      </div>
      <AuthTitle>You&apos;re in</AuthTitle>
      <p className="mt-3 text-[15px] text-slate-500">Redirecting to your dashboard...</p>
    </div>
  )
}
