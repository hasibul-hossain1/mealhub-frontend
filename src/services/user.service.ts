import { cookies } from "next/headers";

export const userService = {
  getSession: async () => {
    try {
      const cookieStore = await cookies();
      const res = await fetch("http://localhost:5000/api/v1/auth/get-session", {
        headers: {
          cookie: cookieStore.toString(),
        },
      });
      const payload = await res.json();
      const authData = payload?.data ?? payload;
      const user = authData?.user ?? null;
      const session = authData?.session ?? null;
      return { user, session, error: null };
    } catch (error: any) {
      return {
        user: null,
        session: null,
        error: error.message || "An error occurred while fetching the session.",
      };
    }
  },
};
