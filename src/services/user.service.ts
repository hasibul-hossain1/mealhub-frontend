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
      const session = await res.json();
      return { session, error: null };
    } catch (error: any) {
      return {
        session: null,
        error: error.message || "An error occurred while fetching the session.",
      };
    }
  },
};

