import { NextResponse } from "next/server"
import { z } from "zod"
import { requireUser } from "@/lib/auth/require-user"
import { getCareerProfile, createOrUpdateCareerProfile } from "@/lib/career/dal"

const ProfileSchema = z.object({
  fullName: z.string().optional(),
  headline: z.string().optional(),
  location: z.string().optional(),
  workMode: z.string().optional(),
  salaryExpectations: z.custom<Record<string, any>>().optional(),
  careerGoals: z.custom<Record<string, any>>().optional(),
  preferredRoles: z.array(z.string()).optional(),
})

export async function GET() {
  const user = await requireUser()
  const profile = await getCareerProfile(user.id)
  return NextResponse.json(profile)
}

export async function POST(request: Request) {
  const user = await requireUser()
  const body = await request.json()
  const parsed = ProfileSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const profile = await createOrUpdateCareerProfile(user.id, parsed.data)
  return NextResponse.json(profile, { status: 200 })
}