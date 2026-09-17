import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { requireUser } from "@/lib/auth/require-user"
import {
  getAiProvider,
  getAiProviderKeys,
  createAiProviderKey,
} from "@/lib/ai/provider-manager"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ providerId: string }> }
) {
  const user = await requireUser()
  const { providerId } = await params
  const provider = await getAiProvider(providerId)
  if (!provider || provider.userId !== user.id) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 })
  }
  const keys = await getAiProviderKeys(providerId)
  return NextResponse.json(keys)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ providerId: string }> }
) {
  const user = await requireUser()
  const { providerId } = await params
  const provider = await getAiProvider(providerId)
  if (!provider || provider.userId !== user.id) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 })
  }
  const body = await request.json()
  const parsed = z
    .object({ secret: z.string().min(1), status: z.enum(["ENABLED", "DISABLED"]).optional() })
    .safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const key = await createAiProviderKey(providerId, {
    secret: parsed.data.secret,
    status: parsed.data.status,
  })
  return NextResponse.json(key, { status: 201 })
}