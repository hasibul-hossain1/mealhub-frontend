import React from 'react'
import { CheckCircle2, Clock3, ShoppingBag, XCircle, Banknote, Utensils } from 'lucide-react'

type SellerOrderStatsProps = {
    totalReceivedOrders: number
    pendingOrders: number
    cancelledOrders: number
    deliveredOrders: number
    totalRevenue: number
    totalMeals: number
}

const currency = new Intl.NumberFormat('en-BD', {
  style: 'currency',
  currency: 'BDT',
  maximumFractionDigits: 0,
})

function SellerOrderStats({
    totalReceivedOrders,
    pendingOrders,
    cancelledOrders,
    deliveredOrders,
    totalRevenue,
    totalMeals,
}: SellerOrderStatsProps) {
    const stats = [
        {
            title: 'Total Orders',
            value: String(totalReceivedOrders),
            icon: ShoppingBag,
            cardClass: 'from-sky-50 to-sky-100/60 dark:from-sky-900/20 dark:to-sky-800/10',
            iconClass: 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300',
        },
        {
            title: 'Pending',
            value: String(pendingOrders),
            icon: Clock3,
            cardClass: 'from-amber-50 to-amber-100/60 dark:from-amber-900/20 dark:to-amber-800/10',
            iconClass: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
        },
        {
            title: 'Cancelled',
            value: String(cancelledOrders),
            icon: XCircle,
            cardClass: 'from-rose-50 to-rose-100/60 dark:from-rose-900/20 dark:to-rose-800/10',
            iconClass: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
        },
        {
            title: 'Delivered',
            value: String(deliveredOrders),
            icon: CheckCircle2,
            cardClass: 'from-emerald-50 to-emerald-100/60 dark:from-emerald-900/20 dark:to-emerald-800/10',
            iconClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
        },
        {
            title: 'Total Revenue',
            value: currency.format(totalRevenue),
            icon: Banknote,
            cardClass: 'from-emerald-50 to-emerald-100/60 dark:from-emerald-900/20 dark:to-emerald-800/10',
            iconClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
        },
        {
            title: 'Total Meals',
            value: String(totalMeals),
            icon: Utensils,
            cardClass: 'from-indigo-50 to-indigo-100/60 dark:from-indigo-900/20 dark:to-indigo-800/10',
            iconClass: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300',
        },
    ]

    return (
        <div className='grid grid-cols-2 lg:grid-cols-3 gap-3 w-full'>
            {stats.map((stat) => (
                <article
                    key={stat.title}
                    className={`min-w-0 rounded-xl border border-border/70 bg-linear-to-br ${stat.cardClass} p-3 shadow-xs`}
                >
                    <div className='mb-2 flex items-center justify-between gap-1'>
                        <p className='text-[10px] sm:text-xs font-semibold text-foreground/80 truncate'>{stat.title}</p>
                        <span className={`inline-flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-full ${stat.iconClass}`}>
                            <stat.icon className='size-3.5 sm:size-4' />
                        </span>
                    </div>
                    <p className='text-lg sm:text-xl font-extrabold text-foreground tracking-tight truncate'>{stat.value}</p>
                </article>
            ))}
        </div>
    )
    }

export default SellerOrderStats
