import { NextResponse } from "next/server"
import { z } from "zod"

import { requireUser } from "@/lib/auth/require-user"
import {
  type ProviderFormInput,
  createAiProvider,
  getAiProviders,
} from "@/lib/ai/provider-manager"

const ProviderSchema = z.object({
  provider: z.enum(["openrouter", "gemini", "groq", "openai-compatible", "ollama"]),
  model: z.string(),
  baseUrl: z.string().optional(),
  isFree: z.boolean(),
  freeTierVerifiedAt: z.string().optional(),
  contextLimit: z.number().int().positive().optional(),
  capabilities: z.array(z.string()),
  enabled: z.boolean(),
  freeOnly: z.boolean(),
  priority: z.number().int().optional(),
})

export async function GET() {
  const user = await requireUser()
  const providers = await getAiProviders(user.id)
  return NextResponse.json(providers)
}

export async function POST(request: Request) {
  const user = await requireUser()
  const body = await request.json()
  const parsed = ProviderSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const input: ProviderFormInput = { ...parsed.data, capabilities: [...parsed.data.capabilities] }
  const provider = await createAiProvider(user.id, input)
  return NextResponse.json(provider, { status: 201 })
}
