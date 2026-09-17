import Link from "next/link"
import {
  Briefcase,
  FileText,
  Target,
  Users,
  Building2,
  Search,
  Sparkles,
  ChevronRight,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  return (
    <main className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Career OS</h1>
        <p className="text-muted-foreground">Your career intelligence dashboard</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Open Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Target Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Saved Searches</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Network Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">AI Providers</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Career Planning</CardTitle>
            <CardDescription>Track roles, skills, and career transitions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/master-resume" className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition">
              <div>
                <div className="font-medium">Master Resume</div>
                <div className="text-sm text-muted-foreground">Manage your resume versions</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link href="/career-dna" className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition">
              <div>
                <div className="font-medium">Career DNA</div>
                <div className="text-sm text-muted-foreground">Your career identity and skills</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link href="/career-evidence" className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition">
              <div>
                <div className="font-medium">Career Evidence</div>
                <div className="text-sm text-muted-foreground">Track achievements and claims</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Search</CardTitle>
            <CardDescription>Track applications, interviews, and opportunities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/jobs" className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition">
              <div>
                <div className="font-medium">Job Board</div>
                <div className="text-sm text-muted-foreground">Browse and manage job listings</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link href="/applications" className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition">
              <div>
                <div className="font-medium">Applications</div>
                <div className="text-sm text-muted-foreground">Track your applications and status</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link href="/interviews" className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition">
              <div>
                <div className="font-medium">Interviews</div>
                <div className="text-sm text-muted-foreground">Prepare and track interview sessions</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI & Intelligence</CardTitle>
            <CardDescription>AI providers and career insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/providers" className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition">
              <div>
                <div className="font-medium">AI Providers</div>
                <div className="text-sm text-muted-foreground">Configure and manage AI models</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link href="/dashboard" className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition">
              <div>
                <div className="font-medium">AI Insights</div>
                <div className="text-sm text-muted-foreground">Get AI-powered career advice</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Networking</CardTitle>
            <CardDescription>Build connections and track outreach</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/network" className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition">
              <div>
                <div className="font-medium">Network Contacts</div>
                <div className="text-sm text-muted-foreground">Manage your professional network</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link href="/recruitment" className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition">
              <div>
                <div className="font-medium">Recruiters</div>
                <div className="text-sm text-muted-foreground">Track recruitment agency relationships</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <Badge>Phase 2: Auth, Dashboard, Career Insights</Badge>
        <Badge variant="outline">Active</Badge>
      </div>
    </main>
  )
}