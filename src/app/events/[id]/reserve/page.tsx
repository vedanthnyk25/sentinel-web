import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { formattedPrice} from "@/lib/utils";
import { processCheckout } from "@/app/actions/checkout";
import { API_BASE_URL } from "@/lib/constants";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  description: { String: string; Valid: boolean };
  price: string;
  start_time: string;
}

async function getEventDetails(id: string): Promise<Event> {
  const res = await fetch(`${API_BASE_URL}/events/${id}`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch event details');
  }

  return res.json();
}

export default async function ReservePage({ params }: PageProps) {
  const { id } = await params;
  const event = await getEventDetails(id);

  return (
    <div className="w-full h-full bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl border-0 ring-1 ring-slate-200">
        <CardHeader className="bg-slate-900 text-white rounded-t-xl pb-8 pt-8 text-center">
          <CardTitle className="text-3xl font-black">Order Summary</CardTitle>
        </CardHeader>

        <CardContent className="pt-8 space-y-6 text-lg">
          <div className="flex justify-between border-b pb-4">
            <span className="text-slate-500">Event</span>
            <span className="font-bold text-slate-900">{event.name}</span>
          </div>
          <div className="flex justify-between border-b pb-4">
            <span className="text-slate-500">Location</span>
            <span className="font-medium text-slate-900">{event.location}</span>
          </div>
          <div className="flex justify-between text-2xl pt-2">
            <span className="font-bold text-slate-900">Total</span>
            <span className="font-black text-blue-600">{formattedPrice(event.price)}</span>
          </div>
        </CardContent>

        <CardFooter className="bg-slate-50 border-t p-6 rounded-b-xl">
          {/* We will attach the Server Action to this form next! */}
          <form className="w-full" action={processCheckout}>
            <input type="hidden" name="eventId" value={event.id} />
            <Button type="submit" size="lg" className="w-full text-lg h-14 bg-blue-600 hover:bg-blue-700 text-white">
              Proceed to Payment
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
