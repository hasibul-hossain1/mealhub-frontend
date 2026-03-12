import AdminOverviewStats from '@/components/dashboard/admin/admin-overview-stats'
import React from 'react'

function AdminHome() {
  const totalUsers = 0
  const totalOrders = 0
  const totalBanned = 0
  const totalActive = 0

  return (
    <section className='w-full p-4 sm:p-6 lg:p-8 space-y-6'>
      <div className='rounded-2xl border border-border/70 bg-card p-5 shadow-xs'>
        <p className='text-xs font-semibold tracking-[0.18em] text-primary uppercase'>Admin Dashboard</p>
        <h1 className='mt-2 text-2xl font-extrabold text-foreground sm:text-3xl'>Overview</h1>
        <p className='mt-1 text-sm text-muted-foreground'>Monitor user activity, orders, and access health.</p>
      </div>

      <AdminOverviewStats
        totalUsers={totalUsers}
        totalOrders={totalOrders}
        totalBanned={totalBanned}
        totalActive={totalActive}
      />
    </section>
  )
}

export default AdminHome
