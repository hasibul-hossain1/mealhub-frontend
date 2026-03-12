"use server"
import { CategoryPayload, mealService } from "@/services/meal.service"
import { revalidatePath } from "next/cache"


export const getCartMeal =async (cart:{mealId:string,quantity:number}[])=>{
    return await mealService.getCartMeals(cart)
}

export const addReview = async ({id,payload}:{id:string,payload:{rating:number,comment:string}})=>{
    const data=await mealService.addReview({id,payload})
    revalidatePath(`/meals/${id}`)
    return data
}

export const deleteCategories = async ({categoryId}:{categoryId:string}) => {
    const data = await mealService.deleteCategories({categoryId})
    revalidatePath("/admin-dashboard/categories")
    return data
}
export const createCategory = async (payload:CategoryPayload) => {
    const data = await mealService.createCategory(payload)
    revalidatePath("/admin-dashboard/categories")
    return data
}