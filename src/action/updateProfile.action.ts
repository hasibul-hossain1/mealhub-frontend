"use server";
import { env } from "@/env";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateProfileAction(formData: FormData) {
  // Form data extract
  const name = formData.get("name")?.toString().trim() || "";
  const image = formData.get("image")?.toString().trim() || "";
  const cookieStore = await cookies();
  const body = {
    name,
    image,
  };

  // Simple validation server side
  if (!name) throw new Error("Name cannot be empty");

  if (!image) throw new Error("image cannot be empty");
  // Call your Express backend
  const res = await fetch(`${env.BACKEND_URL}/user/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: cookieStore.toString(),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to update profile");
  }

  // Next.js revalidation for instant UI update
  revalidatePath("/dashboard/profile"); // <-- this triggers Server Component refresh
  return true;
}
