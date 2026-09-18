import { executeOpenRouter } from "./providers"
import { getAiProviders, getAiProviderKeys, getDecryptedProviderKey } from "./provider-manager"

export const AIService = {
  async generate(opts: { userId: string; prompt: string; system?: string }) {
    const providers = await getAiProviders(opts.userId)
    const enabledProvider = providers.find(p => p.enabled)

    if (!enabledProvider) {
      throw new Error("No AI provider configured")
    }

    if (enabledProvider.provider === "openrouter") {
      const keys = await getAiProviderKeys(enabledProvider.id)
      const enabledKey = keys.find(k => k.status === "ENABLED")
      const apiKey = enabledKey ? await getDecryptedProviderKey(enabledKey.id) : process.env.OPENROUTER_API_KEY || ""
      const config = {
        providerId: enabledProvider.provider,
        model: enabledProvider.model,
        baseUrl: enabledProvider.baseUrl ?? undefined,
      }
      const result = await executeOpenRouter(config, opts.prompt, opts.system, apiKey || undefined)
      if (!result.success) {
        throw new Error(`OpenRouter request failed: ${result.error}`)
      }
      return result.content
    }

    throw new Error(`Provider ${enabledProvider.provider} not yet implemented`)
  },

  async generateStructured(opts: { userId: string; prompt: string; schema?: unknown }) {
    return await this.generate({ ...opts })
  },

  async embed(opts: { userId: string; text: string }) {
    const providers = await getAiProviders(opts.userId)
    const enabledProvider = providers.find(p => p.enabled)

    if (!enabledProvider) {
      throw new Error("No AI provider configured")
    }

    if (enabledProvider.provider === "openrouter") {
      const keys = await getAiProviderKeys(enabledProvider.id)
      const enabledKey = keys.find(k => k.status === "ENABLED")
      const apiKey = enabledKey ? await getDecryptedProviderKey(enabledKey.id) : process.env.OPENROUTER_API_KEY || ""
      const config = {
        providerId: enabledProvider.provider,
        model: enabledProvider.model,
        baseUrl: enabledProvider.baseUrl ?? undefined,
      }
      const result = await executeOpenRouter(config, opts.text, undefined, apiKey || undefined)
      if (!result.success) {
        throw new Error(`OpenRouter embedding request failed: ${result.error}`)
      }
      return { embedding: result.content ? result.content.split(",").map(s => parseFloat(s.trim()) || 0).filter(n => !isNaN(n)) : [0] }
    }

    throw new Error(`Provider ${enabledProvider.provider} not yet implemented for embeddings`)
  },

  async classify(opts: { userId: string; text: string }) {
    const providers = await getAiProviders(opts.userId)
    const enabledProvider = providers.find(p => p.enabled)

    if (!enabledProvider) {
      return { label: "UNKNOWN", confidence: 0, reasoning: "No AI provider configured", evidence: null }
    }

    if (enabledProvider.provider === "openrouter") {
      try {
        const keys = await getAiProviderKeys(enabledProvider.id)
        const enabledKey = keys.find(k => k.status === "ENABLED")
        const apiKey = enabledKey ? await getDecryptedProviderKey(enabledKey.id) : process.env.OPENROUTER_API_KEY || ""
        const config = {
          providerId: enabledProvider.provider,
          model: enabledProvider.model,
          baseUrl: enabledProvider.baseUrl ?? undefined,
        }
        const result = await executeOpenRouter(config, `Classify the following text into a job type, role family, seniority, skill category, or evidence type. Return structured JSON with label, confidence (0-1), reasoning, and evidence. Text: "${opts.text}"`, undefined, apiKey || undefined)
        if (!result.success) {
          return { label: "UNKNOWN", confidence: 0, reasoning: `Provider error: ${result.error}`, evidence: null }
        }
        const parsed = JSON.parse(result.content || "{}")
        return {
          label: parsed.label || "UNKNOWN",
          confidence: parsed.confidence ?? 0,
          reasoning: parsed.reasoning ?? result.content ?? "No reasoning provided",
          evidence: parsed.evidence || null,
        }
      } catch (e: any) {
        return { label: "UNKNOWN", confidence: 0, reasoning: `Parse error: ${e.message || String(e)}`, evidence: null }
      }
    }

    return { label: "UNKNOWN", confidence: 0, reasoning: `Provider ${enabledProvider.provider} not yet implemented for classification`, evidence: null }
  },
}
