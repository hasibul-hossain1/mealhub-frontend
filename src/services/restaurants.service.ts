import { env } from "@/env"

export const restaurantsService = {
  getAllRestaurants: async () => {
    const response = await fetch(`${env.BACKEND_URL}/seller`, { cache: "no-store" })
    if (!response.ok) {
      throw new Error("Failed to fetch restaurants.")
    }
    return response.json()
  },
  getSingleRestaurantsWithMeals: async (id:string) => {
    const response = await fetch(`${env.BACKEND_URL}/seller/${id}`, { cache: "no-store" })
    if (!response.ok) {
      throw new Error("Failed to fetch restaurants.")
    }
    return response.json()
  }
}
