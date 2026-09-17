"use client"

import { useState, useEffect } from "react"
import { Plus, Key, RefreshCw, Settings, Trash2, Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { toast } from "sonner"

const PROVIDERS = [
  { value: "openrouter", label: "OpenRouter", models: ["mistralai/mistral-7b-instruct", "meta-llama/llama-3.1-8b-instant", "deepseek/deepseek-chat-v3"] },
  { value: "gemini", label: "Google Gemini", models: ["gemini-2.0-flash", "gemini-2.0-flash-lite"] },
  { value: "groq", label: "Groq", models: ["llama-3.3-70b-versatile", "gemma2-9b-it", "mixtral-8x7b-32b-instruct-v0.1"] },
  { value: "openai-compatible", label: "OpenAI Compatible", models: ["gpt-4o-mini", "o3-mini"] },
  { value: "ollama", label: "Ollama (Local)", models: ["llama3.2:3b-instruct-q4_K_M", "qwen2.5-coder:7b", "codellama:7b-code-instruct"] },
]

interface Provider {
  id: string
  provider: string
  model: string
  baseUrl: string | null
  status: string
  enabled: boolean
  isFree: boolean
  freeOnly: boolean
  requestCount: number
  errorCount: number
}

interface ProviderKey {
  id: string
  providerId: string
  status: string
  health: string
}

type ProviderForm = {
  provider: string
  model: string
  baseUrl?: string
  isFree: boolean
  enabled: boolean
  freeOnly: boolean
}

type KeyForm = {
  secret: string
  status: "ENABLED" | "DISABLED"
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [keysMap, setKeysMap] = useState<Record<string, ProviderKey[]>>({})
  const [loading, setLoading] = useState(true)
  const [showAddProvider, setShowAddProvider] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [showAddKey, setSelectedProviderForKey] = useState<Provider | null>(null)
  const [testingKey, setTestingKey] = useState<string | null>(null)
  const toast = useToast()

  const fetchProviders = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/providers")
      const data = await res.json()
      setProviders(data)
      
      const keysRes = await Promise.all(data.map((p: Provider) => 
        fetch(`/api/providers/${p.id}/keys`).then(r => r.json())
      ))
      const newKeysMap: Record<string, ProviderKey[]> = {}
      data.forEach((p: Provider, i: number) => {
        newKeysMap[p.id] = keysRes[i] || []
      })
      setKeysMap(newKeysMap)
    } catch (error) {
      toast.error("Failed to load providers")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProviders()
  }, [])

  const handleAddProvider = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const providerName = formData.get("provider") as string
    const model = formData.get("model") as string
    const baseUrl = formData.get("baseUrl") as string | undefined
    const isFree = formData.get("isFree") === "true"
    const freeOnly = formData.get("freeOnly") === "true"
    const enabled = formData.get("enabled") === "true"

    try {
      const res = await fetch("/api/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: providerName,
          model,
          baseUrl: baseUrl || undefined,
          isFree,
          freeOnly,
          enabled,
          capabilities: ["chat"],
        }),
      })
      if (res.ok) {
        toast.success("Provider added successfully")
        setShowAddProvider(false)
        await fetchProviders()
      } else {
        const err = await res.json()
        toast.error(err.error || "Failed to add provider")
      }
    } catch (error) {
      toast.error("Failed to add provider")
    }
  }

  const handleDeleteProvider = async (id: string) => {
    try {
      const res = await fetch(`/api/providers/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Provider deleted")
        await fetchProviders()
      }
    } catch (error) {
      toast.error("Failed to delete provider")
    }
  }

  const handleToggleProvider = async (id: string, enabled: boolean) => {
    try {
      await fetch(`/api/providers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled, freeOnly: false }),
      })
      toast.success(`Provider ${enabled ? "enabled" : "disabled"}`)
      await fetchProviders()
    } catch (error) {
      toast.error("Failed to update provider")
    }
  }

  const handleAddKey = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!showAddKey) return
    
    const formData = new FormData(e.currentTarget)
    const secret = formData.get("secret") as string
    const status = formData.get("status") as "ENABLED" | "DISABLED"

    try {
      const res = await fetch(`/api/providers/${showAddKey.id}/keys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, status }),
      })
      if (res.ok) {
        toast.success("API key added")
        setSelectedProviderForKey(null)
        await fetchProviders()
      } else {
        const err = await res.json()
        toast.error(err.error || "Failed to add key")
      }
    } catch (error) {
      toast.error("Failed to add key")
    }
  }

  const handleDeleteKey = async (providerId: string, keyId: string) => {
    try {
      const res = await fetch(`/api/providers/${providerId}/keys/${keyId}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Key deleted")
        await fetchProviders()
      }
    } catch (error) {
      toast.error("Failed to delete key")
    }
  }

  const handleTestKey = async (providerId: string, keyId: string) => {
    setTestingKey(keyId)
    try {
      const res = await fetch(`/api/providers/${providerId}/keys/${keyId}/test`, { method: "POST" })
      if (res.ok) {
        toast.success("Key validation successful")
      } else {
        const err = await res.json()
        toast.error(err.error || "Key validation failed")
      }
    } catch (error) {
      toast.error("Failed to test key")
    } finally {
      setTestingKey(null)
    }
  }

  const getProviderLabel = (value: string) => {
    const found = PROVIDERS.find(p => p.value === value)
    return found?.label || value
  }

  const getModelsForProvider = (value: string) => {
    const found = PROVIDERS.find(p => p.value === value)
    return found?.models || []
  }

  if (loading) {
    return (
      <main className="p-8 max-w-4xl mx-auto">
        <div className="text-center">Loading providers...</div>
      </main>
    )
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">AI Providers</h1>
          <p className="text-muted-foreground">Manage your AI model providers and API keys</p>
        </div>
        <Dialog open={showAddProvider} onOpenChange={setShowAddProvider}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add Provider
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAddProvider}>
              <DialogHeader>
                <DialogTitle>Add AI Provider</DialogTitle>
                <DialogDescription>Configure a new AI provider with its model</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="provider">Provider</Label>
                  <Select name="provider" required defaultValue="openrouter">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVIDERS.map(p => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input name="model" placeholder="e.g., mistralai/mistral-7b-instruct" required />
                </div>
                <div>
                  <Label htmlFor="baseUrl">Base URL (optional)</Label>
                  <Input name="baseUrl" placeholder="https://api.example.com" />
                </div>
                <div>
                  <Label htmlFor="isFree">Is Free Tier</Label>
                  <Switch name="isFree" defaultChecked />
                </div>
                <div>
                  <Label htmlFor="freeOnly">Free Only Mode</Label>
                  <Switch name="freeOnly" />
                </div>
                <div>
                  <Label htmlFor="enabled">Enabled</Label>
                  <Switch name="enabled" defaultChecked />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Provider</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {providers.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center py-8">No providers configured.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {providers.map(provider => {
            const providerInfo = PROVIDERS.find(p => p.value === provider.provider)
            return (
              <Card key={provider.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{getProviderLabel(provider.provider)} - {provider.model}</CardTitle>
                      <CardDescription>Status: {provider.status}</CardDescription>
                    </div>
                    <Badge variant={provider.enabled ? "default" : "outline"}>
                      {provider.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Provider</Label>
                        <p className="text-sm">{providerInfo?.label || provider.provider}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={provider.enabled} onCheckedChange={checked => handleToggleProvider(provider.id, checked)} />
                        <Trash2 className="h-4 w-4 text-destructive cursor-pointer" onClick={() => handleDeleteProvider(provider.id)} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>API Keys</Label>
                        <p className="text-sm">{keysMap[provider.id]?.length || 0} key(s) configured</p>
                      </div>
                      <Dialog open={showAddKey?.id === provider.id} onOpenChange={open => { if (open) setSelectedProviderForKey(provider); else setSelectedProviderForKey(null) }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Key className="h-4 w-4 mr-2" /> Add Key
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add API Key</DialogTitle>
                            <DialogDescription>Add an API key for {getProviderLabel(provider.provider)}</DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleAddKey}>
                            <div className="space-y-4 py-4">
                              <div>
                                <Label htmlFor="secret">API Key</Label>
                                <Input name="secret" type="password" required />
                              </div>
                              <div>
                                <Label htmlFor="status">Status</Label>
                                <Select name="status" defaultValue="ENABLED">
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="ENABLED">Enabled</SelectItem>
                                    <SelectItem value="DISABLED">Disabled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit">Add Key</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                    {keysMap[provider.id] && keysMap[provider.id].length > 0 && (
                      <div className="space-y-2">
                        <Label>Configured Keys</Label>
                        <div className="border rounded-md p-3">
                          {keysMap[provider.id].map(key => (
                            <div key={key.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                              <div>
                                <div className="font-medium">{key.id.slice(0, 8)}...</div>
                                <Badge variant={key.status === "ENABLED" ? "default" : "secondary"}>{key.status}</Badge>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleTestKey(provider.id, key.id)}>
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteKey(provider.id, key.id)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </main>
  )
}