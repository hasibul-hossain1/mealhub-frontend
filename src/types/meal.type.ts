export interface MealCategory {
  id?: string
  name: string
  imageUrl?: string
  createdAt?: string
  updatedAt?: string
}

export interface MealReview {
  id: string
  userId: string
  mealId: string
  rating: number
  comment: string | null
  createdAt: string
  user?: {
    name?: string | null
    image?: string | null
  } | null
  userName?: string | null
  userImage?: string | null
  name?: string | null
  image?: string | null
}

export interface MealSeller {
  id: string
  userId: string
  restaurantName: string | null
  description: string | null
  address: string | null
  phoneNumber: string | null
  isProfileCompleted: boolean
  isApproved: boolean
  isOpen: boolean
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
  reviews?: MealReview[]
  seller?: MealSeller | null
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

export interface MealDetailsResponse {
  success: boolean
  data: Meal
  message: string
}
