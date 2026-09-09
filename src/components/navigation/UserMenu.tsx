import { LogOut, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ROUTES } from '@/lib/constants/routes'
import { ROLE_HIERARCHY, ROLE_LABELS, type Role } from '@/lib/constants/roles'

export function UserMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-full py-1 pr-1.5 pl-1 outline-none transition-colors hover:bg-slate-50 focus:outline-none">
        <Avatar className="h-9 w-9 border border-slate-200">
          {user?.avatar && <AvatarImage src={user.avatar} alt={displayName} />}
          <AvatarFallback className="bg-gradient-to-br from-[#3b82f6] to-[#6366f1] text-xs font-semibold text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="hidden text-left sm:block">
          <p className="text-sm font-semibold leading-tight text-[#0b1f4d]">
            {displayName}
          </p>
          <p className="text-[11px] text-slate-400">{roleLabel}</p>
        </div>
        <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{displayName}</span>
            <span className="text-xs text-muted-foreground">{user?.email || ''}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
