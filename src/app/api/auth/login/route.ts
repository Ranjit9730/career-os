import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { verifyPassword } from "@/lib/auth/password"
import { db } from "@/db/client"
import { users } from "@/db/schema"

export async function POST(request: Request) {
  const body = await request.json()
  const userRows = await db.select({ id: users.id, email: users.email, passwordHash: users.passwordHash }).from(users).where(eq(users.email, body.email)).execute()
  const userRow = userRows[0]
  if (!userRow) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  const ok = await verifyPassword(body.password, userRow.passwordHash)
  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  return NextResponse.json({ user: userRow.id })
}
