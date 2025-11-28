import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, ShieldCheck, Lock, CreditCard, ChevronRight } from 'lucide-react';
import { ADDONS } from '../constants';
import { useAuth } from '../contexts/AuthContext';

const Checkout: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Interaction State
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<any>(null);

  // Redirect if no state present (direct access)
  useEffect(() => {
    if (!state || !user) {
      navigate('/');
    }
  }, [state, user, navigate]);

  if (!state) return null;
  const { property, addons, totalPrice, date, guests } = state;

  // Haptic Hold Logic
  const startHold = () => {
    if (progress >= 100) return;
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current);
          handleSuccess();
          return 100;
        }
        return prev + 2; // Speed of fill
      });
    }, 20);
  };

  const stopHold = () => {
    clearInterval(intervalRef.current);
    if (progress < 100) {
      setProgress(0);
    }
  };

  const handleSuccess = () => {
    setTimeout(() => {
      navigate('/booking-success');
    }, 500);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
      
      {/* LEFT: TRIP SUMMARY (Holographic Card) */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-1/2"
      >
        <h1 className="font-display text-4xl mb-8">SECURE YOUR SANCTUARY</h1>
        
        <div className="relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden p-8 backdrop-blur-xl">
           {/* Visual Noise Overlay */}
           <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

           <div className="relative z-10">
              <div className="aspect-video rounded-2xl overflow-hidden mb-6 border border-white/10">
                 <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
              </div>

              <h2 className="font-display text-2xl font-bold mb-2">{property.title}</h2>
              <p className="text-white/60 flex items-center gap-2 mb-6"><MapPin size={16}/> {property.location}</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1 flex items-center gap-1"><Calendar size={10}/> Dates</p>
                    <p className="font-mono text-sm">{date}</p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1 flex items-center gap-1"><Users size={10}/> Guests</p>
                    <p className="font-mono text-sm">{guests} Adults</p>
                 </div>
              </div>

              {addons.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-widest text-white/40 mb-3">Selected Upgrades</p>
                  <div className="space-y-2">
                    {addons.map((addonId: string) => {
                       const item = ADDONS.find(a => a.id === addonId);
                       return item ? (
                         <div key={addonId} className="flex justify-between text-sm">
                            <span className="flex items-center gap-2 text-white/80">{item.emoji} {item.name}</span>
                            <span className="font-mono text-white/60">₹{item.price}</span>
                         </div>
                       ) : null;
                    })}
                  </div>
                </div>
              )}

              <div className="border-t border-white/10 pt-6 flex justify-between items-end">
                 <span className="text-white/50 text-sm">Total Due Today</span>
                 <span className="font-display text-3xl font-bold">₹{totalPrice.toLocaleString()}</span>
              </div>
           </div>
        </div>
      </motion.div>

      {/* RIGHT: PAYMENT TERMINAL */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full md:w-1/2 flex flex-col justify-center"
      >
        <div className="bg-black/40 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
           <div className="flex items-center gap-3 mb-8 text-white/50">
              <Lock size={16} />
              <span className="text-xs uppercase tracking-widest">Encrypted Transaction // 256-Bit SSL</span>
           </div>

           {/* Payment Method Selector (Visual Only) */}
           <div className="space-y-4 mb-8">
              <p className="text-sm font-bold">Payment Method</p>
              <div className="flex gap-4">
                 <div className="flex-1 p-4 rounded-xl border border-white/20 bg-white/10 flex items-center justify-center gap-2 cursor-pointer ring-1 ring-white/50">
                    <CreditCard size={18} /> Card
                 </div>
                 <div className="flex-1 p-4 rounded-xl border border-white/5 bg-transparent opacity-50 flex items-center justify-center gap-2 cursor-pointer hover:opacity-100">
                    <span>Crypto</span>
                 </div>
              </div>
           </div>

           {/* Card Visual Input */}
           <div className="mb-8 space-y-4">
              <div className="space-y-2">
                 <label className="text-[10px] uppercase tracking-widest text-white/40">Card Number</label>
                 <div className="relative">
                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-mono text-white focus:border-white/40 outline-none transition-colors" />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                       <div className="w-8 h-5 bg-white/20 rounded-sm" />
                       <div className="w-8 h-5 bg-white/20 rounded-sm" />
                    </div>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40">Expiry</label>
                    <input type="text" placeholder="MM/YY" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-mono text-white focus:border-white/40 outline-none transition-colors" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40">CVC</label>
                    <input type="text" placeholder="123" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-mono text-white focus:border-white/40 outline-none transition-colors" />
                 </div>
              </div>
           </div>

           {/* HOLD TO CONFIRM BUTTON */}
           <div className="mt-8">
              <div 
                 className="relative w-full h-16 bg-white/5 rounded-xl border border-white/10 overflow-hidden cursor-pointer select-none group"
                 onMouseDown={startHold}
                 onMouseUp={stopHold}
                 onMouseLeave={stopHold}
                 onTouchStart={startHold}
                 onTouchEnd={stopHold}
              >
                 {/* Progress Fill */}
                 <motion.div 
                    className="absolute inset-0 bg-white"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear", duration: 0 }}
                 />
                 
                 {/* Content Layer */}
                 <div className="absolute inset-0 flex items-center justify-center gap-3 mix-blend-difference text-white">
                    {progress >= 100 ? (
                       <span className="font-display font-bold tracking-widest flex items-center gap-2">
                          PROCESSING <motion.span animate={{ opacity: [0,1,0] }} transition={{ repeat: Infinity }}>...</motion.span>
                       </span>
                    ) : (
                       <>
                          <div className={`p-2 rounded-full border-2 border-white transition-all duration-300 ${progress > 0 ? 'scale-110' : ''}`}>
                             <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                          <span className="font-display font-bold tracking-widest text-sm">HOLD TO CONFIRM</span>
                       </>
                    )}
                 </div>
              </div>
              <p className="text-center text-[10px] text-white/30 mt-3 uppercase tracking-wider">
                 {progress > 0 ? 'Initiating Neural Link...' : 'Press and hold to authorize'}
              </p>
           </div>

        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;