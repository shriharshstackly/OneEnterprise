import { useLocation, useNavigate } from 'react-router-dom'
import { Check, ChevronDown, Languages, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { navigationConfig } from '@/config/navigation.config'
import { usePermissions } from '@/hooks/usePermissions'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useLocale } from '@/hooks/useLocale'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ROUTES } from '@/lib/constants/routes'
import { LANGUAGES } from '@/lib/i18n/locale'
import { ROLE_HIERARCHY, ROLE_LABELS, type Role } from '@/lib/constants/roles'
import type { NavigationItem } from '@/types/navigation.types'
import type { Permission } from '@/lib/constants/permissions'

function isRouteActive(pathname: string, path: string) {
  if (pathname === path) return true
  return path !== '/' && pathname.startsWith(`${path}/`)
}

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { can } = usePermissions()
  const { user, logout } = useAuth()
  const { locale, setLocale, language, t } = useLocale()

  const canSeeItem = (item: NavigationItem): boolean => {
    if (item.children?.length) {
      return item.children.some((child) => canSeeItem(child))
    }
    return !item.permission || can(item.permission as Permission)
  }

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : 'Guest'
  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : '?'
  const primaryRole = user?.roles?.length
    ? [...user.roles].sort((a, b) => ROLE_HIERARCHY[b] - ROLE_HIERARCHY[a])[0]
    : undefined
  const roleLabel = primaryRole
    ? ROLE_LABELS[primaryRole as Role] || primaryRole
    : 'User'

  const renderNavItem = (item: NavigationItem) => {
    if (!canSeeItem(item)) return null

    const Icon = item.icon
    const active = isRouteActive(location.pathname, item.path)

    return (
      <button
        key={item.path}
        type="button"
        onClick={() => navigate(item.path)}
        className={cn(
          'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition-colors',
          active
            ? 'border border-[#3b82f6]/70 bg-[#1a2744] text-white shadow-[inset_0_0_0_1px_rgba(59,130,246,0.25)]'
            : 'border border-transparent text-white/75 hover:bg-white/[0.06] hover:text-white'
        )}
      >
        {Icon && (
          <Icon
            className={cn('h-[18px] w-[18px] shrink-0', active ? 'text-white' : 'text-white/70')}
            strokeWidth={1.75}
          />
        )}
        <span className="truncate">{item.label}</span>
      </button>
    )
  }

  return (
    <aside className="relative flex h-screen w-[268px] min-h-0 shrink-0 flex-col overflow-hidden bg-[#0a0e27] text-white">
      {/* Header: logo + badge */}
      <div className="shrink-0 px-5 pt-3 pb-2">
        <img
          src="/icons/sidebar/logo-stackly-white.svg"
          alt="Stackly"
          className="h-14 w-auto max-w-[220px] object-contain object-left scale-105 origin-left"
        />
        <div className="mt-1.5 inline-flex rounded-full border border-white/10 bg-[#13253a] px-2.5 py-1">
          <span className="text-[9px] font-semibold tracking-[0.08em] text-[#7dd3c7] uppercase">
            Platform Administration
          </span>
        </div>
      </div>

      {/* Nav */}
      <div className="sidebar-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-3">
        {navigationConfig.map((group) => {
          const visibleItems = group.items.filter((item) => canSeeItem(item))
          if (visibleItems.length === 0) return null

          return (
            <div key={group.label} className="mb-5">
              <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.14em] text-white/40 uppercase">
                {group.label}
              </p>
              <nav className="space-y-0.5">{visibleItems.map(renderNavItem)}</nav>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="shrink-0 space-y-1 border-t border-white/10 px-3 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-white/75 transition-colors hover:bg-white/[0.06] hover:text-white"
              title={t.language}
            >
              <Languages className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
              <span className="min-w-0 flex-1 text-left">Language</span>
              <span className="flex items-center gap-1 text-white/50">
                {language.nativeLabel}
                <ChevronDown className="h-3.5 w-3.5" />
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-52">
            {LANGUAGES.map((option) => (
              <DropdownMenuItem
                key={option.code}
                onClick={() => setLocale(option.code)}
                className="flex items-center justify-between gap-2"
              >
                <span>
                  <span className="font-medium">{option.nativeLabel}</span>
                  {option.nativeLabel !== option.label && (
                    <span className="ml-1.5 text-xs text-muted-foreground">
                      {option.label}
                    </span>
                  )}
                </span>
                {locale === option.code && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-white/75 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
          <span>Log out</span>
        </button>

        {user && (
          <div className="mt-2 flex items-center gap-3 rounded-lg px-2 py-2">
            <Avatar className="h-9 w-9 border border-white/15">
              {user.avatar && <AvatarImage src={user.avatar} alt={displayName} />}
              <AvatarFallback className="bg-gradient-to-br from-[#3b82f6] to-[#6366f1] text-xs font-semibold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold leading-tight text-white">
                {displayName}
              </p>
              <p className="truncate text-[11px] text-white/50">{roleLabel}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
