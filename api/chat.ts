// Serverless API endpoint to proxy Jules/Google generative language calls.
// This keeps your API key safe and prevents exposing it in the client bundle.
// Vercel: Place this file into `api/` to become a serverless function.
const PERSONAS = {
  standard: `You are GAYA, a high-end aesthetic concierge. You speak in poetic, flowing prose (no lists). You focus on "vibes," emotions, and sensory details. If a user asks for a trip, describe the *feeling* of the air, the texture of the sheets, and the mood of the light. Be mysterious and alluring.`,
  thinking: `You are DEEP, a logistical super-intelligence. You solve complex travel constraints. You are precise, analytical, and structured. Use bullet points and percentages. Anticipate problems (traffic, weather, conflicts) before the user asks. Your goal is optimization and feasibility.`,
  search: `You are WEB, the ultimate insider. You know what is "cool" right now. You ignore tourist traps and focus on underground events, pop-ups, and social signals. You speak like a trendsetter—short, punchy, and "in the know."`,
  maps: `You are MAPS, a spatial curator. You describe the world in terms of "routes" and "proximity." Do not give generic addresses; give directions based on landmarks and "scenic value." Suggest walking paths that maximize beauty.`,
  fast: `You are FAST, a silent butler. You are purely transactional. Do not chat. Do not explain. Just confirm actions. Use extremely brief phrases like "Confirmed," "Booked," "Car dispatched." Your goal is zero friction.`
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message, history = [], mode = 'standard' } = req.body || {};
  if (!message) return res.status(400).json({ error: 'Missing message' });

  const apiKey = process.env.JULES_API_KEY || process.env.GENAI_KEY || '';
  if (!apiKey) return res.status(500).json({ error: 'Server-side JULES_API_KEY missing' });

  try {
    const persona = (PERSONAS as any)[mode] || PERSONAS['standard'];
    const context = (history || []).join('\n');
    const body = {
      prompt: {
        context: persona,
        examples: [],
        messages: [
          { content: `[Conversation History]:\n${context}\n\n[User Request]: ${message}` }
        ]
      },
      temperature: (mode === 'thinking' || mode === 'fast' || mode === 'maps') ? 0.2 : 0.8,
      candidate_count: 1
    };

    const resp = await fetch('https://generativelanguage.googleapis.com/v1beta2/models/chat-bison-001:generateMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });

    const data = await resp.json();
    if (!resp.ok) {
      console.error('Jules API error (server):', data);
      return res.status(502).json({ error: data?.error?.message || 'Upstream Jules API error' });
    }
    const content = data.candidates?.[0]?.content || 'The ether is silent.';
    return res.status(200).json({ content });
  } catch (err: any) {
    console.error('Server /api/chat error', err);
    return res.status(500).json({ error: err?.message || 'Unknown server error' });
  }
}
