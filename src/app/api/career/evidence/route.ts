import { NextResponse } from "next/server"
import { z } from "zod"

import { requireUser } from "@/lib/auth/require-user"
import { createCareerEvidence } from "@/lib/career/dal"
import { db } from "@/db/client"
import { careerEvidence } from "@/db/schema"
import { eq, desc } from "drizzle-orm"

const CareerEvidenceSchema = z.object({
  claim: z.string().min(1, "Claim is required"),
  source: z.string().optional(),
  sourceType: z.string().min(1, "Source type is required"),
  date: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
  verificationStatus: z.string().optional(),
  relatedRole: z.string().optional(),
  relatedSkill: z.string().optional(),
  relatedAchievement: z.string().optional(),
  metadata: z.record(z.any()).optional(),
})

export async function GET() {
  const user = await requireUser()
  const evidence = await db.select().from(careerEvidence).where(eq(careerEvidence.userId, user.id)).orderBy(desc(careerEvidence.createdAt))
  return NextResponse.json(evidence)
}

export async function POST(request: Request) {
  const user = await requireUser()
  const body = await request.json()
  const parsed = CareerEvidenceSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const data = await createCareerEvidence(user.id, {
    ...parsed.data,
    date: parsed.data.date ? new Date(parsed.data.date) : undefined,
  })
  return NextResponse.json(data, { status: 201 })
}
