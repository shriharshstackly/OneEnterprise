import { Download, RefreshCw } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ROLE_HIERARCHY, ROLE_LABELS, type Role } from '@/lib/constants/roles'

export default function Dashboard() {
  const { user } = useAuth()

  const primaryRole = user?.roles?.length
    ? [...user.roles].sort((a, b) => ROLE_HIERARCHY[b] - ROLE_HIERARCHY[a])[0]
    : undefined
  const roleLabel = primaryRole
    ? ROLE_LABELS[primaryRole as Role] || primaryRole
    : 'Admin'

  return (
    <PageContainer>
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

      <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
        <p className="text-sm text-slate-500">
          Signed in as{' '}
          <span className="font-medium text-[#0b1f4d]">
            {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
          </span>
          . Platform administration shell is ready for module widgets.
        </p>
      </div>
    </PageContainer>
  )
}
