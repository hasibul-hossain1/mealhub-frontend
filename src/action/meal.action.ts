"use server"
import { mealService } from "@/services/meal.service"


export const getCartMeal =async (cart:{mealId:string,quantity:number}[])=>{
    return await mealService.getCartMeals(cart)
}

export const addReview = async ({id,payload}:{id:string,payload:{rating:number,comment:string}})=>{
    return await mealService.addReview({id,payload})
}