import { useState } from 'react'
import {
  AuthDivider,
  AuthFieldLabel,
  AuthLink,
  AuthPrimaryButton,
  AuthSecondaryButton,
  AuthStepLabel,
  AuthSubtitle,
  AuthTitle,
} from '../auth-ui'

interface IdentifyStepProps {
  workspace: string
  email: string
  onContinue: (data: { workspace: string; email: string }) => void
  onCreateAccount?: () => void
  isLoading?: boolean
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function MicrosoftIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 23 23" aria-hidden>
      <path fill="#f35325" d="M1 1h10v10H1z" />
      <path fill="#81bc06" d="M12 1h10v10H12z" />
      <path fill="#05a6f0" d="M1 12h10v10H1z" />
      <path fill="#ffba08" d="M12 12h10v10H12z" />
    </svg>
  )
}

function SsoIcon() {
  return (
    <svg
      className="h-4 w-4 text-slate-600"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M4 20a8 8 0 0 1 16 0" />
      <path d="M19 8v4M17 10h4" />
    </svg>
  )
}

export function IdentifyStep({
  workspace: initialWorkspace,
  email: initialEmail,
  onContinue,
  onCreateAccount,
  isLoading,
}: IdentifyStepProps) {
  const [workspace, setWorkspace] = useState(initialWorkspace)
  const [email, setEmail] = useState(initialEmail)
  const [errors, setErrors] = useState<{ workspace?: string; email?: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (!workspace.trim()) next.workspace = 'Enter your workspace'
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = 'Enter a valid work email'
    }
    setErrors(next)
    if (Object.keys(next).length) return
    onContinue({ workspace: workspace.trim().toLowerCase(), email: email.trim() })
  }

  return (
    <div>
      <AuthStepLabel>Step 1 of 3 · Identify</AuthStepLabel>
      <AuthTitle>Sign in</AuthTitle>
      <AuthSubtitle>Enter your workspace and work email to continue.</AuthSubtitle>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <AuthFieldLabel htmlFor="workspace">Workspace</AuthFieldLabel>
          <div className="flex h-10 overflow-hidden rounded-lg border border-slate-200 focus-within:border-[#0a0e27] focus-within:ring-2 focus-within:ring-[#0a0e27]/10 sm:h-11">
            <input
              id="workspace"
              value={workspace}
              onChange={(e) => setWorkspace(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
              placeholder="acmecorp"
              className="min-w-0 flex-1 bg-white px-3 text-sm text-[#0a0e27] outline-none placeholder:text-slate-400"
              autoComplete="organization"
            />
            <span className="flex shrink-0 items-center border-l border-slate-200 bg-slate-50 px-3 text-sm text-slate-400">
              .oneenterprise.io
            </span>
          </div>
          {errors.workspace && (
            <p className="mt-1.5 text-sm text-red-600">{errors.workspace}</p>
          )}
          <p className="mt-1.5 text-sm text-slate-500">
            Don&apos;t know your workspace?{' '}
            <AuthLink>Find it here</AuthLink>
          </p>
        </div>

        <div>
          <AuthFieldLabel htmlFor="email">Work email</AuthFieldLabel>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@acmecorp.com"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-[#0a0e27] outline-none placeholder:text-slate-400 focus:border-[#0a0e27] focus:ring-2 focus:ring-[#0a0e27]/10 sm:h-11"
            autoComplete="email"
          />
          {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
        </div>

        <AuthPrimaryButton disabled={isLoading}>
          {isLoading ? 'Continuing…' : 'Continue'}
        </AuthPrimaryButton>
      </form>

      <AuthDivider label="or continue with" />

      <div className="space-y-2">
        <AuthSecondaryButton type="button">
          <GoogleIcon />
          Google
        </AuthSecondaryButton>
        <AuthSecondaryButton type="button">
          <MicrosoftIcon />
          Microsoft
        </AuthSecondaryButton>
        <AuthSecondaryButton type="button">
          <SsoIcon />
          Company SSO (SAML)
        </AuthSecondaryButton>
      </div>

      <p className="mt-5 text-center text-sm text-slate-500">
        New to One Enterprise? <AuthLink onClick={onCreateAccount}>Create an account</AuthLink>
      </p>
    </div>
  )
}
