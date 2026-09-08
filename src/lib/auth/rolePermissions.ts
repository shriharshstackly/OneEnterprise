import { PERMISSIONS, type Permission } from '@/lib/constants/permissions'
import { ROLES, type Role } from '@/lib/constants/roles'

export const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS).flatMap(
  (group) => Object.values(group)
) as Permission[]

export const ROLE_PERMISSION_PRESETS: Partial<Record<Role, Permission[]>> = {
  [ROLES.SUPER_ADMIN]: ALL_PERMISSIONS,
  [ROLES.ADMIN]: ALL_PERMISSIONS,
  [ROLES.HR_MANAGER]: [PERMISSIONS.DASHBOARD.VIEW],
  [ROLES.HR_EXECUTIVE]: [PERMISSIONS.DASHBOARD.VIEW],
  [ROLES.MANAGER]: [PERMISSIONS.DASHBOARD.VIEW],
  [ROLES.EMPLOYEE]: [PERMISSIONS.DASHBOARD.VIEW],
}

export function getPermissionsForRoles(roles: Role[]): Permission[] {
  const set = new Set<Permission>()
  for (const role of roles) {
    const preset = ROLE_PERMISSION_PRESETS[role] ?? []
    for (const permission of preset) set.add(permission)
  }
  return [...set]
}
