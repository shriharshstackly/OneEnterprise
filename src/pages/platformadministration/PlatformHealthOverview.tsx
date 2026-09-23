import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'

type ServiceStatus = 'healthy' | 'degraded' | 'failed'

type MonitoredService = {
  name: string
  description: string
  status: ServiceStatus
  uptime: string
}

type Incident = {
  title: string
  description: string
  status: ServiceStatus
  startedAt: string
  state: string
}

const services: MonitoredService[] = [
  { name: 'Auth Service', description: 'JWT issuance · SSO · MFA', status: 'healthy', uptime: '99.99%' },
  { name: 'API Gateway', description: 'avg. response 118ms', status: 'healthy', uptime: '99.98%' },
  { name: 'Database Cluster', description: 'elevated replication lag — investigating', status: 'degraded', uptime: '99.91%' },
  { name: 'Message Queue', description: '0 dead-letter events', status: 'healthy', uptime: '100%' },
  { name: 'Object Storage', description: 'files & document uploads', status: 'healthy', uptime: '99.99%' },
  { name: 'AI Engine', description: 'Copilot & automation inference', status: 'healthy', uptime: '99.95%' },
]

const incidents: Incident[] = [
  {
    title: 'Database Cluster — elevated replication lag',
    description:
      'Read replicas are lagging ~2.4s behind primary. No tenant-facing errors detected; monitoring for further drift.',
    status: 'degraded',
    startedAt: '08:12 UTC',
    state: 'investigating',
  },
]

const statusDotClasses: Record<ServiceStatus, string> = {
  healthy: 'bg-[#22c55e]',
  degraded: 'bg-[#f59e0b]',
  failed: 'bg-[#ef4444]',
}

export default function PlatformHealthOverview() {
  const [refreshing, setRefreshing] = useState(false)
  const [secondsAgo, setSecondsAgo] = useState(1)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSecondsAgo((prev) => prev + 1)
    }, 1000)
    return () => window.clearInterval(interval)
  }, [])

  const healthyCount = services.filter((service) => service.status === 'healthy').length
  const degradedCount = services.filter((service) => service.status === 'degraded').length
  const failedCount = services.filter((service) => service.status === 'failed').length
  const aggregateUptime = '99.98%'

  const overallStatus = failedCount > 0 ? 'Down' : degradedCount > 0 ? 'Degraded' : 'Operational'

  const statusParts: string[] = []
  if (degradedCount > 0) {
    statusParts.push(`${degradedCount} service${degradedCount > 1 ? 's' : ''} degraded`)
  }
  if (failedCount > 0) {
    statusParts.push(`${failedCount} service${failedCount > 1 ? 's' : ''} failed`)
  }
  statusParts.push(`${healthyCount} healthy`)

  const handleRefresh = () => {
    setRefreshing(true)
    setSecondsAgo(0)
    window.setTimeout(() => setRefreshing(false), 650)
  }

  return (
    <PageContainer className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <h1 className="m-0 text-[clamp(1.7rem,2vw,2.15rem)] font-bold leading-tight tracking-[-0.04em] text-[#102b57]">
          Platform Health Overview
        </h1>

        <button
          type="button"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-[11px] font-semibold text-[#183766] shadow-sm transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md disabled:cursor-wait disabled:opacity-70"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={refreshing ? 'animate-spin' : ''} size={14} />
          {refreshing ? 'Refreshing' : 'Refresh now'}
        </button>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border-l-4 border-[#22c55e] bg-[#eaf7f0] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#22c55e]" />
          <div>
            <p className="m-0 text-[15px] font-bold text-[#0b3d24]">
              Platform status: {overallStatus}
            </p>
            <p className="m-0 mt-0.5 text-[12px] text-[#5b7c6c]">
              {statusParts.join(', ')} · Last refreshed {secondsAgo}s ago
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[12px] font-semibold text-[#137a4d]">
          <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
          All systems operational
        </div>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Service health summary">
        <article className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.08),0_1px_2px_rgba(15,23,42,0.04)]">
          <strong className="font-mono text-[2rem] font-bold leading-none text-[#22c55e]">{healthyCount}</strong>
          <span className="mt-3 text-[10px] font-semibold uppercase tracking-[0.11em] text-[#7890b2]">
            Healthy
          </span>
        </article>

        <article className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.08),0_1px_2px_rgba(15,23,42,0.04)]">
          <strong className="font-mono text-[2rem] font-bold leading-none text-[#d97706]">{degradedCount}</strong>
          <span className="mt-3 text-[10px] font-semibold uppercase tracking-[0.11em] text-[#7890b2]">
            Degraded
          </span>
        </article>

        <article className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.08),0_1px_2px_rgba(15,23,42,0.04)]">
          <strong className="font-mono text-[2rem] font-bold leading-none text-[#dc2626]">{failedCount}</strong>
          <span className="mt-3 text-[10px] font-semibold uppercase tracking-[0.11em] text-[#7890b2]">
            Failed
          </span>
        </article>

        <article className="flex flex-col justify-between rounded-2xl border border-transparent bg-gradient-to-br from-[#3044d5] to-[#161c62] p-5 text-white shadow-[0_2px_5px_rgba(24,36,112,0.22)]">
          <strong className="font-mono text-[2rem] font-bold leading-none">{aggregateUptime}</strong>
          <span className="mt-3 text-[10px] font-semibold uppercase tracking-[0.11em] text-white/70">
            Aggregate uptime (30d)
          </span>
        </article>
      </section>

      <section>
        <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7790b4]">
          Monitored Services
        </h2>

        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
          {services.map((service, index) => (
            <div
              key={service.name}
              className={`flex items-center justify-between gap-4 px-5 py-4 ${
                index !== services.length - 1 ? 'border-b border-slate-100' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${statusDotClasses[service.status]}`}
                />
                <div>
                  <strong className="block text-[13px] font-bold text-[#092b62]">{service.name}</strong>
                  <span className="block text-[12px] text-[#647b9d]">{service.description}</span>
                </div>
              </div>

              <span className="shrink-0 font-mono text-[13px] font-semibold text-[#334966]">
                {service.uptime} uptime
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7790b4]">
          Active Incidents
        </h2>

        {incidents.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 text-[13px] text-[#647b9d] shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
            No active incidents.
          </div>
        ) : (
          <div className="space-y-3">
            {incidents.map((incident) => (
              <div
                key={incident.title}
                className="flex items-start gap-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)]"
              >
                <span
                  className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${statusDotClasses[incident.status]}`}
                />
                <div>
                  <strong className="block text-[13px] font-bold text-[#092b62]">{incident.title}</strong>
                  <p className="mt-1 text-[12px] leading-[1.6] text-[#647b9d]">{incident.description}</p>
                  <span className="mt-2 block text-[11px] font-medium text-[#9aaac0]">
                    Started {incident.startedAt} · {incident.state}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </PageContainer>
  )
}