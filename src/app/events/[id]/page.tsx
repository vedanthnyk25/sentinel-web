import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

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
  const res = await fetch(`http://localhost:8080/events/${id}`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch event details');
  }

  return res.json();
}

export default async function EventPage({ params }: PageProps) {
  const { id } = await params;
  const event = await getEventDetails(id);
  
  return (
    // Wrapper that fills the screen with padding
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      
      {/* The Card now takes full width and at least 85% of screen height */}
      <Card className="w-full min-h-[85vh] flex flex-col shadow-lg border-slate-200">
        
        {/* Header */}
        <CardHeader className="border-b bg-slate-900 text-white rounded-t-xl py-8">
          <CardTitle className="text-4xl md:text-5xl font-black tracking-tight">{event.name}</CardTitle>
        </CardHeader>

        {/* Content: 'flex-grow' is the magic class that stretches this section to push the footer down */}
        <CardContent className="flex-grow pt-8 text-lg md:text-xl">
          <p className="whitespace-pre-wrap leading-relaxed mb-10 text-slate-700">
            {event.description.Valid ? event.description.String : "No description available."}
          </p>
          
          <div className="space-y-3 p-6 bg-slate-100 rounded-lg inline-block">
            <p><strong>Date:</strong> {formattedDate(event.date)}</p>
            <p><strong>Location:</strong> {event.location}</p>
          </div>
        </CardContent>

        {/* Footer: Pinned to the bottom by the flex-grow content above it */}
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center border-t bg-slate-50 p-6 md:p-8 rounded-b-xl gap-4">
          <p className="text-4xl font-black text-slate-900">{formattedPrice(event.price)}</p>
          
          <Button asChild size="lg" className="w-full sm:w-auto text-lg h-14 px-10 bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer transition-all">
            <Link href={`/events/${event.id}/reserve`}>
              Reserve Ticket
            </Link>
          </Button>
        </CardFooter>

      </Card>
    </div>
  )
}

// --- Formatting Helpers ---

const formattedPrice = (price: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', 
  }).format(Number(price) / 100);
};

const formattedDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
};
