import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/require-user"
import { getLinkedinProfiles } from "@/lib/career/dal"

export async function GET() {
  const user = await requireUser()
  return NextResponse.json(await getLinkedinProfiles(user.id))
}