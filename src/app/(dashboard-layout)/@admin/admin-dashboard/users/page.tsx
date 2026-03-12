import AdminUsersTable, { AdminUser } from '@/components/dashboard/admin/admin-users-table'
import { userService } from '@/services/user.service'

type UsersResponse = {
  success: boolean
  data: AdminUser[]
  message: string
}

const isUserList = (value: unknown): value is AdminUser[] => {
  if (!Array.isArray(value)) return false

  return value.every((item) => {
    if (!item || typeof item !== 'object') return false
    const user = item as Partial<AdminUser>

    if (typeof user.id !== 'string' || typeof user.email !== 'string') {
      return false
    }

    if (user.name !== undefined && user.name !== null && typeof user.name !== 'string') {
      return false
    }

    if (user.image !== undefined && user.image !== null && typeof user.image !== 'string') {
      return false
    }

    if (user.role !== undefined && typeof user.role !== 'string') {
      return false
    }

    if (user.createdAt !== undefined && typeof user.createdAt !== 'string') {
      return false
    }

    if (user.updatedAt !== undefined && typeof user.updatedAt !== 'string') {
      return false
    }

    if (user.emailVerified !== undefined && typeof user.emailVerified !== 'boolean') {
      return false
    }

    if (user.isActive !== undefined && typeof user.isActive !== 'boolean') {
      return false
    }

    return true
  })
}

async function UserPage() {
  const { data, error } = await userService.getAllUser()

  if (error) {
    return (
      <div className='rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
        Failed to load users. Please try again.
      </div>
    )
  }

  const payload = data as UsersResponse | null
  const users = isUserList(payload?.data)
    ? [...payload.data].sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bTime - aTime
      })
    : []

  return (
    <section className='space-y-4 lg:px-6'>
      <div className='rounded-2xl border border-border/70 bg-linear-to-r from-amber-50 via-orange-50 to-rose-50 p-6 shadow-xs dark:from-amber-950/40 dark:via-orange-950/35 dark:to-rose-950/35'>
        <p className='text-xs font-semibold tracking-[0.18em] text-amber-700 uppercase dark:text-amber-200'>
          Admin Dashboard
        </p>
        <div className='mt-2 flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h1 className='text-2xl font-extrabold text-zinc-900 sm:text-3xl dark:text-amber-50'>
              User Management
            </h1>
            <p className='mt-1 text-sm text-zinc-700 dark:text-zinc-300'>
              Review every registered account, roles, and verification status.
            </p>
          </div>
          <div className='rounded-full border border-amber-200 bg-white/80 px-4 py-1.5 text-sm font-semibold text-amber-700 backdrop-blur dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-100'>
            Total users: {users.length}
          </div>
        </div>
      </div>

      {users.length === 0 ? (
        <div className='rounded-md border p-6 text-sm text-muted-foreground'>
          No users found.
        </div>
      ) : (
        <div className='lg:px-6'>
          <AdminUsersTable users={users} />
        </div>
      )}
    </section>
  )
}

export default UserPage
