import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/require-user"

export async function GET() {
  await requireUser()
  return NextResponse.json([])
}
