import { db } from "@/db/client"
import { decryptSecret } from "@/lib/secrets/encryption"

export interface ProviderConfig {
  providerId: string
  model: string
  baseUrl?: string
}

export function buildOpenRouterPayload(config: ProviderConfig, prompt: string, system?: string) {
  return {
    model: config.model,
    messages: [
      ...(system ? [{ role: "system", content: system }] : []),
      { role: "user", content: prompt },
    ],
  }
}
