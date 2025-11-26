import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Client-side callback handler for the OAuth PKCE flow
const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      const params = new URLSearchParams(window.location.search);
      const error = params.get('error');
      if (error) {
        const desc = params.get('error_description') || '';
        setErrorMsg(`${error}: ${desc}`);
        return;
      }

      const code = params.get('code');
      const state = params.get('state');
      const storedState = sessionStorage.getItem('oauth_state');
      if (!code) {
        setErrorMsg('Missing authorization code.');
        return;
      }
      if (!state || state !== storedState) {
        setErrorMsg('Invalid state returned from OAuth provider.');
        return;
      }

      const verifier = sessionStorage.getItem('pkce_code_verifier');
      try {
        const resp = await fetch('/api/auth/exchange', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, code_verifier: verifier, redirect_uri: window.location.origin })
        });
        const data = await resp.json();
        if (!resp.ok) {
          setErrorMsg(data?.error || 'Failed to exchange token');
          return;
        }
        // expected: { access_token, refresh_token, expires_in, token_type }
        try {
          if (data.access_token) sessionStorage.setItem('oauth_access_token', data.access_token);
          if (data.refresh_token) sessionStorage.setItem('oauth_refresh_token', data.refresh_token);
        } catch (e) {
          console.warn('Unable to store tokens in sessionStorage', e);
        }
        // Clear temporary PKCE data
        try { sessionStorage.removeItem('pkce_code_verifier'); sessionStorage.removeItem('oauth_state'); } catch (e) { /* ignore */ }
        // Redirect to dashboard or home
        navigate('/dashboard', { replace: true });
      } catch (err: any) {
        setErrorMsg(err?.message || 'Unknown error during token exchange');
      }
    }

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg p-8 rounded-xl shadow-md bg-black/70 border border-white/5 text-white">
        {errorMsg ? (
          <div>
            <h2 className="font-bold text-lg mb-2">OAuth Error</h2>
            <p className="text-sm">{errorMsg}</p>
            <p className="mt-3 text-xs text-white/40">Check your configured redirect URI in the Google Cloud Console and ensure it exactly matches the URL shown below.</p>
            <pre className="mt-2 text-xs bg-white/5 p-2 rounded">{window.location.origin + '/auth/callback'}</pre>
          </div>
        ) : (
          <div>
            <h2 className="font-bold text-lg mb-2">Signing in...</h2>
            <p className="text-sm">Please wait while we complete the sign-in process.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
