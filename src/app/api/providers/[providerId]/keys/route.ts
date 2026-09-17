import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/require-user"
import {
  getAiProvider,
  getAiProviderKeys,
  createAiProviderKey,
  deleteAiProviderKey,
} from "@/lib/ai/provider-manager"

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
  return NextResponse.json(keys)
}

export async function POST(
  request: Request,
  { params }: { params: { providerId: string } }
) {
  const user = await requireUser()
  const provider = await getAiProvider(params.providerId)
  if (!provider || provider.userId !== user.id) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 })
  }
  const body = await request.json()
  const parsed = await (
    await import("zod")
  ).z
    .object({ secret: z.string().min(1), status: z.string().optional() })
    .safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const key = await createAiProviderKey(params.providerId, {
    secret: parsed.data.secret,
    status: parsed.data.status as any,
  })
  return NextResponse.json(key, { status: 201 })
}

export async function DELETE(
  request: Request,
  { params }: { params: { providerId: string; keyId: string } }
) {
  const user = await requireUser()
  const provider = await getAiProvider(params.providerId)
  if (!provider || provider.userId !== user.id) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 })
  }
  const deleted = await deleteAiProviderKey(params.keyId)
  return NextResponse.json({ deleted })
}