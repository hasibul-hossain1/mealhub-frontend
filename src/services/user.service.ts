import { env } from "@/env";
import { cookies } from "next/headers";

type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: boolean;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
  role?: string;
  isActive?: boolean;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isSessionUser = (value: unknown): value is SessionUser => {
  if (!isObject(value)) return false;
  return typeof value.id === "string" && typeof value.email === "string";
};

const getUserFromPayload = (payload: unknown): SessionUser | null => {
  if (!isObject(payload)) return null;

  const nestedData = payload.data;
  if (isObject(nestedData)) {
    if (isSessionUser(nestedData.user)) return nestedData.user;
    if (isSessionUser(nestedData)) return nestedData;
  }

  if (isSessionUser(payload.user)) return payload.user;
  if (isSessionUser(payload)) return payload;

  return null;
};

const getSessionFromPayload = (payload: unknown): unknown | null => {
  if (!isObject(payload)) return null;

  const nestedData = payload.data;
  if (isObject(nestedData) && nestedData.session !== undefined) {
    return nestedData.session;
  }

  if (payload.session !== undefined) {
    return payload.session;
  }

  return null;
};

const SESSION_COOKIE_NAMES = [
  "__Secure-better-auth.session_token",
  "better-auth.session_token",
];

export const userService = {
  getSession: async () => {
    try {
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.toString();

      const hasSessionCookie = SESSION_COOKIE_NAMES.some((name) =>
        cookieHeader.includes(name)
      );
      if (!hasSessionCookie) {
        return { user: null, session: null, error: null };
      }

      const res = await fetch(`${env.BACKEND_URL}/auth/get-session`, {
        cache: "no-store",
        headers: {
          Cookie: cookieHeader,
          Origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        },
      });

      const payload = await res.json().catch(() => null);
      const user = getUserFromPayload(payload);
      const session = getSessionFromPayload(payload);

      if (!res.ok) {
        const message =
          isObject(payload) && typeof payload.message === "string"
            ? payload.message
            : "Failed to fetch session data.";
        return { user: null, session: null, error: message };
      }

      return { user, session, error: null };
      
    } catch (error: unknown) {
      return {
        user: null,
        session: null,
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while fetching the session.",
      };
    }
  },
  getAllUser: async () => {
    const cookieStore = await cookies();
    try {
      const res = await fetch(`${env.BACKEND_URL}/user`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
      });
      if (!res.ok) {
        throw new Error("Failed to get users");
      }
      const data = await res.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
  updateUserStatus: async ({ id, status }: { id: string; status: boolean }) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${env.BACKEND_URL}/user/${id}`, {
        method: "PATCH",
        headers: {
          Cookie: cookieStore.toString(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        throw new Error("Failed to update user status");
      }
      const data = await res.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};
