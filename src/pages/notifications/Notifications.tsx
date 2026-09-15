import { useState, useMemo } from 'react'
import { Check, ShieldAlert, Ban, TriangleAlert, Filter, RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/cn'

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'warning',
    category: 'BILLING ALERT',
    title: 'Acme Corp enterprise license expires in 5 days',
    description: 'Review account usage and renewal terms before automatic suspension.',
    time: '10m ago',
    unread: true,
  },
  {
    id: '2',
    type: 'success',
    category: 'SSO / IDENTITY',
    title: 'NovaTech Solutions completed onboarding and SSO setup',
    description: 'Primary tenant provisioned with 240 employee seats.',
    time: '1h ago',
    unread: true,
  },
  {
    id: '3',
    type: 'security',
    category: 'SECURITY ALERT',
    title: 'Admin login from unrecognized IP (194.26.29.11)',
    description: 'Delta Retail Group — Frankfurt, DE. Geo-fence alert triggered.',
    time: '3h ago',
    unread: true,
  },
  {
    id: '4',
    type: 'error',
    category: 'AUTH LOCKOUT',
    title: '5 consecutive failed MFA attempts',
    description: 'User j.mehta@acmecorp.com temporarily locked.',
    time: '3h ago',
    unread: true,
  },
  {
    id: '5',
    type: 'default',
    category: 'Infrastructure',
    title: 'SSL Certificate auto-renewal succeeded (*.acme.io)',
    description: 'Wildcard certificate refreshed for 365 days via Let\'s Encrypt.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: '6',
    type: 'default',
    category: 'Audit Compliance',
    title: 'Weekly Enterprise Audit Log ready for download',
    description: 'Compliance record covering 14,289 admin actions ready in portal.',
    time: '2 days ago',
    unread: false,
  },
]

// The SVG is now loaded from public folder

const ITEMS_PER_PAGE = 4

export default function Notifications() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all')
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [currentPage, setCurrentPage] = useState(1)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const unreadCount = notifications.filter((n) => n.unread).length

  // Filter based on active tab
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (activeTab === 'all') return true
      if (activeTab === 'unread') return n.unread
      return true
    })
  }, [notifications, activeTab])

  // Reset page when tab changes
  useMemo(() => {
    setCurrentPage(1)
  }, [activeTab])

  // Pagination logic
  const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE) || 1
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  const getIconInfo = (type: string) => {
    switch (type) {
      case 'warning':
        return { icon: TriangleAlert, className: 'text-amber-500 border-amber-500', categoryColor: 'text-amber-600 bg-amber-50/80', sideColor: 'bg-amber-500' }
      case 'success':
        return { icon: Check, className: 'text-emerald-500 border-emerald-500', categoryColor: 'text-emerald-600 bg-emerald-50/80', sideColor: 'bg-emerald-500' }
      case 'security':
        return { icon: ShieldAlert, className: 'text-rose-500 border-rose-500', categoryColor: 'text-rose-600 bg-rose-50/80', sideColor: 'bg-rose-500' }
      case 'error':
        return { icon: Ban, className: 'text-orange-500 border-orange-500', categoryColor: 'text-orange-600 bg-orange-50/80', sideColor: 'bg-orange-500' }
      default:
        return { icon: ShieldAlert, className: 'text-blue-500 border-blue-500', categoryColor: 'text-slate-600 bg-slate-100', sideColor: 'bg-blue-500' }
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Main Container replacing the previous gray background layout */}
      <div className="bg-white rounded-[16px] shadow-sm border border-slate-200 mt-2 mb-6">

        {/* Header Section */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#0b1f4d]">Notifications</h1>
            {unreadCount > 0 && notifications.length > 0 && (
              <span className="bg-blue-100 text-blue-600 text-sm font-semibold px-3 py-1 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Tabs and Filter */}
        <div className="px-8 pb-4 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={cn(
                "px-5 py-2 text-sm font-medium rounded-md transition-colors",
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
                "px-5 py-2 text-sm font-medium rounded-md transition-colors",
                activeTab === 'unread'
                  ? "bg-blue-600 text-white"
                  : "text-slate-500 hover:bg-slate-50"
              )}
            >
              Unread ({unreadCount})
            </button>
          </div>
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
            <Filter className="h-4 w-4" />
          </button>
        </div>

        {/* List Content */}
        <div className="min-h-[400px]">
          {paginatedNotifications.length > 0 ? (
            <div className="flex flex-col">
              {paginatedNotifications.map((notification, index) => {
                const IconInfo = getIconInfo(notification.type)
                const Icon = IconInfo.icon

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "group relative flex items-start p-6 hover:bg-slate-50 transition-colors cursor-pointer",
                      index !== paginatedNotifications.length - 1 && "border-b border-slate-100"
                    )}
                  >
                    {/* Left colored border */}
                    <div className={cn("absolute left-0 top-0 bottom-0 w-[3px]", IconInfo.sideColor)} />

                    <div className="flex-1 flex gap-5 pl-2">
                      <div className="shrink-0 flex items-start pt-1">
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full border bg-white",
                          IconInfo.className.split(' ')[1] // use the border color class
                        )}>
                          <Icon className={cn("h-5 w-5", IconInfo.className.split(' ')[0])} strokeWidth={1.75} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn("text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded", IconInfo.categoryColor)}>
                            {notification.category}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-400 font-medium">
                              {notification.time}
                            </span>
                            {notification.unread && (
                              <span className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
                            )}
                          </div>
                        </div>
                        <p className="text-[15px] font-bold text-[#0b1f4d] mb-1">
                          {notification.title}
                        </p>
                        <p className="text-sm text-slate-500">
                          {notification.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center p-6 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="h-8 w-8 inline-flex items-center justify-center rounded-md text-slate-400 hover:text-[#0b1f4d] hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-transparent"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={cn(
                          "h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium",
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "text-slate-500 hover:bg-slate-100"
                        )}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 inline-flex items-center justify-center rounded-md text-slate-400 hover:text-[#0b1f4d] hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-transparent"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-center px-8">
              <img src="/icons/sidebar/Frame 2085665285.svg" alt="No notifications" className="h-32 w-32" />
              <h3 className="text-xl font-semibold text-[#0b1f4d] mt-6 mb-2">No Notifications</h3>
              <p className="text-sm text-slate-500 max-w-md">
                You're all caught up! When there are new alerts or updates, they'll show up here.
              </p>
              <div className="flex items-center gap-3 mt-8">
                <button 
                  onClick={() => {
                    setIsRefreshing(true)
                    setTimeout(() => {
                      setIsRefreshing(false)
                      // Simply toggle some unread state or reset notifications for a "dynamic" feel
                      setNotifications(MOCK_NOTIFICATIONS.map(n => ({ ...n, unread: true })))
                      setActiveTab('all')
                    }, 1000)
                  }}
                  disabled={isRefreshing}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  <RefreshCcw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                  {isRefreshing ? 'Checking...' : 'Check for updates'}
                </button>
                <button
                  onClick={() => navigate(ROUTES.SETTINGS)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Notification Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
