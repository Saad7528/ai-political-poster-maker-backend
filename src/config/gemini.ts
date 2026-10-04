import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

export class GeminiKeyManager {
  private apiKeys: string[] = [];
  private currentIndex: number = 0;

  constructor() {
    const keysEnv = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || '';
    this.apiKeys = keysEnv
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    if (this.apiKeys.length === 0) {
      console.warn('⚠️ No Gemini API keys found. Operating in local fallback mode.');
    } else {
      console.log(`🤖 Gemini AI Key Manager initialized with ${this.apiKeys.length} active key(s).`);
    }
  }

  getClient(): { client: GoogleGenerativeAI; keyIndex: number } | null {
    if (this.apiKeys.length === 0) return null;
    const key = this.apiKeys[this.currentIndex];
    const client = new GoogleGenerativeAI(key);
    const keyIndex = this.currentIndex;
    this.currentIndex = (this.currentIndex + 1) % this.apiKeys.length;
    return { client, keyIndex };
  }

  async executeWithFailover<T>(operation: (ai: GoogleGenerativeAI) => Promise<T>): Promise<T> {
    if (this.apiKeys.length === 0) {
      throw new Error('No Gemini API keys configured.');
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.apiKeys.length; attempt++) {
      const activeKeyIndex = (this.currentIndex + attempt) % this.apiKeys.length;
      const key = this.apiKeys[activeKeyIndex];

      try {
        const ai = new GoogleGenerativeAI(key);
        const result = await operation(ai);
        this.currentIndex = (activeKeyIndex + 1) % this.apiKeys.length;
        return result;
      } catch (err: unknown) {
        const errObj = err instanceof Error ? err : new Error(String(err));
        console.warn(`⚠️ Gemini API Key [Index ${activeKeyIndex}] failed: ${errObj.message}. Trying next key...`);
        lastError = errObj;
      }
    }

    throw new Error(
      `All ${this.apiKeys.length} Gemini API keys failed. Last error: ${lastError?.message || 'Unknown'}`
    );
  }
}

export const geminiManager = new GeminiKeyManager();
