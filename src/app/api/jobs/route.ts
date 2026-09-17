import { NextResponse } from "next/server"
import { z } from "zod"
import { requireUser } from "@/lib/auth/require-user"
import { getJobs } from "@/lib/career/dal"

const JobSchema = z.object({
  title: z.string(),
  companyName: z.string(),
  status: z.string().optional(),
})

export async function GET() {
  const user = await requireUser()
  const jobs = await getJobs(user.id)
  return NextResponse.json(jobs)
}

export async function POST(request: Request) {
  const user = await requireUser()
  const body = await request.json()
  const parsed = JobSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  return NextResponse.json({ message: "Job added", data: parsed.data, userId: user.id }, { status: 201 })
}