export const PERMISSIONS = {
  DASHBOARD: {
    VIEW: 'dashboard.view',
  },
} as const

type FlatPermissions = {
  [K in keyof typeof PERMISSIONS]: (typeof PERMISSIONS)[K][keyof (typeof PERMISSIONS)[K]]
}

export type Permission = FlatPermissions[keyof FlatPermissions]
