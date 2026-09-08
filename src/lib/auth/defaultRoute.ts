import type { AuthUser } from '@/types/auth.types'
import { ROUTES } from '@/lib/constants/routes'

/** Fresh prod shell — always land on the platform dashboard after login. */
export function getHomeRoute(_user: AuthUser): string {
  return ROUTES.DASHBOARD
}
