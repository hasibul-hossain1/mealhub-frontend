import { OrderStatus } from "@/constant/orderStatus";
import { env } from "@/env";
import { cookies } from "next/headers";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export type AddMealPayload = {
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
};

export type UpdateMealPayload = AddMealPayload;

export type CompleteSellerProfilePayload = {
  restaurantName: string;
  description?: string;
  address: string;
  phoneNumber: string;
};

export type SellerProfile = {
  id: string;
  userId: string;
  restaurantName: string | null;
  description: string | null;
  address: string | null;
  phoneNumber: string | null;
  isProfileCompleted: boolean;
  isApproved: boolean;
  isOpen: boolean;
  createdAt: string;
  updatedAt: string;
};

type SellerProfileResponse = {
  success: boolean;
  data: SellerProfile;
  message?: string;
};

const isNullableString = (value: unknown) =>
  value === null || typeof value === "string";

const isSellerProfile = (value: unknown): value is SellerProfile => {
  if (!isObject(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.userId === "string" &&
    isNullableString(value.restaurantName) &&
    isNullableString(value.description) &&
    isNullableString(value.address) &&
    isNullableString(value.phoneNumber) &&
    typeof value.isProfileCompleted === "boolean" &&
    typeof value.isApproved === "boolean" &&
    typeof value.isOpen === "boolean" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
};

export const extractSellerProfile = (payload: unknown): SellerProfile | null => {
  if (isSellerProfile(payload)) return payload;

  if (!isObject(payload)) return null;

  if (isSellerProfile(payload.data)) return payload.data;

  const nestedData = payload.data;
  if (isObject(nestedData) && isSellerProfile(nestedData.data)) {
    return nestedData.data;
  }

  return null;
};

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
  getSellerProfile: async () => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${env.BACKEND_URL}/seller/my-seller-profile`, {
        cache: "no-store",
        headers: {
          Cookie: cookieStore.toString(),
        },
      });

      const data = (await res.json().catch(() => null)) as
        | SellerProfileResponse
        | SellerProfile
        | null;

      if (!res.ok) {
        const message =
          isObject(data) &&
          "message" in data &&
          typeof data.message === "string"
            ? data.message
            : "Failed to fetch seller profile.";

        return { data, error: message };
      }

      return { data, error: null };
    } catch (error: unknown) {
      return {
        data: null as SellerProfileResponse | SellerProfile | null,
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while fetching the seller profile.",
      };
    }
  },
  completeProfile: async (payload: CompleteSellerProfilePayload) => {
    const cookieStore = await cookies();
    const res = await fetch(`${env.BACKEND_URL}/seller/complete-profile`, {
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
        isObject(data) &&
        (typeof data.message === "string"
          ? data.message
          : typeof data.error === "string"
            ? data.error
            : null);

      throw new Error(message || "Failed to complete seller profile.");
    }

    return data;
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
