import { Separator } from "@/components/ui/separator"
import { orderService } from "@/services/order.service"
import {
  BadgeCheck,
  Clock3,
  LoaderCircle,
  MapPin,
  ReceiptText,
  Truck,
  XCircle,
} from "lucide-react"
import Image from "next/image"

type OrderItem = {
  id: string
  orderId: string
  mealId: string
  quantity: number
  priceAtOrderTime: number
  meal?: {
    foodName?: string
    imageUrl?: string
  } | null
}

type Order = {
  id: string
  userId: string
  status: string
  totalPrice: number
  createdAt: string
  updatedAt: string
  address: string
  orderItems: OrderItem[]
}

type OrdersResponse = {
  success: boolean
  data: Order[]
  message: string
}

const currency = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
})

const dateTime = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
})

const getStatusMeta = (status: string) => {
  const normalized = status.toUpperCase()

  if (normalized === "DELIVERED") {
    return {
      icon: BadgeCheck,
      chipClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
      label: "Delivered",
    }
  }

  if (normalized === "CANCELLED") {
    return {
      icon: XCircle,
      chipClass: "border-rose-200 bg-rose-50 text-rose-700",
      label: "Cancelled",
    }
  }

  if (normalized === "OUT_FOR_DELIVERY") {
    return {
      icon: Truck,
      chipClass: "border-sky-200 bg-sky-50 text-sky-700",
      label: "Out For Delivery",
    }
  }

  if (normalized === "PREPARING") {
    return {
      icon: LoaderCircle,
      chipClass: "border-violet-200 bg-violet-50 text-violet-700",
      label: "Preparing",
    }
  }

  return {
    icon: Clock3,
    chipClass: "border-amber-200 bg-amber-50 text-amber-700",
    label: normalized.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
  }
}

const isOrderList = (value: unknown): value is Order[] => {
  if (!Array.isArray(value)) return false

  return value.every((item) => {
    if (!item || typeof item !== "object") return false
    const order = item as Partial<Order>
    return (
      typeof order.id === "string" &&
      typeof order.status === "string" &&
      typeof order.totalPrice === "number" &&
      typeof order.createdAt === "string" &&
      typeof order.address === "string" &&
      Array.isArray(order.orderItems)
    )
  })
}

async function MyOrdersPage() {
  const { data, error } = await orderService.getMyAllOrder()

  if (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong while loading your orders."

    return (
      <section className="w-full p-4 sm:p-6 lg:p-8">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
          <p className="text-sm font-semibold text-rose-700">Could not load orders</p>
          <p className="mt-1 text-sm text-rose-600">{message}</p>
        </div>
      </section>
    )
  }

  const payload = data as OrdersResponse | null
  const orders = isOrderList(payload?.data)
    ? [...payload.data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : []

  const totalOrders = orders.length
  const pendingOrders = orders.filter((order) => order.status.toUpperCase() === "PENDING").length
  const deliveredOrders = orders.filter((order) => order.status.toUpperCase() === "DELIVERED").length
  const cancelledOrders = orders.filter((order) => order.status.toUpperCase() === "CANCELLED").length
  const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0)

  return (
    <section className="w-full p-4 sm:p-6 lg:p-8">
      <div className="mb-6 rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">My Orders</p>
        <h1 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">Track Your Order Status</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review your recent orders, delivery status, and order details in one place.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-border/70 bg-linear-to-br from-sky-50 to-sky-100/60 p-5 shadow-xs">
          <p className="text-sm font-semibold text-foreground">Total Orders</p>
          <p className="mt-2 text-3xl font-extrabold text-foreground">{totalOrders}</p>
        </article>
        <article className="rounded-2xl border border-border/70 bg-linear-to-br from-amber-50 to-amber-100/60 p-5 shadow-xs">
          <p className="text-sm font-semibold text-foreground">Pending</p>
          <p className="mt-2 text-3xl font-extrabold text-foreground">{pendingOrders}</p>
        </article>
        <article className="rounded-2xl border border-border/70 bg-linear-to-br from-emerald-50 to-emerald-100/60 p-5 shadow-xs">
          <p className="text-sm font-semibold text-foreground">Delivered</p>
          <p className="mt-2 text-3xl font-extrabold text-foreground">{deliveredOrders}</p>
        </article>
        <article className="rounded-2xl border border-border/70 bg-linear-to-br from-orange-50 to-amber-100/60 p-5 shadow-xs">
          <p className="text-sm font-semibold text-foreground">Total Spent</p>
          <p className="mt-2 text-3xl font-extrabold text-foreground">{currency.format(totalSpent)}</p>
        </article>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <p className="text-base font-semibold text-foreground">No orders yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Place your first order and you will see live status updates here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = getStatusMeta(order.status)
            const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0)

            return (
              <article key={order.id} className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{dateTime.format(new Date(order.createdAt))}</p>
                  </div>

                  <div
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${status.chipClass}`}
                  >
                    <status.icon className="size-3.5" />
                    <span>{status.label}</span>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-border/60 bg-muted/35 p-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Total</p>
                    <p className="mt-1 text-lg font-bold text-foreground">{currency.format(order.totalPrice)}</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/35 p-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Items</p>
                    <p className="mt-1 text-lg font-bold text-foreground">{totalItems}</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/35 p-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Address</p>
                    <p className="mt-1 line-clamp-2 text-sm font-medium text-foreground">{order.address}</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  {order.orderItems.map((item) => {
                    const mealName =
                      typeof item.meal?.foodName === "string" && item.meal.foodName.trim().length > 0
                        ? item.meal.foodName
                        : `Meal ${item.mealId.slice(0, 8)}`

                    const mealImage =
                      typeof item.meal?.imageUrl === "string" && item.meal.imageUrl.trim().length > 0
                        ? item.meal.imageUrl
                        : null

                    return (
                      <div
                        key={item.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 p-3"
                      >
                        <div className="flex min-w-55 items-center gap-3">
                          {mealImage ? (
                            <Image
                              src={mealImage}
                              alt={mealName}
                              width={52}
                              height={52}
                              className="size-13 rounded-lg border border-border/60 object-cover"
                            />
                          ) : (
                            <div className="flex size-13 items-center justify-center rounded-lg border border-border/60 bg-muted text-xs font-bold text-muted-foreground">
                              {mealName.slice(0, 1).toUpperCase()}
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">{mealName}</p>
                            <p className="text-xs text-muted-foreground">ID: {item.mealId.slice(0, 8)}</p>
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          {item.quantity} x {currency.format(item.priceAtOrderTime)}
                        </div>

                        <div className="text-sm font-semibold text-foreground">
                          {currency.format(item.priceAtOrderTime * item.quantity)}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <div className="inline-flex items-center gap-1.5">
                    <MapPin className="size-3.5" />
                    <span>{order.address}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5">
                    <ReceiptText className="size-3.5" />
                    <span>ID: {order.id}</span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {cancelledOrders > 0 && (
        <p className="mt-4 text-xs text-muted-foreground">
          You have {cancelledOrders} cancelled order{cancelledOrders > 1 ? "s" : ""} in your history.
        </p>
      )}
    </section>
  )
}

export default MyOrdersPage
