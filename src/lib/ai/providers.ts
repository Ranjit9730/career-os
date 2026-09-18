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

export async function executeOpenRouter(
  config: ProviderConfig,
  prompt: string,
  system?: string,
  key?: string
): Promise<{ content: string; usage?: any; latencyMs: number; success: boolean; error?: string }> {
  const start = Date.now()
  try {
    const apiKey = key || process.env.OPENROUTER_API_KEY || ""
    const endpoint = config.baseUrl || "https://openrouter.ai/api/v1/chat/completions"
    const payload = buildOpenRouterPayload(config, prompt, system)
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://career-os.app",
        "X-Title": "Career OS",
      },
      body: JSON.stringify(payload),
    })
    const latencyMs = Date.now() - start
    if (!res.ok) {
      const errText = await res.text()
      return { content: "", usage: {}, latencyMs, success: false, error: `HTTP ${res.status}: ${res.statusText}` }
    }
    const data = await res.json()
    const content = data?.choices?.[0]?.message?.content || ""
    return { content, usage: data?.usage || {}, latencyMs, success: true }
  } catch (e: any) {
    const latencyMs = Date.now() - start
    return { content: "", usage: {}, latencyMs, success: false, error: e.message || String(e) }
  }
}
