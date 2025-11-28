import crypto from 'node:crypto';
import Redis from 'ioredis';

// Constants (Must be defined before use)
const DEFAULT_RATE_LIMIT = Number(process.env.RATE_LIMIT_PER_MIN || 60);
const DEFAULT_RATE_WINDOW = Number(process.env.RATE_LIMIT_WINDOW_SEC || 60);
const DEFAULT_CACHE_TTL = Number(process.env.CACHE_TTL || 60);
const MAX_MESSAGE_LENGTH = Number(process.env.MAX_MESSAGE_LENGTH || 2000);
const MAX_HISTORY_ITEMS = Number(process.env.MAX_HISTORY_ITEMS || 20);

// In-memory fallback structures (use Redis in production for reliability)
const MEMORY_RATE_LIMITS = new Map<string, { count: number; expiresAt: number }>();
const MEMORY_CACHE = new Map<string, { content: string; expiresAt: number }>();

const PERSONAS: Record<string, string> = {
  standard: `You are GAYA, a high-end aesthetic concierge. You speak in poetic, flowing prose (no lists). You focus on "vibes," emotions, and sensory details. If a user asks for a trip, describe the *feeling* of the air, the texture of the sheets, and the mood of the light. Be mysterious and alluring.`,
  thinking: `You are DEEP, a logistical super-intelligence. You solve complex travel constraints. You are precise, analytical, and structured. Use bullet points and percentages. Anticipate problems (traffic, weather, conflicts) before the user asks. Your goal is optimization and feasibility.`,
  search: `You are WEB, the ultimate insider. You know what is "cool" right now. You ignore tourist traps and focus on underground events, pop-ups, and social signals. You speak like a trendsetter—short, punchy, and "in the know."`,
  maps: `You are MAPS, a spatial curator. You describe the world in terms of "routes" and "proximity." Do not give generic addresses; give directions based on landmarks and "scenic value." Suggest walking paths that maximize beauty.`,
  fast: `You are FAST, a silent butler. You are purely transactional. Do not chat. Do not explain. Just confirm actions. Use extremely brief phrases like "Confirmed," "Booked," "Car dispatched." Your goal is zero friction.`
};

let redisClient: Redis | null = null;
if (process.env.REDIS_URL) {
  redisClient = new Redis(process.env.REDIS_URL);
}

function getRequesterKey(req: any): string {
  // Prefer an authenticated user id header if provided, otherwise fallback to IP
  const userIdHeader = req.headers['x-user-id'] || req.headers['authorization'];
  if (userIdHeader) return userIdHeader.toString();
  const header = req.headers['x-forwarded-for'] || req.headers['x-real-ip'];
  if (header) return header.toString().split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

function sanitizeMessage(input: string) {
  if (!input || typeof input !== 'string') return '';
  // Remove null characters and tags
  const stripped = input.replace(/\0/g, '').replace(/<[^>]*>/g, '');
  return stripped.trim();
}

function generateKeyHash(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

async function checkRateLimit(ip: string, limit = DEFAULT_RATE_LIMIT, windowSeconds = DEFAULT_RATE_WINDOW) {
  if (redisClient) {
    const windowKey = `rl:${ip}:${Math.floor(Date.now() / 1000 / windowSeconds)}`;
    const count = await redisClient.incr(windowKey);
    if (count === 1) await redisClient.expire(windowKey, windowSeconds);
    return count <= limit;
  }
  const now = Date.now();
  const entry = MEMORY_RATE_LIMITS.get(ip);
  if (!entry || now > entry.expiresAt) {
    MEMORY_RATE_LIMITS.set(ip, { count: 1, expiresAt: now + windowSeconds * 1000 });
    return true;

  import crypto from 'node:crypto';
  import Redis from 'ioredis';

  // Serverless API endpoint to proxy Jules/Google generative language calls.

  const PERSONAS: Record<string, string> = {
    standard: `You are GAYA, a high-end aesthetic concierge. Speak in poetic, flowing prose.`,
    thinking: `You are DEEP, a logistical super-intelligence. Be precise.`,
    search: `You are WEB, the ultimate insider.`,
    maps: `You are MAPS, a spatial curator.`,
    fast: `You are FAST, a silent butler. Be purely transactional.`
  };

  // Constants (Must be defined before use)
  const DEFAULT_RATE_LIMIT = 60;
  const DEFAULT_RATE_WINDOW = 60;
  const DEFAULT_CACHE_TTL = 60;
  const MAX_MESSAGE_LENGTH = 2000;
  const MAX_HISTORY_ITEMS = 20;

  // In-memory fallback (use Redis in production)
  const MEMORY_RATE_LIMITS = new Map<string, { count: number; expiresAt: number }>();
  const MEMORY_CACHE = new Map<string, { content: string; expiresAt: number }>();

  let redisClient: Redis | null = null;
  if (process.env.REDIS_URL) {
    redisClient = new Redis(process.env.REDIS_URL);
  }

  function getRequesterKey(req: any): string {
    const userIdHeader = req.headers['x-user-id'] || req.headers['authorization'];
    if (userIdHeader) return userIdHeader.toString();
    const header = req.headers['x-forwarded-for'] || req.headers['x-real-ip'];
    if (header) return header.toString().split(',')[0].trim();
    return 'unknown-ip';
  }

  function sanitizeMessage(input: string) {
    if (!input || typeof input !== 'string') return '';
    return input.replace(/\0/g, '').replace(/<[^>]*>/g, '').trim();
  }

  function generateKeyHash(value: string) {
    return crypto.createHash('sha256').update(value).digest('hex');
  }

  async function checkRateLimit(ip: string, limit = DEFAULT_RATE_LIMIT, windowSeconds = DEFAULT_RATE_WINDOW) {
    if (redisClient) {
      const windowKey = `rl:${ip}:${Math.floor(Date.now() / 1000 / windowSeconds)}`;
      const count = await redisClient.incr(windowKey);
      if (count === 1) await redisClient.expire(windowKey, windowSeconds);
      return count <= limit;
    }
    const now = Date.now();
    const entry = MEMORY_RATE_LIMITS.get(ip);
    if (!entry || now > entry.expiresAt) {
      MEMORY_RATE_LIMITS.set(ip, { count: 1, expiresAt: now + windowSeconds * 1000 });
      return true;
    }
    entry.count += 1;
    return entry.count <= limit;
  }

  async function getCachedResponse(key: string) {
    if (redisClient) {
      const raw = await redisClient.get(key);
      return raw ? JSON.parse(raw) : null;
    }
    const mem = MEMORY_CACHE.get(key);
    if (!mem) return null;
    if (Date.now() > mem.expiresAt) {
      MEMORY_CACHE.delete(key);
      return null;
    }
    return { content: mem.content };
  }

  async function setCachedResponse(key: string, content: string, ttl = DEFAULT_CACHE_TTL) {
    if (redisClient) {
      await redisClient.set(key, JSON.stringify({ content }), 'EX', ttl);
      return;
    }
    MEMORY_CACHE.set(key, { content, expiresAt: Date.now() + ttl * 1000 });
  }

  export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const requesterKey = getRequesterKey(req);
    const { message, history = [], mode = 'standard' } = req.body || {};

    if (!message) return res.status(400).json({ error: 'Missing message' });
    if ((history || []).length > MAX_HISTORY_ITEMS) return res.status(400).json({ error: 'History too long' });

    const sanitizedMessage = sanitizeMessage(message);
    if (sanitizedMessage.length > MAX_MESSAGE_LENGTH) return res.status(400).json({ error: 'Message too long' });

    const allowed = await checkRateLimit(requesterKey);
    if (!allowed) return res.status(429).json({ error: 'Too many requests' });

    const keySource = `${sanitizedMessage}::${(history || []).join('\n')}::${mode}`;
    const cacheKey = `cache:${generateKeyHash(keySource)}`;
  
    const cached = await getCachedResponse(cacheKey);
    if (cached) return res.status(200).json({ content: cached.content, cached: true });

    // USE SERVER-SIDE KEY
    const apiKey = process.env.JULES_API_KEY || process.env.GENAI_KEY || process.env.VITE_GEMINI_API_KEY;
  
    if (!apiKey) {
      console.error('Missing API Key on Server');
      return res.status(500).json({ error: 'Server configuration error (API Key)' });
    }

    try {
      // Call Google Gemini
      const persona = (PERSONAS as any)[mode] || PERSONAS.standard;
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `[System]: ${persona}\n[History]: ${(history||[]).join('\n')}\n[User]: ${sanitizedMessage}` }]
          }]
        })
      });
    
      const data = await resp.json();
      if (!resp.ok) return res.status(502).json({ error: data?.error?.message || 'Gemini API error' });

      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'The ether is silent.';
    
      await setCachedResponse(cacheKey, content);
      return res.status(200).json({ content, cached: false });

    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

    // USE SERVER-SIDE KEY
    const apiKey = process.env.JULES_API_KEY || process.env.GENAI_KEY || process.env.VITE_GEMINI_API_KEY;
  
    if (!apiKey) {
      console.error('Missing API Key on Server');
      return res.status(500).json({ error: 'Server configuration error (API Key)' });
    }

    try {
      // Call Google Gemini
      const persona = (PERSONAS as any)[mode] || PERSONAS.standard;
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `[System]: ${persona}\n[History]: ${(history||[]).join('\n')}\n[User]: ${sanitizedMessage}` }]
          }]
        })
      });
    
      const data = await resp.json();
      if (!resp.ok) return res.status(502).json({ error: data?.error?.message || 'Gemini API error' });

      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'The ether is silent.';
    
      await setCachedResponse(cacheKey, content);
      return res.status(200).json({ content, cached: false });

    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
