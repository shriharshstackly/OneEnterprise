import { Clock, Lock, Shield } from 'lucide-react'

const PILLARS = ['Secure', 'Scalable', 'Future-Ready'] as const

export function AuthBrandPanel() {
  return (
    <aside className="relative hidden h-full w-1/2 min-w-0 flex-col overflow-hidden bg-[#f4f8fc] px-8 py-7 lg:flex xl:px-12">
      {/* Soft sky — light wash only (no dark blue blotch) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 40% at 78% 12%, rgba(210,228,255,0.35) 0%, transparent 70%), linear-gradient(180deg, #fbfcfe 0%, #f6f9fc 45%, #f2f6fb 100%)',
        }}
      />

      {/* Misty mountain landscape — matches Figma atmospheric background */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[28%] z-0 overflow-hidden">
        <img
          src="/logos/auth-mountains.png"
          alt=""
          className="absolute inset-0 h-full w-full scale-105 object-cover object-[center_40%] opacity-90"
          draggable={false}
        />
        {/* Soft blend into sky */}
        <div
          className="absolute inset-x-0 top-0 h-[42%]"
          style={{
            background:
              'linear-gradient(180deg, #f4f8fc 0%, rgba(244,248,252,0.85) 35%, rgba(244,248,252,0) 100%)',
          }}
        />
        {/* Soft floor fade for footer readability */}
        <div
          className="absolute inset-x-0 bottom-0 h-[28%]"
          style={{
            background:
              'linear-gradient(0deg, #f2f6fb 0%, rgba(242,246,251,0.75) 45%, rgba(242,246,251,0) 100%)',
          }}
        />
      </div>

      {/* Logo */}
      <div className="relative z-10 shrink-0">
        <img
          src="/logos/logo-stackly.svg"
          alt="Stackly"
          className="h-9 w-auto"
        />
      </div>

      {/* Hero copy */}
      <div className="relative z-10 mt-5 max-w-xl shrink-0 xl:mt-6">
        <p className="text-[11px] font-medium tracking-[0.14em] text-slate-400 uppercase">
          Cloud Platform – HRMS – CRM – ERP – Finance – AI
        </p>
        <h1 className="mt-2.5 text-[1.9rem] font-bold leading-[1.15] tracking-tight text-[#0b1f4d] xl:text-[2.35rem]">
          <span className="block">One identity.</span>
          <span className="block">
            <span className="bg-gradient-to-r from-[#3b82f6] via-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">
              Infinite
            </span>{' '}
            Potential.
          </span>
        </h1>
        <p className="mt-2.5 max-w-md text-sm leading-relaxed text-slate-500">
          A unified platform to connect your people, data and operations —
          securely, everywhere.
        </p>
      </div>

      {/* Spacer so footer stays pinned; graphic is absolutely placed like Figma */}
      <div className="relative z-10 min-h-0 flex-1" aria-hidden />

      {/* Orbit graphic — larger + biased right to match Figma */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[7.5rem] top-[11rem] z-[5] flex items-center justify-end pr-2 xl:bottom-[8rem] xl:top-[12rem] xl:pr-3">
        <img
          src="/logos/auth-orbit.svg"
          alt=""
          className="h-[90%] w-auto max-w-[min(540px,80%)] object-contain object-right drop-shadow-sm xl:h-[94%] xl:max-w-[min(580px,84%)]"
          draggable={false}
        />
      </div>

      {/* Values + tagline */}
      <div className="relative z-10 mb-3 flex shrink-0 items-end justify-between gap-4">
        <div>
          <div className="mb-2 h-0.5 w-8 rounded-full bg-[#3b82f6]" />
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] font-semibold tracking-wide text-[#0b1f4d]">
            {PILLARS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <p className="text-right text-[10px] font-medium leading-[1.35] tracking-[0.14em] text-slate-400 uppercase">
          Built for
          <br />
          a brighter
          <br />
          tomorrow
        </p>
      </div>

      {/* Trust badges */}
      <footer className="relative z-10 shrink-0 border-t border-slate-200/80 pt-3">
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-slate-400">
          <li className="flex items-center gap-1.5">
            <Shield className="h-3 w-3" strokeWidth={1.75} />
            SOC 2 Type II
          </li>
          <li className="flex items-center gap-1.5">
            <Lock className="h-3 w-3" strokeWidth={1.75} />
            ISO 27001
          </li>
          <li className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" strokeWidth={1.75} />
            99.95% uptime SLA
          </li>
        </ul>
      </footer>
    </aside>
  )
}
