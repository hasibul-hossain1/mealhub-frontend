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
import { RxUpdate } from 'react-icons/rx'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { OrderStatus } from '@/constant/orderStatus'
import { updateOrderStatus } from '@/action/seller.action'
import { toast } from 'sonner'

type SellerOrder = {
  id: string
  userId: string
  status: string
  totalPrice: number
  createdAt: string
  updatedAt: string
  address: string
  isPaid: boolean
  paymentMethod: string
  paidAt: string | null
  user: {
    name: string
  }
}

type SellerOrdersTableProps = {
  orders: SellerOrder[]
}

const ITEMS_PER_PAGE = 6

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

const getPaymentStatusClassName = (isPaid: boolean) => {
  return isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
}

const formatPaymentMethod = (method: string) => {
  const normalized = method.toUpperCase()
  if (normalized === 'COD') {
    return 'Cash on Delivery'
  }
  if (normalized === 'STRIPE') {
    return 'Stripe'
  }
  return method
}

const formatStatus = (status: string) =>
  status
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())

const getStatusNextStep = (step: OrderStatus) => {
  switch (step) {
    case OrderStatus.PENDING:
      return OrderStatus.CONFIRMED
    case OrderStatus.CONFIRMED:
      return OrderStatus.COOKING
    case OrderStatus.COOKING:
      return OrderStatus.DELIVERED
    default:
      return OrderStatus.PENDING
  }
}

function SellerOrdersTable({ orders }: SellerOrdersTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(orders.length / ITEMS_PER_PAGE))
  const handleStatusUpdate = async ({ orderId, status }: { orderId: string, status: OrderStatus }) => {
    const toastId = toast.loading('Updating order status...')
    try {
      const response = await updateOrderStatus({ orderId, status })
      if (response.error) {
        toast.error('Failed to update order status', { id: toastId })
      } else {
        toast.success(`Order status updated to ${status.toLowerCase()}`, { id: toastId })
      }
    } catch (error) {
      toast.error('An unexpected error occurred', { id: toastId })
      throw error
    }
  }

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
        <table className='w-full min-w-230 text-sm'>
          <thead className='bg-muted/50'>
            <tr className='border-b text-left'>
              <th className='px-4 py-3 font-medium'>Order ID</th>
              <th className='px-4 py-3 font-medium'>Customer Name</th>
              <th className='px-4 py-3 font-medium'>Customer ID</th>
              <th className='px-4 py-3 font-medium'>Status</th>
              <th className='px-4 py-3 font-medium'>Total</th>
              <th className='px-4 py-3 font-medium'>Payment Method</th>
              <th className='px-4 py-3 font-medium'>Payment Status</th>
              <th className='px-4 py-3 font-medium'>Address</th>
              <th className='px-4 py-3 font-medium'>Created</th>
              <th className='px-4 py-3 font-medium'>Updated</th>
              <th className='px-4 py-3 font-medium'>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => (
              <tr key={order.id} className='border-b align-top'>
                <td className='px-4 py-3 font-medium text-foreground'>#{order.id.slice(0, 8)}</td>
                <td className='px-4 py-3 text-muted-foreground'>{order.user.name}</td>
                <td className='px-4 py-3 text-muted-foreground'>{order.userId.slice(0, 10)}...</td>
                <td className='px-4 py-3'>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClassName(order.status)}`}
                  >
                    {formatStatus(order.status)}
                  </span>
                </td>
                <td className='px-4 py-3 font-medium'>{currency.format(order.totalPrice)}</td>
                <td className='px-4 py-3'>
                  <span className='text-sm text-muted-foreground'>{formatPaymentMethod(order.paymentMethod)}</span>
                </td>
                <td className='px-4 py-3'>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getPaymentStatusClassName(order.isPaid)}`}
                  >
                    {order.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                </td>
                <td className='max-w-56 px-4 py-3 text-muted-foreground'>{order.address}</td>
                <td className='px-4 py-3 text-muted-foreground'>{formatDateTime(order.createdAt)}</td>
                <td className='px-4 py-3 text-muted-foreground'>{formatDateTime(order.updatedAt)}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  <DropdownMenu>
                    {order.status === OrderStatus.DELIVERED ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
                            <DropdownMenuTrigger disabled className="cursor-not-allowed opacity-50">
                              <RxUpdate />
                            </DropdownMenuTrigger>
                          </span>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Order already delivered</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <DropdownMenuTrigger className="cursor-pointer">
                        <RxUpdate />
                      </DropdownMenuTrigger>
                    )}

                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleStatusUpdate({ orderId: order.id, status: getStatusNextStep(order.status as OrderStatus) })}>
                        {getStatusNextStep(order.status as OrderStatus)}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusUpdate({ orderId: order.id, status: OrderStatus.CANCELLED })}>Cancel</DropdownMenuItem>
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

export default SellerOrdersTable
