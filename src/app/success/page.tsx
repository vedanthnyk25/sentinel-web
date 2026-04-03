import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 text-center ring-1 ring-slate-200">
        <CardHeader className="pt-10">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="h-20 w-20 text-green-500" />
          </div>
          <CardTitle className="text-3xl font-black">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 text-lg">
            Your ticket has been officially secured. We have sent a confirmation receipt to your email.
          </p>
        </CardContent>
        <CardFooter className="pb-10 pt-4">
          <Button asChild size="lg" className="w-full text-lg h-14 bg-slate-900 hover:bg-slate-800 text-white">
            <Link href="/">
              Return to Events
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
