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
} from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/cn'

type ModalType = 'smtp' | 'sms' | 'api' | null

export default function PlatformConfiguration() {
  const [modal, setModal] = useState<ModalType>(null)
  const [modalSaved, setModalSaved] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [showApiSecret, setShowApiSecret] = useState(false)
  const [showSmsSid, setShowSmsSid] = useState(false)
  const [showSmsToken, setShowSmsToken] = useState(false)
  const [saved, setSaved] = useState(true)

  const [platformName, setPlatformName] = useState('Java Enterprise Suite')
  const [platformUrl, setPlatformUrl] = useState('https://app.javasuite.enterprise')
  const [timezone, setTimezone] = useState('UTC +05:30 (India Standard Time)')
  const [language, setLanguage] = useState('ENGLISH')

  const [smtpHost, setSmtpHost] = useState('smtp.stackly.com')
  const [smtpPort, setSmtpPort] = useState('587')
  const [smtpUsername, setSmtpUsername] = useState('noreply@stackly.com')
  const [smtpPassword, setSmtpPassword] = useState('password123')
  const [encryption, setEncryption] = useState('TLS')
  const [fromEmail, setFromEmail] = useState('noreply@stackly.com')
  const [fromName, setFromName] = useState('Stackly Platform')

  const [smsProvider, setSmsProvider] = useState('Stackly')
  const [smsGatewayName, setSmsGatewayName] = useState('Stackly Primary')
  const [smsApiUrl, setSmsApiUrl] = useState('https://api.stackly.com/2010-04-01')
  const [smsAccountSid, setSmsAccountSid] = useState('ACxxxxxxxxxxxxxxxxxxxxxxxx')
  const [smsSender, setSmsSender] = useState('+14155552671')
  const [smsTimeout, setSmsTimeout] = useState('30')
  const [smsAuthToken, setSmsAuthToken] = useState('xxxxxxxxxxxxxxxxxxxxxxxx')
  const [smsMessagingSid, setSmsMessagingSid] = useState('MGxxxxxxxxxxxxxxxxxxxxxxxx')
  const [smsEnabled, setSmsEnabled] = useState(true)

  const [apiGatewayName, setApiGatewayName] = useState('Main API Gateway')
  const [apiEnvironment, setApiEnvironment] = useState('Production')
  const [apiBaseUrl, setApiBaseUrl] = useState('https://api.stackly.com/V1')
  const [apiVersion, setApiVersion] = useState('V1')
  const [authenticationType, setAuthenticationType] = useState('API Key')
  const [apiKey, setApiKey] = useState('xxxxxxxxxxxxxxxxxxxx')
  const [apiSecret, setApiSecret] = useState('xxxxxxxxxxxxxxxxxxxx')
  const [headerName, setHeaderName] = useState('X-API-Key')
  const [requestTimeout, setRequestTimeout] = useState('30')
  const [retryAttempts, setRetryAttempts] = useState('3')
  const [rateLimit, setRateLimit] = useState('100')
  const [apiEnabled, setApiEnabled] = useState(true)

  const handleSave = () => setSaved(true)
  const handleCancel = () => setSaved(false)

  const openModal = (type: ModalType) => {
    setModal(type)
    setModalSaved(false)
  }

  return (
    <PageContainer className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Platform Configuration</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage core platform identity, regional defaults, and security handling.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
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
              <Field label="Platform Name" value={platformName} onChange={setPlatformName} />
              <Field label="Platform URL" value={platformUrl} onChange={setPlatformUrl} />
            </div>
          </Card>

          <Card>
            <CardTitle icon={Globe2} title="Regional Configuration" />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Default Time Zone"
                value={timezone}
                onChange={setTimezone}
                options={[
                  'UTC +05:30 (India Standard Time)',
                  'UTC +00:00 (Coordinated Universal Time)',
                  'UTC -05:00 (Eastern Time)',
                  'UTC +01:00 (Central European Time)',
                ]}
              />
              <SelectField
                label="Default Language"
                value={language}
                onChange={setLanguage}
                options={['ENGLISH', 'HINDI', 'KANNADA', 'FRENCH']}
              />
            </div>
          </Card>

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
                Changes to Core Platform configurations may require a service restart for integrated
                modules to reflect the updates completely.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
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
      </div>

      {modal === 'smtp' && (
        <ModalShell
          title="Configure SMTP"
          description="See your SMTP server details to enable outgoing email notifications."
          onClose={() => setModal(null)}
          maxWidth="max-w-[520px]"
          footer={<ModalFooter onCancel={() => setModal(null)} onSave={() => setModalSaved(true)} />}
        >
          {modalSaved && <SuccessBanner compact />}
          <div className="space-y-4">
            <Field label="SMTP Host *" value={smtpHost} onChange={setSmtpHost} />
            <Field label="Port *" value={smtpPort} onChange={setSmtpPort} />
            <Field label="User Name *" value={smtpUsername} onChange={setSmtpUsername} />
            <PasswordField
              label="Password *"
              value={smtpPassword}
              visible={showPassword}
              onChange={setSmtpPassword}
              onToggle={() => setShowPassword(!showPassword)}
            />
            <SelectField label="Encryption *" value={encryption} onChange={setEncryption} options={['TLS', 'SSL', 'None']} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="From Email *" value={fromEmail} onChange={setFromEmail} />
              <Field label="From Name *" value={fromName} onChange={setFromName} />
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
          maxWidth="max-w-[520px]"
          footer={<ModalFooter onCancel={() => setModal(null)} onSave={() => setModalSaved(true)} />}
        >
          {modalSaved && <SuccessBanner compact />}
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Gateway Provider *" value={smsProvider} onChange={setSmsProvider} />
              <Field label="Gateway Name *" value={smsGatewayName} onChange={setSmsGatewayName} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="API Base URL *" value={smsApiUrl} onChange={setSmsApiUrl} helper="Base URL for Stackly API" />
              <PasswordField
                label="Account SID *"
                value={smsAccountSid}
                visible={showSmsSid}
                onChange={setSmsAccountSid}
                onToggle={() => setShowSmsSid(!showSmsSid)}
                helper="Your Stackly Account SID"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="From Number / Sender ID *"
                value={smsSender}
                onChange={setSmsSender}
                helper="Phone number or Sender ID to send SMS from"
              />
              <Field
                label="Connection Timeout (Seconds)"
                value={smsTimeout}
                onChange={setSmsTimeout}
                helper="Timeout for API requests"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <PasswordField
                label="Auth Token *"
                value={smsAuthToken}
                visible={showSmsToken}
                onChange={setSmsAuthToken}
                onToggle={() => setShowSmsToken(!showSmsToken)}
                helper="Your Stackly Auth Token"
              />
              <Field
                label="Messaging Service SID (Optional) *"
                value={smsMessagingSid}
                onChange={setSmsMessagingSid}
                helper="Stackly Messaging Service SID"
              />
            </div>

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
          maxWidth="max-w-[600px]"
          footer={<ModalFooter onCancel={() => setModal(null)} onSave={() => setModalSaved(true)} />}
        >
          {modalSaved && <SuccessBanner compact />}
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Gateway Name *" value={apiGatewayName} onChange={setApiGatewayName} />
              <Field label="Environment *" value={apiEnvironment} onChange={setApiEnvironment} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Base URL *" value={apiBaseUrl} onChange={setApiBaseUrl} helper="Base URL of the API Gateway" />
              <Field label="API Version *" value={apiVersion} onChange={setApiVersion} helper="API version (e.g., v1, v2)" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Authentication Type *" value={authenticationType} onChange={setAuthenticationType} />
              <PasswordField
                label="API Key *"
                value={apiKey}
                visible={showApiKey}
                onChange={setApiKey}
                onToggle={() => setShowApiKey(!showApiKey)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <PasswordField
                label="API Secret *"
                value={apiSecret}
                visible={showApiSecret}
                onChange={setApiSecret}
                onToggle={() => setShowApiSecret(!showApiSecret)}
                helper="Secret used to authenticate API requests"
              />
              <Field
                label="Header Name (Optional) *"
                value={headerName}
                onChange={setHeaderName}
                helper="Custom header name for API key (if required)"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Request Timeout (Seconds) *"
                value={requestTimeout}
                onChange={setRequestTimeout}
                helper="Timeout for API requests"
              />
              <Field
                label="Retry Attempts *"
                value={retryAttempts}
                onChange={setRetryAttempts}
                helper="Number of retry attempts on failure"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Rate Limit (requests/minute) *"
                value={rateLimit}
                onChange={setRateLimit}
                helper="Maximum number of requests allowed per minute"
              />
              <ToggleRow
                label="Enable Gateway"
                checked={apiEnabled}
                onChange={setApiEnabled}
                description="Enable the API gateway"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg bg-accent px-4 py-3">
              <div className="flex items-center gap-3">
                <UploadCloud className="h-4.5 w-4.5 text-primary" strokeWidth={1.75} />
                <span className="text-sm font-semibold text-foreground">API Gateway Configuration</span>
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

function CardTitle({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  title: string
}) {
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
        'flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4',
        compact ? 'py-2.5' : 'py-3.5'
      )}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500">
        <Check className="h-3 w-3 text-white" strokeWidth={3} />
      </span>
      <span className="text-sm font-medium text-emerald-700">
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
  onChange?: (value: string) => void
  helper?: string
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <Input
        value={value}
        readOnly={!onChange}
        onChange={(event) => onChange?.(event.target.value)}
      />
      {helper && <p className="mt-1.5 text-xs text-muted-foreground/80">{helper}</p>}
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
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <div className="relative">
        <Input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="pr-9"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </button>
      </div>
      {helper && <p className="mt-1.5 text-xs text-muted-foreground/80">{helper}</p>}
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
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-9 w-full appearance-none rounded-md border border-input bg-transparent px-3 pr-8 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
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
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-foreground/60 p-4">
      <div className={cn('w-full overflow-hidden rounded-xl bg-card shadow-2xl', maxWidth)}>
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">{children}</div>

        {footer}
      </div>
    </div>
  )
}

function ModalFooter({ onCancel, onSave }: { onCancel: () => void; onSave: () => void }) {
  return (
    <div className="flex justify-end gap-2 border-t border-border px-5 py-4">
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button onClick={onSave}>Save Configuration</Button>
    </div>
  )
}

function TestConnectionButton() {
  return (
    <Button variant="outline" size="sm" type="button">
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
        <p className="text-sm font-medium text-foreground">{label}</p>
        <button
          type="button"
          onClick={() => onChange(!checked)}
          className={cn(
            'relative mt-1.5 h-5 w-9 rounded-full transition-colors',
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
      <span className="mt-4 text-xs text-muted-foreground">{description}</span>
    </div>
  )
}

function NotesBox({ items }: { items: string[] }) {
  return (
    <div className="rounded-lg bg-muted/60 px-4 py-3">
      <div className="mb-2 flex items-center gap-2">
        <Info className="h-3.5 w-3.5 text-primary" strokeWidth={1.75} />
        <p className="text-xs font-semibold text-foreground">Important Notes</p>
      </div>
      <ul className="space-y-1 pl-4 text-xs leading-relaxed text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="list-disc">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}