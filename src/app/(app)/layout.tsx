import Link from "next/link"
import { requireUser } from "@/lib/auth/require-user"
import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()
  return (
    <div className="min-h-screen flex-col">
      <header className="border-b px-8 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">Career OS</Link>
        <nav className="flex gap-6 text-sm items-center">
          <Link href="/">Dashboard</Link>
          <Link href="/providers">Providers</Link>
          <Link href="/career-dna">Career DNA</Link>
          <Link href="/career-evidence">Evidence</Link>
          <Link href="/master-resume">Resume</Link>
          <form action="/api/auth/logout" method="POST">
            <Button variant="ghost" size="sm" type="submit">
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </form>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}