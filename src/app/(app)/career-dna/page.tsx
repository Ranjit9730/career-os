"use client"

import { useState, useEffect } from "react"
import { Plus, Minus, Save, RefreshCw, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface CareerDna {
  id: string
  careerIdentity: string
  coreStrengths: string[]
  technicalStrengths: string[]
  domainStrengths: string[]
  transferableSkills: string[]
  evidenceBackedAchievements: string[]
  careerThemes: string[]
  roleFamilies: string[]
  potentialRoleTransitions: string[]
  skillGaps: string[]
  experienceGaps: string[]
  positioningOptions: string[]
}

const SECTIONS = [
  { key: "careerIdentity", label: "Career Identity", type: "textarea", placeholder: "Describe your professional identity, values, and what drives you..." },
  { key: "coreStrengths", label: "Core Strengths", type: "array", placeholder: "e.g., Strategic thinking, Problem solving, Leadership" },
  { key: "technicalStrengths", label: "Technical Strengths", type: "array", placeholder: "e.g., TypeScript, React, PostgreSQL, AWS" },
  { key: "domainStrengths", label: "Domain Strengths", type: "array", placeholder: "e.g., FinTech, HealthTech, E-commerce" },
  { key: "transferableSkills", label: "Transferable Skills", type: "array", placeholder: "e.g., Project management, Communication, Data analysis" },
  { key: "evidenceBackedAchievements", label: "Evidence-Backed Achievements", type: "array", placeholder: "e.g., Scaled API from 1k to 1M req/day with 99.9% uptime" },
  { key: "careerThemes", label: "Career Themes", type: "array", placeholder: "e.g., Building developer tools, Scaling systems, Team leadership" },
  { key: "roleFamilies", label: "Role Families", type: "array", placeholder: "e.g., Engineering Manager, Staff Engineer, CTO" },
  { key: "potentialRoleTransitions", label: "Potential Role Transitions", type: "array", placeholder: "e.g., IC to Manager, Backend to Full-stack" },
  { key: "skillGaps", label: "Skill Gaps", type: "array", placeholder: "e.g., ML/AI, Distributed systems, Public speaking" },
  { key: "experienceGaps", label: "Experience Gaps", type: "array", placeholder: "e.g., Managing 50+ people, Open source leadership" },
  { key: "positioningOptions", label: "Positioning Options", type: "array", placeholder: "e.g., Technical leader in AI infra, Platform engineering expert" },
] as const

export default function CareerDnaPage() {
  const [dna, setDna] = useState<CareerDna | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchDna = async () => {
    try {
      const res = await fetch("/api/career/dna")
      if (res.ok) {
        const data = await res.json()
        setDna(data)
      }
    } catch (error) {
      toast.error("Failed to load career DNA")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDna()
  }, [])

  const handleSave = async () => {
    if (!dna) return
    setSaving(true)
    try {
      const res = await fetch("/api/career/dna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dna),
      })
      if (res.ok) {
        toast.success("Career DNA saved")
      } else {
        const err = await res.json()
        toast.error(err.error?.fieldErrors ? JSON.stringify(err.error.fieldErrors) : "Failed to save")
      }
    } catch (error) {
      toast.error("Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const updateArrayField = (field: keyof CareerDna, value: string[]) => {
    setDna(prev => prev ? { ...prev, [field]: value } : null)
  }

  const addArrayItem = (field: keyof CareerDna, item: string) => {
    if (!item.trim()) return
    setDna(prev => prev ? { ...prev, [field]: [...prev[field], item.trim()] } : null)
  }

  const removeArrayItem = (field: keyof CareerDna, index: number) => {
    setDna(prev => prev ? { ...prev, [field]: prev[field].filter((_, i) => i !== index) } : null)
  }

  const handleInputChange = (field: keyof CareerDna, value: string) => {
    if (field === "careerIdentity") {
      setDna(prev => prev ? { ...prev, careerIdentity: value } : null)
    }
  }

  if (loading) {
    return (
      <main className="p-8 max-w-4xl mx-auto">
        <div className="text-center py-12">Loading Career DNA...</div>
      </main>
    )
  }

  const initialDna: CareerDna = dna ?? {
    id: "",
    careerIdentity: "",
    coreStrengths: [],
    technicalStrengths: [],
    domainStrengths: [],
    transferableSkills: [],
    evidenceBackedAchievements: [],
    careerThemes: [],
    roleFamilies: [],
    potentialRoleTransitions: [],
    skillGaps: [],
    experienceGaps: [],
    positioningOptions: [],
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Career DNA</h1>
          <p className="text-muted-foreground">Define your professional identity, strengths, and career direction</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Save Career DNA"}
        </Button>
      </div>

      <div className="space-y-6">
        {SECTIONS.map((section) => {
          const fieldKey = section.key as keyof CareerDna
          const value = initialDna[fieldKey]

          if (section.type === "textarea") {
            return (
              <Card key={fieldKey}>
                <CardHeader>
                  <CardTitle>{section.label}</CardTitle>
                  <CardDescription>Your professional identity and what drives you</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={value as string}
                    onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                    placeholder={section.placeholder}
                    className="min-h-[120px]"
                    rows={5}
                  />
                </CardContent>
              </Card>
            )
          }

          return (
            <Card key={fieldKey}>
              <CardHeader>
                <CardTitle>{section.label}</CardTitle>
                <CardDescription>Add items, one per line</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(value as string[]).map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={item}
                        onChange={(e) => {
                          const newItems = [...(value as string[])]
                          newItems[index] = e.target.value
                          updateArrayField(fieldKey, newItems)
                        }}
                        placeholder={section.placeholder}
                        className="flex-1"
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeArrayItem(fieldKey, index)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder={section.placeholder}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value.trim()) {
                          e.preventDefault()
                          addArrayItem(fieldKey, e.currentTarget.value)
                          e.currentTarget.value = ""
                        }
                      }}
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={() => addArrayItem(fieldKey, "")}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {dna?.id && (
        <Card className="mt-6 border-amber-200 bg-amber-50">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-medium text-amber-800">Evidence-backed claims</p>
              <p className="text-sm text-amber-700">
                Link your strengths and achievements to evidence in the <a href="/career-evidence" className="underline">Career Evidence</a> section.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  )
}