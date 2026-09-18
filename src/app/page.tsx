"use client"
import Link from "next/link"
import {
  Briefcase, FileText, Target, Users, Building2, Search, Sparkles, ChevronRight
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <main className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Career OS</h1>
        <p className="text-muted-foreground">Your career intelligence dashboard</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Open Jobs", val: "0", icon: Briefcase },
          { label: "Applications", val: "0", icon: FileText },
          { label: "Target Companies", val: "0", icon: Building2 },
          { label: "Saved Searches", val: "0", icon: Search },
          { label: "Network Contacts", val: "0", icon: Users },
          { label: "AI Providers", val: "0", icon: Sparkles },
        ].map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs text-muted-foreground">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{s.val}</div></CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Career Planning</CardTitle><p className="text-sm text-muted-foreground">Track roles, skills, and transitions</p></CardHeader>
          <CardContent className="space-y-3">
            {[
              { href: "/master-resume", label: "Master Resume", desc: "Manage resume versions" },
              { href: "/career-dna", label: "Career DNA", desc: "Your identity and skills" },
              { href: "/career-evidence", label: "Career Evidence", desc: "Track achievements" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition">
                <div><div className="font-medium">{l.label}</div><div className="text-sm text-muted-foreground">{l.desc}</div></div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Job Search</CardTitle><p className="text-sm text-muted-foreground">Applications, interviews, opportunities</p></CardHeader>
          <CardContent className="space-y-3">
            {[
              { href: "/jobs", label: "Job Board", desc: "Browse open positions" },
              { href: "/applications", label: "Applications", desc: "Track status" },
              { href: "/interviews", label: "Interviews", desc: "Prepare for sessions" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition">
                <div><div className="font-medium">{l.label}</div><div className="text-sm text-muted-foreground">{l.desc}</div></div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI & Intelligence</CardTitle>
            <p className="text-sm text-muted-foreground">AI providers and career insights</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/providers" className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition">
              <div><div className="font-medium">AI Providers</div><div className="text-sm text-muted-foreground">Configure and manage AI models</div></div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Networking</CardTitle>
            <p className="text-sm text-muted-foreground">Build connections and track outreach</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/recruitment" className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition">
              <div><div className="font-medium">Recruiters</div><div className="text-sm text-muted-foreground">Track recruitment agency relationships</div></div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-2">
        <Badge>Phase 1: Complete</Badge>
        <Badge>Phase 2: Active</Badge>
      </div>
    </main>
  );
}
