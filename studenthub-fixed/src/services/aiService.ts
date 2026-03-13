import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * AI Service
 * Handles AI content generation by calling Gemini directly from the frontend.
 */
export async function generateAIContent(prompt: string, signal?: AbortSignal) {
  try {
    // 1. Try Gemini directly from frontend (Mandatory per guidelines)
    // FIX 8: Correct model name (gemini-3-flash-preview does not exist)
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const text = response.text;
    
    if (text) {
      return {
        response: text,
        provider: 'Gemini',
        cached: false
      };
    }

    throw new Error("No response from Gemini");
  } catch (error: any) {
    console.warn("Gemini frontend call failed, trying backend fallback:", error.message);
    
    // 2. Fallback to backend (which might have Groq or other providers)
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
        signal // Pass the abort signal
      });

      const data = await response.json();
      
      if (data.success) {
        return {
          response: data.data.response,
          provider: data.data.provider,
          cached: data.data.cached
        };
      } else {
        throw new Error(data.message || "AI generation failed");
      }
    } catch (fallbackError: any) {
      console.error("All AI providers failed:", fallbackError.message);
      throw fallbackError;
    }
  }
}
