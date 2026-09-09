import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { HomeRedirect } from './HomeRedirect'
import { ROUTES } from '@/lib/constants/routes'
import Login from '@/pages/auth/Login'
import Dashboard from '@/pages/dashboard/Dashboard'
import { PlaceholderPage } from '@/pages/PlaceholderPage'

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
        element: placeholder('Platform Administration'),
      },
      {
        path: 'global-dashboard',
        element: placeholder('Global Dashboard'),
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
        element: placeholder('Feature Management'),
      },
      {
        path: 'license-management',
        element: placeholder('License Management'),
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
    ],
  },
])
