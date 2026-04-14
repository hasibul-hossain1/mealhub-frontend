import { env } from "@/env";
import { cookies } from "next/headers";
import { CreateOrderPayload } from "@/types";

export const orderService = {
  createOrder: async (payload: CreateOrderPayload) => {
    const cookieStore = await cookies();
    const res = await fetch(`${env.BACKEND_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieStore.toString(),
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
          : "Order creation failed";

      throw new Error(message);
    }

    return data;
  },
  getMyAllOrder: async () => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${env.BACKEND_URL}/orders`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const message =
          data &&
          typeof data === "object" &&
          "message" in data &&
          typeof data.message === "string"
            ? data.message
            : "Failed to retrieve orders.";

        throw new Error(message);
      }
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
  isOrdered: async ({ mealId }: { mealId: string }) => {
    try {
      const normalizedMealId = mealId.trim();
      if (!normalizedMealId) {
        throw new Error("Meal id is required.");
      }

      const cookieStore = await cookies();
      const res = await fetch(`${env.BACKEND_URL}/orders/me/${normalizedMealId}`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const message =
          data &&
          typeof data === "object" &&
          "message" in data &&
          typeof data.message === "string"
            ? data.message
            : "Failed to verify ordered status.";

        throw new Error(message);
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
  getAllOrder: async () => {
    const cookieStore = await cookies();
    try {
      const res = await fetch(`${env.BACKEND_URL}/admin/all-meal`, {
        headers:{
          Cookie: cookieStore.toString(),
          "Content-Type":"application/json"
        }
      })
      if (!res.ok) {
        throw new Error("Failed to get all orders")
      }
      const data = await res.json()
      return {data,error:null}
    } catch (error) {
      return {data:null,error}
    }
  }
};
