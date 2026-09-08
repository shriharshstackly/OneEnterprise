import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export function AuthStepLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-medium tracking-[0.12em] text-slate-400 uppercase">
      {children}
    </p>
  )
}

export function AuthTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-1.5 text-[1.5rem] font-bold tracking-tight text-[#0a0e27] sm:text-[1.65rem]">
      {children}
    </h2>
  )
}

export function AuthSubtitle({ children }: { children: ReactNode }) {
  return <p className="mt-1.5 text-sm leading-relaxed text-slate-500 sm:text-[15px]">{children}</p>
}

export function AuthBackButton({
  onClick,
  label = 'Back',
}: {
  onClick: () => void
  label?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-5 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-[#0a0e27]"
    >
      <ChevronLeft className="h-4 w-4" />
      {label}
    </button>
  )
}

export function AuthPrimaryButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="submit"
      className={cn(
        'flex h-10 w-full items-center justify-center rounded-lg bg-[#0a0e27] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:text-[15px]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function AuthSecondaryButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        'flex h-10 w-full items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-medium text-[#0a0e27] transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:text-[14px]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function AuthFieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string
  children: ReactNode
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-[#0a0e27]">
      {children}
    </label>
  )
}

export function AuthLink({
  children,
  onClick,
  className,
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'font-medium text-[#2563eb] transition-colors hover:text-[#1d4ed8]',
        className
      )}
    >
      {children}
    </button>
  )
}

export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-white px-3 text-slate-400">{label}</span>
      </div>
    </div>
  )
}
