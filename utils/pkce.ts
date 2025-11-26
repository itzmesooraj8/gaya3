export function base64UrlEncode(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.slice(i, i + chunkSize)));
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function sha256(plain: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return await crypto.subtle.digest('SHA-256', data);
}

export async function generateCodeChallenge(verifier: string) {
  const hashed = await sha256(verifier);
  return base64UrlEncode(hashed);
}

export function generateRandomString(length = 64) {
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  // convert to base64url-like string
  return Array.from(arr)
    .map((b) => ('0' + b.toString(16)).slice(-2))
    .join('');
}

export function generateCodeVerifier() {
  // A recommended verifier length is between 43 and 128 characters
  // produce a 64-char random string base16
  return generateRandomString(32);
}
