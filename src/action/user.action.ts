"use server"

import { userService } from "@/services/user.service"

export const getSession = async () => {
    return await userService.getSession()
}