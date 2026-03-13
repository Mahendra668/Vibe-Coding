import { useState, useEffect, useRef, useCallback } from 'react';
import { generateAIContent } from '../services/aiService';

interface AIState {
  result: string | null;
  isLoading: boolean;
  error: string | null;
  provider?: string;
  cached?: boolean;
}

export function useAI() {
  const [state, setState] = useState<AIState>({
    result: null,
    isLoading: false,
    error: null,
  });
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState({
      result: null,
      isLoading: false,
      error: null,
    });
  }, []);

  const generate = useCallback(async (prompt: string, template?: (input: string) => string) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const finalPrompt = template ? template(prompt) : prompt;

    try {
      const data = await generateAIContent(finalPrompt, abortControllerRef.current.signal);
      setState({
        result: data.response,
        isLoading: false,
        error: null,
        provider: data.provider,
        cached: data.cached
      });
      return data;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return null;
      }
      setState({
        result: null,
        isLoading: false,
        error: err.message || 'Failed to generate content',
      });
      throw err;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    generate,
    reset,
  };
}
