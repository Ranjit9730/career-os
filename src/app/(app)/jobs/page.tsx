"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Briefcase, Plus, Building2, MapPin, DollarSign } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/jobs").then(r => r.json()).then(data => {
      setJobs(Array.isArray(data) ? data : [])
      setLoading(false)
    })
  }, [])

  return (
    <main className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Board</h1>
          <p className="text-muted-foreground">Track positions, companies, and applications</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Add Job
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No jobs tracked yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job: any, i: number) => (
            <Card key={job.id || i}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <h3 className="font-semibold">{job.title || "Untitled Position"}</h3>
                    <p className="text-sm text-muted-foreground">{job.companyName || "Unknown Company"}</p>
                    <div className="flex gap-2 pt-2">
                      <Badge variant="outline">{job.status || "NEW"}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}