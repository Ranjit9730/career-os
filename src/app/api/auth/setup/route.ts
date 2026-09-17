import { NextResponse } from "next/server"
import { hashPassword } from "@/lib/auth/password"
import { createToken, hashToken, SESSION_COOKIE } from "@/lib/auth/session"
import { db } from "@/db/client"
import { users, authSessions } from "@/db/schema"

export async function POST(request: Request) {
  const body = await request.json()
  const setupCode = process.env.SETUP_CODE
  if (!setupCode || body.setupCode !== setupCode) {
    return NextResponse.json({ error: "Invalid setup code" }, { status: 403 })
  }
  const existing = await db
    .select({ id: users.id, email: users.email, displayName: users.displayName })
    .from(users)
    .execute()
  if (existing.length > 0) {
    return NextResponse.json({ error: "User exists" }, { status: 409 })
  }
  const hash = await hashPassword(body.password)
  const [user] = await db.insert(users).values({
    email: body.email,
    passwordHash: hash,
    displayName: body.displayName ?? body.email,
    setupCompleted: true,
  }).returning({ id: users.id, email: users.email, displayName: users.displayName })

  const rawToken = createToken()
  const tokenHash = hashToken(rawToken)
  await db.insert(authSessions).values({
    tokenHash,
    userId: user.id,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  })

  const response = NextResponse.json({ user: user.id })
  response.cookies.set(SESSION_COOKIE, rawToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  })
  return response
}
