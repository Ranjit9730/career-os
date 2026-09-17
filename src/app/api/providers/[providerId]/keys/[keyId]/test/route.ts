import { NextRequest, NextResponse } from "next/server"

import { requireUser } from "@/lib/auth/require-user"
import {
  getAiProvider,
  getAiProviderKey,
  testAiProviderKey,
} from "@/lib/ai/provider-manager"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ providerId: string; keyId: string }> }
) {
  const user = await requireUser()
  const { providerId, keyId } = await params
  const provider = await getAiProvider(providerId)
  if (!provider || provider.userId !== user.id) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 })
  }
  const key = await getAiProviderKey(keyId)
  if (!key || key.providerId !== providerId) {
    return NextResponse.json({ error: "Key not found" }, { status: 404 })
  }
  try {
    const result = await testAiProviderKey(providerId, keyId)
    return NextResponse.json({ success: true, message: result.message })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Key validation failed" }, { status: 400 })
  }
}