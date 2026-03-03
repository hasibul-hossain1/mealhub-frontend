import { orderService } from "@/services/order.service"
import UserStats from "./components/UserStats"

type Order = {
  id: string
  status: string
}

type OrdersResponse = {
  success: boolean
  data: Order[]
  message: string
}

const isOrderList = (value: unknown): value is Order[] => {
  if (!Array.isArray(value)) return false

  return value.every((item) => {
    if (!item || typeof item !== "object") return false
    const order = item as Partial<Order>
    return typeof order.id === "string" && typeof order.status === "string"
  })
}

async function UserDashboard() {
  const { data } = await orderService.getMyAllOrder()
  const payload = data as OrdersResponse | null
  const orders = isOrderList(payload?.data) ? payload.data : []

  const totalOrders = orders.length
  const pendingOrders = orders.filter((order) => order.status.toUpperCase() === "PENDING").length
  const cancelledOrders = orders.filter((order) => order.status.toUpperCase() === "CANCELLED").length
  const deliveredOrders = orders.filter((order) => order.status.toUpperCase() === "DELIVERED").length

  return (
    <section className="w-full p-4 sm:p-6 lg:p-8">
      <div className="mb-6 rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">User Dashboard</p>
        <h1 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track your current order status and cart activity.</p>
      </div>
      <UserStats
        totalOrders={totalOrders}
        pendingOrders={pendingOrders}
        cancelledOrders={cancelledOrders}
        deliveredOrders={deliveredOrders}
      />
    </section>
  )
}

export default UserDashboard
