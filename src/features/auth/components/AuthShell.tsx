import type { ReactNode } from 'react'
import { AuthBrandPanel } from './AuthBrandPanel'

interface AuthShellProps {
  children: ReactNode
  /** Center content vertically (status screens) vs top-aligned form */
  centered?: boolean
}

export function AuthShell({ children, centered = false }: AuthShellProps) {
  return (
    <div className="flex h-dvh overflow-hidden bg-white">
      <AuthBrandPanel />
      <main className="flex h-full w-full flex-col overflow-hidden lg:w-1/2">
        <div
          className={
            centered
              ? 'flex h-full flex-col items-center justify-center px-6 py-6 sm:px-10'
              : 'flex h-full flex-col justify-center px-6 py-6 sm:px-10 lg:px-14 xl:px-16'
          }
        >
          <div className={centered ? 'w-full max-w-[380px]' : 'mx-auto w-full max-w-[400px]'}>
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
