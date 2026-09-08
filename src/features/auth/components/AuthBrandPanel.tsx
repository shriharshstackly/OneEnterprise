import { Clock, Lock, Shield } from 'lucide-react'

/** Positions in SVG coords — inset so long labels (WORKFLOW, ANALYTICS) stay inside */
const MODULES = [
  { label: 'HRMS', x: 100, y: 48, side: 'left' as const },
  { label: 'CRM', x: 72, y: 130, side: 'left' as const },
  { label: 'ERP', x: 104, y: 212, side: 'left' as const },
  { label: 'FINANCE', x: 400, y: 48, side: 'right' as const },
  { label: 'WORKFLOW', x: 418, y: 130, side: 'right' as const },
  { label: 'ANALYTICS', x: 396, y: 212, side: 'right' as const },
] as const

const CX = 250
const CY = 130

export function AuthBrandPanel() {
  return (
    <aside className="relative hidden h-full w-1/2 min-w-0 flex-col overflow-hidden bg-[#0a0e27] px-8 py-7 lg:flex xl:px-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 55%, rgba(99,102,241,0.18) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex shrink-0 items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-[#9fe870] to-[#e8d44d] text-[11px] font-bold tracking-tight text-[#0a0e27]">
          1E
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-white">
          One Enterprise
        </span>
      </div>

      <div className="relative z-10 mt-8 max-w-lg shrink-0 xl:mt-10">
        <p className="text-[11px] font-medium tracking-[0.14em] text-[#7dd3c7]">
          CLOUD PLATFORM · HRMS · CRM · ERP · FINANCE · AI
        </p>
        <h1 className="mt-3 text-[2.15rem] font-bold leading-[1.12] tracking-tight xl:text-[2.5rem]">
          <span className="block text-white">Every operation.</span>
          <span className="block bg-gradient-to-r from-[#e8a04a] to-[#f0c56a] bg-clip-text text-transparent">
            One sign-in.
          </span>
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55 xl:text-[15px]">
          HR, sales, procurement, finance and your AI copilot — running on one
          identity, one policy, one audit trail.
        </p>
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center py-4">
        <svg
          viewBox="0 0 520 260"
          className="h-full max-h-[240px] w-full max-w-[520px]"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <defs>
            <radialGradient id="aiGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.55" />
              <stop offset="70%" stopColor="#6366f1" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </radialGradient>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle cx={CX} cy={CY} r="72" fill="url(#aiGlow)" />

          {MODULES.map((node, i) => {
            const dashed = i % 2 === 1
            return (
              <path
                key={`line-${node.label}`}
                d={`M ${CX} ${CY} Q ${(CX + node.x) / 2} ${node.y < CY ? node.y - 18 : node.y + 18} ${node.x} ${node.y}`}
                fill="none"
                stroke={dashed ? 'rgba(148,163,184,0.35)' : 'rgba(94,234,212,0.45)'}
                strokeWidth="1.25"
                strokeDasharray={dashed ? '4 5' : undefined}
              />
            )
          })}

          {MODULES.map((node) => {
            const isLeft = node.side === 'left'
            return (
              <g key={node.label}>
                <circle cx={node.x} cy={node.y} r="5" fill="#818cf8" opacity="0.9" />
                <circle cx={node.x} cy={node.y} r="9" fill="#818cf8" opacity="0.2" />
                <text
                  x={isLeft ? node.x - 14 : node.x + 14}
                  y={node.y + 4}
                  textAnchor={isLeft ? 'end' : 'start'}
                  fill="rgba(226,232,240,0.75)"
                  fontSize="11"
                  fontWeight="500"
                  letterSpacing="0.04em"
                >
                  {node.label}
                </text>
              </g>
            )
          })}

          <circle
            cx={CX}
            cy={CY}
            r="28"
            fill="#12163a"
            stroke="#a5b4fc"
            strokeWidth="1.5"
            filter="url(#softGlow)"
          />
          <circle
            cx={CX}
            cy={CY}
            r="34"
            fill="none"
            stroke="rgba(251,191,36,0.25)"
            strokeWidth="1"
          />
          <text
            x={CX}
            y={CY + 5}
            textAnchor="middle"
            fill="#e0e7ff"
            fontSize="13"
            fontWeight="700"
            letterSpacing="0.08em"
          >
            AI
          </text>
        </svg>
      </div>

      <footer className="relative z-10 shrink-0 border-t border-white/10 pt-4">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-white/45">
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
