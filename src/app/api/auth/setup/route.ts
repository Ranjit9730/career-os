import { NextResponse } from "next/server"
import { hashPassword } from "@/lib/auth/password"
import { db } from "@/db/client"
import { users } from "@/db/schema"

export async function POST(request: Request) {
  const body = await request.json()
  const setupCode = process.env.SETUP_CODE
  if (!setupCode || body.setupCode !== setupCode) {
    return NextResponse.json({ error: "Invalid setup code" }, { status: 403 })
  }
  const existing = await db.select().from(users).execute()
  if (existing.length > 0) {
    return NextResponse.json({ error: "User exists" }, { status: 409 })
  }
  const hash = await hashPassword(body.password)
  const user = await db.insert(users).values({
    email: body.email,
    passwordHash: hash,
    displayName: body.displayName ?? body.email,
    setupCompleted: true,
  }).returning()
  return NextResponse.json({ user: user[0].id })
}
