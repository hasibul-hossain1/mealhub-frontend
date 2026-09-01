// lib/auth.ts — API calls

import { env } from "@/env";

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // cookie এর জন্য জরুরি
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw await res.json();
  return res.json(); // { accessToken, user }
};

export const refreshAccessToken = async () => {
  const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Session expired");
  return res.json(); // { accessToken }
};

export const logoutUser = async () => {
  await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
};