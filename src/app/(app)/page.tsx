import Link from "next/link"

export default function DashboardPage() {
  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Career OS</h1>
      <p className="mb-6 text-muted-foreground">Phase 0: Database, Auth, AI architecture complete.</p>
      <div className="flex gap-4">
        <Link href="/providers" className="px-4 py-2 rounded-md bg-primary text-primary-foreground">Providers</Link>
      </div>
    </main>
  )
}
