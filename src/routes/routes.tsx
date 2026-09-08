import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { HomeRedirect } from './HomeRedirect'
import { ROUTES } from '@/lib/constants/routes'
import Login from '@/pages/auth/Login'
import Dashboard from '@/pages/dashboard/Dashboard'

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
    ],
  },
])
