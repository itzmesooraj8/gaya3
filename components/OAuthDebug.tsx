import React from 'react';

const GOOGLE_CLIENT_ID = (globalThis as any).GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '';
const REDIRECT_URI = (typeof window !== 'undefined' ? window.location.origin : '');

const OAuthDebug: React.FC = () => {
  return (
    <section className="p-6 bg-white/5 border border-white/10 rounded-2xl text-sm mb-6 font-mono">
      <h3 className="font-bold mb-3">OAuth Debug</h3>
      <p><strong>Computed Redirect URI:</strong> <code>{REDIRECT_URI}</code></p>
      <p><strong>Google Client ID:</strong> <code>{GOOGLE_CLIENT_ID || 'Not set'}</code></p>
      <p className="text-white/40 mt-2">If you see a redirect mismatch, ensure the Redirect URI in the Google Cloud Console matches the computed redirect exactly.</p>
    </section>
  );
};

export default OAuthDebug;
