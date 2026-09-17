import { Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function ApplicationsPage() {
  return (
    <main className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Applications</h1>
          <p className="text-muted-foreground">Track applications, interviews, and outcomes</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Add Application
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Position</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Applied</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {[
              { job: "AI Research Engineer", company: "DeepMind Labs", status: "Interview", date: "2 days ago" },
              { job: "Senior Product Manager", company: "TechCorp", status: "Applied", date: "1 week ago" },
              { job: "Engineering Lead", company: "Cloud Systems", status: "Offer", date: "Yesterday" },
            ].map((app, i) => (
              <tr key={i} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{app.job}</td>
                <td className="px-4 py-3 text-muted-foreground">{app.company}</td>
                <td className="px-4 py-3"><Badge variant={app.status === "Offer" ? "default" : "outline"}>{app.status}</Badge></td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{app.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}