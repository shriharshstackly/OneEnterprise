import { PageContainer } from '@/components/layout/PageContainer'

interface PlaceholderPageProps {
  title: string
  description?: string
}

export function PlaceholderPage({
  title,
  description = 'This module is ready for implementation.',
}: PlaceholderPageProps) {
  return (
    <PageContainer>
      <div className="rounded-2xl border border-border bg-white px-8 py-16 text-center shadow-sm">
        <h2 className="text-xl font-bold text-[#0b1f4d]">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </PageContainer>
  )
}
