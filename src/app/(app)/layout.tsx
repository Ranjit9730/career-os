import Link from "next/link"
import { requireUser } from "@/lib/auth/require-user"
import { LogOut } from "lucide-react"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireUser()
  return (
    <div className="min-h-screen flex-col">
      <header className="border-b px-8 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">Career OS</Link>
        <nav className="flex gap-6 text-sm">
          <Link href="/">Dashboard</Link>
          <Link href="/providers">Providers</Link>
          <Link href="/career-dna">Career DNA</Link>
          <Link href="/career-evidence">Evidence</Link>
          <Link href="/master-resume">Resume</Link>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
