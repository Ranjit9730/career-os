"use client"

import { useState, useEffect } from "react"
import { Plus, Save, RefreshCw, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface MasterResume {
  id: string
  title: string
  content: Record<string, any>
  createdAt: string
  updatedAt: string
}

interface ResumeSection {
  name: string
  label: string
  items: string[]
}

const DEFAULT_SECTIONS = [
  { name: "summary", label: "Summary", items: [""] },
  { name: "experience", label: "Experience", items: [""] },
  { name: "education", label: "Education", items: [""] },
  { name: "skills", label: "Skills", items: [""] },
  { name: "projects", label: "Projects", items: [""] },
]

export default function MasterResumePage() {
  const [resume, setResume] = useState<MasterResume | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState("Master Resume")
  const [sections, setSections] = useState<ResumeSection[]>(DEFAULT_SECTIONS)

  const fetchResume = async () => {
    try {
      const res = await fetch("/api/resumes/master")
      if (res.ok) {
        const data = await res.json()
        setResume(data)
        if (data) {
          setTitle(data.title)
          if (data.content && data.content.sections) {
            setSections(data.content.sections)
          }
        }
      }
    } catch (error) {
      toast.error("Failed to load master resume")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResume()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/resumes/master", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: { sections },
        }),
      })
      if (res.ok) {
        toast.success("Resume saved")
      } else {
        const err = await res.json()
        toast.error(err.error || "Failed to save")
      }
    } catch (error) {
      toast.error("Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const updateSectionItem = (sectionIndex: number, itemIndex: number, value: string) => {
    setSections(prev => {
      const newSections = [...prev]
      const newItems = [...newSections[sectionIndex].items]
      newItems[itemIndex] = value
      newSections[sectionIndex] = { ...newSections[sectionIndex], items: newItems }
      return newSections
    })
  }

  const addSectionItem = (sectionIndex: number) => {
    setSections(prev => {
      const newSections = [...prev]
      newSections[sectionIndex] = {
        ...newSections[sectionIndex],
        items: [...newSections[sectionIndex].items, ""]
      }
      return newSections
    })
  }

  const removeSectionItem = (sectionIndex: number, itemIndex: number) => {
    setSections(prev => {
      const newSections = [...prev]
      const newItems = newSections[sectionIndex].items.filter((_, i) => i !== itemIndex)
      newSections[sectionIndex] = { ...newSections[sectionIndex], items: newItems }
      return newSections
    })
  }

  const addSection = () => {
    setSections(prev => [...prev, { name: `section_${Date.now()}`, label: "New Section", items: [""] }])
  }

  const updateSectionLabel = (sectionIndex: number, label: string) => {
    setSections(prev => {
      const newSections = [...prev]
      newSections[sectionIndex] = { ...newSections[sectionIndex], label }
      return newSections
    })
  }

  const removeSection = (sectionIndex: number) => {
    if (sections.length <= 1) {
      toast.error("Cannot remove the last section")
      return
    }
    setSections(prev => prev.filter((_, i) => i !== sectionIndex))
  }

  if (loading) {
    return (
      <main className="p-8 max-w-4xl mx-auto">
        <div className="text-center py-12">Loading Master Resume...</div>
      </main>
    )
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Master Resume</h1>
          <p className="text-muted-foreground">Build your comprehensive master resume with all your experience</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Save Resume"}
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label>Resume Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., My Master Resume" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {sections.map((section, sectionIndex) => (
          <Card key={section.name}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <Input
                  value={section.label}
                  onChange={(e) => updateSectionLabel(sectionIndex, e.target.value)}
                  className="text-lg font-semibold border-none p-0 h-auto focus-visible:ring-0"
                />
                <Button variant="ghost" size="icon" onClick={() => removeSection(sectionIndex)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start gap-2">
                    <Textarea
                      value={item}
                      onChange={(e) => updateSectionItem(sectionIndex, itemIndex, e.target.value)}
                      placeholder={`${section.label} item ${itemIndex + 1}`}
                      className="flex-1"
                      rows={3}
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeSectionItem(sectionIndex, itemIndex)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => addSectionItem(sectionIndex)}>
                    <Plus className="h-4 w-4 mr-2" /> Add Item
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" size="sm" onClick={addSection} className="w-full justify-start">
            <Plus className="h-4 w-4 mr-2" /> Add Section
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}