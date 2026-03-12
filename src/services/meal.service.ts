import { env } from "@/env";
import type {
  Meal,
  MealCategory,
  MealDetailsResponse,
  MealsResponse,
} from "@/types/meal.type";
import { cookies } from "next/headers";

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

type CartMeal = {
  mealId: string;
  quantity: number;
};

export type CategoryPayload = {
  name: string;
  imageUrl: string;
}

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
      const res = await fetch(`${env.BACKEND_URL}/meals/${id}`, {
        cache: "no-store",
      });
      const payload = (await res.json()) as MealDetailsResponse | Meal;
      const data =
        "data" in payload
          ? payload
          : ({ data: payload } as MealDetailsResponse);
      return { data, error: null };
    } catch (error) {
      return { data: null as MealDetailsResponse | null, error };
    }
  },
  getMealCategories: async () => {
    try {
      const res = await fetch(`${env.BACKEND_URL}/meals/categories`, {
        cache: "no-store",
      });
      const payload = (await res.json()) as
        | {
            data?:
              | MealCategory[]
              | { data?: MealCategory[] | { data?: MealCategory[] } };
          }
        | MealCategory[];

      const categories = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.data?.data)
            ? payload.data.data
            : Array.isArray(payload?.data?.data?.data)
              ? payload.data.data.data
              : [];

      return { data: categories, error: null };
    } catch (error) {
      return { data: [] as MealCategory[], error };
    }
  },
  getCartMeals: async (cart: CartMeal[]) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${env.BACKEND_URL}/meals/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify({ items: cart }),
      });

      if (!res.ok) {
        throw new Error("Failed to get cart items");
      }

      const data = await res.json();

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },
  addReview: async ({ id,payload }: { id: string,payload:{rating:number,comment:string} }) => {
    const cookieStore = await cookies()
    try {
      const res = await fetch(`${env.BACKEND_URL}/meals/${id}`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Cookie:cookieStore.toString()
        },
        body:JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to add review.");
      const data = await res.json();
      return { data, error: null };
    } catch (error) {
      return { error, data: null };
    }
  },
  createCategory: async (payload:CategoryPayload) => {
    const cookieStore = await cookies()
    try {
      const res = await fetch(`${env.BACKEND_URL}/admin/create-category`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Cookie:cookieStore.toString()
        },
        body:JSON.stringify(payload)
      })
      if (!res.ok) throw new Error("Failed to create category.");
      const data = await res.json();
      return { data, error: null };
    } catch (error) {
      return {data:null,error}
    }
  },
  deleteCategories: async ({categoryId}:{categoryId:string}) => {
    const cookieStore = await cookies()
    try {
      const res = await fetch(`${env.BACKEND_URL}/admin/delete-category/${categoryId}`,{
        method:"DELETE",
        headers:{
          "Content-Type":"application/json",
          Cookie:cookieStore.toString()
        }
      });
      if (!res.ok) throw new Error("Failed to delete category.");
      const data = await res.json();
      return { data, error: null };
    } catch (error) {
      return { error, data: null };
    }
  },
};
