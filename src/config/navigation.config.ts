import {
  LayoutDashboard,
  Shield,
  Globe,
  Settings2,
  Palette,
  Puzzle,
  KeyRound,
  Settings,
  Building2,
  Users,
} from 'lucide-react'
import type { NavigationGroup } from '@/types/navigation.types'
import { ROUTES } from '@/lib/constants/routes'
import { PERMISSIONS } from '@/lib/constants/permissions'

export const navigationConfig: NavigationGroup[] = [
  {
    label: 'SUPER ADMIN MANAGEMENT',
    items: [
      {
        label: 'Super Admin Dashboard',
        path: ROUTES.DASHBOARD,
        icon: LayoutDashboard,
        permission: PERMISSIONS.DASHBOARD.VIEW,
      },
      {
        label: 'Platform Administration',
        path: ROUTES.PLATFORM_ADMIN,
        icon: Shield,
        permission: PERMISSIONS.DASHBOARD.VIEW,
      },
      {
        label: 'Global Dashboard',
        path: ROUTES.GLOBAL_DASHBOARD,
        icon: Globe,
        permission: PERMISSIONS.DASHBOARD.VIEW,
      },
      {
        label: 'Platform Configuration',
        path: ROUTES.PLATFORM_CONFIG,
        icon: Settings2,
        permission: PERMISSIONS.DASHBOARD.VIEW,
      },
      {
        label: 'Platform Branding',
        path: ROUTES.PLATFORM_BRANDING,
        icon: Palette,
        permission: PERMISSIONS.DASHBOARD.VIEW,
      },
      {
        label: 'Feature Management',
        path: ROUTES.FEATURE_MANAGEMENT,
        icon: Puzzle,
        permission: PERMISSIONS.DASHBOARD.VIEW,
      },
      {
        label: 'License Management',
        path: ROUTES.LICENSE_MANAGEMENT,
        icon: KeyRound,
        permission: PERMISSIONS.DASHBOARD.VIEW,
      },
      {
        label: 'Settings',
        path: ROUTES.SETTINGS,
        icon: Settings,
        permission: PERMISSIONS.DASHBOARD.VIEW,
      },
    ],
  },
  {
    label: 'ORGANIZATION',
    items: [
      {
        label: 'Company Setup',
        path: ROUTES.COMPANY_SETUP,
        icon: Building2,
        permission: PERMISSIONS.DASHBOARD.VIEW,
      },
      {
        label: 'User Management',
        path: ROUTES.USER_MANAGEMENT,
        icon: Users,
        permission: PERMISSIONS.DASHBOARD.VIEW,
      },
    ],
  },
]
