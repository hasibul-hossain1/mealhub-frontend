import { sellerService } from '@/services/seller.service'
import MyMealsTable from '@/components/dashboard/seller/my-meals-table'
import React from 'react'

type Meal = {
    id: string
    sellerId: string
    categoryId: string
    category?: {
        name?: string
    }
    foodName: string
    description: string | null
    price: number
    imageUrl: string
    isAvailable: boolean
    createdAt: string
    updatedAt: string
}

type MyMealsResponse = {
    success: boolean
    data: Meal[]
    message: string
}






async function MyMeals() {
    const [{ data, error }] = await Promise.all([
        sellerService.myMeals(),
    ])

    if (error) {
        return (
            <div className='rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
                Failed to load meals. Please try again.
            </div>
        )
    }

    const meals = (data as MyMealsResponse | null)?.data ?? []


    return (
        <div className='space-y-4 lg:px-6'>
            <div className='rounded-2xl border border-border/70 bg-linear-to-r from-amber-50 via-orange-50 to-rose-50 p-6 shadow-xs dark:from-amber-950/45 dark:via-orange-950/35 dark:to-rose-950/40'>
                <p className='text-xs font-semibold tracking-[0.18em] text-orange-600 uppercase dark:text-orange-300'>
                    Seller Dashboard
                </p>
                <div className='mt-2 flex flex-wrap items-center justify-between gap-3'>
                    <div>
                        <h1 className='text-2xl font-extrabold text-zinc-900 sm:text-3xl dark:text-orange-50'>
                            Menu Control Center
                        </h1>
                        <p className='mt-1 text-sm text-zinc-700 dark:text-zinc-300'>
                            Manage, review, and track all of your listed meals in one place.
                        </p>
                    </div>
                    <div className='rounded-full border border-orange-200 bg-white/80 px-4 py-1.5 text-sm font-semibold text-orange-700 backdrop-blur dark:border-orange-500/40 dark:bg-orange-950/40 dark:text-orange-100'>
                        Total meals: {meals.length}
                    </div>
                </div>
            </div>



            {meals.length === 0 ? (
                <div className='rounded-md border p-6 text-sm text-muted-foreground'>
                    No meals found.
                </div>
            ) : (
                <div className='lg:px-6'>
                    <MyMealsTable meals={meals} />
                </div>
            )}
        </div>
    )
}

export default MyMeals
