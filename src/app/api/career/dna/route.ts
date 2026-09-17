import { NextResponse } from "next/server"
import { z } from "zod"

import { requireUser } from "@/lib/auth/require-user"
import { createOrUpdateCareerDna, getCareerDna } from "@/lib/career/dal"

const CareerDnaSchema = z.object({
  careerIdentity: z.string().min(1, "Career identity is required"),
  coreStrengths: z.array(z.string()),
  technicalStrengths: z.array(z.string()),
  domainStrengths: z.array(z.string()),
  transferableSkills: z.array(z.string()),
  evidenceBackedAchievements: z.array(z.string()),
  careerThemes: z.array(z.string()),
  roleFamilies: z.array(z.string()),
  potentialRoleTransitions: z.array(z.string()),
  skillGaps: z.array(z.string()),
  experienceGaps: z.array(z.string()),
  positioningOptions: z.array(z.string()),
  sourceContext: z.custom<Record<string, any>>().optional(),
})

export async function GET(
  _request: Request,
  _params: { params: Promise<Record<string, string>> }
) {
  const user = await requireUser()
  const dna = await getCareerDna(user.id)
  return NextResponse.json(dna)
}

export async function POST(request: Request) {
  const user = await requireUser()
  const body = await request.json()
  const parsed = CareerDnaSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const dna = await createOrUpdateCareerDna(user.id, parsed.data)
  return NextResponse.json(dna, { status: 200 })
}
