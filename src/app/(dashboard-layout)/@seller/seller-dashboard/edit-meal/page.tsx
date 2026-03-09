import EditMeal from "@/components/dashboard/seller/edit-meal"
import { sellerService } from "@/services/seller.service"

type Meal = {
  id: string
  categoryId: string
  foodName: string
  description: string | null
  price: number
  imageUrl: string
  category?: {
    name?: string
  }
}

type MyMealsResponse = {
  success: boolean
  data: Meal[]
  message: string
}

type EditMealPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const toSingleValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0]
  }

  return value
}

async function EditMealPage({ searchParams }: EditMealPageProps) {
  const resolvedSearchParams = await searchParams
  const mealId = toSingleValue(resolvedSearchParams.id)

  if (!mealId) {
    return (
      <section className="w-full p-4 sm:p-6 lg:p-8">
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Meal ID is missing. Please open edit from the My Meals table.
        </div>
      </section>
    )
  }

  const { data, error } = await sellerService.myMeals()

  if (error) {
    return (
      <section className="w-full p-4 sm:p-6 lg:p-8">
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to load meal details. Please try again.
        </div>
      </section>
    )
  }

  const meals = (data as MyMealsResponse | null)?.data ?? []
  const selectedMeal = meals.find((meal) => meal.id === mealId)

  if (!selectedMeal) {
    return (
      <section className="w-full p-4 sm:p-6 lg:p-8">
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Could not find this meal. It may have been deleted.
        </div>
      </section>
    )
  }

  return (
    <section className="w-full p-4 sm:p-6 lg:p-8">
      <EditMeal
        meal={{
          id: selectedMeal.id,
          categoryId: selectedMeal.categoryId,
          categoryName: selectedMeal.category?.name,
          foodName: selectedMeal.foodName,
          description: selectedMeal.description,
          price: selectedMeal.price,
          imageUrl: selectedMeal.imageUrl,
        }}
      />
    </section>
  )
}

export default EditMealPage
