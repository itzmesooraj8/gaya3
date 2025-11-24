
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MagneticButton from '../components/ui/MagneticButton';
import { useAuth } from '../contexts/AuthContext';

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
