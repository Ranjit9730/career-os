import { buildOpenRouterPayload } from "./providers"
import { getAiProviders } from "./provider-manager"

export const AIService = {
  async generate(opts: { userId: string; prompt: string; system?: string }) {
    const providers = await getAiProviders(opts.userId)
    const enabledProvider = providers.find(p => p.enabled)

    if (!enabledProvider) {
      throw new Error("No AI provider configured")
    }

    if (enabledProvider.provider === "openrouter") {
      const config = { providerId: enabledProvider.provider, model: enabledProvider.model, baseUrl: enabledProvider.baseUrl ?? undefined }
      return buildOpenRouterPayload(config, opts.prompt, opts.system)
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
      const config = { providerId: enabledProvider.provider, model: enabledProvider.model, baseUrl: enabledProvider.baseUrl ?? undefined }
      return { embedding: [0] }
    }

    throw new Error(`Provider ${enabledProvider.provider} not yet implemented for embeddings`)
  },

  async classify(opts: { userId: string; text: string }) {
    const providers = await getAiProviders(opts.userId)
    const enabledProvider = providers.find(p => p.enabled)

    if (!enabledProvider) {
      return { label: "UNKNOWN", confidence: 0, reasoning: "No AI provider configured" }
    }

    if (enabledProvider.provider === "openrouter") {
      const config = { providerId: enabledProvider.provider, model: enabledProvider.model, baseUrl: enabledProvider.baseUrl ?? undefined }
      return { label: "UNKNOWN", confidence: 0, reasoning: "Classification not yet implemented" }
    }

    return { label: "UNKNOWN", confidence: 0, reasoning: `Provider ${enabledProvider.provider} not yet implemented for classification` }
  },
}