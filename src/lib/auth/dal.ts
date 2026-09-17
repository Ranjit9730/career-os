import "server-only"
import { cookies } from "next/headers"
import { cache } from "react"
import { eq } from "drizzle-orm"

import { db } from "@/db/client"
import { authSessions, users } from "@/db/schema"
import { SESSION_COOKIE, hashToken } from "./session"

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const tokenCookie = cookieStore.get(SESSION_COOKIE)?.value
  if (!tokenCookie) return null
  const tokenHash = hashToken(tokenCookie)
  const sessionRows = await db.select({ session: authSessions, user: users }).from(authSessions).leftJoin(users, eq(authSessions.userId, users.id)).where(eq(authSessions.tokenHash, tokenHash)).execute()
  const row = sessionRows[0]
  if (!row) return null
  const sessionRow = row.session
  const userRow = row.user
  if (!sessionRow || sessionRow.revokedAt || sessionRow.expiresAt < new Date() || !userRow) return null
  return {
    id: userRow.id,
    email: userRow.email,
    displayName: userRow.displayName,
    setupCompleted: userRow.setupCompleted,
  }
}
