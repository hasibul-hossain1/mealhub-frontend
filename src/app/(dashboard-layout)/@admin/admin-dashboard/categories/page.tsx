import Categories from '@/components/dashboard/admin/Categories'
import { getCategories } from '@/action/seller.action'
import type { MealCategory } from '@/types/meal.type'

type CategoryResponse = MealCategory[] | null

const isCategoryList = (value: unknown): value is MealCategory[] => {
  if (!Array.isArray(value)) return false

  return value.every((item) => {
    if (!item || typeof item !== 'object') return false
    const category = item as Partial<MealCategory>
    return typeof category.name === 'string'
  })
}

async function CategoriesPage() {
  const { data, error } = await getCategories()

  if (error) {
    return (
      <div className='rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
        Failed to load categories. Please try again.
      </div>
    )
  }

  const payload = data as CategoryResponse
  const categories = isCategoryList(payload) ? payload : []

  return (
     <section className='space-y-4 lg:px-6'>
      <div className='rounded-2xl border border-border/70 bg-linear-to-r from-emerald-50 via-sky-50 to-indigo-50 p-6 shadow-xs dark:from-emerald-950/40 dark:via-sky-950/35 dark:to-indigo-950/35'>
        <p className='text-xs font-semibold tracking-[0.18em] text-emerald-700 uppercase dark:text-emerald-200'>
          Admin Dashboard
        </p>
        <div className='mt-2 flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h1 className='text-2xl font-extrabold text-zinc-900 sm:text-3xl dark:text-emerald-50'>
              Category Management
            </h1>
            <p className='mt-1 text-sm text-zinc-700 dark:text-zinc-300'>
              Track meal categories, images, and last updated times.
            </p>
          </div>
          <div className='rounded-full border border-emerald-200 bg-white/80 px-4 py-1.5 text-sm font-semibold text-emerald-700 backdrop-blur dark:border-emerald-500/40 dark:bg-emerald-950/40 dark:text-emerald-100'>
            Total categories: {categories.length}
          </div>
        </div>
      </div>
      <Categories categories={categories} />
    </section>
  )
}

export default CategoriesPage
