import Link from "next/link";
import { cookies } from "next/headers";
import { UserCircle } from "lucide-react";
import { logoutUser } from "@/app/actions/auth"; // We need to create this action!

export default async function Header() {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;

  return (
    <header className="bg-slate-900 text-white p-4 shadow-md">
      {/* flex and justify-between pushes the logo to the left, links to the right */}
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo / Home Link */}
        <Link href="/" className="text-2xl font-black tracking-tight hover:text-blue-400 transition-colors">
          Sentinel
        </Link>

        {/* Navigation Group */}
        <div className="flex items-center gap-6">
          {token ? (
            // Logged In State
            <>
              <Link href="/dashboard" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                <UserCircle className="h-6 w-6" />
                <span className="font-medium text-lg">Dashboard</span>
              </Link>
              
              {/* Logout triggers a server action instead of changing pages */}
              <form action={logoutUser}>
                <button type="submit" className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer">
                  Logout
                </button>
              </form>
            </>
          ) : (
            // Logged Out State
            <Link href="/login" className="text-sm font-medium bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-md transition-colors shadow-sm">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
