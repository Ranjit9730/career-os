import Link from "next/link"

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md border rounded-xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Career OS Login</h1>
        <p className="text-sm text-muted-foreground mb-6">Private single-user workspace.</p>
        <Link href="/setup" className="text-sm underline">First-time setup</Link>
      </div>
    </main>
  )
}
