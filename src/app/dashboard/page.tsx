import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formattedDate, formattedPrice } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/constants";

interface Reservation {
  reservation_id: string;
  reservation_status: "pending" | "confirmed" | "expired" | "cancelled";
  expires_at: string;
  event_name: string;
  event_date: string;
  event_location: string;
  event_price: string;
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;

  if (!token) {
    redirect("/login");
  }

  const res = await fetch(`${API_BASE_URL}/my-reservations`, {
    cache: "no-store", // Always fetch fresh data for the dashboard
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch reservations");
  }

  const reservations: Reservation[] = await res.json();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-extrabold mb-8">My Tickets</h1>
      {/* Your turn!
        Map over the 'reservations' array here and render your Cards.
      */
        reservations?.map((reservation) => (
          <Card key={reservation.reservation_id}>
            <CardHeader>
              <CardTitle>{reservation.event_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Date: {formattedDate(reservation.event_date)}</p>
              <p>Location: {reservation.event_location}</p>
              <p>Price: {formattedPrice(reservation.event_price)}</p>
              <p>Status: {reservation.reservation_status}</p>
              <p>Expires: {formattedDate(reservation.expires_at)}</p>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
