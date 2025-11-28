import { GoogleGenAI } from "@google/genai";
import { ChatMode } from "../types";

// SAFE KEY LOADING:
let apiKey = '';
try {
  // @ts-ignore
  if (typeof __APP_GEMINI_API_KEY__ !== 'undefined') {
    // @ts-ignore
    apiKey = __APP_GEMINI_API_KEY__;
  }
} catch (e) {
  console.warn("Build-time API key not found, falling back to runtime env.");
}

if (!apiKey) {
  apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
}

const ai = new GoogleGenAI({ apiKey });

const PERSONAS: Record<string, string> = {
  standard: `You are GAYA, a high-end aesthetic concierge. Speak in poetic, flowing prose. Focus on vibes, emotions, and sensory details.`,
  thinking: `You are DEEP, a logistical super-intelligence. Be precise, analytical, and structured. Use bullet points.`,
  search: `You are WEB, the ultimate insider. You know what is cool right now. Speak like a trendsetter—short, punchy.`,
  maps: `You are MAPS, a spatial curator. Describe the world in terms of routes and proximity.`,
  fast: `You are FAST, a silent butler. Be purely transactional. Use extremely brief phrases like 'Confirmed', 'Booked'.`
};

export const getGeminiResponse = async (
  userMessage: string,
  history: string[],
  mode: ChatMode = 'standard'
): Promise<string> => {
  try {
    if (!apiKey) {
      console.error("CRITICAL: API Key is missing in the browser!");
      return "I cannot connect to the ether. (System Error: API Key Missing)";
    }

    const modeMap: Record<string, string> = {
      standard: 'GAYA', thinking: 'DEEP', search: 'WEB', maps: 'MAPS', fast: 'FAST'
    };
    const personaKey = (mode && modeMap[mode]) ? modeMap[mode] : 'GAYA';
    const systemInstruction = PERSONAS[personaKey];
    
    const context = history.join('\n');
    const fullPrompt = `
      [System Persona]: ${systemInstruction}
      [Conversation History]: ${context}
      [User Request]: ${userMessage}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        { 
          role: 'user', 
          parts: [{ text: fullPrompt }] 
        }
      ],
    });

    return response.text || "The ether is silent.";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return `I am currently realigning my neural pathways. (${error.message})`;
  }
};
