import AdminOrdersTable, { AdminOrder } from '@/components/dashboard/admin/admin-orders-table'
import { orderService } from '@/services/order.service'

type AdminOrdersResponse = {
  success: boolean
  data: AdminOrder[]
  message: string
}

const isAdminOrderList = (value: unknown): value is AdminOrder[] => {
  if (!Array.isArray(value)) return false

  return value.every((item) => {
    if (!item || typeof item !== 'object') return false

    const order = item as Partial<AdminOrder>

    return (
      typeof order.id === 'string' &&
      typeof order.userId === 'string' &&
      typeof order.status === 'string' &&
      typeof order.totalPrice === 'number' &&
      typeof order.createdAt === 'string' &&
      typeof order.updatedAt === 'string' &&
      typeof order.address === 'string' &&
      order.user &&
      typeof order.user === 'object'
    )
  })
}

export default async function AllOrderPage() {
  const { data, error } = await orderService.getAllOrder()

  if (error) {
    return (
      <div className='rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
        Failed to load orders. Please try again.
      </div>
    )
  }

  const payload = data as AdminOrdersResponse | null
  const orders = isAdminOrderList(payload?.data)
    ? [...payload.data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    : []

  return (
    <section className='space-y-4 lg:px-6'>
      <div className='rounded-2xl border border-border/70 bg-linear-to-r from-emerald-50 via-sky-50 to-indigo-50 p-6 shadow-xs dark:from-emerald-950/40 dark:via-sky-950/35 dark:to-indigo-950/35'>
        <p className='text-xs font-semibold tracking-[0.18em] text-emerald-700 uppercase dark:text-emerald-200'>
          Admin Dashboard
        </p>
        <div className='mt-2 flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h1 className='text-2xl font-extrabold text-zinc-900 sm:text-3xl dark:text-emerald-50'>
              Order Overview
            </h1>
            <p className='mt-1 text-sm text-zinc-700 dark:text-zinc-300'>
              Review every customer order, current status, totals, and restaurants.
            </p>
          </div>
          <div className='rounded-full border border-emerald-200 bg-white/80 px-4 py-1.5 text-sm font-semibold text-emerald-700 backdrop-blur dark:border-emerald-500/40 dark:bg-emerald-950/40 dark:text-emerald-100'>
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
          <AdminOrdersTable orders={orders} />
        </div>
      )}
    </section>
  )
}
