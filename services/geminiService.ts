
import Groq from "groq-sdk";
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

// Initialize Groq Client with the key from .env
const apiKey = import.meta.env.VITE_Jules_API_KEY || '';
const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

const PERSONAS: Record<string, string> = {
  standard: `You are GAYA, a high-end aesthetic concierge. You speak in poetic, flowing prose (no lists). You focus on "vibes," emotions, and sensory details. If a user asks for a trip, describe the *feeling* of the air, the texture of the sheets, and the mood of the light. Be mysterious and alluring.`,
  thinking: `You are DEEP, a logistical super-intelligence. You solve complex travel constraints. You are precise, analytical, and structured. Use bullet points and percentages. Anticipate problems (traffic, weather, conflicts) before the user asks. Your goal is optimization and feasibility.`,
  search: `You are WEB, the ultimate insider. You know what is "cool" right now. You ignore tourist traps and focus on underground events, pop-ups, and social signals. You speak like a trendsetter—short, punchy, and "in the know."`,
  maps: `You are MAPS, a spatial curator. You describe the world in terms of "routes" and "proximity." Do not give generic addresses; give directions based on landmarks and "scenic value." Suggest walking paths that maximize beauty.`,
  fast: `You are FAST, a silent butler. You are purely transactional. Do not chat. Do not explain. Just confirm actions. Use extremely brief phrases like "Confirmed," "Booked," "Car dispatched." Your goal is zero friction.`
};

export const getGeminiResponse = async (
  userMessage: string, 
  history: string[], 
  mode: ChatMode = 'standard'
): Promise<string> => {
  try {
    if (!apiKey) {
      console.error("CRITICAL: Groq API Key is missing!");
      return "I cannot connect to the ether. (Missing API Key)";
    }

    // Prepare the conversation history
    const context = history.join('\n');

    const persona = PERSONAS[mode] || PERSONAS['standard'];
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: persona
        },
        {
          role: "user",
          content: `[Conversation History]:\n${context}\n\n[User Request]: ${userMessage}`
        }
      ],
      // Llama 3 70B is free on Groq and very smart
      model: "mixtral-8x7b-32768", 
      
      // Creative for Gaya, Precise for Deep/Fast
      temperature: (mode === 'thinking' || mode === 'fast' || mode === 'maps') ? 0.2 : 0.8,
      max_tokens: 1024,
    });

    return chatCompletion.choices[0]?.message?.content || "The ether is silent.";
  } catch (error: any) {
    console.error("Groq Error:", error);
    return "I am currently realigning my neural pathways. (Groq Connection Error)";
  }
};
