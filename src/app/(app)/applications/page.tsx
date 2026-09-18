"use client"
import { useState, useEffect } from "react"
import { Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function ApplicationsPage() {
  const [apps, setApps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/applications").then(r => r.json()).then(data => {
      setApps(Array.isArray(data) ? data : [])
      setLoading(false)
    })
  }, [])

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

      {loading ? (
        <div className="text-center py-12">Loading applications...</div>
      ) : apps.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No applications tracked yet.</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Position</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {apps.map((app: any, i: number) => (
                <tr key={app.id || i} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">App #{app.id?.slice(0, 8) || i + 1}</td>
                  <td className="px-4 py-3"><Badge variant="outline">{app.status || "NEW"}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{app.interviewStage || "Not set"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}