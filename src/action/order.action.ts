"use server"

import { orderService } from "@/services/order.service";
import { userService } from "@/services/user.service";
import { CreateOrderPayload } from "@/types";

export const createOrder = async (payload: CreateOrderPayload) => {
    return await orderService.createOrder(payload)
}

export const getCurrentUser = async () => {
    const { user, error } = await userService.getSession()
    if (error || !user) {
        throw new Error(error || "Failed to get current user")
    }
    return user
}