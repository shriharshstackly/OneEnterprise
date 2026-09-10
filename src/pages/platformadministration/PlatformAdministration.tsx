import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Activity,
  Building2,
  ChevronRight,
  FileText,
  Globe2,
  Grid2X2,
  Palette,
  RefreshCw,
  Settings,
  SlidersHorizontal,
  UsersRound,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { PageContainer } from '@/components/layout/PageContainer'
import { ROLE_HIERARCHY, ROLE_LABELS, type Role } from '@/lib/constants/roles'

type ManagementCard = {
  title: string
  description: string
  href: string
  icon: LucideIcon
}

const stats = [
  { label: 'Organizations', value: '1,842', detail: '↑ 4.2% this month', icon: Building2, tone: 'mint' },
  { label: 'Total Users', value: '96,412', detail: '↑ 1.8% this month', icon: UsersRound, tone: 'blue' },
  { label: 'Licenses Active', value: '2,140', detail: '27 expiring < 30 days', icon: FileText, tone: 'rose' },
  { label: 'Platform Uptime', value: '99.98%', detail: 'Healthy — all regions', icon: Activity, tone: 'dark' },
] as const

const statToneClasses = {
  mint: 'border border-slate-200/90 bg-white text-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.08),0_1px_2px_rgba(15,23,42,0.04)]',
  blue: 'border border-slate-200/90 bg-white text-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.08),0_1px_2px_rgba(15,23,42,0.04)]',
  rose: 'border border-slate-200/90 bg-white text-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.08),0_1px_2px_rgba(15,23,42,0.04)]',
  dark: 'border border-transparent bg-gradient-to-br from-[#3044d5] to-[#161c62] text-white shadow-[0_2px_5px_rgba(24,36,112,0.22)]',
} as const

const statIconClasses = {
  mint: 'bg-[#eaf8f2] text-[#24966f]',
  blue: 'bg-[#edf3ff] text-[#3569df]',
  rose: 'bg-[#fff3e9] text-[#ff791f]',
  dark: 'bg-white/15 text-white',
} as const

const managementGroups = [
  {
    group: 'Super Admin Management',
    cards: [
      {
        title: 'Super Admin Dashboard',
        description: 'Platform status, KPIs, system health, and recent admin activity at a glance.',
        href: '/dashboard',
        icon: Grid2X2,
      },
      {
        title: 'Global Dashboard',
        description: 'Platform-wide KPIs across every organization — tenants by plan, onboarding trends.',
        href: '/global-dashboard',
        icon: Globe2,
      },
      {
        title: 'Platform Configuration',
        description: 'Platform name, timezone, session limits, upload size, and environment defaults.',
        href: '/platform-configuration',
        icon: Settings,
      },
      {
        title: 'Settings',
        description: 'Platform behavior toggles, regional defaults, security policy, and notifications.',
        href: '/settings',
        icon: SlidersHorizontal,
      },
      {
        title: 'Platform Branding',
        description: 'Logo, brand colors, login background, and custom domain for the platform shell.',
        href: '/platform-branding',
        icon: Palette,
      },
      {
        title: 'Feature Management',
        description: 'Roll features out by plan tier, and track rollout percentage across tenants.',
        href: '/feature-management',
        icon: Zap,
      },
      {
        title: 'License Management',
        description: 'Seat usage, renewal dates, and license status across every organization.',
        href: '/license-management',
        icon: FileText,
      },
      {
        title: 'Platform Health Overview',
        description: 'Live status per service — auth, API gateway, database, queue, storage, AI engine.',
        href: '/platform-administration',
        icon: Activity,
      },
    ] satisfies ManagementCard[],
  },
  {
    group: 'Organization',
    cards: [
      {
        title: 'Company Setup',
        description: 'Business units, departments, branches, and legal entity details.',
        href: '/company-setup',
        icon: Building2,
      },
      {
        title: 'User Management',
        description: 'Invite, deactivate, and manage roles for every user across the organization.',
        href: '/user-management',
        icon: UsersRound,
      },
    ] satisfies ManagementCard[],
  },
]

export default function PlatformAdministration() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [refreshing, setRefreshing] = useState(false)

  const primaryRole = user?.roles?.length
    ? [...user.roles].sort((a, b) => ROLE_HIERARCHY[b] - ROLE_HIERARCHY[a])[0]
    : undefined
  const roleLabel = primaryRole
    ? ROLE_LABELS[primaryRole as Role] || primaryRole
    : 'Admin'

  const handleRefresh = () => {
    setRefreshing(true)
    window.setTimeout(() => setRefreshing(false), 650)
  }

  return ( 
    
    // <div className="min-h-full bg-[#f5f7fb] px-5 py-5 text-slate-900 sm:px-6 lg:px-8">
    <PageContainer className="space-y-6">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#7790b4]">
            Platform Administration
          </p>
          <h1 className="m-0 text-[clamp(1.7rem,2vw,2.15rem)] font-bold leading-tight tracking-[-0.04em] text-[#102b57]">
            Platform Administration
          </h1>
          <p className="mt-2 text-sm font-medium text-[#5e7599]">Welcome back, {roleLabel}</p>
        </div>

        <button
          type="button"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-[11px] font-semibold text-[#183766] shadow-sm transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md disabled:cursor-wait disabled:opacity-70"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={refreshing ? 'animate-spin' : ''} size={14} />
          {refreshing ? 'Refreshing' : 'Refresh'}
        </button>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 " aria-label="Platform metrics">
        {stats.map((stat) => {
          const Icon = stat.icon
          const toneClass = statToneClasses[stat.tone]
          const iconClass = statIconClasses[stat.tone]

          return (
            <article
              key={stat.label}
              className={`flex min-h-[8.1rem] items-start justify-between rounded-2xl p-5 ${toneClass}`}
            >
              <div>
                <span
                  className={`mb-3 block text-[10px] font-semibold uppercase tracking-[0.11em] ${
                    stat.tone === 'dark' ? 'text-white/70' : 'text-[#7890b2]'
                  }`}
                >
                  {stat.label}
                </span>

                <strong
                  className={`block text-[clamp(1.45rem,2vw,1.8rem)] font-bold leading-none tracking-[-0.045em] ${
                    stat.tone === 'dark' ? 'text-white' : 'text-[#092b62]'
                  }`}
                >
                  {stat.value}
                </strong>

                <small
                  className={`mt-3 block text-[10px] font-semibold ${
                    stat.tone === 'dark'
                      ? 'text-[#ffd52a]'
                      : stat.tone === 'rose'
                        ? 'text-[#657997]'
                        : 'text-[#00a979]'
                  }`}
                >
                  {stat.detail}
                </small>
              </div>

              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${iconClass}`}>
                <Icon size={18} strokeWidth={1.8} />
              </div>
            </article>
          )
        })}
      </section>

      <div className="mt-7 space-y-7">
        {managementGroups.map((section) => (
          <section key={section.group}>
            <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7790b4]">
              {section.group}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {section.cards.map((card) => {
                const Icon = card.icon

                return (
                  <button
                    key={card.title}
                    type="button"
                    className="group relative  min-h-[7.6rem] w-full items-start gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 text-left text-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.07)] transition-all duration-150 hover:-translate-y-0.5 hover:border-[#b9c3ff] hover:shadow-[0_8px_20px_rgba(35,54,155,0.09)]"
                    onClick={() => navigate(card.href)}
                  >
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#eef3ff] text-[#2d67e6]">
                      <Icon size={17} strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0 pr-5">
                      <strong className="mt-0.5 mb-1.5 block text-[13px] font-bold leading-5 text-[#092b62]">
                        {card.title}
                      </strong>
                      <span className="block text-[11px] leading-[1.55] text-[#647b9d]">
                        {card.description}
                      </span>
                    </div>

                    <ChevronRight
                      className="absolute right-3 top-4 text-[#9aaac0] transition-transform duration-150 group-hover:translate-x-0.5"
                      size={15}
                    />
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-7 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
        <p className="m-0 text-sm leading-6 text-[#647b9d]">
          Signed in as{' '}
          <span className="font-bold text-[#092b62]">
            {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
          </span>
          . Platform administration shell is ready for module widgets.
        </p>
      </div>
    {/* </div> */}
      </PageContainer>
  )
}

