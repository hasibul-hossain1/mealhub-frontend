"use server"

import { revalidatePath } from "next/cache"
import {
  sellerService,
  type AddMealPayload,
  type UpdateMealPayload,
} from "@/services/seller.service"
import { mealService } from "@/services/meal.service";
import { OrderStatus } from "@/constant/orderStatus";

export const createSeller = async (seller: { name: string; email: string; image?: string; password: string }) => {
  return await sellerService.createSeller(seller)
}

export const addMeal = async (payload: AddMealPayload) => {
  try {
    const data = await sellerService.addMeals(payload)
    revalidatePath("/seller-dashboard/add-meal")
    revalidatePath("/seller-dashboard/my-meals")
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export const getCategories = async () => {
  return await mealService.getMealCategories()
}

export const deleteMeal = async (id:string) => {
  revalidatePath("/seller-dashboard/my-meals")
  return await sellerService.deleteMeals(id)
}

export const updateMeal = async (id: string, payload: UpdateMealPayload) => {
  try {
    const data = await sellerService.updateMeals(id, payload)
    revalidatePath("/seller-dashboard/edit-meal")
    revalidatePath("/seller-dashboard/my-meals")
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export const updateOrderStatus = async ({orderId,status}:{orderId:string,status:OrderStatus}) => {
  const response = await sellerService.updateOrderStatus({orderId,status})
  revalidatePath("/seller-dashboard/orders")
  revalidatePath("/seller-dashboard")
  return response
}
