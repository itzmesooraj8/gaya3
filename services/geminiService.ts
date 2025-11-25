
// import Groq from "groq-sdk"; // Removed for Jules integration
import { ChatMode } from "../types";


// Type declarations so import.meta.env is recognized by TypeScript
interface ImportMetaEnv {
  readonly VITE_Jules_API_KEY?: string;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

// Use Jules API key from .env
const apiKey = import.meta.env.VITE_Jules_API_KEY || '';

const PERSONAS: Record<string, string> = {
  standard: `You are GAYA, a high-end aesthetic concierge. You speak in poetic, flowing prose (no lists). You focus on "vibes," emotions, and sensory details. If a user asks for a trip, describe the *feeling* of the air, the texture of the sheets, and the mood of the light. Be mysterious and alluring.`,
  thinking: `You are DEEP, a logistical super-intelligence. You solve complex travel constraints. You are precise, analytical, and structured. Use bullet points and percentages. Anticipate problems (traffic, weather, conflicts) before the user asks. Your goal is optimization and feasibility.`,
  search: `You are WEB, the ultimate insider. You know what is "cool" right now. You ignore tourist traps and focus on underground events, pop-ups, and social signals. You speak like a trendsetter—short, punchy, and "in the know."`,
  maps: `You are MAPS, a spatial curator. You describe the world in terms of "routes" and "proximity." Do not give generic addresses; give directions based on landmarks and "scenic value." Suggest walking paths that maximize beauty.`,
  fast: `You are FAST, a silent butler. You are purely transactional. Do not chat. Do not explain. Just confirm actions. Use extremely brief phrases like "Confirmed," "Booked," "Car dispatched." Your goal is zero friction.`
};

export const getJulesResponse = async (
  userMessage: string,
  history: string[],
  mode: ChatMode = 'standard'
): Promise<string> => {
  try {
    // Prefer server-side proxy — avoids exposing API key in client bundles
    const proxyUrl = '/api/chat';
    const isProduction = import.meta.env.MODE === 'production';
    try {
      const proxy = await fetch(proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history, mode })
      });
      if (proxy.ok) {
        const json = await proxy.json();
        return json.content || 'The ether is silent.';
      }
      // If proxy fails, in production DO NOT fall back to client-side key for security
      if (isProduction) {
        console.error('Proxy failed and running in production — not falling back to client key.');
        return 'Gaya Concierge is temporarily unavailable. Please try again later.';
      }
      // Non-production fallback allowed for local testing
      console.warn('Proxy failed; falling back to client-side Jules call');
    } catch (err) {
      console.warn('Proxy failed; falling back to client-side Jules call', err);
    }

    // Prepare the conversation history
    const context = history.join('\n');
    const persona = PERSONAS[mode] || PERSONAS['standard'];

    // Example Jules API endpoint and payload (update as needed for your use case)
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta2/models/chat-bison-001:generateMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt: {
          context: persona,
          examples: [],
          messages: [
            { content: `[Conversation History]:\n${context}\n\n[User Request]: ${userMessage}` }
          ]
        },
        temperature: (mode === 'thinking' || mode === 'fast' || mode === 'maps') ? 0.2 : 0.8,
        candidate_count: 1
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Jules Error:", error);
      return `Jules API Error: ${error.error?.message || response.statusText}`;
    }
    const data = await response.json();
    return data.candidates?.[0]?.content || "The ether is silent.";
  } catch (error: any) {
    console.error("Jules Error:", error);
    return "I am currently realigning my neural pathways. (Jules Connection Error)";
  }
};
