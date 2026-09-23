import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navigationConfig } from '@/config/navigation.config'
import { ROUTES } from '@/lib/constants/routes'

function findNavLabel(pathname: string): string | null {
  for (const group of navigationConfig) {
    for (const item of group.items) {
      if (pathname === item.path || pathname.startsWith(`${item.path}/`)) {
        return item.label
      }
    }
  }
  return null
}

/** Sits below the white top bar, in the page content area (Figma). */
export function PageBreadcrumbs() {
  const location = useLocation()

  const currentLabel = useMemo(() => {
    if (location.pathname === ROUTES.DASHBOARD) return 'Dashboard'
    return findNavLabel(location.pathname) || 'Dashboard'
  }, [location.pathname])

  return (
    <nav className="mb-4 flex items-center gap-1.5 text-sm">
      <Link
        to={ROUTES.DASHBOARD}
        className="text-slate-400 transition-colors hover:text-slate-600"
      >
        Platform Administration
      </Link>
      <span className="text-slate-300">/</span>
      <span className="font-semibold text-[#0b1f4d]">{currentLabel}</span>
    </nav>
  )
}
