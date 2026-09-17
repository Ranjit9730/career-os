import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { requireUser } from "@/lib/auth/require-user"
import {
  getAiProvider,
  getAiProviderKeys,
  createAiProviderKey,
  deleteAiProviderKey,
  updateAiProviderKey,
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ providerId: string; keyId: string }> }
) {
  const user = await requireUser()
  const { providerId, keyId } = await params
  const provider = await getAiProvider(providerId)
  if (!provider || provider.userId !== user.id) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 })
  }
  const body = await request.json()
  const parsed = z
    .object({
      status: z.enum(["ENABLED", "DISABLED"]).optional(),
      priority: z.number().int().optional(),
    })
    .safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const key = await updateAiProviderKey(keyId, {
    status: parsed.data.status,
    priority: parsed.data.priority,
  })
  if (!key) {
    return NextResponse.json({ error: "Key not found" }, { status: 404 })
  }
  return NextResponse.json({ success: true, key })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ providerId: string; keyId: string }> }
) {
  const user = await requireUser()
  const { providerId, keyId } = await params
  const provider = await getAiProvider(providerId)
  if (!provider || provider.userId !== user.id) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 })
  }
  const deleted = await deleteAiProviderKey(keyId)
  return NextResponse.json({ deleted })
}