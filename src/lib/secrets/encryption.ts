import "server-only"
import { randomBytes, createCipheriv, createDecipheriv, scryptSync } from "node:crypto"

function getEncryptionKey(): Buffer {
  const raw = process.env.AI_ENCRYPTION_KEY
  if (!raw) throw new Error("AI_ENCRYPTION_KEY is required")
  const buf = Buffer.from(raw, "base64")
  if (buf.length !== 32) throw new Error("AI_ENCRYPTION_KEY must be a base64-encoded 32-byte value (AES-256)")
  return buf
}

export function encryptSecret(plaintext: string): string {
  const iv = randomBytes(16)
  const cipher = createCipheriv("aes-256-gcm", getEncryptionKey(), iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()
  return `v1:${iv.toString("base64")}:${encrypted.toString("base64")}:${tag.toString("base64")}`
}

export function decryptSecret(ciphertext: string): string {
  if (!ciphertext.startsWith("v1:")) throw new Error("Invalid encrypted secret format")
  const parts = ciphertext.slice(3).split(":")
  if (parts.length !== 3) throw new Error("Invalid encrypted secret format")
  const [ivB64, dataB64, tagB64] = parts
  const iv = Buffer.from(ivB64, "base64")
  const data = Buffer.from(dataB64, "base64")
  const tag = Buffer.from(tagB64, "base64")
  const decipher = createDecipheriv("aes-256-gcm", getEncryptionKey(), iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8")
}
