import React from "react"
import { CheckCircle2, Clock3, ShoppingBag, XCircle } from "lucide-react"

const userStats = [
  {
    title: "Total Order",
    value: "0",
    icon: ShoppingBag,
    cardClass: "from-sky-50 to-sky-100/60 dark:from-sky-900/20 dark:to-sky-800/10",
    iconClass: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
  },
  {
    title: "Pending",
    value: "0",
    icon: Clock3,
    cardClass: "from-amber-50 to-amber-100/60 dark:from-amber-900/20 dark:to-amber-800/10",
    iconClass: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  },
  {
    title: "Cancelled",
    value: "0",
    icon: XCircle,
    cardClass: "from-rose-50 to-rose-100/60 dark:from-rose-900/20 dark:to-rose-800/10",
    iconClass: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
  },
  {
    title: "Delivered",
    value: "0",
    icon: CheckCircle2,
    cardClass: "from-emerald-50 to-emerald-100/60 dark:from-emerald-900/20 dark:to-emerald-800/10",
    iconClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  },
]

function UserDashboard() {
  return (
    <section className="w-full p-4 sm:p-6 lg:p-8">
      <div className="mb-6 rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">User Dashboard</p>
        <h1 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track your current order status and cart activity.</p>
      </div>

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
    </section>
  )
}

export default UserDashboard
