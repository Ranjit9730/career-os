import { buildOpenRouterPayload } from "./providers"

export const AIService = {
  async generate(opts: { userId: string; prompt: string; system?: string }) {
    const config = { providerId: "openrouter", model: "mistralai/mistral-7b-instruct" }
    return buildOpenRouterPayload(config, opts.prompt, opts.system)
  },
  async generateStructured(opts: { userId: string; prompt: string; schema?: unknown }) {
    return await this.generate({ ...opts })
  },
  async embed(opts: { userId: string; text: string }) {
    return { embedding: [0] }
  },
  async classify(opts: { userId: string; text: string }) {
    return { label: "UNKNOWN", confidence: 0, reasoning: "No AI provider configured" }
  },
}
