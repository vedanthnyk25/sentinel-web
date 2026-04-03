import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 text-center ring-1 ring-slate-200">
        <CardHeader className="pt-10">
          <div className="flex justify-center mb-6">
            <XCircle className="h-20 w-20 text-red-500" />
          </div>
          <CardTitle className="text-3xl font-black">Checkout Cancelled</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 text-lg">
            Your payment process was cancelled. You have not been charged, and your pending reservation has been released.
          </p>
        </CardContent>
        <CardFooter className="pb-10 pt-4">
          <Button asChild size="lg" className="w-full text-lg h-14 bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/">
              Try Again
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
