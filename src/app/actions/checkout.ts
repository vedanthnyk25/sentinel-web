"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_BASE_URL } from "@/lib/constants";

export async function processCheckout(formData: FormData) {
  const eventId= formData.get("eventId") as string;

  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;

  if (!token) {
    redirect("/login");
    return;
  }

  const idempotencyKey = crypto.randomUUID();

  const reserveResponse = await fetch(`${API_BASE_URL}/reserve`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,

    },
    body: JSON.stringify({ event_id: eventId}),
  });

  if (!reserveResponse.ok) {
    throw new Error("Failed to reserve ticket");
  }

  const reserveData = await reserveResponse.json();
  const reservationId = reserveData.id;

  let checkoutResponse: Response | undefined;
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
  checkoutResponse = await fetch(`${API_BASE_URL}/checkout`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reservation_id: reservationId }),
  });

  if (checkoutResponse.ok) {
    break;
  }

  await new Promise(resolve => setTimeout(resolve, 500));
  attempts++;
  }

  if (!checkoutResponse || !checkoutResponse.ok) {
    throw new Error("Failed to create checkout session: Reservation sync timeout");
  }

  const checkoutData = await checkoutResponse.json();
  const checkoutUrl = checkoutData.url;

  redirect(checkoutUrl);
}
