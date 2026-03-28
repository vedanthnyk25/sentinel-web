import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formattedPrice, formattedDate } from "@/lib/utils";

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  description: {
    String: string;
    Valid: boolean;
  };
  price: string; 
  start_time: string;
}

async function getEvents(): Promise<Event[]> {
  const res = await fetch('http://localhost:8080/events', { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch events');
  }

  return res.json();
}

export default async function Home() {
  const events = await getEvents();

  return (
    <div className="container mx-auto py-10"> 
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Upcoming Events</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <Card key={event.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-2xl">{event.name}</CardTitle>
              {/* Safely extract the Go sql.NullString description */}
              <CardDescription>
                {event.description.Valid ? event.description.String : "No description available."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-2">
              <p><strong>Date:</strong> {formattedDate(event.date)}</p>
              <p><strong>Location:</strong> {event.location}</p>
            </CardContent>

            <CardFooter className="flex justify-between items-center">
              <p className="text-xl font-bold">{formattedPrice(event.price)}</p>
              
              <Link href={`/events/${event.id}`}>
                <Button>Get Tickets</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

