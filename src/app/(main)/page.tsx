import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import Featured from "@/components/home/Featured";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import GetUpdates from "@/components/home/GetUpdates";
import Faq from "@/components/home/Faq";
import { mealService } from "@/services/meal.service";
import type { Meal, MealsResponse } from "@/types/meal.type";

const fallbackImage = "/test/food.png"
const fallbackCategoryImage = "/test/biriani.jpg"

async function HomePage() {
  const [{ data: categoriesResponse }, { data: featuredResponse }] = await Promise.all([
    mealService.getMealCategories(),
    mealService.getMeals({
      limit: "4",
      available: "true",
      sortBy: "createdAt",
      sortOrder: "desc",
    }),
  ])

  const categories = (categoriesResponse ?? [])
    .filter((category) => Boolean(category.name?.trim()))
    .slice(0, 4)
    .map((category, index) => ({
      id: category.id ?? `category-${index + 1}`,
      name: category.name.trim(),
      description: `Top picks from our ${category.name.trim()} collection.`,
      imageUrl: category.imageUrl ?? fallbackCategoryImage,
    }))

  const featuredFoods = extractMealList(featuredResponse)
    .filter((meal) => Boolean(meal.id && meal.foodName))
    .slice(0, 4)
    .map((meal) => ({
      id: meal.id,
      name: meal.foodName,
      subtitle: meal.description?.trim() || "Freshly prepared and ready to order.",
      price: formatPrice(meal.price),
      rating: getRatingLabel(meal),
      imageUrl: meal.imageUrl || fallbackImage,
    }))

  return (
    <div>
      <Hero/>
      <Categories categories={categories} />
      <Featured featuredFoods={featuredFoods} />
      <WhyChooseUs />
      <Faq />
      <GetUpdates />
    </div>
  )
}

export default HomePage

function extractMealList(payload: MealsResponse | null): Meal[] {
  return payload?.data?.data ?? []
}

function formatPrice(price: number) {
  if (!Number.isFinite(price)) {
    return "$0.00"
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price)
}

function getRatingLabel(meal: Meal) {
  const reviews = meal.reviews ?? []
  const validRatings = reviews.map((review) => review.rating).filter((rating) => Number.isFinite(rating))

  if (!validRatings.length) {
    return "New"
  }

  const average = validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length
  return average.toFixed(1)
}
