import { useEffect, useRef, useState } from 'react'
import {
  AuthBackButton,
  AuthLink,
  AuthPrimaryButton,
  AuthStepLabel,
  AuthSubtitle,
  AuthTitle,
} from '../auth-ui'
import { cn } from '@/lib/utils/cn'

interface VerifyStepProps {
  isLoading?: boolean
  onBack: () => void
  onVerify: (code: string) => void
}

const CODE_LENGTH = 6

export function VerifyStep({ isLoading, onBack, onVerify }: VerifyStepProps) {
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const [secondsLeft, setSecondsLeft] = useState(5 * 60 - 3)
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')

  const setDigitAt = (index: number, value: string) => {
    const char = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = char
    setDigits(next)
    if (char && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH)
    if (!pasted) return
    const next = Array(CODE_LENGTH).fill('')
    pasted.split('').forEach((ch, i) => {
      next[i] = ch
    })
    setDigits(next)
    inputsRef.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const code = digits.join('')
    if (code.length !== CODE_LENGTH) return
    onVerify(code)
  }

  const complete = digits.every((d) => d.length === 1)

  return (
    <div>
      <AuthBackButton onClick={onBack} />
      <AuthStepLabel>Step 3 of 3 · Verify</AuthStepLabel>
      <AuthTitle>Two-factor verification</AuthTitle>
      <AuthSubtitle>Enter the 6-digit code from your authenticator app.</AuthSubtitle>

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="flex justify-between gap-2 sm:gap-2.5">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el
              }}
              type="text"
              inputMode="numeric"
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              maxLength={1}
              value={digit}
              onChange={(e) => setDigitAt(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              aria-label={`Digit ${i + 1}`}
              className={cn(
                'h-12 w-11 rounded-lg border text-center text-lg font-semibold text-[#0a0e27] outline-none transition-shadow sm:h-14 sm:w-12',
                digit
                  ? 'border-[#0a0e27]'
                  : 'border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30'
              )}
            />
          ))}
        </div>

        <p className="mt-4 text-sm text-slate-500">
          Code expires in {mm}:{ss} ·{' '}
          <AuthLink
            onClick={() => setSecondsLeft(5 * 60)}
            className="text-slate-700"
          >
            Resend code
          </AuthLink>{' '}
          ·{' '}
          <AuthLink className="text-slate-700">Use a backup code</AuthLink>
        </p>

        <AuthPrimaryButton className="mt-6" disabled={!complete || isLoading}>
          {isLoading ? 'Verifying…' : 'Verify and sign in'}
        </AuthPrimaryButton>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Having trouble? <AuthLink>Contact support</AuthLink>
      </p>
    </div>
  )
}
