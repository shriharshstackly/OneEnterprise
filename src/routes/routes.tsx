import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { HomeRedirect } from './HomeRedirect'
import { ROUTES } from '@/lib/constants/routes'
import Login from '@/pages/auth/Login'
import Dashboard from '@/pages/dashboard/Dashboard'
import GlobalDashboard from '@/pages/globaldashboard'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import PlatformAdministration from '@/pages/platformadministration/PlatformAdministration'
import LicenseManagement from '@/pages/licence-management/LicenseManagement'
import FeatureManagement from '@/pages/feature-management/FeatureManagement'

function placeholder(title: string) {
  return <PlaceholderPage title={title} />
}

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomeRedirect />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'platform-administration',
        element: <PlatformAdministration />,
      },
      {
        path: 'global-dashboard',
        element: <GlobalDashboard />,
      },
      {
        path: 'platform-configuration',
        element: placeholder('Platform Configuration'),
      },
      {
        path: 'platform-branding',
        element: placeholder('Platform Branding'),
      },
      {
        path: 'feature-management',
        element: <FeatureManagement />,
      },
      {
        path: 'license-management',
        element: <LicenseManagement/>,
      },
      {
        path: 'settings',
        element: placeholder('Settings'),
      },
      {
        path: 'company-setup',
        element: placeholder('Company Setup'),
      },
      {
        path: 'user-management',
        element: placeholder('User Management'),
      },
      {
        path: 'audit-logs',
        element: placeholder('Audit Logs'),
      },
      {
        path: 'notifications',
        element: placeholder('Notifications'),
      },
      {
        path: 'backup-recovery',
        element: placeholder('Backup & Recovery'),
      },
      {
        path: 'reports',
        element: placeholder('Reports'),
      },
      {
        path: 'security-center',
        element: placeholder('Security Center'),
      },
    ],
  },
])
