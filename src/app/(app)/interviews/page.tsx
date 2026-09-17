import { Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function InterviewsPage() {
  return (
    <main className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Interview Sessions</h1>
          <p className="text-muted-foreground">Prepare, track, and review interview sessions</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> New Session
        </Button>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold mb-1">DeepMind Labs — AI Research Engineer</h3>
                <p className="text-sm text-muted-foreground">Behavioral + Technical — Round 2</p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">In 2 days</Badge>
                <Badge>Technical</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold mb-1">Cloud Systems — Engineering Lead</h3>
                <p className="text-sm text-muted-foreground">Panel Interview — Round 3</p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">Next week</Badge>
                <Badge>Leadership</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}