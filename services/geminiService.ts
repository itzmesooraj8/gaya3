import { GoogleGenAI } from "@google/genai";
import { ChatMode } from "../types";

// 1. Retrieve the forced global key
// @ts-ignore
const apiKey = __APP_GEMINI_API_KEY__;

const ai = new GoogleGenAI({ apiKey });

const PERSONAS: Record<string, string> = {
  standard: `You are GAYA, a high-end aesthetic concierge. Speak in poetic, flowing prose.`,
  thinking: `You are DEEP, a logistical super-intelligence. Be precise.`,
  search: `You are WEB, the ultimate insider.`,
  maps: `You are MAPS, a spatial curator.`,
  fast: `You are FAST, a silent butler. Be purely transactional.`
};

export const getGeminiResponse = async (
  userMessage: string,
  history: string[],
  mode: ChatMode = 'standard'
): Promise<string> => {
  try {
    if (!apiKey) {
      console.error("API Key missing in service");
      return "I cannot connect to the ether. (Key Missing)";
    }

    const modeMap: Record<string, string> = {
      standard: 'GAYA', thinking: 'DEEP', search: 'WEB', maps: 'MAPS', fast: 'FAST'
    };
    
    const personaKey = (mode && modeMap[mode]) ? modeMap[mode] : 'GAYA';
    const systemInstruction = PERSONAS[mode] || PERSONAS.standard; // Fallback fix
    
    const context = history.join('\n');
    const fullPrompt = `
      [System Persona]: ${systemInstruction}
      [Conversation History]: ${context}
      [User Request]: ${userMessage}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
    });

    return response.text || "The ether is silent.";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return `I am currently realigning my neural pathways. (${error.message})`;
  }
};
