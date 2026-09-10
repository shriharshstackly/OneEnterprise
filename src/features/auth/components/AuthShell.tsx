import type { ReactNode } from 'react'
import { AuthBrandPanel } from './AuthBrandPanel'

interface AuthShellProps {
  children: ReactNode
  /** Center content vertically (status screens) vs top-aligned form */
  centered?: boolean
  /** Wide width for multi-column registration forms */
  wide?: boolean
  /** Sticky top bar rendered above the scrollable content (e.g. back button + progress bar) */
  topBar?: ReactNode
}

export function AuthShell({ children, centered = false, wide = false, topBar }: AuthShellProps) {
  return (
    <div className="flex h-dvh overflow-hidden bg-white">
      <AuthBrandPanel />
      <main className="flex h-full w-full flex-col overflow-hidden lg:w-1/2">
        {/* Sticky top bar — stays fixed at the top, does NOT scroll */}
        {topBar && (
          <div className="shrink-0 px-6 pb-2 pt-6 sm:px-10 lg:px-12 xl:px-16">
            {topBar}
          </div>
        )}

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
          <div
            className={
              centered
                ? 'flex min-h-full flex-col items-center justify-center px-6 py-6 sm:px-10'
                : topBar
                  ? 'flex min-h-full flex-col justify-start px-6 pt-4 pb-10 sm:px-10 lg:px-12 xl:px-16'
                  : 'flex min-h-full flex-col justify-center px-6 py-8 sm:px-10 lg:px-12 xl:px-16'
            }
          >
            <div className={centered ? 'w-full max-w-[380px]' : wide ? 'mx-auto w-full max-w-[480px]' : 'mx-auto w-full max-w-[420px]'}>
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
