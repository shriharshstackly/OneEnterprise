import { LayoutDashboard } from 'lucide-react'
import type { NavigationGroup } from '@/types/navigation.types'
import { ROUTES } from '@/lib/constants/routes'
import { PERMISSIONS } from '@/lib/constants/permissions'

/** Fresh shell — dashboard only. Add modules here as features are built. */
export const navigationConfig: NavigationGroup[] = [
  {
    label: 'MAIN',
    items: [
      {
        label: 'Dashboard',
        path: ROUTES.DASHBOARD,
        icon: LayoutDashboard,
        permission: PERMISSIONS.DASHBOARD.VIEW,
      },
    ],
  },
]
