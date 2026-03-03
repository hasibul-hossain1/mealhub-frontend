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

export const userService = {
  getSession: async () => {
    try {
      const cookieStore = await cookies();
      const res = await fetch("http://localhost:5000/api/v1/auth/get-session", {
        cache: "no-store",
        headers: {
          cookie: cookieStore.toString(),
        },
      });

      const payload = await res.json();
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
};
