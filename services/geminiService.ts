import { GoogleGenAI } from "@google/genai";
import { ChatMode } from "../types";

// 1. Load Key safely for Vite
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const PERSONAS: Record<string, string> = {
  GAYA: `You are GAYA, a high-end aesthetic concierge. Speak in poetic, flowing prose. Focus on vibes, emotions, and sensory details.`,
  DEEP: `You are DEEP, a logistical super-intelligence. Be precise, analytical, and structured. Use bullet points.`,
  WEB: `You are WEB, the ultimate insider. You know what is cool right now. Speak like a trendsetter—short, punchy.`,
  MAPS: `You are MAPS, a spatial curator. Describe the world in terms of routes and proximity.`,
  FAST: `You are FAST, a silent butler. Be purely transactional. Use extremely brief phrases like 'Confirmed', 'Booked'.`
};

export const getGeminiResponse = async (
  userMessage: string,
  history: string[],
  mode: ChatMode = 'standard'
): Promise<string> => {
  try {
    // 2. Safety Check
    if (!apiKey) {
      return "I cannot connect to the ether. (Missing API Key in .env)";
    }

    // 3. Prepare Persona
    // Map app ChatMode values to persona keys used here
    const modeMap: Record<string, string> = {
      standard: 'GAYA',
      thinking: 'DEEP',
      search: 'WEB',
      maps: 'MAPS',
      fast: 'FAST'
    };
    const personaKey = (mode && modeMap[mode]) ? modeMap[mode] : 'GAYA';
    const systemInstruction = PERSONAS[personaKey];
    
    // 4. Prepare Context (Combine history into one block for simplicity)
    const context = history.join('\n');
    const fullPrompt = `
      [System Persona]: ${systemInstruction}
      [Conversation History]: ${context}
      [User Request]: ${userMessage}
    `;

    // 5. Call Google API (Using the FREE model: gemini-1.5-flash)
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        { 
          role: 'user', 
          parts: [{ text: fullPrompt }] 
        }
      ],
      config: {
        temperature: (personaKey === 'DEEP' || personaKey === 'FAST') ? 0.2 : 0.8,
      }
    });

    return response.text() || "The ether is silent.";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return `I am currently realigning my neural pathways. (${error.message})`;
  }
};
