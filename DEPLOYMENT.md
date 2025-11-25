Deployment & Security Notes
===========================

This document lists the required environment variables, deployment notes, and security considerations for running Gaya3 in production (Vercel recommended).

1) Environment Variables
------------------------
Add these variables to your Vercel Project settings (or in your production host):

- JULES_API_KEY: (required) - Server-side Google Generative Language (Jules) API key; **store this in production only**.
- REDIS_URL: (optional) - If you use a Redis provider (e.g., Upstash), set this for reliable rate-limiting and caching.
- RATE_LIMIT_PER_MIN: (optional) - Defaults to 60; set a lower value for stricter rate limits.
- RATE_LIMIT_WINDOW_SEC: (optional) - Defaults to 60.
- CACHE_TTL: (optional) - Defaults to 60 seconds; increase if you want cached responses to live longer.
- MAX_MESSAGE_LENGTH: (optional) - Max char length for messages (default: 2000).
- MAX_HISTORY_ITEMS: (optional) - Max number of previous messages in history (default: 20).

2) Production Behavior
----------------------
- The client `getJulesResponse` will first call `/api/chat` (serverless). In production, there is no fallback to client-side API key (ensures API key is never embedded).
- The `api/chat` serverless endpoint uses a server-side key from `JULES_API_KEY`; the endpoint implements rate limiting and caching.
- If you set `REDIS_URL`, we use Redis for rate-limiter and cache. Otherwise, we use in-memory (not recommended for production serverless environment, because memory does not persist across warm invocations).

3) Local Development
---------------------
- For fast local testing we allow the client-side `VITE_Jules_API_KEY` fallback if `NODE_ENV` !== 'production'. To test serverless locally:
  - `npx vercel dev` (recommended) or run `vercel dev` after `npx vercel login`.
  - This will run serverless `api/` functions locally and apply server-side behavior.

4) Security & Monitoring
-------------------------
- Do not set `VITE_Jules_API_KEY` on production — it would expose your key in the built bundle.
- Use `REDIS_URL` for production rate-limiting and caching for reliability.
- Consider adding Sentry/Datadog for performance/exception monitoring. The serverless function logs structured JSON to console.

5) Re-deploy / Clear cache
--------------------------
- To clear Vercel caches and trigger a fresh deployment:
  - Vercel Dashboard → Your Project → Deployments → Redeploy (Clear cache if available).
  - Or push a new commit to `main` branch.

6) Optional Improvements
------------------------
- Add IP-based or user-based authentication and a token system to identify and throttle more aggressively per user.
- Add a second layer of request signing between client/serverless to avoid abusing the endpoint.
- Use Cloudflare rate-limiting in front of serverless for extra protection.
