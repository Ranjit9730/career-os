import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { verifyPassword } from "@/lib/auth/password"
import { createToken, hashToken, SESSION_COOKIE } from "@/lib/auth/session"
import { db } from "@/db/client"
import { users, authSessions } from "@/db/schema"

export async function POST(request: Request) {
  const body = await request.json()
  const userRows = await db.select({ id: users.id, email: users.email, passwordHash: users.passwordHash }).from(users).where(eq(users.email, body.email)).execute()
  const userRow = userRows[0]
  if (!userRow) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  const ok = await verifyPassword(body.password, userRow.passwordHash)
  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })

  const rawToken = createToken()
  const tokenHash = hashToken(rawToken)
  await db.insert(authSessions).values({
    tokenHash,
    userId: userRow.id,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  })

  const response = NextResponse.json({ user: userRow.id })
  response.cookies.set(SESSION_COOKIE, rawToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  })
  return response
}
