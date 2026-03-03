"use server"

import { orderService } from "@/services/order.service";

type createOrderPayload={
    address:string;
    items:{mealId:string,quantity:number}[];
}

export const createOrder = async (payload:createOrderPayload) => {
    return await orderService.createOrder(payload)
}