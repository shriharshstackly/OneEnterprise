import type { LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  Bell,
  Building2,
  Check,
  Database,
  Download,
  FileText,
  HardDrive,
  KeyRound,
  Lock,
  RefreshCw,
  ScrollText,
  Server,
  Settings,
  Shield,
  ShieldAlert,
  Users,
  Wifi,
} from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ROLE_HIERARCHY, ROLE_LABELS, type Role } from '@/lib/constants/roles'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/cn'

const overview = [
  {
    label: 'Total Users',
    value: '96,412',
    hint: '+1.8% this month',
    hintClass: 'text-emerald-600',
    icon: Users,
    iconWrap: 'bg-emerald-50 text-emerald-600',
  },
  {
    label: 'Active Users',
    value: '78,920',
    hint: '4,215 online now',
    hintClass: 'text-blue-600',
    icon: Check,
    iconWrap: 'bg-blue-50 text-blue-600',
  },
  {
    label: 'Organizations',
    value: '1,842',
    hint: '+4.2% this month',
    hintClass: 'text-emerald-600',
    icon: Building2,
    iconWrap: 'bg-orange-50 text-orange-500',
  },
] as const

const systemStatus = [
  { label: 'Server Status', value: 'Healthy', tone: 'ok' as const, icon: Server },
  { label: 'Database', value: 'Connected', tone: 'ok' as const, icon: Database },
  { label: 'API Gateway', value: 'Running', tone: 'ok' as const, icon: Wifi },
  { label: 'Storage', value: '68% used', tone: 'warn' as const, icon: HardDrive },
]

const resources = [
  { label: 'CPU usage', value: 42, bar: 'bg-[#1c3979]' },
  { label: 'Memory usage', value: 57, bar: 'bg-[#1c3979]' },
  { label: 'Storage', value: 68, bar: 'bg-emerald-500' },
]

const quickNav: {
  title: string
  description: string
  icon: LucideIcon
  path: string
}[] = [
    {
      title: 'User Management',
      description: 'Invite, roles and access control',
      icon: Users,
      path: ROUTES.USER_MANAGEMENT,
    },
    {
      title: 'Platform Settings',
      description: 'Identity, region and defaults',
      icon: Settings,
      path: ROUTES.SETTINGS,
    },
    {
      title: 'License Management',
      description: 'Seats, renewals and expiry',
      icon: KeyRound,
      path: ROUTES.LICENSE_MANAGEMENT,
    },
    {
      title: 'Audit Logs',
      description: 'Security and change history',
      icon: ScrollText,
      path: ROUTES.AUDIT_LOGS,
    },
    {
      title: 'Notifications',
      description: 'Alerts, digests and channels',
      icon: Bell,
      path: ROUTES.NOTIFICATIONS,
    },
    {
      title: 'Backup & Recovery',
      description: 'Snapshots and restore points',
      icon: HardDrive,
      path: ROUTES.BACKUP,
    },
    {
      title: 'Reports',
      description: 'Usage, licenses and activity',
      icon: FileText,
      path: ROUTES.REPORTS,
    },
    {
      title: 'Security Center',
      description: 'Policies, lockouts and MFA',
      icon: Shield,
      path: ROUTES.SECURITY_CENTER,
    },
  ]

const alerts = [
  {
    tone: 'amber' as const,
    title: '27 licenses expiring within 30 days.',
    detail: 'Review renewals for Acme Corp, Northwind and 8 other tenants.',
  },
  {
    tone: 'blue' as const,
    title: '3 organizations awaiting activation approval.',
    detail: 'Pending reviews in Platform Administration.',
  },
  {
    tone: 'orange' as const,
    title: 'Unusual login pattern detected.',
    detail: 'Multiple failed attempts from a new location on j.mehta@acmecorp.com.',
  },
]

const logins = [
  {
    name: 'Priya Sharma',
    detail: 'Signed in · Mumbai, IN',
    time: '14 minutes ago',
    tone: 'ok' as const,
  },
  {
    name: 'Daniel Chen',
    detail: 'Signed in · Singapore, SG',
    time: '41 minutes ago',
    tone: 'ok' as const,
  },
  {
    name: 'j.mehta@acmecorp.com',
    detail: '5 failed attempts — account locked',
    time: '1 hour ago',
    tone: 'danger' as const,
  },
  {
    name: 'Aisha Rahman',
    detail: 'New device challenge · London, UK',
    time: '3 hours ago',
    tone: 'warn' as const,
  },
]

const alertTone = {
  amber: 'border-amber-200 bg-amber-50 text-amber-900',
  blue: 'border-sky-200 bg-sky-50 text-sky-900',
  orange: 'border-orange-200 bg-orange-50 text-orange-900',
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-3 text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
      {children}
    </p>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const primaryRole = user?.roles?.length
    ? [...user.roles].sort((a, b) => ROLE_HIERARCHY[b] - ROLE_HIERARCHY[a])[0]
    : undefined
  const roleLabel = primaryRole
    ? ROLE_LABELS[primaryRole as Role] || primaryRole
    : 'Admin'

  return (
    <PageContainer className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0b1f4d]">
            Super Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">Welcome back, {roleLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-medium text-[#0b1f4d] transition-colors hover:bg-slate-50"
          >
            <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
            Refresh
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#2563eb] px-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <Download className="h-3.5 w-3.5" strokeWidth={2} />
            Export report
          </button>
        </div>
      </div>

      <section>
        <SectionLabel>Platform overview</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overview.map((card) => (
            <article
              key={card.label}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                    {card.label}
                  </p>
                  <p className="mt-2 text-[1.75rem] font-bold tracking-tight text-[#0b1f4d]">
                    {card.value}
                  </p>
                  <p className={cn('mt-1.5 text-xs font-medium', card.hintClass)}>
                    {card.hint}
                  </p>
                </div>
                <span
                  className={cn(
                    'inline-flex h-10 w-10 items-center justify-center rounded-xl',
                    card.iconWrap
                  )}
                >
                  <card.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
              </div>
            </article>
          ))}

          <article className="rounded-2xl bg-gradient-to-br from-[#2E44FF] to-[#0D1029] p-5 text-white shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.12em] text-white/55 uppercase">
                  Licenses Active
                </p>
                <p className="mt-2 text-[1.75rem] font-bold tracking-tight">2,140</p>
                <p className="mt-1.5 text-xs font-medium text-amber-300">
                  27 expiring &lt; 30 days
                </p>
              </div>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <FileText className="h-5 w-5" strokeWidth={1.75} />
              </span>
            </div>
          </article>
        </div>
      </section>

      <section>
        <SectionLabel>System status</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {systemStatus.map((item) => (
            <article
              key={item.label}
              className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3.5 shadow-sm"
            >
              <item.icon className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.75} />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold tracking-[0.1em] text-slate-400 uppercase">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-[#0b1f4d]">{item.value}</p>
              </div>
              <span
                className={cn(
                  'h-2 w-2 shrink-0 rounded-full',
                  item.tone === 'ok' ? 'bg-emerald-500' : 'bg-orange-400'
                )}
              />
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionLabel>Resource utilization</SectionLabel>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="grid gap-8 sm:grid-cols-3">
            {resources.map((row) => (
              <div key={row.label}>
                <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-600">{row.label}</span>
                  <span className="text-slate-900">{row.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn('h-full rounded-full', row.bar)}
                    style={{ width: `${row.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <SectionLabel>Quick navigation</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickNav.map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => navigate(item.path)}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-sm transition-colors hover:border-blue-200 hover:bg-slate-50/80"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <item.icon className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <p className="mt-3 text-sm font-semibold text-[#0b1f4d]">{item.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                {item.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-[#0b1f4d]">Security alerts</h2>
            <button
              type="button"
              onClick={() => navigate(ROUTES.SECURITY_CENTER)}
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              View all alerts
            </button>
          </div>
          <div className="space-y-2.5">
            {alerts.map((alert) => (
              <div
                key={alert.title}
                className={cn(
                  'flex gap-3 rounded-xl border px-3.5 py-3',
                  alertTone[alert.tone]
                )}
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
                <div>
                  <p className="text-sm font-semibold">{alert.title}</p>
                  <p className="mt-0.5 text-xs opacity-80">{alert.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-[#0b1f4d]">
            Recent login activities
          </h2>
          <ul className="space-y-3.5">
            {logins.map((row) => (
              <li key={row.name + row.time} className="flex items-start gap-3">
                <span
                  className={cn(
                    'mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                    row.tone === 'ok' && 'bg-emerald-50 text-emerald-600',
                    row.tone === 'warn' && 'bg-amber-50 text-amber-600',
                    row.tone === 'danger' && 'bg-red-50 text-red-600'
                  )}
                >
                  {row.tone === 'ok' && <Check className="h-4 w-4" strokeWidth={2} />}
                  {row.tone === 'warn' && (
                    <ShieldAlert className="h-4 w-4" strokeWidth={1.75} />
                  )}
                  {row.tone === 'danger' && <Lock className="h-4 w-4" strokeWidth={1.75} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#0b1f4d]">{row.name}</p>
                  <p className="truncate text-xs text-slate-500">{row.detail}</p>
                </div>
                <span className="shrink-0 text-[11px] text-slate-400">{row.time}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </PageContainer>
  )
}
