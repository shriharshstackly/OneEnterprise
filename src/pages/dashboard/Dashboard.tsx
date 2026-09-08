import { PageContainer } from '@/components/layout/PageContainer'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { appConfig } from '@/config/app.config'

/** Fresh starter dashboard — replace with real widgets as modules are added. */
export default function Dashboard() {
  const { user } = useAuth()

  return (
    <PageContainer>
      <div className="ui-card-elevated rounded-2xl border border-border/60 bg-card p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-blue">
          Platform
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-brand-navy">
          Welcome to {appConfig.name}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Signed in as{' '}
          <span className="font-medium text-foreground">
            {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
          </span>
          . This is a clean shell with login, sidebar, and top bar — ready for production
          modules.
        </p>
      </div>
    </PageContainer>
  )
}
