"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/constants";

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const res= await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  const data = await res.json();
  const token = data.token;

  const cookieStore = await cookies();
  cookieStore.set("jwt", token,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24
    });

    redirect("/");
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("jwt");
  redirect("/");
}
