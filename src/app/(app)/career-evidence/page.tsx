"use client"

import { useState, useEffect } from "react"
import { Plus, RefreshCw, Check, X, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface CareerEvidence {
  id: string
  claim: string
  source: string
  sourceType: string
  date: string
  confidence: number
  verificationStatus: string
  relatedRole: string
  relatedSkill: string
  relatedAchievement: string
  metadata: Record<string, any>
  createdAt: string
}

const SOURCE_TYPES = [
  "github", "linkedin", "article", "blog", "presentation", "product", "service", "job", "certification", "other"
]

const STATUS_OPTIONS = [
  "VERIFIED", "PENDING", "DISPUTED", "UNKNOWN"
]

export default function CareerEvidencePage() {
  const [evidence, setEvidence] = useState<CareerEvidence[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    claim: "",
    source: "",
    sourceType: "other",
    date: "",
    confidence: 1,
    verificationStatus: "PENDING",
    relatedRole: "",
    relatedSkill: "",
    relatedAchievement: "",
    metadata: {},
  })

  const fetchEvidence = async () => {
    try {
      const res = await fetch("/api/career/evidence")
      if (res.ok) {
        const data = await res.json()
        setEvidence(data)
      }
    } catch (error) {
      toast.error("Failed to load career evidence")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvidence()
  }, [])

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddEvidence = async () => {
    if (!formData.claim.trim()) {
      toast.error("Claim is required")
      return
    }

    setSaving(true)
    try {
      const res = await fetch("/api/career/evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        toast.success("Evidence added")
        setShowAddForm(false)
        setFormData({
          claim: "",
          source: "",
          sourceType: "other",
          date: "",
          confidence: 1,
          verificationStatus: "PENDING",
          relatedRole: "",
          relatedSkill: "",
          relatedAchievement: "",
          metadata: {},
        })
        fetchEvidence()
      } else {
        const err = await res.json()
        toast.error(err.error || "Failed to add evidence")
      }
    } catch (error) {
      toast.error("Failed to add evidence")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="p-8 max-w-4xl mx-auto">
        <div className="text-center py-12">Loading Career Evidence...</div>
      </main>
    )
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Career Evidence</h1>
          <p className="text-muted-foreground">Document your achievements and accomplishments with supporting evidence</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Evidence
        </Button>
      </div>

      {evidence.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center py-8">No evidence yet. Start by adding your first achievement!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {evidence.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{item.claim}</span>
                  <Badge variant={item.verificationStatus === "VERIFIED" ? "default" : "outline"}>
                    {item.verificationStatus}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {item.source && <span>{item.source} • </span>}
                  {item.relatedRole && <span>Role: {item.relatedRole} • </span>}
                  {item.relatedSkill && <span>Skill: {item.relatedSkill}</span>}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {item.date && <div><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</div>}
                  {item.confidence > 0 && <div><strong>Confidence:</strong> {(item.confidence * 100).toFixed(0)}%</div>}
                  {item.sourceType && <div><strong>Source Type:</strong> {item.sourceType}</div>}
                  <div><strong>Created:</strong> {new Date(item.createdAt).toLocaleDateString()}</div>
                </div>
                {item.metadata.url && (
                  <a href={item.metadata.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mt-2">
                    <ExternalLink className="h-3 w-3" />
                    View Source
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>Connect evidence to your Career DNA</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Your evidence can support claims in <a href="/career-dna" className="underline">Career DNA</a></li>
            <li>Use evidence to back up your strengths, achievements, and skills</li>
            <li>Verified evidence increases confidence scores for your profile</li>
          </ul>
        </CardContent>
      </Card>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle>Add Career Evidence</CardTitle>
              <CardDescription>Document an achievement or accomplishment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Claim *</Label>
                <Textarea
                  value={formData.claim}
                  onChange={(e) => handleInputChange("claim", e.target.value)}
                  placeholder="What did you achieve? Be specific and measurable."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Source</Label>
                  <Input
                    value={formData.source}
                    onChange={(e) => handleInputChange("source", e.target.value)}
                    placeholder="Link, reference, or description"
                  />
                </div>
                <div>
                  <Label>Source Type</Label>
                  <Select value={formData.sourceType} onValueChange={(v) => handleInputChange("sourceType", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SOURCE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Related Role</Label>
                <Input
                  value={formData.relatedRole}
                  onChange={(e) => handleInputChange("relatedRole", e.target.value)}
                  placeholder="e.g., Staff Engineer, Product Manager"
                />
              </div>

              <div>
                <Label>Related Skill</Label>
                <Input
                  value={formData.relatedSkill}
                  onChange={(e) => handleInputChange("relatedSkill", e.target.value)}
                  placeholder="e.g., Distributed Systems, Go"
                />
              </div>

              <div>
                <Label>Related Achievement</Label>
                <Input
                  value={formData.relatedAchievement}
                  onChange={(e) => handleInputChange("relatedAchievement", e.target.value)}
                  placeholder="Link to achievement in Career DNA"
                />
              </div>
            </CardContent>
            <CardContent className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEvidence} disabled={saving}>
                {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Add Evidence"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  )
}