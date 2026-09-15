import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/lib/constants/routes'
import { Bell, BellOff, Check, ShieldAlert, Ban, TriangleAlert, ArrowRight } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils/cn'

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'warning',
    title: 'Acme Corp enterprise license expires in 5 days',
    description: 'Review account usage and renewal terms before automatic suspension.',
    time: '10m ago',
    unread: true,
  },
  {
    id: '2',
    type: 'success',
    title: 'NovaTech Solutions completed onboarding and SSO setup',
    description: 'Primary tenant provisioned with 240 employee seats.',
    time: '1h ago',
    unread: true,
  },
  {
    id: '3',
    type: 'security',
    title: 'Admin login from unrecognized IP (194.26.29.11)',
    description: 'Delta Retail Group — Frankfurt, DE. Geo-fence alert triggered.',
    time: '3h ago',
    unread: true,
  },
  {
    id: '4',
    type: 'error',
    title: '5 consecutive failed MFA attempts',
    description: 'User j.mehta@acmecorp.com temporarily locked.',
    time: '4h ago',
    unread: true,
  },
]

export function NotificationDropdown() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all')
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  const unreadCount = notifications.filter((n) => n.unread).length

  const displayNotifications = notifications.filter(
    (n) => activeTab === 'all' || n.unread
  )

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  const getIconInfo = (type: string) => {
    switch (type) {
      case 'warning':
        return { icon: TriangleAlert, className: 'text-amber-500', bg: 'bg-amber-50' }
      case 'success':
        return { icon: Check, className: 'text-emerald-500', bg: 'bg-emerald-50' }
      case 'security':
        return { icon: ShieldAlert, className: 'text-rose-500', bg: 'bg-rose-50' }
      case 'error':
        return { icon: Ban, className: 'text-orange-500', bg: 'bg-orange-50' }
      default:
        return { icon: Bell, className: 'text-blue-500', bg: 'bg-blue-50' }
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 outline-none"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-[10px] w-[10px] rounded-full bg-red-500 border-2 border-white" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className="relative w-[420px] p-0 rounded-2xl shadow-xl border-slate-200 bg-white overflow-visible"
      >
        <div className="absolute -top-[7px] right-[14px] h-[14px] w-[14px] rotate-45 border-t border-l border-slate-200 bg-white rounded-tl-[2px] z-0" />
        
        <div className="relative z-10 overflow-hidden rounded-2xl bg-white">
          <div className="p-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-[#0b1f4d]">Notifications</h2>
              {unreadCount > 0 && (
                <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <button
              onClick={markAllAsRead}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Mark all as read
            </button>
          </div>

          <div className="flex items-center gap-1 bg-white">
            <button
              onClick={() => setActiveTab('all')}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                activeTab === 'all'
                  ? "bg-blue-600 text-white"
                  : "text-slate-500 hover:bg-slate-50"
              )}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                activeTab === 'unread'
                  ? "bg-blue-600 text-white"
                  : "text-slate-500 hover:bg-slate-50"
              )}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {displayNotifications.length > 0 ? (
            <div className="flex flex-col">
              {displayNotifications.map((notification, index) => {
                const IconInfo = getIconInfo(notification.type)
                const Icon = IconInfo.icon
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-3 p-4 hover:bg-slate-50 transition-colors cursor-pointer",
                      index !== displayNotifications.length - 1 && "border-b border-slate-50"
                    )}
                  >
                    <div
                      className={cn(
                        "shrink-0 flex h-8 w-8 items-center justify-center rounded-full mt-0.5",
                        IconInfo.bg,
                        IconInfo.className
                      )}
                    >
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0b1f4d] truncate whitespace-normal line-clamp-2">
                        {notification.title}
                      </p>
                      <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">
                        {notification.description}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                    {notification.unread && (
                      <div className="shrink-0 pt-2">
                        <span className="block h-2 w-2 rounded-full bg-blue-600" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-8 text-center">
              <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 relative">
                <BellOff className="h-8 w-8 text-slate-400" strokeWidth={1.5} />
                <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
              </div>
              <h3 className="text-base font-semibold text-[#0b1f4d] mb-2">No Notifications</h3>
              <p className="text-sm text-slate-500 max-w-[250px]">
                You're all caught up! When there are new alerts or updates, they'll show up here.
              </p>
              <button
                className="mt-6 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                onClick={() => {
                  setIsOpen(false)
                  navigate(ROUTES.NOTIFICATIONS)
                }}
              >
                View all notifications
              </button>
            </div>
          )}
        </div>

        {displayNotifications.length > 0 && (
          <div className="p-3 border-t border-slate-100 text-center bg-white">
            <button 
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors py-1"
              onClick={() => {
                setIsOpen(false)
                navigate(ROUTES.NOTIFICATIONS)
              }}
            >
              View all notifications
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
