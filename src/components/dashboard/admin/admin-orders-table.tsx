'use client'

import { Fragment, useMemo, useState } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { OrderStatus } from '@/constant/orderStatus'

export type AdminOrderItem = {
  quantity: number
  meal?: {
    foodName?: string | null
    seller?: {
      restaurantName?: string | null
    }
  }
}

export type AdminOrder = {
  id: string
  userId: string
  status: string
  totalPrice: number
  createdAt: string
  updatedAt: string
  address: string
  user?: {
    name?: string | null
    email?: string | null
  }
  orderItems?: AdminOrderItem[]
}

type AdminOrdersTableProps = {
  orders: AdminOrder[]
}

const ITEMS_PER_PAGE = 7

const currency = new Intl.NumberFormat('en-BD', {
  style: 'currency',
  currency: 'BDT',
  maximumFractionDigits: 0,
})

const dateTime = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const formatDateTime = (value: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'N/A'
  }

  return dateTime.format(date)
}

const getStatusClassName = (status: string) => {
  const normalized = status.toUpperCase()

  if (normalized === OrderStatus.DELIVERED) {
    return 'bg-emerald-100 text-emerald-700'
  }

  if (normalized === OrderStatus.CANCELLED) {
    return 'bg-rose-100 text-rose-700'
  }

  if (normalized === OrderStatus.CONFIRMED) {
    return 'bg-sky-100 text-sky-700'
  }

  if (normalized === OrderStatus.COOKING) {
    return 'bg-purple-100 text-purple-700'
  }

  return 'bg-amber-100 text-amber-700'
}

const formatStatus = (status: string) =>
  status
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())

const getUniqueLabel = (values: (string | null | undefined)[], visibleCount = 2) => {
  const unique = Array.from(new Set(values.filter((value): value is string => Boolean(value))))

  if (unique.length === 0) {
    return 'N/A'
  }

  const visible = unique.slice(0, visibleCount)
  const remaining = unique.length - visible.length

  return remaining > 0 ? `${visible.join(', ')} +${remaining} more` : visible.join(', ')
}

const getItemsMeta = (order: AdminOrder) => {
  const items = Array.isArray(order.orderItems) ? order.orderItems : []
  const totalQuantity = items.reduce(
    (sum, item) => sum + (typeof item.quantity === 'number' ? item.quantity : 0),
    0,
  )
  const totalItems = totalQuantity || items.length
  const itemNames = items.map((item) => item.meal?.foodName ?? null)

  return {
    totalItems,
    summary: getUniqueLabel(itemNames),
  }
}

const getRestaurantSummary = (order: AdminOrder) => {
  const items = Array.isArray(order.orderItems) ? order.orderItems : []
  const names = items.map((item) => item.meal?.seller?.restaurantName ?? null)
  return getUniqueLabel(names)
}

function AdminOrdersTable({ orders }: AdminOrdersTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(orders.length / ITEMS_PER_PAGE))

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
  const paginatedOrders = orders.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return
    }

    setCurrentPage(page)
  }

  return (
    <div className='rounded-md border bg-background lg:p-4'>
      <div className='overflow-x-auto'>
        <table className='w-full min-w-265 text-sm'>
          <thead className='bg-muted/50'>
            <tr className='border-b text-left'>
              <th className='px-4 py-3 font-medium'>Order ID</th>
              <th className='px-4 py-3 font-medium'>Customer</th>
              <th className='px-4 py-3 font-medium'>Status</th>
              <th className='px-4 py-3 font-medium'>Total</th>
              <th className='px-4 py-3 font-medium'>Items</th>
              <th className='px-4 py-3 font-medium'>Restaurant</th>
              <th className='px-4 py-3 font-medium'>Address</th>
              <th className='px-4 py-3 font-medium'>Created</th>
              <th className='px-4 py-3 font-medium'>Updated</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => {
              const itemsMeta = getItemsMeta(order)
              return (
                <tr key={order.id} className='border-b align-top'>
                  <td className='px-4 py-3 font-medium text-foreground'>#{order.id.slice(0, 8)}</td>
                  <td className='px-4 py-3'>
                    <div className='space-y-1'>
                      <p className='font-medium text-foreground'>{order.user?.name ?? 'Unknown customer'}</p>
                      <p className='text-xs text-muted-foreground'>{order.user?.email ?? 'Email not available'}</p>
                    </div>
                  </td>
                  <td className='px-4 py-3'>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClassName(order.status)}`}
                    >
                      {formatStatus(order.status)}
                    </span>
                  </td>
                  <td className='px-4 py-3 font-medium'>{currency.format(order.totalPrice)}</td>
                  <td className='px-4 py-3'>
                    <div className='space-y-1'>
                      <p className='font-medium text-foreground'>
                        {itemsMeta.totalItems} item{itemsMeta.totalItems === 1 ? '' : 's'}
                      </p>
                      <p className='text-xs text-muted-foreground line-clamp-2'>{itemsMeta.summary}</p>
                    </div>
                  </td>
                  <td className='max-w-56 px-4 py-3 text-muted-foreground'>{getRestaurantSummary(order)}</td>
                  <td className='max-w-56 px-4 py-3 text-muted-foreground'>{order.address}</td>
                  <td className='px-4 py-3 text-muted-foreground'>{formatDateTime(order.createdAt)}</td>
                  <td className='px-4 py-3 text-muted-foreground'>{formatDateTime(order.updatedAt)}</td>
                </tr>
              )
            })}
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

export default AdminOrdersTable
