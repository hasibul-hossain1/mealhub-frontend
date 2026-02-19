export interface MealCategory {
  id: string
  name: string
  imageUrl: string
  createdAt: string
  updatedAt: string
}

export interface Meal {
  id: string
  sellerId: string
  categoryId: string
  foodName: string
  description: string | null
  price: number
  imageUrl: string
  isAvailable: boolean
  createdAt: string
  updatedAt: string
  category?: MealCategory
  _count?: {
    reviews: number
  }
}

export interface MealsPagination {
  total: number
  page: number
  limit: number
  totalPage: number
}

export interface MealsPayload {
  data: Meal[]
  pagination: MealsPagination
}

export interface MealsResponse {
  success: boolean
  data: MealsPayload
  message: string
}
