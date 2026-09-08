import { ApiError } from '@/lib/api/apiError'
import { ALL_PERMISSIONS } from '@/lib/auth/rolePermissions'
import { ROLES } from '@/lib/constants/roles'
import { readMockState, writeMockState } from '@/lib/mock/mockStateStore'
import type { AuthUser } from '@/types/auth.types'

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

type StoredUser = AuthUser & { password: string; status: 'active' | 'inactive' }

function createSeedUsers(): StoredUser[] {
  return [
    {
      id: 'user-1',
      email: 'admin@oneenterprise.com',
      password: 'admin123',
      firstName: 'Dharani',
      lastName: 'Admin',
      roles: [ROLES.SUPER_ADMIN],
      permissions: ALL_PERMISSIONS,
      status: 'active',
    },
  ]
}

let users: StoredUser[] | null = null

function getStore(): StoredUser[] {
  if (users) return users

  const saved = readMockState().users as StoredUser[] | undefined
  users = saved?.length ? saved : createSeedUsers()
  if (!saved?.length) {
    writeMockState({ users })
  }
  return users
}

function toAuthUser(user: StoredUser): AuthUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    roles: user.roles,
    permissions: user.permissions,
    avatar: user.avatar,
  }
}

export const mockUserService = {
  async authenticate(email: string, password: string): Promise<AuthUser> {
    await delay()
    const user = getStore().find(
      (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password
    )
    if (!user || user.status !== 'active') {
      throw new ApiError('Invalid email or password', 401)
    }
    return toAuthUser(user)
  },

  async getAuthUserById(id: string): Promise<AuthUser> {
    await delay(100)
    const user = getStore().find((item) => item.id === id)
    if (!user) {
      throw new ApiError('User not found', 404)
    }
    return toAuthUser(user)
  },
}
