import "server-only"

import { eq, asc } from "drizzle-orm"
import { db } from "@/db/client"
import { aiProviderKeys, aiProviders } from "@/db/schema"
import { encryptSecret, decryptSecret } from "@/lib/secrets/encryption"

export type ProviderStatus = "UNKNOWN" | "READY" | "ERROR"
export type ProviderKeyStatus = "ENABLED" | "DISABLED"
export type AiProviderName = "openrouter" | "gemini" | "groq" | "openai-compatible" | "ollama"

export interface AiProvider {
  id: string
  userId: string
  provider: string
  model: string
  baseUrl: string | null
  status: string
  priority: number
  isFree: boolean
  freeTierVerifiedAt: Date | null
  contextLimit: number | null
  capabilities: any
  fallbackProviderId: any
  enabled: boolean
  freeOnly: boolean
  requestCount: number
  errorCount: number
  cooldownUntil: Date | null
  dailyUsage: any
  monthlyUsage: any
  lastUsed: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface AiProviderKey {
  id: string
  providerId: string
  encryptedSecretReference: string
  status: string
  health: string
  priority: number
  usage: any
  lastUsed: Date | null
  cooldownUntil: Date | null
  errorCount: number
  keyVersion: number
  createdAt: Date
  updatedAt: Date
}

export interface ProviderFormInput {
  provider: AiProviderName
  model: string
  baseUrl?: string
  isFree: boolean
  freeTierVerifiedAt?: string
  contextLimit?: number
  capabilities: string[]
  enabled: boolean
  freeOnly: boolean
  priority?: number
}

export interface ProviderKeyFormInput {
  secret: string
  status?: ProviderKeyStatus
  priority?: number
}

const FREE_MODELS: Record<AiProviderName, string[]> = {
  openrouter: ["deepseek/deepseek-chat-v3", "mistralai/mistral-small-latest"],
  gemini: ["gemini-2.0-flash", "gemini-2.0-flash-lite"],
  groq: ["llama-3.3-70b-versatile", "gemma2-9b-it"],
  "openai-compatible": ["gpt-4o-mini"],
  ollama: ["llama3.2:3b-instruct-q4_K_M", "qwen2.5-coder:7b"],
}

const PROVIDER_MODELS: Record<AiProviderName, string[]> = {
  openrouter: ["deepseek/deepseek-chat-v3", "openai/gpt-4o-mini", "anthropic/claude-3.5-sonnet"],
  gemini: ["gemini-2.0-flash", "gemini-2.0-flash-lite"],
  groq: ["llama-3.3-70b-versatile", "gemma2-9b-it"],
  "openai-compatible": ["gpt-4o-mini", "o3-mini"],
  ollama: ["llama3.2:3b-instruct-q4_K_M", "qwen2.5-coder:7b"],
}

export async function getAiProviders(userId: string): Promise<AiProvider[]> {
  return await db.select().from(aiProviders).where(eq(aiProviders.userId, userId)).orderBy(asc(aiProviders.priority), asc(aiProviders.createdAt))
}

export async function getAiProvider(providerId: string): Promise<AiProvider | null> {
  return (await db.select().from(aiProviders).where(eq(aiProviders.id, providerId)).limit(1))[0] ?? null
}

export async function getAiProviderKeys(providerId: string): Promise<AiProviderKey[]> {
  return await db.select().from(aiProviderKeys).where(eq(aiProviderKeys.providerId, providerId)).orderBy(asc(aiProviderKeys.priority), asc(aiProviderKeys.createdAt))
}

export async function getAiProviderWithKeys(providerId: string): Promise<{ provider: AiProvider; keys: AiProviderKey[] } | null> {
  const provider = await getAiProvider(providerId)
  if (!provider) return null
  return { provider, keys: await getAiProviderKeys(providerId) }
}

export async function getDecryptedProviderKey(keyId: string): Promise<string | null> {
  const keyRow = await db.select({ encrypted: aiProviderKeys.encryptedSecretReference }).from(aiProviderKeys).where(eq(aiProviderKeys.id, keyId)).limit(1)
  if (!keyRow[0]) return null
  return decryptSecret(keyRow[0].encrypted)
}

export async function createAiProvider(userId: string, input: ProviderFormInput): Promise<AiProvider> {
    const model = input.model.trim().toLowerCase()
    const provider = input.provider
    const isFree = input.isFree || FREE_MODELS[provider].includes(model)
    const freeTierVerifiedAt = input.isFree ? new Date() : null
    const capabilities = input.capabilities.length > 0 ? input.capabilities : ["chat"]
    const priority = input.priority ?? 100

    const [row] = await db.insert(aiProviders).values([{
      userId,
      provider,
      model,
      baseUrl: input.baseUrl?.trim() || null,
      status: "UNKNOWN",
      priority,
      isFree,
      freeTierVerifiedAt,
      contextLimit: input.contextLimit ?? null,
      capabilities,
      enabled: input.enabled,
      freeOnly: input.freeOnly,
      requestCount: 0,
      errorCount: 0,
      cooldownUntil: null,
      dailyUsage: {},
      monthlyUsage: {},
      lastUsed: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }]).returning() as [AiProvider]

  return {
    id: row.id,
    userId: row.userId,
    provider: row.provider,
    model: row.model,
    baseUrl: row.baseUrl,
    status: row.status,
    priority: row.priority,
    isFree: row.isFree,
    freeTierVerifiedAt: row.freeTierVerifiedAt,
    contextLimit: row.contextLimit,
    capabilities: row.capabilities,
    fallbackProviderId: row.fallbackProviderId,
    enabled: row.enabled,
    freeOnly: row.freeOnly,
    requestCount: row.requestCount,
    errorCount: row.errorCount,
    cooldownUntil: row.cooldownUntil,
    dailyUsage: row.dailyUsage,
    monthlyUsage: row.monthlyUsage,
    lastUsed: row.lastUsed,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

export async function updateAiProvider(providerId: string, updates: Partial<AiProvider>): Promise<AiProvider | null> {
  const existing = await getAiProvider(providerId)
  if (!existing) return null
  const [row] = await db.update(aiProviders).set({
    ...updates,
    updatedAt: new Date(),
  }).where(eq(aiProviders.id, providerId)).returning()
  if (!row) return null
  return {
    id: row.id,
    userId: row.userId,
    provider: row.provider,
    model: row.model,
    baseUrl: row.baseUrl,
    status: row.status,
    priority: row.priority,
    isFree: row.isFree,
    freeTierVerifiedAt: row.freeTierVerifiedAt,
    contextLimit: row.contextLimit,
    capabilities: row.capabilities,
    fallbackProviderId: row.fallbackProviderId,
    enabled: row.enabled,
    freeOnly: row.freeOnly,
    requestCount: row.requestCount,
    errorCount: row.errorCount,
    cooldownUntil: row.cooldownUntil,
    dailyUsage: row.dailyUsage,
    monthlyUsage: row.monthlyUsage,
    lastUsed: row.lastUsed,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

export async function deleteAiProvider(providerId: string): Promise<boolean> {
  const result = await db.delete(aiProviders).where(eq(aiProviders.id, providerId)).returning({ id: aiProviders.id })
  return result.length > 0
}

export async function createAiProviderKey(providerId: string, input: ProviderKeyFormInput): Promise<AiProviderKey> {
  const provider = await getAiProvider(providerId)
  if (!provider) throw new Error("Provider not found")
  const status = input.status ?? "ENABLED"
  const [row] = await db.insert(aiProviderKeys).values({
    providerId,
    encryptedSecretReference: encryptSecret(input.secret),
    status,
    health: "UNKNOWN",
    priority: input.priority ?? 0,
    keyVersion: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning()
  return {
    id: row.id,
    providerId: row.providerId,
    encryptedSecretReference: row.encryptedSecretReference,
    status: row.status,
    health: row.health,
    priority: row.priority,
    usage: row.usage,
    lastUsed: row.lastUsed,
    cooldownUntil: row.cooldownUntil,
    errorCount: row.errorCount,
    keyVersion: row.keyVersion,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

export async function updateAiProviderKey(keyId: string, updates: Partial<Pick<AiProviderKey, "status" | "health" | "priority" | "cooldownUntil" | "errorCount" | "keyVersion">>): Promise<AiProviderKey | null> {
  const existing = await db.select({ id: aiProviderKeys.id }).from(aiProviderKeys).where(eq(aiProviderKeys.id, keyId)).limit(1)
  if (!existing[0]) return null
  const [row] = await db.update(aiProviderKeys).set({ ...updates, updatedAt: new Date() }).where(eq(aiProviderKeys.id, keyId)).returning()
  if (!row) return null
  return {
    id: row.id,
    providerId: row.providerId,
    encryptedSecretReference: row.encryptedSecretReference,
    status: row.status,
    health: row.health,
    priority: row.priority,
    usage: row.usage,
    lastUsed: row.lastUsed,
    cooldownUntil: row.cooldownUntil,
    errorCount: row.errorCount,
    keyVersion: row.keyVersion,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

export async function deleteAiProviderKey(keyId: string): Promise<boolean> {
  const result = await db.delete(aiProviderKeys).where(eq(aiProviderKeys.id, keyId)).returning({ id: aiProviderKeys.id })
  return result.length > 0
}
