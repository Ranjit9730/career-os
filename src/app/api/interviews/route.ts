import { NextResponse } from "next/server"
import { z } from "zod"
import { requireUser } from "@/lib/auth/require-user"
import { getInterviewSessions } from "@/lib/career/dal"

const SessionSchema = z.object({
  sessionType: z.string(),
  status: z.string().optional(),
})

export async function GET() {
  const user = await requireUser()
  const sessions = await getInterviewSessions(user.id)
  return NextResponse.json(sessions)
}

export async function POST(request: Request) {
  const user = await requireUser()
  const body = await request.json()
  const parsed = SessionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  return NextResponse.json({ message: "Session added", data: parsed.data, userId: user.id }, { status: 201 })
}