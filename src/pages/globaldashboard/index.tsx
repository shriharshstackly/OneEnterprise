import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Download,
  FileText,
  Info,
  RefreshCw,
  Settings,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PageContainer } from '@/components/layout/PageContainer'
import { useState } from 'react'

type Stat = {
  label: string
  value: string
  change: string
  icon: LucideIcon
}

const stats: Stat[] = [
  { label: 'Total Tenants', value: '132', change: '+8% this month', icon: Users },
  { label: 'Total Users', value: '48,920', change: '+13% this month', icon: UserCheck },
  { label: 'Active Subscriptions', value: '1,233', change: '+10% this month', icon: Activity },
  { label: 'Active Sessions', value: '789', change: '+6% this month', icon: TrendingUp },
]

const healthMetrics = [
  { label: 'CPU Usage', value: 67, color: 'var(--color-warning)' },
  { label: 'Memory Utilization', value: 54, color: 'var(--color-warning)' },
  { label: 'Disk I/O', value: 32, color: 'var(--color-success)' },
  { label: 'Network Bandwidth', value: 78, color: 'var(--color-warning)' },
]

const healthData = [
  { day: 'May 1', operational: 60, degraded: 45, down: 30 },
  { day: 'May 2', operational: 72, degraded: 52, down: 34 },
  { day: 'May 3', operational: 68, degraded: 55, down: 40 },
  { day: 'May 4', operational: 85, degraded: 60, down: 42 },
  { day: 'May 5', operational: 80, degraded: 66, down: 48 },
  { day: 'May 6', operational: 92, degraded: 72, down: 46 },
  { day: 'May 7', operational: 98, degraded: 78, down: 52 },
]

const quickNavigation = [
  { title: 'Manage Tenants', description: 'Manage accounts & roles', icon: Users },
  { title: 'Platform Settings', description: 'Global configuration', icon: Settings },
  { title: 'Generate Report', description: 'Renewals & seat usage', icon: FileText },
  { title: 'System Monitoring', description: 'Track admin actions', icon: Activity },
]

const alerts = [
  { title: 'High CPU Usage', description: 'Database server CPU usage is high', time: '1 hour ago', icon: AlertTriangle, color: 'var(--color-warning)' },
  { title: 'Storage Threshold', description: 'Storage utilization reached 80%', time: '2 hours ago', icon: Info, color: 'var(--color-blue)' },
  { title: 'New Tenant Registration', description: 'Techcorp solutions registered', time: '2 hours ago', icon: UserPlus, color: 'var(--color-warning)' },
]

const activities = [
  { title: 'New Tenant Created', detail: 'by Admin users', time: '30 min ago', icon: AlertTriangle, color: 'var(--color-warning)' },
  { title: 'License Updated', detail: 'by Admin users', time: '1 hour ago', icon: FileText, color: 'var(--color-warning)' },
  { title: 'User Added', detail: 'Superadmin granted access to monitoring module.', time: '3 hours ago', icon: UserCheck, color: 'var(--color-blue)' },
  { title: 'Backup Completed', detail: 'Daily snapshot of primary database cluster successful.', time: 'Yesterday', icon: CheckCircle2, color: 'var(--color-success)' },
]

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-border bg-card p-5 shadow-sm ${className}`}>{children}</div>
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{children}</h2>
}

function RangeButton() {
  return (
    <button type="button" className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground">
      Last 7 Days
      <ChevronDown className="size-3.5" aria-hidden="true" />
    </button>
  )
}

export default function GlobalDashboard() {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    window.setTimeout(() => setRefreshing(false), 650)
  }

  return (
    <PageContainer className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Global Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track performance, engagement, and growth across all your social platforms in one place.
        </p>
      </header>

      <div className="flex flex-col gap-6">
          <section aria-labelledby="overview-heading">
            <SectionTitle>Platform Overview</SectionTitle>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <Card key={stat.label}>
                    <div className="flex items-start justify-between">
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-primary">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                    </div>
                    <p className="mt-3 text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="mt-1 text-xs font-medium text-success">{stat.change}</p>
                  </Card>
                )
              })}
            </div>
          </section>

          <section aria-labelledby="quicknav-heading">
            <SectionTitle>Quick Navigation</SectionTitle>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickNavigation.map((item) => {
                const Icon = item.icon
                return (
                  <button key={item.title} type="button" className="rounded-xl border border-border bg-card p-5 text-left shadow-sm transition-colors hover:border-primary/40 hover:bg-accent/40">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <p className="mt-4 text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                  </button>
                )
              })}
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="h-full">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Platform Health Status</h3>
                <RangeButton />
              </div>
              <div className="mt-6 flex flex-col gap-5">
                {healthMetrics.map((metric) => (
                  <div key={metric.label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{metric.label}</span>
                      <span className="font-semibold text-muted-foreground">{metric.value}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full" style={{ width: `${metric.value}%`, backgroundColor: metric.color }} role="progressbar" aria-valuenow={metric.value} aria-valuemin={0} aria-valuemax={100} aria-label={metric.label} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="h-full">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">System Health</h3>
                <RangeButton />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                {[
                  ['Operational', 'var(--color-chart-1)'],
                  ['Degraded', 'var(--color-chart-2)'],
                  ['Down', 'var(--color-chart-3)'],
                ].map(([label, color]) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
                    <span className="text-xs text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={healthData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 12, backgroundColor: 'var(--color-card)' }} />
                    <Line type="monotone" dataKey="operational" stroke="var(--color-chart-1)" strokeWidth={2.5} dot={{ r: 3, fill: 'var(--color-chart-1)', strokeWidth: 0 }} />
                    <Line type="monotone" dataKey="degraded" stroke="var(--color-chart-2)" strokeWidth={2.5} dot={{ r: 3, fill: 'var(--color-chart-2)', strokeWidth: 0 }} />
                    <Line type="monotone" dataKey="down" stroke="var(--color-chart-3)" strokeWidth={2.5} dot={{ r: 3, fill: 'var(--color-chart-3)', strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="h-full">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Security alerts</h3>
                <button type="button" className="text-xs font-medium text-primary">View all alerts</button>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {alerts.map((alert) => {
                  const Icon = alert.icon
                  return (
                    <div key={alert.title} className="flex items-start gap-3 rounded-lg bg-muted/60 p-3">
                      <Icon className="mt-0.5 size-4 shrink-0" style={{ color: alert.color }} aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground">{alert.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{alert.description}</p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">{alert.time}</span>
                    </div>
                  )
                })}
              </div>
            </Card>

            <Card className="h-full">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Recent activities</h3>
                <button type="button" className="text-xs font-medium text-primary">View All</button>
              </div>
              <div className="mt-4 flex flex-col">
                {activities.map((activity, index) => {
                  const Icon = activity.icon
                  return (
                    <div key={activity.title} className={`flex items-start gap-3 py-3 ${index !== activities.length - 1 ? 'border-b border-border' : ''}`}>
                      <Icon className="mt-0.5 size-4 shrink-0" style={{ color: activity.color }} aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">{activity.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{activity.detail}</p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>

          <div className="flex flex-col justify-end gap-3 sm:flex-row">
            <button type="button" onClick={handleRefresh} disabled={refreshing} className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent/40 disabled:cursor-wait disabled:opacity-70">
              <RefreshCw className={refreshing ? 'size-4 animate-spin' : 'size-4'} aria-hidden="true" />
              {refreshing ? 'Refreshing' : 'Refresh'}
            </button>
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue px-4 py-2 text-sm font-medium text-blue-foreground shadow-sm transition-opacity hover:opacity-90">
              <Download className="size-4" aria-hidden="true" />
              Export report
            </button>
          </div>
        </div>
    </PageContainer>
  )
}