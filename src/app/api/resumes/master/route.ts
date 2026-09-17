import { NextResponse } from "next/server"
import { z } from "zod"

import { requireUser } from "@/lib/auth/require-user"
import { createOrUpdateMasterResume, getMasterResume } from "@/lib/career/dal"

const MasterResumeSchema = z.object({
  title: z.string().optional(),
  content: z.custom<Record<string, any>>().optional(),
})

export async function GET(
  _request: Request,
  _params: { params: Promise<Record<string, string>> }
) {
  const user = await requireUser()
  const resume = await getMasterResume(user.id)
  return NextResponse.json(resume)
}

export async function POST(request: Request) {
  const user = await requireUser()
  const body = await request.json()
  const parsed = MasterResumeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const resume = await createOrUpdateMasterResume(user.id, parsed.data)
  return NextResponse.json(resume, { status: 200 })
}
