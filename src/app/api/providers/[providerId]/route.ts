import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { requireUser } from "@/lib/auth/require-user"
import {
  getAiProvider,
  getAiProviderKeys,
  deleteAiProvider,
  updateAiProvider,
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
  return NextResponse.json({ provider, keys })
}

export async function PATCH(
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
  const parsed = z.object({ enabled: z.boolean(), freeOnly: z.boolean() }).safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const updated = await updateAiProvider(providerId, {
    enabled: parsed.data.enabled,
    freeOnly: parsed.data.freeOnly,
  })
  if (!updated) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 })
  }
  return NextResponse.json({ success: true, provider: updated })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ providerId: string }> }
) {
  const user = await requireUser()
  const { providerId } = await params
  const provider = await getAiProvider(providerId)
  if (!provider || provider.userId !== user.id) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 })
  }
  const deleted = await deleteAiProvider(providerId)
  return NextResponse.json({ deleted })
}