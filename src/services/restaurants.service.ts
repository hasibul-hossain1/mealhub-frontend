import { env } from "@/env"

export const restaurantsService = {
  getAllRestaurants: async () => {
    const response = await fetch(`${env.BACKEND_URL}/seller`, { cache: "no-store" })
    if (!response.ok) {
      throw new Error("Failed to fetch restaurants.")
    }
    return response.json()
  },
}
