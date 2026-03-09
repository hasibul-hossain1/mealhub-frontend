import SellerOrderStats from '@/components/dashboard/seller/seller-order-stats'
import { sellerService } from '@/services/seller.service'
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

async function SellerHome() {
  const [{ data, error }, { data: mealsData, error: mealError }] = await Promise.all([
    sellerService.getOrders(),
    sellerService.myMeals()
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

  return (
    <section className='w-full p-4 sm:p-6 lg:p-8 space-y-6'>
      <div className='rounded-2xl border border-border/70 bg-card p-5 shadow-xs'>
        <p className='text-xs font-semibold tracking-[0.18em] text-primary uppercase'>Seller Dashboard</p>
        <h1 className='mt-2 text-2xl font-extrabold text-foreground sm:text-3xl'>Overview</h1>
        <p className='mt-1 text-sm text-muted-foreground'>Track your incoming and completed order progress.</p>
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
