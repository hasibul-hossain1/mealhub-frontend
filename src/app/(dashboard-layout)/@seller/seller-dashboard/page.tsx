import Link from 'next/link'
import SellerOrderStats from '@/components/dashboard/seller/seller-order-stats'
import { extractSellerProfile, sellerService } from '@/services/seller.service'
import React from 'react'

type SellerOrder = {
  id: string
  status: string
  totalPrice: number
  user: {
    name: string
  }
}

type SellerOrdersResponse = {
  success: boolean
  data: SellerOrder[]
  message: string
}

type Meal = {
  id: string
}

type MealsResponse = {
  success: boolean
  data: Meal[]
  message: string
}

const isSellerOrderList = (value: unknown): value is SellerOrder[] => {
  if (!Array.isArray(value)) return false

  return value.every((item) => {
    if (!item || typeof item !== 'object') return false
    const order = item as Partial<SellerOrder>
    return (
      typeof order.id === 'string' &&
      typeof order.status === 'string' &&
      typeof order.totalPrice === 'number' &&
      order.user &&
      typeof order.user === 'object' &&
      typeof (order.user as { name?: string }).name === 'string'
    )
  })
}

const isMealList = (value: unknown): value is Meal[] => {
  if (!Array.isArray(value)) return false
  return value.every((item) => item && typeof item === 'object' && 'id' in item)
}

const getText = (value: unknown, fallback = 'Not provided') =>
  typeof value === 'string' && value.trim().length > 0 ? value : fallback

async function SellerHome() {
  const [
    { data, error },
    { data: mealsData, error: mealError },
    { data: sellerProfileData, error: sellerProfileError },
  ] = await Promise.all([
    sellerService.getOrders(),
    sellerService.myMeals(),
    sellerService.getSellerProfile(),
  ])

  if (error || mealError) {
    return (
      <div className='rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
        {error ? 'Failed to load orders. ' : ''}
        {mealError ? 'Failed to load meals.' : ''}
        Please try again later.
      </div>
    )
  }

  const orderPayload = data as SellerOrdersResponse | null
  const orders = isSellerOrderList(orderPayload?.data) ? orderPayload.data : []

  const mealPayload = mealsData as MealsResponse | null
  const meals = isMealList(mealPayload?.data) ? mealPayload.data : []

  const totalReceivedOrders = orders.length
  const pendingOrders = orders.filter((order) => order.status.toUpperCase() === 'PENDING').length
  const cancelledOrders = orders.filter((order) => order.status.toUpperCase() === 'CANCELLED').length
  const deliveredOrders = orders.filter((order) => order.status.toUpperCase() === 'DELIVERED').length
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)
  const totalMeals = meals.length
  const sellerProfile = extractSellerProfile(sellerProfileData)
  const restaurantName = getText(sellerProfile?.restaurantName, 'Restaurant not set')
  const description = getText(sellerProfile?.description, 'No restaurant description yet.')
  const address = getText(sellerProfile?.address)
  const phoneNumber = getText(sellerProfile?.phoneNumber)
  const isProfileCompleted = sellerProfile?.isProfileCompleted === true
  const isApproved = sellerProfile?.isApproved === true
  const isOpen = sellerProfile?.isOpen === true

  return (
    <section className='w-full p-4 sm:p-6 lg:p-8 space-y-6'>
      <div className='rounded-2xl border border-border/70 bg-card p-5 shadow-xs'>
        <p className='text-xs font-semibold tracking-[0.18em] text-primary uppercase'>Seller Dashboard</p>
        <h1 className='mt-2 text-2xl font-extrabold text-foreground sm:text-3xl'>Overview</h1>
        <p className='mt-1 text-sm text-muted-foreground'>Track your incoming and completed order progress.</p>
      </div>

      <div className='rounded-2xl border border-border/70 bg-card p-5 shadow-xs'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
          <div>
            <p className='text-xs font-semibold tracking-[0.16em] text-primary uppercase'>Restaurant Profile</p>
            <h2 className='mt-2 text-xl font-bold text-foreground'>{restaurantName}</h2>
            <p className='mt-2 max-w-3xl text-sm text-muted-foreground'>{description}</p>
          </div>

          <Link
            href='/seller-dashboard/profile'
            className='inline-flex h-10 items-center justify-center rounded-md border border-border px-4 text-sm font-medium text-foreground transition hover:bg-muted'
          >
            Manage Profile
          </Link>
        </div>

        <div className='mt-4 flex flex-wrap gap-2'>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isProfileCompleted
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
            }`}
          >
            {isProfileCompleted ? 'Profile Complete' : 'Profile Incomplete'}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isApproved
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
            }`}
          >
            {isApproved ? 'Approved Seller' : 'Approval Pending'}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isOpen
                ? 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300'
                : 'bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300'
            }`}
          >
            {isOpen ? 'Open Now' : 'Closed'}
          </span>
        </div>

        {sellerProfileError ? (
          <div className='mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800'>
            Could not refresh seller profile details. Showing available data only.
          </div>
        ) : null}

        <div className='mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          <article className='rounded-xl border border-border/70 bg-muted/20 p-4'>
            <p className='text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground'>Address</p>
            <p className='mt-2 text-sm font-medium text-foreground'>{address}</p>
          </article>
          <article className='rounded-xl border border-border/70 bg-muted/20 p-4'>
            <p className='text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground'>Phone</p>
            <p className='mt-2 text-sm font-medium text-foreground'>{phoneNumber}</p>
          </article>
          <article className='rounded-xl border border-border/70 bg-muted/20 p-4'>
            <p className='text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground'>Meals Published</p>
            <p className='mt-2 text-sm font-medium text-foreground'>{totalMeals}</p>
          </article>
        </div>
      </div>

      <SellerOrderStats
        totalReceivedOrders={totalReceivedOrders}
        pendingOrders={pendingOrders}
        cancelledOrders={cancelledOrders}
        deliveredOrders={deliveredOrders}
        totalRevenue={totalRevenue}
        totalMeals={totalMeals}
      />
    </section>
  )
}

export default SellerHome
