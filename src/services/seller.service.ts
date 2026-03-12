import { OrderStatus } from "@/constant/orderStatus";
import { env } from "@/env";
import { cookies } from "next/headers";

export type AddMealPayload = {
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
};

export type UpdateMealPayload = AddMealPayload;

export const sellerService = {
  createSeller: async (seller: {
    name: string;
    email: string;
    image?: string;
    password: string;
  }) => {
    try {
      const response = await fetch(`${env.BACKEND_URL}/seller/create-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(seller),
      });

      if (!response.ok) {
        throw new Error("Failed to create seller.");
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
  myMeals: async () => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${env.BACKEND_URL}/seller/meals`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
      });
      const data = await res.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
  addMeals: async (payload: AddMealPayload) => {
    const cookieStore = await cookies();
    const res = await fetch(`${env.BACKEND_URL}/seller/meals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const message =
        data &&
        typeof data === "object" &&
        "message" in data &&
        typeof data.message === "string"
          ? data.message
          : "Failed to add meal.";

      throw new Error(message);
    }

    return data;
  },
  updateMeals: async (id: string, payload: UpdateMealPayload) => {
    const cookieStore = await cookies();
    const res = await fetch(`${env.BACKEND_URL}/seller/meals/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const message =
        data &&
        typeof data === "object" &&
        "message" in data &&
        typeof data.message === "string"
          ? data.message
          : "Failed to update meal.";

      throw new Error(message);
    }

    return data;
  },
  deleteMeals: async (id: string) => {
    const cookieStore = await cookies();
    try {
      const res = await fetch(`${env.BACKEND_URL}/seller/meals/${id}`, {
        method: "DELETE",
        headers: {
          Cookie: cookieStore.toString(),
        },
      });
      const data = await res.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
  getOrders: async () => {
    const cookieStore = await cookies();
    try {
      const res = await fetch(`${env.BACKEND_URL}/seller/orders`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
      });
      const data = await res.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
  updateOrderStatus:async ({orderId,status}:{orderId:string,status:OrderStatus}) => {
    try {
      const cookieStore = await cookies()
       const res = await fetch(`${env.BACKEND_URL}/seller/orders/${orderId}`,{
      method:"PATCH",
      headers:{
        "Content-Type":"application/json",
        Cookie:cookieStore.toString()
      },
      body:JSON.stringify({status})
    })
    if (!res.ok) {
      throw new Error("Order update failed")
    }
    const data = await res.json()
    return {error:null,data}
      
    } catch (error) {
      return {data:null,error}
    }
   
  }
};
