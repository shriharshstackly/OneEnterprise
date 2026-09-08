import { Home } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import { Breadcrumbs } from './Breadcrumbs'
import { UserMenu } from '@/components/navigation/UserMenu'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ROUTES } from '@/lib/constants/routes'

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard',
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function Header() {
  const { user } = useAuth()
  const location = useLocation()

  const title = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean)
    const last = segments[segments.length - 1]
    if (!last) return 'Dashboard'
    return pageTitles[last] || last.charAt(0).toUpperCase() + last.slice(1)
  }, [location.pathname])

  const displayName = user?.firstName?.toLowerCase() || 'user'

  return (
    <header className="shrink-0 bg-white">
      <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-navy">{title}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {getGreeting()}, {displayName}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <UserMenu />
        </div>
      </div>

      <div
        className="breadcrumb-bar flex items-center gap-2 rounded-bl-xl bg-brand-navy px-6 py-2.5 text-sm text-white"
        style={{
          backgroundImage:
            'repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(47,107,255,0.12) 8px, rgba(47,107,255,0.12) 16px)',
        }}
      >
        <Home className="h-3.5 w-3.5 shrink-0 opacity-90" />
        <Link to={ROUTES.DASHBOARD} className="opacity-90 hover:opacity-100">
          Home
        </Link>
        <span className="opacity-50">&gt;</span>
        <Breadcrumbs variant="onPrimary" />
      </div>
    </header>
  )
}
