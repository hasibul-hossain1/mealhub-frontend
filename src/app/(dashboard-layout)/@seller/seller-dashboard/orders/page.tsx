import SellerOrdersTable from '@/components/dashboard/seller/seller-orders-table'
import { sellerService } from '@/services/seller.service'

type SellerOrder = {
  id: string
  userId: string
  status: string
  totalPrice: number
  createdAt: string
  updatedAt: string
  address: string
  user: {
    name: string
  }
}

type SellerOrdersResponse = {
  success: boolean
  data: SellerOrder[]
  message: string
}

const isSellerOrderList = (value: unknown): value is SellerOrder[] => {
  if (!Array.isArray(value)) return false

  return value.every((item) => {
    if (!item || typeof item !== 'object') return false

    const order = item as Partial<SellerOrder>

    return (
      typeof order.id === 'string' &&
      typeof order.userId === 'string' &&
      typeof order.status === 'string' &&
      typeof order.totalPrice === 'number' &&
      typeof order.createdAt === 'string' &&
      typeof order.updatedAt === 'string' &&
      typeof order.address === 'string' &&
      order.user &&
      typeof order.user === 'object' &&
      typeof (order.user as { name?: string }).name === 'string'
    )
  })
}

async function OrderManagementPage() {
  const { data, error } = await sellerService.getOrders()

  if (error) {
    return (
      <div className='rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
        Failed to load orders. Please try again.
      </div>
    )
  }

  const payload = data as SellerOrdersResponse | null
  const orders = isSellerOrderList(payload?.data)
    ? [...payload.data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    : []

  return (
    <section className='space-y-4 lg:px-6'>
      <div className='rounded-2xl border border-border/70 bg-linear-to-r from-sky-50 via-cyan-50 to-emerald-50 p-6 shadow-xs dark:from-sky-950/40 dark:via-cyan-950/35 dark:to-emerald-950/35'>
        <p className='text-xs font-semibold tracking-[0.18em] text-sky-700 uppercase dark:text-sky-200'>
          Seller Dashboard
        </p>
        <div className='mt-2 flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h1 className='text-2xl font-extrabold text-zinc-900 sm:text-3xl dark:text-sky-50'>
              Order Management
            </h1>
            <p className='mt-1 text-sm text-zinc-700 dark:text-zinc-300'>
              Review recent customer orders, their delivery status, and order totals.
            </p>
          </div>
          <div className='rounded-full border border-sky-200 bg-white/80 px-4 py-1.5 text-sm font-semibold text-sky-700 backdrop-blur dark:border-sky-500/40 dark:bg-sky-950/40 dark:text-sky-100'>
            Total orders: {orders.length}
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className='rounded-md border p-6 text-sm text-muted-foreground'>
          No orders found.
        </div>
      ) : (
        <div className='lg:px-6'>
          <SellerOrdersTable orders={orders} />
        </div>
      )}
    </section>
  )
}

export default OrderManagementPage
