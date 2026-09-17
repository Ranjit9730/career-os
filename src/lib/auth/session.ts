import { randomBytes, createHmac } from "node:crypto"
import "server-only"

export const SESSION_COOKIE = "careeros_session"
export const SESSION_MAX_AGE_DAYS = 30

export function createToken(): string {
  return randomBytes(32).toString("base64url")
}

export function hashToken(token: string): string {
  return createHmac("sha256", process.env.SESSION_ENCRYPTION_KEY ?? "dev").update(token).digest("base64url")
}
