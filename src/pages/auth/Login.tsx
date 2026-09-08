import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthShell } from '@/features/auth/components/AuthShell'
import { IdentifyStep } from '@/features/auth/components/steps/IdentifyStep'
import { PasswordStep } from '@/features/auth/components/steps/PasswordStep'
import { VerifyStep } from '@/features/auth/components/steps/VerifyStep'
import { ForgotPasswordStep } from '@/features/auth/components/steps/ForgotPasswordStep'
import { CheckEmailStep } from '@/features/auth/components/steps/CheckEmailStep'
import { LockedStep } from '@/features/auth/components/steps/LockedStep'
import { SuccessStep } from '@/features/auth/components/steps/SuccessStep'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { authService } from '@/features/auth/services/authService'
import { setToken, setRefreshToken } from '@/lib/auth/auth'
import { getHomeRoute } from '@/lib/auth/defaultRoute'
import { ApiError } from '@/lib/api/apiError'
import { useToast } from '@/hooks/useToast'
import type { AuthUser } from '@/types/auth.types'

type AuthView =
  | 'identify'
  | 'password'
  | 'verify'
  | 'forgot'
  | 'check-email'
  | 'locked'
  | 'success'

const MAX_ATTEMPTS = 5
const LOCK_SECONDS = 15 * 60

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { success: toastSuccess } = useToast()

  const [view, setView] = useState<AuthView>('identify')
  const [workspace, setWorkspace] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberDevice, setRememberDevice] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [showPasswordError, setShowPasswordError] = useState(false)
  const [lockSeconds, setLockSeconds] = useState(LOCK_SECONDS)
  const [isLoading, setIsLoading] = useState(false)
  const [pendingUser, setPendingUser] = useState<{
    user: AuthUser
    accessToken: string
    refreshToken: string
  } | null>(null)

  useEffect(() => {
    if (view !== 'locked') return
    setLockSeconds(LOCK_SECONDS)
    const id = window.setInterval(() => {
      setLockSeconds((s) => {
        if (s <= 1) {
          window.clearInterval(id)
          setFailedAttempts(0)
          setShowPasswordError(false)
          setView('password')
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [view])

  const finishLogin = useCallback(
    (payload: { user: AuthUser; accessToken: string; refreshToken: string }) => {
      setToken(payload.accessToken)
      setRefreshToken(payload.refreshToken)
      login(payload.user)
      toastSuccess('Login successful', `Welcome back, ${payload.user.firstName}!`)
      navigate(getHomeRoute(payload.user))
    },
    [login, navigate, toastSuccess]
  )

  const handleIdentify = ({
    workspace: nextWorkspace,
    email: nextEmail,
  }: {
    workspace: string
    email: string
  }) => {
    setWorkspace(nextWorkspace)
    setEmail(nextEmail)
    setShowPasswordError(false)
    setView('password')
  }

  const handlePasswordSubmit = async (nextPassword: string, remember: boolean) => {
    setIsLoading(true)
    setShowPasswordError(false)
    setPassword(nextPassword)
    setRememberDevice(remember)
    try {
      const response = await authService.login({
        email,
        password: nextPassword,
      })
      setFailedAttempts(0)
      setPendingUser({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      })
      setView('verify')
    } catch (err) {
      const nextFails = failedAttempts + 1
      setFailedAttempts(nextFails)
      if (nextFails >= MAX_ATTEMPTS) {
        setView('locked')
      } else {
        setShowPasswordError(true)
      }
      if (!(err instanceof ApiError)) {
        // keep UI error state only
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (_code: string) => {
    if (!pendingUser) return
    setIsLoading(true)
    try {
      // Demo: accept any 6-digit code after password succeeds
      void _code
      void rememberDevice
      void password
      setView('success')
      window.setTimeout(() => {
        finishLogin(pendingUser)
      }, 1200)
    } finally {
      setIsLoading(false)
    }
  }

  const resetToIdentify = () => {
    setView('identify')
    setShowPasswordError(false)
    setFailedAttempts(0)
    setPendingUser(null)
    setPassword('')
  }

  const centered =
    view === 'check-email' || view === 'locked' || view === 'success'

  return (
    <AuthShell centered={centered}>
      {view === 'identify' && (
        <IdentifyStep
          workspace={workspace}
          email={email}
          onContinue={handleIdentify}
        />
      )}

      {view === 'password' && (
        <PasswordStep
          workspace={workspace}
          email={email}
          attemptsRemaining={MAX_ATTEMPTS - failedAttempts}
          showError={showPasswordError}
          isLoading={isLoading}
          onBack={resetToIdentify}
          onSwitchAccount={resetToIdentify}
          onForgotPassword={() => setView('forgot')}
          onSubmit={handlePasswordSubmit}
        />
      )}

      {view === 'verify' && (
        <VerifyStep
          isLoading={isLoading}
          onBack={() => {
            setPendingUser(null)
            setView('password')
          }}
          onVerify={handleVerify}
        />
      )}

      {view === 'forgot' && (
        <ForgotPasswordStep
          email={email}
          isLoading={isLoading}
          onBack={() => setView(failedAttempts >= MAX_ATTEMPTS ? 'locked' : 'password')}
          onSend={(nextEmail) => {
            setEmail(nextEmail)
            setIsLoading(true)
            window.setTimeout(() => {
              setIsLoading(false)
              setView('check-email')
            }, 600)
          }}
        />
      )}

      {view === 'check-email' && (
        <CheckEmailStep
          email={email}
          onResend={() => {
            /* demo: no-op resend */
          }}
          onBackToSignIn={resetToIdentify}
        />
      )}

      {view === 'locked' && (
        <LockedStep
          email={email}
          lockSeconds={lockSeconds}
          onResetPassword={() => setView('forgot')}
          onBackToSignIn={resetToIdentify}
        />
      )}

      {view === 'success' && <SuccessStep />}
    </AuthShell>
  )
}
