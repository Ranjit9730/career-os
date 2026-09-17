import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { requireUser } from "@/lib/auth/require-user"
import {
  getAiProvider,
  getAiProviderKeys,
  deleteAiProvider,
  deleteAiProviderKey,
} from "@/lib/ai/provider-manager"

const ProviderIdSchema = z.object({
  providerId: z.string(),
})

const KeyStatusSchema = z.object({
  status: z.enum(["ENABLED", "DISABLED"]),
})

export async function GET(
  request: Request,
  { params }: { params: { providerId: string } }
) {
  const user = await requireUser()
  const provider = await getAiProvider(params.providerId)
  if (!provider || provider.userId !== user.id) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 })
  }
  const keys = await getAiProviderKeys(params.providerId)
  return NextResponse.json({ provider, keys })
}

export async function PATCH(
  request: Request,
  { params }: { params: { providerId: string } }
) {
  const user = await requireUser()
  const provider = await getAiProvider(params.providerId)
  if (!provider || provider.userId !== user.id) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 })
  }
  const body = await request.json()
  const parsed = z.object({ enabled: z.boolean(), freeOnly: z.boolean() }).safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const [updated] = await (await import("drizzle-orm")).update
    .aiProviders.set({ enabled: parsed.data.enabled, freeOnly: parsed.data.freeOnly })
    .where(({ id }) => id === params.providerId)
    .execute()
  return NextResponse.json({ success: true })
}

export async function DELETE(
  request: Request,
  { params }: { params: { providerId: string } }
) {
  const user = await requireUser()
  const provider = await getAiProvider(params.providerId)
  if (!provider || provider.userId !== user.id) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 })
  }
  const deleted = await deleteAiProvider(params.providerId)
  return NextResponse.json({ deleted })
}