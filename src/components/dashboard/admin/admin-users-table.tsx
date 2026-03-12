'use client'

import { Fragment, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { updateUserStatus } from '@/action/updateProfile.action'
import { MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'

export type AdminUser = {
  id: string
  name?: string | null
  email: string
  emailVerified?: boolean
  image?: string | null
  createdAt?: string
  updatedAt?: string
  role?: string
  isActive?: boolean
}

type AdminUsersTableProps = {
  users: AdminUser[]
}

const ITEMS_PER_PAGE = 8

const dateTime = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const formatDateTime = (value?: string) => {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'N/A'
  return dateTime.format(date)
}

const getInitials = (name?: string | null) => {
  if (!name) return 'NA'
  const parts = name
    .split(' ')
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length === 0) return 'NA'
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

const getRoleClassName = (role?: string) => {
  const normalized = role?.toUpperCase()

  if (normalized === 'ADMIN') return 'bg-sky-100 text-sky-700'
  if (normalized === 'SELLER') return 'bg-amber-100 text-amber-700'
  if (normalized === 'CUSTOMER') return 'bg-emerald-100 text-emerald-700'

  return 'bg-muted text-muted-foreground'
}

const getStatusClassName = (isActive?: boolean) =>
  isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'

const getVerifiedClassName = (isVerified?: boolean) =>
  isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'

function AdminUsersTable({ users }: AdminUsersTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)
  const router = useRouter()
  const totalPages = Math.max(1, Math.ceil(users.length / ITEMS_PER_PAGE))

  const pageNumbers = useMemo(
    () =>
      Array.from(
        new Set(
          [1, currentPage - 1, currentPage, currentPage + 1, totalPages].filter(
            (page): page is number => page >= 1 && page <= totalPages,
          ),
        ),
      ).sort((a, b) => a - b),
    [currentPage, totalPages],
  )

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedUsers = users.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return
    }

    setCurrentPage(page)
  }

  const handleUserStatusUpdate = async (user: AdminUser) => {
    if (updatingUserId) return

    const nextStatus = !Boolean(user.isActive)
    const toastId = toast.loading(nextStatus ? 'Unbanning user...' : 'Banning user...')
    setUpdatingUserId(user.id)

    try {
      const response = await updateUserStatus({ id: user.id, status: nextStatus })
      if (response.error) {
        toast.error('Failed to update user status.', { id: toastId })
        return
      }

      toast.success(nextStatus ? 'User unbanned.' : 'User banned.', { id: toastId })
      router.refresh()
    } catch (error) {
      toast.error('An unexpected error occurred.', { id: toastId })
      throw error
    } finally {
      setUpdatingUserId(null)
    }
  }

  return (
    <div className='rounded-md border bg-background lg:p-4'>
      <div className='overflow-x-auto'>
        <table className='w-full min-w-265 text-sm'>
          <thead className='bg-muted/50'>
            <tr className='border-b text-left'>
              <th className='px-4 py-3 font-medium'>User</th>
              <th className='px-4 py-3 font-medium'>Email</th>
              <th className='px-4 py-3 font-medium'>Role</th>
              <th className='px-4 py-3 font-medium'>Status</th>
              <th className='px-4 py-3 font-medium'>Verified</th>
              <th className='px-4 py-3 font-medium'>Created</th>
              <th className='px-4 py-3 font-medium'>Updated</th>
              <th className='px-4 py-3 font-medium'>User ID</th>
              <th className='px-4 py-3 font-medium'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id} className='border-b align-top'>
                <td className='px-4 py-3'>
                  <div className='flex items-center gap-3'>
                    <Avatar size='sm'>
                      <AvatarImage src={user.image ?? undefined} alt={user.name ?? 'User avatar'} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='font-medium text-foreground'>{user.name ?? 'Unnamed user'}</p>
                      <p className='text-xs text-muted-foreground'>{user.role ?? 'Unknown role'}</p>
                    </div>
                  </div>
                </td>
                <td className='px-4 py-3 text-muted-foreground'>{user.email}</td>
                <td className='px-4 py-3'>
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
                      getRoleClassName(user.role),
                    )}
                  >
                    {user.role ?? 'UNKNOWN'}
                  </span>
                </td>
                <td className='px-4 py-3'>
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
                      getStatusClassName(user.isActive),
                    )}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className='px-4 py-3'>
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
                      getVerifiedClassName(user.emailVerified),
                    )}
                  >
                    {user.emailVerified ? 'Verified' : 'Unverified'}
                  </span>
                </td>
                <td className='px-4 py-3 text-muted-foreground'>{formatDateTime(user.createdAt)}</td>
                <td className='px-4 py-3 text-muted-foreground'>{formatDateTime(user.updatedAt)}</td>
                <td className='px-4 py-3 text-muted-foreground'>{user.id.slice(0, 12)}...</td>
                <td className='px-4 py-3'>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className='inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/70 bg-background text-muted-foreground transition hover:text-foreground'
                      aria-label='User actions'
                    >
                      <MoreHorizontal className='size-4' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem
                        onClick={() => void handleUserStatusUpdate(user)}
                        disabled={updatingUserId === user.id}
                      >
                        {updatingUserId === user.id
                          ? 'Updating...'
                          : user.isActive
                          ? 'Ban user'
                          : 'Unban user'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <Pagination className='mt-6'>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href='#'
                onClick={(event) => {
                  event.preventDefault()
                  goToPage(currentPage - 1)
                }}
                aria-disabled={currentPage === 1}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : undefined}
              />
            </PaginationItem>

            {pageNumbers.map((page, index) => (
              <Fragment key={page}>
                {index > 0 && pageNumbers[index - 1] !== page - 1 ? (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : null}

                <PaginationItem>
                  <PaginationLink
                    href='#'
                    isActive={currentPage === page}
                    onClick={(event) => {
                      event.preventDefault()
                      goToPage(page)
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              </Fragment>
            ))}

            <PaginationItem>
              <PaginationNext
                href='#'
                onClick={(event) => {
                  event.preventDefault()
                  goToPage(currentPage + 1)
                }}
                aria-disabled={currentPage === totalPages}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </div>
  )
}

export default AdminUsersTable
