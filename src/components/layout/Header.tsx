import { Bell, Search, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { UserMenu } from '@/components/navigation/UserMenu'
import { ROUTES } from '@/lib/constants/routes'

/** Top bar only — search (left) + actions (right). Breadcrumbs live below in content. */
export function Header() {
  const navigate = useNavigate()

  return (
    <header className="shrink-0 border-b border-slate-200/80 bg-white">
      <div className="flex items-center justify-between gap-4 px-6 py-3">
        <div className="w-full max-w-md min-w-0 flex-1 lg:max-w-lg">
          <label className="relative block">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search tenants, users, settings, audit logs..."
              className="h-10 w-full rounded-full border-0 bg-slate-100/90 pr-14 pl-10 text-sm text-[#0b1f4d] outline-none placeholder:text-slate-400 focus:bg-slate-100 focus:ring-2 focus:ring-[#3b82f6]/20"
            />
            <kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 items-center rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:inline-flex">
              ⌘ K
            </kbd>
          </label>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" strokeWidth={1.75} />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
            aria-label="Settings"
            onClick={() => navigate(ROUTES.SETTINGS)}
          >
            <Settings className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
