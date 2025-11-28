import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, Users, ShieldCheck, Lock, CreditCard, 
  Smartphone, QrCode, CheckCircle, Zap, Shield, AlertCircle, ChevronRight
} from 'lucide-react';
import { ADDONS } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { QRCodeSVG } from 'qrcode.react';

const Checkout: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Logic State
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [upiMode, setUpiMode] = useState<'scan' | 'vpa'>('scan');
  const [zenProtection, setZenProtection] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  
  // Interaction State
  const [progress, setProgress] = useState(0);
  const [isVerifyingVpa, setIsVerifyingVpa] = useState(false);
  const [vpaVerified, setVpaVerified] = useState(false);
  const intervalRef = useRef<any>(null);

  // Redirect if no state present (direct access)
  useEffect(() => {
    if (!state || !user) {
      navigate('/');
    }
  }, [state, user, navigate]);

  if (!state) return null;
  const { property, addons, totalPrice: baseTotalPrice, date, guests } = state;

  // --- CALCULATIONS ---
  const TAX_RATE = 0.12; // 12% GST
  const SERVICE_FEE = 2500;
  const PROTECTION_FEE = 1500;

  const calculateFinalTotal = () => {
    let total = baseTotalPrice;
    // Add taxes on base
    total += baseTotalPrice * TAX_RATE;
    // Add service fee
    total += SERVICE_FEE;
    // Add protection if active
    if (zenProtection) total += PROTECTION_FEE;
    
    return Math.floor(total);
  };

  const finalAmount = calculateFinalTotal();

  // --- HANDLERS ---
  const handleVerifyVpa = () => {
    setIsVerifyingVpa(true);
    setTimeout(() => {
      setIsVerifyingVpa(false);
      setVpaVerified(true);
    }, 1500);
  };

  const startHold = () => {
    if (progress >= 100) return;
    // Prevent checkout if VPA is selected but not verified
    if (paymentMethod === 'upi' && upiMode === 'vpa' && !vpaVerified) return;

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
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
      
      {/* LEFT: TRIP SUMMARY & UPSELLS */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-1/2 space-y-6"
      >
        <h1 className="font-display text-4xl">SECURE YOUR SANCTUARY</h1>
        
        {/* Property Card */}
        <div className="relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden p-6 md:p-8 backdrop-blur-xl">
           <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
           <div className="relative z-10">
              <div className="flex gap-6 mb-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                   <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="font-display text-xl md:text-2xl font-bold leading-tight mb-1">{property.title}</h2>
                  <p className="text-white/60 flex items-center gap-2 text-sm"><MapPin size={14}/> {property.location}</p>
                </div>
              </div>

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

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-white/5 pt-6 text-sm">
                 <div className="flex justify-between text-white/60">
                    <span>Base Fare & Add-ons</span>
                    <span>₹{baseTotalPrice.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between text-white/60">
                    <span>Taxes & Fees (12%)</span>
                    <span>₹{(baseTotalPrice * TAX_RATE).toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between text-white/60">
                    <span>Concierge Fee</span>
                    <span>₹{SERVICE_FEE.toLocaleString()}</span>
                 </div>
                 {zenProtection && (
                    <div className="flex justify-between text-green-400">
                      <span className="flex items-center gap-1"><ShieldCheck size={12}/> Zen Protection</span>
                      <span>₹{PROTECTION_FEE.toLocaleString()}</span>
                    </div>
                 )}
              </div>

              <div className="border-t border-dashed border-white/20 pt-4 mt-4 flex justify-between items-end">
                 <span className="text-white/50 text-sm">Total Due</span>
                 <span className="font-display text-3xl font-bold">₹{finalAmount.toLocaleString()}</span>
              </div>
           </div>
        </div>

        {/* Zen Protection Toggle (Upsell) */}
        <div 
          onClick={() => setZenProtection(!zenProtection)}
          className={`relative p-6 rounded-3xl border transition-all cursor-pointer overflow-hidden group ${zenProtection ? 'bg-green-500/10 border-green-500/40' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
        >
           <div className="flex items-start gap-4 relative z-10">
              <div className={`p-3 rounded-full ${zenProtection ? 'bg-green-500 text-black' : 'bg-white/10 text-white/50'}`}>
                 <Shield size={24} />
              </div>
              <div className="flex-1">
                 <div className="flex justify-between items-center mb-1">
                    <h3 className={`font-display text-sm font-bold ${zenProtection ? 'text-green-400' : 'text-white'}`}>ADD ZEN PROTECTION</h3>
                    <span className="font-mono text-sm">₹1,500</span>
                 </div>
                 <p className="text-xs text-white/60 leading-relaxed">
                    Flexible cancellation up to 24h before arrival, medical coverage, and lost baggage insurance.
                 </p>
              </div>
              <div className={`w-6 h-6 rounded-full border border-white/20 flex items-center justify-center ${zenProtection ? 'bg-green-500 border-green-500' : ''}`}>
                 {zenProtection && <CheckCircle size={14} className="text-black" />}
              </div>
           </div>
           {/* Glow Effect */}
           {zenProtection && <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-green-500/20 blur-[50px] rounded-full" />}
        </div>
      </motion.div>

      {/* RIGHT: PAYMENT TERMINAL */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full lg:w-1/2 flex flex-col justify-center"
      >
        <div className="bg-[#050505] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
           {/* Security Banner */}
           <div className="flex items-center justify-between mb-8 text-white/30 text-[10px] uppercase tracking-widest border-b border-white/5 pb-4">
              <span className="flex items-center gap-2"><Lock size={12} /> 256-Bit SSL Encrypted</span>
              <span className="flex items-center gap-2"><Zap size={12} /> Instant Confirmation</span>
           </div>

           {/* Payment Method Selector */}
           <div className="grid grid-cols-2 gap-3 mb-8">
              <button 
                 onClick={() => setPaymentMethod('card')}
                 className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'card' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'}`}
              >
                 <CreditCard size={20} />
                 <span className="text-xs font-bold uppercase tracking-wider">Card</span>
              </button>
              <button 
                 onClick={() => setPaymentMethod('upi')}
                 className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'upi' ? 'bg-blue-500 text-white border-blue-400' : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'}`}
              >
                 <Smartphone size={20} />
                 <span className="text-xs font-bold uppercase tracking-wider">UPI / VPA</span>
              </button>
           </div>

           <div className="min-h-[280px]">
             <AnimatePresence mode="wait">
               {paymentMethod === 'card' ? (
                 <motion.div key="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-white/40">Card Number</label>
                       <div className="relative">
                          <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-mono text-white focus:border-white/40 outline-none transition-colors" />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 opacity-50">
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
                 </motion.div>
               ) : (
                 <motion.div key="upi" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    {/* UPI Sub-Tabs */}
                    <div className="flex gap-4 border-b border-white/10 pb-4">
                      <button onClick={() => setUpiMode('scan')} className={`text-xs uppercase tracking-widest pb-1 border-b-2 transition-all ${upiMode === 'scan' ? 'text-white border-blue-500' : 'text-white/30 border-transparent'}`}>Scan QR</button>
                      <button onClick={() => setUpiMode('vpa')} className={`text-xs uppercase tracking-widest pb-1 border-b-2 transition-all ${upiMode === 'vpa' ? 'text-white border-blue-500' : 'text-white/30 border-transparent'}`}>Enter VPA</button>
                    </div>

                    {upiMode === 'scan' ? (
                       <div className="flex flex-col items-center justify-center py-4 space-y-4">
                          <div className="p-4 bg-white rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                             <QRCodeSVG value={`upi://pay?pa=gaya3@luxury&pn=Gaya3&am=${finalAmount}&cu=INR`} size={140} />
                          </div>
                          <p className="text-xs text-white/40 text-center max-w-[200px]">Scan with Google Pay, PhonePe, or Paytm</p>
                       </div>
                    ) : (
                       <div className="space-y-4 pt-4">
                          <div className="relative">
                             <input 
                               type="text" 
                               placeholder="username@upi" 
                               disabled={vpaVerified}
                               className={`w-full bg-white/5 border rounded-xl p-4 font-mono text-white outline-none transition-all ${vpaVerified ? 'border-green-500/50 text-green-400' : 'border-white/10 focus:border-blue-500'}`} 
                             />
                             {vpaVerified && <CheckCircle size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" />}
                          </div>
                          {!vpaVerified ? (
                             <button 
                               onClick={handleVerifyVpa}
                               disabled={isVerifyingVpa}
                               className="w-full py-3 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2"
                             >
                                {isVerifyingVpa ? 'Verifying Node...' : 'Verify VPA'}
                             </button>
                          ) : (
                             <div className="text-center text-xs text-green-400 font-mono">
                                Verified: Elena Fisher (HDFC Bank)
                             </div>
                          )}
                       </div>
                    )}
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
           
           {/* Coupon Code - Styled as "Decryption" */}
           <div className="my-6">
              <div className="relative">
                <input 
                   type="text" 
                   value={promoCode}
                   onChange={(e) => setPromoCode(e.target.value)}
                   placeholder="DECRYPT ACCESS KEY (PROMO)" 
                   className="w-full bg-black border border-white/10 rounded-lg py-2 px-3 text-[10px] font-mono text-white/70 tracking-widest focus:border-white/30 outline-none"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                   <ChevronRight size={14} />
                </button>
              </div>
           </div>

           {/* HOLD TO CONFIRM BUTTON */}
           <div className="mt-2">
              <div 
                 className={`relative w-full h-16 rounded-xl border overflow-hidden select-none group transition-all ${
                    (paymentMethod === 'upi' && upiMode === 'vpa' && !vpaVerified) 
                    ? 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed' 
                    : 'bg-white/5 border-white/10 cursor-pointer hover:border-white/30'
                 }`}
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
              <p className="text-center text-[10px] text-white/30 mt-3 uppercase tracking-wider flex items-center justify-center gap-2">
                 {(paymentMethod === 'upi' && upiMode === 'vpa' && !vpaVerified) ? (
                    <span className="text-red-400 flex items-center gap-1"><AlertCircle size={10} /> Verify VPA to Proceed</span>
                 ) : (
                    <span>{progress > 0 ? 'Initiating Neural Link...' : 'Press and hold to authorize'}</span>
                 )}
              </p>
           </div>

        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;