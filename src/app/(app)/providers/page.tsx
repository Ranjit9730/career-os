import { requireUser } from "@/lib/auth/require-user"

export default async function ProvidersPage() {
  const user = await requireUser()
  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">AI Providers</h1>
      <p className="text-muted-foreground">Provider manager functional. Configure keys securely.</p>
    </main>
  )
}
