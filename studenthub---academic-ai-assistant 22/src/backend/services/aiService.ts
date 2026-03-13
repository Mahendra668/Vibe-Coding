import { GoogleGenAI } from "@google/genai";
import { askGroq } from "../providers/groq.ts";

// Simple in-memory cache
const cache = new Map<string, { response: string; provider: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export class AIService {
  private ai: GoogleGenAI;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async generateContent(prompt: string) {
    // Check cache
    const cached = cache.get(prompt);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log("Returning cached response");
      return { response: cached.response, cached: true, provider: cached.provider + ' (Cached)' };
    }

    // 1. Try Gemini
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const text = response.text || "No response generated";
      
      // Store in cache
      cache.set(prompt, { response: text, provider: 'Gemini', timestamp: Date.now() });

      return { response: text, cached: false, provider: 'Gemini' };
    } catch (error: any) {
      console.warn("Gemini failed, trying Groq fallback:", error.message);
      
      // 2. Try Groq Fallback
      try {
        const text = await askGroq(prompt);
        
        // Store in cache
        cache.set(prompt, { response: text, provider: 'Groq', timestamp: Date.now() });

        return { response: text, cached: false, provider: 'Groq' };
      } catch (groqError: any) {
        console.error("All AI providers failed:", groqError.message);
        throw new Error("AI service temporarily unavailable. Please try again later.");
      }
    }
  }
}

export const aiService = new AIService();
