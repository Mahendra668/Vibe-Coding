import { askGroq } from "../providers/groq.ts";

// Simple in-memory cache
const cache = new Map<string, { response: string; provider: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export class AIService {
  async generateContent(prompt: string) {
    // Check cache
    const cached = cache.get(prompt);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log("Returning cached response");
      return { response: cached.response, cached: true, provider: cached.provider + ' (Cached)' };
    }

    // Backend now only handles Groq fallback (Gemini is handled on frontend)
    try {
      const text = await askGroq(prompt);
      
      // Store in cache
      cache.set(prompt, { response: text, provider: 'Groq', timestamp: Date.now() });

      return { response: text, cached: false, provider: 'Groq' };
    } catch (groqError: any) {
      console.error("Groq provider failed:", groqError.message);
      throw new Error("AI service temporarily unavailable. Please try again later.");
    }
  }
}

export const aiService = new AIService();
