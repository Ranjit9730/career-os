import Link from "next/link"
import { Briefcase, Plus, Building2, MapPin, DollarSign } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function JobsPage() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                <Briefcase className="h-5 w-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-semibold">Senior Product Manager</h3>
                <p className="text-sm text-muted-foreground">TechCorp</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2">
                  <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> Remote</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> US</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Badge variant="outline">NEW</Badge>
                  <Badge variant="outline">Engineering</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-green-50 text-green-600">
                <Briefcase className="h-5 w-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-semibold">AI Research Engineer</h3>
                <p className="text-sm text-muted-foreground">DeepMind Labs</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2">
                  <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> Hybrid</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> London</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Badge variant="outline">APPLIED</Badge>
                  <Badge variant="outline">AI / ML</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
                <Briefcase className="h-5 w-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-semibold">Engineering Lead</h3>
                <p className="text-sm text-muted-foreground">Cloud Systems Inc</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2">
                  <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> $160K - $200K</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Badge variant="outline">INTERVIEW</Badge>
                  <Badge variant="outline">Leadership</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}