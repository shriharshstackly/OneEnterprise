import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  Check,
  ChevronDown,
  Download,
  Eye,
  EyeOff,
  FileSearch,
  Globe2,
  Info,
  LockKeyhole,
  Network,
  Send,
  Settings,
  ShieldCheck,
  ShieldHalf,
  ShieldPlus,
  UploadCloud,
  X,
  type LucideIcon,
} from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/cn'

type ModalType = 'smtp' | 'sms' | 'api' | null

function useFields<T extends Record<string, string>>(initial: T) {
  const [values, setValues] = useState(initial)

  const set = (field: keyof T, value: string) =>
    setValues((v) => ({ ...v, [field]: value }))

  return [values, set] as const
}

export default function PlatformConfiguration() {
  const [modal, setModal] = useState<ModalType>(null)
  const [modalSaved, setModalSaved] = useState(false)
  const [saved, setSaved] = useState(true)
  const [visible, setVisible] = useState<Record<string, boolean>>({})

  const toggleVisible = (key: string) =>
    setVisible((v) => ({ ...v, [key]: !v[key] }))

  const [basic, setBasic] = useFields({
    name: 'Java Enterprise Suite',
    url: 'https://app.javasuite.enterprise',
  })

  const [regional, setRegional] = useFields({
    timezone: 'UTC +05:30 (India Standard Time)',
    language: 'ENGLISH',
  })

  const [smtp, setSmtp] = useFields({
    host: 'smtp.stackly.com',
    port: '587',
    username: 'noreply@stackly.com',
    password: 'password123',
    encryption: 'TLS',
    fromEmail: 'noreply@stackly.com',
    fromName: 'Stackly Platform',
  })

  const [sms, setSms] = useFields({
    provider: 'Stackly',
    gatewayName: 'Stackly Primary',
    apiUrl: 'https://api.stackly.com/2010-04-01',
    accountSid: 'ACxxxxxxxxxxxxxxxxxxxxxxxx',
    sender: '+14155552671',
    timeout: '30',
    authToken: 'xxxxxxxxxxxxxxxxxxxxxxxx',
    messagingSid: 'MGxxxxxxxxxxxxxxxxxxxxxxxx',
  })

  const [smsEnabled, setSmsEnabled] = useState(true)

  const [api, setApi] = useFields({
    gatewayName: 'Main API Gateway',
    environment: 'Production',
    baseUrl: 'https://api.stackly.com/V1',
    version: 'V1',
    authType: 'API Key',
    apiKey: 'xxxxxxxxxxxxxxxxxxxx',
    apiSecret: 'xxxxxxxxxxxxxxxxxxxx',
    headerName: 'X-API-Key',
    requestTimeout: '30',
    retryAttempts: '3',
    rateLimit: '100',
  })

  const [apiEnabled, setApiEnabled] = useState(true)

  const openModal = (type: ModalType) => {
    setModal(type)
    setModalSaved(false)
  }

  return (
    <PageContainer className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Platform Configuration
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage core platform identity, regional defaults, and security handling.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setSaved(false)}>
            Cancel
          </Button>

          <Button onClick={() => setSaved(true)}>
            <Download className="h-3.5 w-3.5" strokeWidth={2} />
            Save Changes
          </Button>
        </div>
      </div>

      {saved && <SuccessBanner />}

      <div className="grid gap-6 lg:grid-cols-[1.65fr_0.9fr]">
        <div className="space-y-6">
          <Card>
            <CardTitle icon={Settings} title="Basic Configuration" />

            <div className="mt-5 space-y-4">
              <Field
                label="Platform Name"
                value={basic.name}
                onChange={(v) => setBasic('name', v)}
              />

              <Field
                label="Platform URL"
                value={basic.url}
                onChange={(v) => setBasic('url', v)}
              />
            </div>
          </Card>

          <Card>
            <CardTitle icon={Globe2} title="Regional Configuration" />

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Default Time Zone"
                value={regional.timezone}
                onChange={(v) => setRegional('timezone', v)}
                options={[
                  'UTC +05:30 (India Standard Time)',
                  'UTC +00:00 (Coordinated Universal Time)',
                  'UTC -05:00 (Eastern Time)',
                  'UTC +01:00 (Central European Time)',
                ]}
              />

              <SelectField
                label="Default Language"
                value={regional.language}
                onChange={(v) => setRegional('language', v)}
                options={['ENGLISH', 'HINDI', 'KANNADA', 'FRENCH']}
              />
            </div>
          </Card>
        </div>

        <Card className="p-0">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <ShieldHalf className="h-4 w-4 text-primary" strokeWidth={1.75} />
            <h2 className="text-sm font-semibold text-foreground">Security Handling</h2>
          </div>

          <div className="space-y-5 px-5 py-5">
            <SecurityRow
              icon={ShieldCheck}
              title="Configuration version control"
              description="All changes are tracked and can be rolled back."
            />

            <SecurityRow
              icon={LockKeyhole}
              title="Encryption of sensitive credentials"
              description="API keys and passwords are AES-256 encrypted."
            />

            <SecurityRow
              icon={FileSearch}
              title="Audit logs"
              description="Comprehensive logging of administrative actions."
            />
          </div>

          <div className="flex items-center gap-3 border-t border-border px-5 py-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary">
              <ShieldPlus className="h-4.5 w-4.5" strokeWidth={1.75} />
            </span>

            <div>
              <p className="text-sm font-semibold text-foreground">System Health</p>
              <p className="text-xs font-medium text-success">Optimal State</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardTitle icon={Network} title="Communication & Integration" />

        <div className="mt-3 divide-y divide-border">
          <IntegrationRow
            title="SMTP Configuration"
            description="Manage email server settings"
            onClick={() => openModal('smtp')}
          />

          <IntegrationRow
            title="SMS Gateway"
            description="Twilio integration settings"
            onClick={() => openModal('sms')}
          />

          <IntegrationRow
            title="API Gateway"
            description="External system access tokens"
            onClick={() => openModal('api')}
          />
        </div>
      </Card>

      <div className="flex gap-3 rounded-xl border border-border bg-muted/60 p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} />

        <div>
          <p className="text-sm font-semibold text-foreground">Deployment Note</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Changes to Core Platform configurations may require a service restart for integrated modules to
            reflect the updates completely.
          </p>
        </div>
      </div>

      {modal === 'smtp' && (
        <ModalShell
          title="Configure SMTP"
          description="See your SMTP server details to enable outgoing email notifications."
          onClose={() => setModal(null)}
          maxWidth="max-w-[400px]"
          footer={
            <ModalFooter onCancel={() => setModal(null)} onSave={() => setModalSaved(true)} />
          }
        >
          {modalSaved && <SuccessBanner compact />}

          <div className={cn('space-y-2', modalSaved && 'mt-2.5')}>
            <Field label="SMTP Host *" value={smtp.host} onChange={(v) => setSmtp('host', v)} />
            <Field label="Port *" value={smtp.port} onChange={(v) => setSmtp('port', v)} />
            <Field
              label="User Name *"
              value={smtp.username}
              onChange={(v) => setSmtp('username', v)}
            />

            <PasswordField
              label="Password *"
              value={smtp.password}
              visible={!!visible.smtpPassword}
              onChange={(v) => setSmtp('password', v)}
              onToggle={() => toggleVisible('smtpPassword')}
            />

            <SelectField
              label="Encryption *"
              value={smtp.encryption}
              onChange={(v) => setSmtp('encryption', v)}
              options={['TLS', 'SSL', 'None']}
            />

            <div className="grid grid-cols-2 gap-2">
              <Field
                label="From Email *"
                value={smtp.fromEmail}
                onChange={(v) => setSmtp('fromEmail', v)}
              />

              <Field
                label="From Name *"
                value={smtp.fromName}
                onChange={(v) => setSmtp('fromName', v)}
              />
            </div>

            <TestConnectionButton />
          </div>
        </ModalShell>
      )}

      {modal === 'sms' && (
        <ModalShell
          title="SMS Gateway Configuration"
          description="Configure SMS Gateway settings to send SMS from the application."
          onClose={() => setModal(null)}
          maxWidth="max-w-[400px]"
          footer={
            <ModalFooter onCancel={() => setModal(null)} onSave={() => setModalSaved(true)} />
          }
        >
          {modalSaved && <SuccessBanner compact />}

          <div className={cn('space-y-2', modalSaved && 'mt-2.5')}>
            <Field
              label="Gateway Provider *"
              value={sms.provider}
              onChange={(v) => setSms('provider', v)}
            />

            <Field
              label="Gateway Name *"
              value={sms.gatewayName}
              onChange={(v) => setSms('gatewayName', v)}
            />

            <Field
              label="API Base URL *"
              value={sms.apiUrl}
              onChange={(v) => setSms('apiUrl', v)}
              helper="Base URL for Stackly API"
            />

            <PasswordField
              label="Account SID *"
              value={sms.accountSid}
              visible={!!visible.smsSid}
              onChange={(v) => setSms('accountSid', v)}
              onToggle={() => toggleVisible('smsSid')}
              helper="Your Stackly Account SID"
            />

            <Field
              label="From Number / Sender ID *"
              value={sms.sender}
              onChange={(v) => setSms('sender', v)}
              helper="Phone number or Sender ID to send SMS from"
            />

            <Field
              label="Connection Timeout (Seconds)"
              value={sms.timeout}
              onChange={(v) => setSms('timeout', v)}
              helper="Timeout for API requests"
            />

            <PasswordField
              label="Auth Token *"
              value={sms.authToken}
              visible={!!visible.smsToken}
              onChange={(v) => setSms('authToken', v)}
              onToggle={() => toggleVisible('smsToken')}
              helper="Your Stackly Auth Token"
            />

            <Field
              label="Messaging Service SID (Optional) *"
              value={sms.messagingSid}
              onChange={(v) => setSms('messagingSid', v)}
              helper="Stackly Messaging Service SID"
            />

            <ToggleRow
              label="Enable Gateway"
              checked={smsEnabled}
              onChange={setSmsEnabled}
              description="Enable this SMS gateway"
            />

            <NotesBox
              items={[
                'Ensure your Stackly account is active and has sufficient balance.',
                'Update the from number / Sender ID with a valid and verified number.',
                'Changes may take a few minutes.',
              ]}
            />
          </div>
        </ModalShell>
      )}

      {modal === 'api' && (
        <ModalShell
          title="API Gateway Configuration"
          description="Configure API Gateway settings to connect and communicate with external services."
          onClose={() => setModal(null)}
          maxWidth="max-w-[400px]"
          footer={
            <ModalFooter onCancel={() => setModal(null)} onSave={() => setModalSaved(true)} />
          }
        >
          {modalSaved && <SuccessBanner compact />}

          <div className={cn('space-y-2', modalSaved && 'mt-2.5')}>
            <Field
              label="Gateway Name *"
              value={api.gatewayName}
              onChange={(v) => setApi('gatewayName', v)}
            />

            <Field
              label="Environment *"
              value={api.environment}
              onChange={(v) => setApi('environment', v)}
            />

            <Field
              label="Base URL *"
              value={api.baseUrl}
              onChange={(v) => setApi('baseUrl', v)}
              helper="Base URL of the API Gateway"
            />

            <Field
              label="API Version *"
              value={api.version}
              onChange={(v) => setApi('version', v)}
              helper="API version (e.g., v1, v2)"
            />

            <Field
              label="Authentication Type *"
              value={api.authType}
              onChange={(v) => setApi('authType', v)}
            />

            <PasswordField
              label="API Key *"
              value={api.apiKey}
              visible={!!visible.apiKey}
              onChange={(v) => setApi('apiKey', v)}
              onToggle={() => toggleVisible('apiKey')}
            />

            <PasswordField
              label="API Secret *"
              value={api.apiSecret}
              visible={!!visible.apiSecret}
              onChange={(v) => setApi('apiSecret', v)}
              onToggle={() => toggleVisible('apiSecret')}
              helper="Secret used to authenticate API requests"
            />

            <Field
              label="Header Name (Optional) *"
              value={api.headerName}
              onChange={(v) => setApi('headerName', v)}
              helper="Custom header name for API key (if required)"
            />

            <Field
              label="Request Timeout (Seconds) *"
              value={api.requestTimeout}
              onChange={(v) => setApi('requestTimeout', v)}
              helper="Timeout for API requests"
            />

            <Field
              label="Retry Attempts *"
              value={api.retryAttempts}
              onChange={(v) => setApi('retryAttempts', v)}
              helper="Number of retry attempts on failure"
            />

            <Field
              label="Rate Limit (requests/minute) *"
              value={api.rateLimit}
              onChange={(v) => setApi('rateLimit', v)}
              helper="Maximum number of requests allowed per minute"
            />

            <ToggleRow
              label="Enable Gateway"
              checked={apiEnabled}
              onChange={setApiEnabled}
              description="Enable the API gateway"
            />

            <div className="flex items-center justify-between rounded-lg bg-accent px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <UploadCloud className="h-4 w-4 text-primary" strokeWidth={1.75} />
                <span className="text-xs font-semibold text-foreground">
                  API Gateway Configuration
                </span>
              </div>

              <TestConnectionButton />
            </div>

            <NotesBox
              items={[
                'Ensure the Base URL is accessible from the application server.',
                'Use a secure API Key and keep the API Secret confidential.',
                'Changes may take a few minutes to reflect in the system.',
              ]}
            />
          </div>
        </ModalShell>
      )}
    </PageContainer>
  )
}

function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-5 shadow-sm', className)}>
      {children}
    </div>
  )
}

function CardTitle({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-primary">
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
    </div>
  )
}

function SuccessBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border border-emerald-200 bg-white px-3.5 shadow-sm',
        compact ? 'py-2' : 'py-3.5'
      )}
    >
      <span className="h-8 w-1 shrink-0 rounded-full bg-emerald-600" />
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600">
        <Check className="h-3 w-3 text-white" strokeWidth={3} />
      </span>
      <span className="text-[12px] font-semibold tracking-wide text-emerald-700">
        Your changes has been saved successfully.
      </span>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  helper,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  helper?: string
}) {
  const required = label.endsWith('*')
  const labelText = required ? label.slice(0, -1).trim() : label

  return (
    <div className="min-w-0">
      <label className="mb-1 block text-[12.5px] font-medium text-foreground">
        {labelText}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>

      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 w-full min-w-0 text-[13px]"
      />

      {helper && (
        <p className="mt-0.5 text-[10.5px] leading-tight text-muted-foreground/80">{helper}</p>
      )}
    </div>
  )
}

function PasswordField({
  label,
  value,
  visible,
  onChange,
  onToggle,
  helper,
}: {
  label: string
  value: string
  visible: boolean
  onChange: (value: string) => void
  onToggle: () => void
  helper?: string
}) {
  const required = label.endsWith('*')
  const labelText = required ? label.slice(0, -1).trim() : label

  return (
    <div className="min-w-0">
      <label className="mb-1 block text-[12.5px] font-medium text-foreground">
        {labelText}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>

      <div className="relative">
        <Input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-8 w-full min-w-0 pr-8 text-[13px]"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground hover:text-foreground"
        >
          {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </button>
      </div>

      {helper && (
        <p className="mt-0.5 text-[10.5px] leading-tight text-muted-foreground/80">{helper}</p>
      )}
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}) {
  const required = label.endsWith('*')
  const labelText = required ? label.slice(0, -1).trim() : label

  return (
    <div className="min-w-0">
      <label className="mb-1 block text-[12.5px] font-medium text-foreground">
        {labelText}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-8 w-full min-w-0 appearance-none rounded-md border border-input bg-transparent px-3 pr-8 text-[13px] text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground" />
      </div>
    </div>
  )
}

function IntegrationRow({
  title,
  description,
  onClick,
}: {
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>

      <Button variant="outline" size="sm" onClick={onClick}>
        Configure
      </Button>
    </div>
  )
}

function SecurityRow({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon
  title: string
  description: string
}) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} />
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function ModalShell({
  title,
  description,
  onClose,
  children,
  footer,
  maxWidth,
}: {
  title: string
  description: string
  onClose: () => void
  children: ReactNode
  footer: ReactNode
  maxWidth: string
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4">
      <div
        className={cn(
          'flex w-full flex-col overflow-hidden rounded-xl bg-card shadow-2xl',
          maxWidth
        )}
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-5 py-3">
          <div className="min-w-0">
            <h2 className="text-[15px] font-semibold leading-[20px] text-foreground">{title}</h2>
            <p className="mt-0.5 text-[11.5px] leading-[15px] text-muted-foreground">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </div>

        <div className="shrink-0 border-t border-border">{footer}</div>
      </div>
    </div>
  )
}

function ModalFooter({ onCancel, onSave }: { onCancel: () => void; onSave: () => void }) {
  return (
    <div className="flex justify-end gap-2 px-5 py-2.5">
      <Button variant="outline" size="sm" className="h-8 px-3.5 text-[12.5px]" onClick={onCancel}>
        Cancel
      </Button>

      <Button size="sm" className="h-8 px-3.5 text-[12.5px]" onClick={onSave}>
        Save Configuration
      </Button>
    </div>
  )
}

function TestConnectionButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      type="button"
      className="h-8 border-primary px-3 text-[12px] text-primary hover:bg-primary/5"
    >
      <Send className="h-3.5 w-3.5" strokeWidth={1.75} />
      Test Connection
    </Button>
  )
}

function ToggleRow({
  label,
  checked,
  onChange,
  description,
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
  description: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div>
        <p className="text-xs font-medium text-foreground">{label}</p>

        <button
          type="button"
          onClick={() => onChange(!checked)}
          className={cn(
            'relative mt-1 h-5 w-9 rounded-full transition-colors',
            checked ? 'bg-primary' : 'bg-muted'
          )}
        >
          <span
            className={cn(
              'absolute top-[3px] h-3.5 w-3.5 rounded-full bg-white transition-transform',
              checked ? 'left-[19px]' : 'left-[3px]'
            )}
          />
        </button>
      </div>

      <span className="text-[11px] text-muted-foreground">{description}</span>
    </div>
  )
}

function NotesBox({ items }: { items: string[] }) {
  return (
    <div className="rounded-lg bg-muted/60 px-3 py-2">
      <div className="mb-1.5 flex items-center gap-2">
        <Info className="h-3.5 w-3.5 text-primary" strokeWidth={1.75} />
        <p className="text-[11px] font-semibold text-foreground">Important Notes</p>
      </div>

      <ul className="space-y-0.5 pl-4 text-[10px] leading-tight text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="list-disc">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}