"use client"
import { useState, useEffect } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfilePage() {
  const [fullName, setFullName] = useState("")
  const [headline, setHeadline] = useState("")
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/career/profile").then(r => r.json()).then(data => {
      if (data) {
        setFullName(data.fullName || "")
        setHeadline(data.headline || "")
        setLocation(data.location || "")
      }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch("/api/career/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, headline, location }),
    })
    if (res.ok) {
      toast.success("Profile saved")
    } else {
      toast.error("Failed to save profile")
    }
    setLoading(false)
  }

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Career Profile</h1>
      <Card>
        <CardHeader><CardTitle>Personal Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input id="headline" value={headline} onChange={e => setHeadline(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Profile"}</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}