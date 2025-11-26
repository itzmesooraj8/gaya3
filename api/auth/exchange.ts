// Exchange authorization code for tokens securely on the server.
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { code, code_verifier, redirect_uri } = req.body || {};
    if (!code) return res.status(400).json({ error: 'Missing code' });

    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const REDIRECT_URI = process.env.REDIRECT_URI || redirect_uri;
    if (!GOOGLE_CLIENT_ID) return res.status(500).json({ error: 'Missing server-side GOOGLE_CLIENT_ID env' });
    if (!REDIRECT_URI) return res.status(500).json({ error: 'Missing redirect URI' });

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', REDIRECT_URI);
    params.append('client_id', GOOGLE_CLIENT_ID);
    if (GOOGLE_CLIENT_SECRET) params.append('client_secret', GOOGLE_CLIENT_SECRET);
    if (code_verifier) params.append('code_verifier', code_verifier);

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const data = await tokenRes.json();
    if (!tokenRes.ok) return res.status(tokenRes.status).json({ error: data, message: 'Token endpoint returned error' });
    return res.status(200).json(data);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err?.message || 'Unknown error' });
  }
}
