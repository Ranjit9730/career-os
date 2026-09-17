import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto"

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex")
  const buffer = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 })
  return `${salt}:${buffer.toString("base64")}`
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  const [salt, stored] = hash.split(":")
  if (!salt || !stored) return false
  const buffer = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 })
  const storedBuffer = Buffer.from(stored, "base64")
  return storedBuffer.length === buffer.length && timingSafeEqual(storedBuffer, buffer)
}
