
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MagneticButton from '../components/ui/MagneticButton';
import { useAuth } from '../contexts/AuthContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "528093127718-l3u2b57f4fvg2ogp1hodpjnebokch2v5.apps.googleusercontent.com";
// Normalize the redirect origin (no trailing slash)
const REDIRECT_URI = window.location.origin.replace(/\/$/, '');
const OAUTH_SCOPE = "https://www.googleapis.com/auth/cloud-platform";

async function handleGoogleAuth() {
  const state = Math.random().toString(36).slice(2);
  const verifier = (await import('../utils/pkce')).generateCodeVerifier();
  const challenge = await (await import('../utils/pkce')).generateCodeChallenge(verifier);
  try { sessionStorage.setItem('oauth_state', state); sessionStorage.setItem('pkce_code_verifier', verifier); } catch(e) { /* ignore */ }
  const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI + '/auth/callback')}&response_type=code&scope=${OAUTH_SCOPE}&prompt=select_account&include_granted_scopes=true&state=${encodeURIComponent(state)}&code_challenge=${encodeURIComponent(challenge)}&code_challenge_method=S256&access_type=offline`;
  window.location.href = oauthUrl;
}

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleDemoLogin = (role: 'user' | 'admin') => {
    login(role);
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex bg-black">
      {/* Left: Cinematic Reel */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/1000/1200')] bg-cover bg-center opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        <div className="absolute bottom-20 left-12 max-w-md p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
          <p className="text-xl italic font-light leading-relaxed mb-4">"Gaya3 isn't just booking; it's the prologue to my life's best chapters."</p>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gray-500" />
             <div>
               <p className="font-bold text-sm">Elena Fisher</p>
               <p className="text-xs text-white/50">Travel Photographer</p>
             </div>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative z-10">
        <div className="w-full max-w-md">
          <div className="flex gap-8 mb-12 border-b border-white/10 pb-4">
             <button 
               onClick={() => setIsLogin(true)}
               className={`text-xl font-display transition-colors ${isLogin ? 'text-white' : 'text-white/30'}`}
             >
               LOGIN
             </button>
             <button 
               onClick={() => setIsLogin(false)}
               className={`text-xl font-display transition-colors ${!isLogin ? 'text-white' : 'text-white/30'}`}
             >
               JOIN THE CLUB
             </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/50">Full Name</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/40" />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/50">Email Address</label>
                <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/40" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/50">Password</label>
                <input type="password" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/40" />
              </div>

              <div className="pt-4 space-y-3">
                <MagneticButton className="w-full">
                  <button 
                    className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  >
                    {isLogin ? 'ENTER PORTAL' : 'BEGIN JOURNEY'}
                  </button>
                </MagneticButton>

                <div className="pt-2">
                  <button
                    onClick={handleGoogleAuth}
                    className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-black border border-white/20 text-white font-bold hover:bg-white/10 transition-all"
                    style={{ fontFamily: 'inherit', fontSize: '1rem' }}
                  >
                    <svg width="20" height="20" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.72 1.22 9.22 3.22l6.9-6.9C35.36 2.34 29.97 0 24 0 14.61 0 6.27 5.7 2.44 14.1l8.06 6.27C12.7 13.13 17.89 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.54-.14-3.02-.39-4.45H24v8.44h12.44c-.54 2.9-2.16 5.36-4.6 7.02l7.18 5.59C43.73 37.13 46.1 31.33 46.1 24.5z"/><path fill="#FBBC05" d="M10.5 28.77c-1.13-3.36-1.13-6.97 0-10.33l-8.06-6.27C.81 16.61 0 20.19 0 24c0 3.81.81 7.39 2.44 10.83l8.06-6.27z"/><path fill="#EA4335" d="M24 48c6.48 0 11.93-2.14 15.91-5.83l-7.18-5.59c-2.01 1.35-4.59 2.13-8.73 2.13-6.11 0-11.3-3.63-13.5-8.77l-8.06 6.27C6.27 42.3 14.61 48 24 48z"/></g></svg>
                    {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
                  </button>
                </div>

                {isLogin && (
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <button 
                      onClick={() => handleDemoLogin('user')}
                      className="py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs uppercase tracking-wider text-white/70 transition-colors"
                    >
                      Demo User
                    </button>
                    <button 
                      onClick={() => handleDemoLogin('admin')}
                      className="py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs uppercase tracking-wider text-white/70 transition-colors"
                    >
                      Demo Admin
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Auth;
