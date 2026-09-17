import { NextResponse } from "next/server"
import { z } from "zod"
import { requireUser } from "@/lib/auth/require-user"
import { getApplications } from "@/lib/career/dal"

const AppSchema = z.object({
  jobId: z.string(),
  status: z.string().optional(),
  interviewStage: z.string().optional(),
})

export async function GET() {
  const user = await requireUser()
  const apps = await getApplications(user.id)
  return NextResponse.json(apps)
}

export async function POST(request: Request) {
  const user = await requireUser()
  const body = await request.json()
  const parsed = AppSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  return NextResponse.json({ message: "Application added", data: parsed.data, userId: user.id }, { status: 201 })
}