import React from 'react'
import { CheckCircle2, Clock3, ShoppingBag, XCircle } from "lucide-react"

type UserStatsProps = {
  totalOrders: number
  pendingOrders: number
  cancelledOrders: number
  deliveredOrders: number
}

function UserStats({
  totalOrders,
  pendingOrders,
  cancelledOrders,
  deliveredOrders,
}: UserStatsProps) {
  const userStats = [
    {
      title: "Total Order",
      value: String(totalOrders),
      icon: ShoppingBag,
      cardClass: "from-sky-50 to-sky-100/60 dark:from-sky-900/20 dark:to-sky-800/10",
      iconClass: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
    },
    {
      title: "Pending",
      value: String(pendingOrders),
      icon: Clock3,
      cardClass: "from-amber-50 to-amber-100/60 dark:from-amber-900/20 dark:to-amber-800/10",
      iconClass: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    },
    {
      title: "Cancelled",
      value: String(cancelledOrders),
      icon: XCircle,
      cardClass: "from-rose-50 to-rose-100/60 dark:from-rose-900/20 dark:to-rose-800/10",
      iconClass: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
    },
    {
      title: "Delivered",
      value: String(deliveredOrders),
      icon: CheckCircle2,
      cardClass: "from-emerald-50 to-emerald-100/60 dark:from-emerald-900/20 dark:to-emerald-800/10",
      iconClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    },
  ]

  return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {userStats.map((stat) => (
          <article
            key={stat.title}
            className={`rounded-2xl border border-border/70 bg-linear-to-br ${stat.cardClass} p-5 shadow-xs`}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">{stat.title}</p>
              <span className={`inline-flex size-10 items-center justify-center rounded-full ${stat.iconClass}`}>
                <stat.icon className="size-5" />
              </span>
            </div>
            <p className="text-3xl font-extrabold text-foreground">{stat.value}</p>
          </article>
        ))}
      </div>
  )
}

export default UserStats
