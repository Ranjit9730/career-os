import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/db/client"
import { authSessions } from "@/db/schema"
import { eq } from "drizzle-orm"
import { hashToken, SESSION_COOKIE } from "@/lib/auth/session"

export async function POST() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (token) {
    const tokenHash = hashToken(token)
    await db.update(authSessions)
      .set({ revokedAt: new Date() })
      .where(eq(authSessions.tokenHash, tokenHash))
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  })
  return response
}