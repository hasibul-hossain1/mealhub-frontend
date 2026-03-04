"use server"
import { mealService } from "@/services/meal.service"
import { revalidatePath } from "next/cache"


export const getCartMeal =async (cart:{mealId:string,quantity:number}[])=>{
    return await mealService.getCartMeals(cart)
}

export const addReview = async ({id,payload}:{id:string,payload:{rating:number,comment:string}})=>{
    const data=await mealService.addReview({id,payload})
    revalidatePath(`/meals/${id}`)
    return data
}