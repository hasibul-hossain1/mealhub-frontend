import { env } from "@/env";
import type { Meal, MealDetailsResponse, MealsResponse } from "@/types/meal.type";

type MealParams = {
  page?: string;
  limit?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: "price" | "createdAt" | "foodName";
  sortOrder?: "asc" | "desc";
  category?: string;
  available?: "true" | "false";
};

export const mealService = {
  getMeals: async (params?: MealParams) => {
    try {
      const url = new URL(`${env.BACKEND_URL}/meals`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, String(value));
          }
        });
      }
      const res = await fetch(url.toString(), { cache: "no-store" });
      const data = (await res.json()) as MealsResponse;
      return { data, error: null };
    } catch (error) {
      return { data: null as MealsResponse | null, error };
    }
  },
  getMealById: async (id: string) => {
    try {
      const res = await fetch(`${env.BACKEND_URL}/meals/${id}`, { cache: "no-store" });
      const payload = (await res.json()) as MealDetailsResponse | Meal;
      const data = "data" in payload ? payload : ({ data: payload } as MealDetailsResponse);
      return { data, error: null };
    } catch (error) {
      return { data: null as MealDetailsResponse | null, error };
    }
  },
};
