import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/require-user"
import { getAiUsage } from "@/lib/career/dal"

export async function GET() {
  const user = await requireUser()
  return NextResponse.json(await getAiUsage(user.id))
}