import { NextResponse } from "next/server"
import { z } from "zod"
import { requireUser } from "@/lib/auth/require-user"
import { getSkills, createSkill } from "@/lib/career/dal"

const SkillSchema = z.object({
  name: z.string(),
  category: z.string().optional(),
  proficiency: z.string().optional(),
  description: z.string().optional(),
})

export async function GET() {
  const user = await requireUser()
  const skills = await getSkills(user.id)
  return NextResponse.json(skills)
}

export async function POST(request: Request) {
  const user = await requireUser()
  const body = await request.json()
  const parsed = SkillSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const skill = await createSkill(user.id, parsed.data)
  return NextResponse.json(skill, { status: 201 })
}