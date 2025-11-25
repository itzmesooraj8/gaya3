import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Sparkles, MapPin, Settings, LogOut, CreditCard, 
  Heart, Star, Plane, Zap, Shield, Activity, 
  History, Plus, Share2, Lock, Unlock, Cloud, Sun, 
  BrainCircuit, XCircle, Smartphone, Globe, Download, Trash2, Key,
  Edit2, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TiltCard from '../components/ui/TiltCard';
import MagneticButton from '../components/ui/MagneticButton';
import { MOCK_BOOKINGS, MOCK_PROPERTIES } from '../constants';
import { useAuth } from '../contexts/AuthContext';

// --- TYPES & MOCKS ---
type Tab = 'journeys' | 'wishlist' | 'vault' | 'settings';
type SettingsSubTab = 'profile' | 'neural' | 'wallet';

const DREAM_KEYWORDS = ["Velvet", "Silence", "Saltwater", "Neon", "Moss", "Adrenaline", "Void", "Gold", "Petrichor", "Basalt"];

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('journeys');
  const [privacyMode, setPrivacyMode] = useState(false);
  
  // Settings State
  const [activeSettingsTab, setActiveSettingsTab] = useState<SettingsSubTab>('profile');
  
  // Vault Interaction States
  const [activeVaultItem, setActiveVaultItem] = useState<string | null>(null);
  const [summonProgress, setSummonProgress] = useState(0);
  const summonInterval = useRef<any>(null);

  // AI Calibration State
  const [aiSliders, setAiSliders] = useState({
    social: 50,
    pacing: 30,
    nature: 80,
    luxury: 60
  });

  const [dreamWords, setDreamWords] = useState<string[]>([]);
  const [bioSyncActive, setBioSyncActive] = useState(false);
  
  // Profile Form State
  const [twoFactor, setTwoFactor] = useState(true);

  // Fallback mock user
  const displayUser = user || {
    id: 'mock-1',
    name: 'Elena Fisher',
    email: 'elena@nomad.com',
    role: 'user',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Elena',
    memberStatus: 'Platinum',
    vibeScore: 4.92
  };

  const upcomingBookings = MOCK_BOOKINGS.filter(b => b.status === 'UPCOMING');
  const pastBookings = MOCK_BOOKINGS.filter(b => b.status === 'COMPLETED');
  const wishlistProperties = [MOCK_PROPERTIES[1], MOCK_PROPERTIES[3], MOCK_PROPERTIES[0]];

  // Summoning Logic
  const startSummoning = () => {
    if (summonProgress >= 100) return;
    summonInterval.current = setInterval(() => {
      setSummonProgress(prev => {
        if (prev >= 100) {
          clearInterval(summonInterval.current);
          return 100;
        }
        return prev + 2;
      });
    }, 20);
  };

  const stopSummoning = () => {
    clearInterval(summonInterval.current);
    if (summonProgress < 100) {
      setSummonProgress(0);
    }
  };

  const toggleDreamWord = (word: string) => {
    setDreamWords(prev => prev.includes(word) ? prev.filter(w => w !== word) : [...prev, word]);
  };

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.05, delayChildren: 0.1 } 
    },
    exit: { opacity: 0, y: 10, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen pt-32 px-4 md:px-12 max-w-7xl mx-auto pb-24 font-body text-white">
      
      {/* --- HUD HEADER --- */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-12"
      >
        <div className="relative bg-[#080808]/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 overflow-hidden shadow-2xl">
          {/* Decorative Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            
            {/* Identity Cluster */}
            <div className="flex items-center gap-6">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-white/20 to-transparent">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-black relative">
                    <img src={displayUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-full border border-black">
                  LVL 4
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-display text-3xl font-bold tracking-tight">
                    {displayUser.name}
                  </h1>
                  {privacyMode ? (
                    <button onClick={() => setPrivacyMode(false)} className="text-white/30 hover:text-white"><Lock size={14}/></button>
                  ) : (
                    <button onClick={() => setPrivacyMode(true)} className="text-white/30 hover:text-white"><Unlock size={14}/></button>
                  )}
                </div>
                <p className="text-white/40 font-mono text-xs mb-2">
                  {privacyMode ? '••••••••••••••••' : displayUser.email}
                </p>
                <div className="flex gap-2">
                   <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-white/70 flex items-center gap-1">
                     <Shield size={10} className="text-purple-400" /> {displayUser.memberStatus}
                   </span>
                   <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-white/70 flex items-center gap-1">
                     <MapPin size={10} className="text-blue-400" /> Global Citizen
                   </span>
                   {bioSyncActive && (
                      <span className="px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] uppercase tracking-widest text-red-400 flex items-center gap-1 animate-pulse">
                        <Activity size={10} /> Sync Active
                      </span>
                   )}
                </div>
              </div>
            </div>

            {/* Stats Cluster (Gamification) */}
            <div className="flex items-center gap-8 bg-black/20 p-4 rounded-2xl border border-white/5">
              
              {/* Vibe Score Ring */}
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path className="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    <motion.path 
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 0.98 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]" 
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3" 
                      strokeDasharray="100, 100" 
                    />
                  </svg>
                  <div className="absolute font-display text-xs font-bold">4.9</div>
                </div>
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-white/40">Vibe Score</p>
                   <p className="text-xs text-green-400">Top 1% Traveler</p>
                </div>
              </div>

              <div className="w-px h-8 bg-white/10" />

              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40">Sanctuaries</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-2xl">{pastBookings.length + upcomingBookings.length}</span>
                  <span className="text-xs text-white/30">Unlocked</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </motion.div>

      {/* --- LIQUID NAVIGATION --- */}
      <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-8 mb-10 border-b border-white/5 px-2">
        {[
          { id: 'journeys', icon: Plane, label: 'Mission Control' },
          { id: 'wishlist', icon: Heart, label: 'Wishlist' },
          { id: 'vault', icon: Star, label: 'The Vault' },
          { id: 'settings', icon: Settings, label: 'Settings' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`relative px-4 py-4 group flex items-center gap-2 transition-all ${activeTab === tab.id ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
          >
            <tab.icon size={16} className={activeTab === tab.id ? 'text-white' : 'opacity-50'} />
            <span className="font-display text-xs md:text-sm tracking-widest uppercase">
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_10px_white]" 
              />
            )}
          </button>
        ))}
      </div>

      {/* --- CONTENT AREA --- */}
      <AnimatePresence mode="wait">
        
        {/* 1. MISSION CONTROL (JOURNEYS) */}
        {activeTab === 'journeys' && (
          <motion.div
            key="journeys"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-12"
          >
            {/* Countdown / Next Mission */}
            {upcomingBookings.length > 0 && (
              <section className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-white/10 rounded-3xl p-1">
                <div className="bg-[#050505]/50 backdrop-blur-xl rounded-[1.4rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/10 text-blue-400 rounded-full animate-pulse"><Zap size={20} /></div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-white/50 mb-1">Next Departure</p>
                        <h3 className="font-display text-lg md:text-xl">
                          {MOCK_PROPERTIES.find(p => p.id === upcomingBookings[0].propertyId)?.title}
                        </h3>
                      </div>
                   </div>
                   <div className="flex gap-4 text-center">
                      <div>
                        <span className="font-mono text-2xl md:text-3xl font-bold">04</span>
                        <p className="text-[10px] uppercase text-white/30">Days</p>
                      </div>
                      <span className="text-2xl opacity-30">:</span>
                      <div>
                        <span className="font-mono text-2xl md:text-3xl font-bold">12</span>
                        <p className="text-[10px] uppercase text-white/30">Hrs</p>
                      </div>
                      <span className="text-2xl opacity-30">:</span>
                      <div>
                        <span className="font-mono text-2xl md:text-3xl font-bold">30</span>
                        <p className="text-[10px] uppercase text-white/30">Mins</p>
                      </div>
                   </div>
                </div>
              </section>
            )}

            <div className="space-y-8">
              {upcomingBookings.map((booking) => (
                <motion.div key={booking.id} variants={itemVariants}>
                  <EnhancedBoardingPass booking={booking} />
                </motion.div>
              ))}
              
              {upcomingBookings.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-white/30">
                  <Plane size={48} className="mb-4 opacity-50" />
                  <p className="font-display text-lg">No Active Missions</p>
                  <p className="text-sm mt-2">The world is waiting.</p>
                </div>
              )}
            </div>

            {/* Past Missions */}
            <div className="pt-12 border-t border-white/5">
              <h3 className="font-display text-sm text-white/40 mb-6 flex items-center gap-2">
                <History size={14} /> Archived Logs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-70">
                {pastBookings.map((booking) => (
                  <motion.div key={booking.id} variants={itemVariants} className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-colors">
                     <div className="w-12 h-12 rounded bg-white/10 overflow-hidden grayscale">
                       <img src={MOCK_PROPERTIES.find(p=>p.id === booking.propertyId)?.image} className="w-full h-full object-cover" />
                     </div>
                     <div>
                       <p className="font-bold text-sm">{MOCK_PROPERTIES.find(p=>p.id === booking.propertyId)?.title}</p>
                       <p className="text-xs text-white/40 font-mono">{booking.date}</p>
                     </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 2. THE VAULT (LOYALTY) */}
        {activeTab === 'vault' && (
          <motion.div
            key="vault"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Status Card */}
            <div className="md:col-span-1 bg-gradient-to-b from-yellow-900/20 to-black border border-yellow-500/20 rounded-3xl p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-32 bg-yellow-500/10 blur-[80px] rounded-full pointer-events-none" />
               <Star size={32} className="text-yellow-400 mb-6" fill="currentColor" />
               <h3 className="font-display text-2xl font-bold mb-1">PLATINUM</h3>
               <p className="text-sm text-white/50 mb-8">Elite Tier Member</p>
               
               <div className="space-y-4">
                 <div className="flex justify-between text-xs mb-1">
                   <span>Progress to Diamond</span>
                   <span>85%</span>
                 </div>
                 <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full w-[85%] bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                 </div>
                 <p className="text-[10px] text-white/30 text-right">3 more stays to unlock</p>
               </div>
            </div>

            {/* Interactive Perks Grid */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
               
               {/* 1. QUANTUM DROP */}
               <motion.div 
                 layout
                 onClick={() => setActiveVaultItem(activeVaultItem === 'drop' ? null : 'drop')}
                 className={`p-6 rounded-2xl border flex flex-col justify-between overflow-hidden relative cursor-pointer transition-all duration-500 ${activeVaultItem === 'drop' ? 'col-span-2 bg-purple-900/10 border-purple-500/50' : 'bg-white/5 border-white/10'}`}
               >
                  {activeVaultItem !== 'drop' ? (
                     <>
                        <div className="flex justify-between items-start">
                           <Lock size={20} className="text-purple-400" />
                        </div>
                        <p className="font-display text-sm">Exclusive Drops</p>
                     </>
                  ) : (
                     <div className="flex flex-col h-full gap-4">
                        <div className="flex justify-between items-start">
                           <h3 className="font-display text-purple-300 flex items-center gap-2"><Sparkles size={16}/> QUANTUM DROP DETECTED</h3>
                           <button onClick={(e) => {e.stopPropagation(); setActiveVaultItem(null)}}><XCircle className="text-white/30 hover:text-white"/></button>
                        </div>
                        <div className="flex gap-4">
                           <div className="w-1/3 bg-black rounded-lg border border-white/10 overflow-hidden relative group">
                              <img src="https://picsum.photos/400/300?grayscale" className="opacity-50 blur-sm group-hover:blur-none transition-all duration-700" />
                              <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-purple-400 font-bold bg-black/50">DECRYPTING...</div>
                           </div>
                           <div className="flex-1 space-y-2">
                              <p className="text-lg font-bold">The Void Villa, Iceland</p>
                              <p className="text-xs text-white/50">Limited time access to unlisted properties.</p>
                              <div className="flex gap-2 font-mono text-xl text-purple-400 mt-2">
                                 <span>02</span>:<span>14</span>:<span>33</span>
                              </div>
                           </div>
                        </div>
                        <button className="w-full py-3 bg-purple-500/20 border border-purple-500/50 text-purple-300 font-bold text-xs uppercase tracking-widest hover:bg-purple-500/40 transition-colors">
                           Claim Access Key
                        </button>
                     </div>
                  )}
               </motion.div>

               {/* 2. SUMMON CONCIERGE */}
               <div 
                 className={`p-6 rounded-2xl border flex flex-col justify-between relative overflow-hidden select-none ${summonProgress > 0 ? 'border-amber-500/50 bg-amber-900/10' : 'bg-white/5 border-white/10'}`}
                 onMouseDown={startSummoning}
                 onMouseUp={stopSummoning}
                 onMouseLeave={stopSummoning}
                 onTouchStart={startSummoning}
                 onTouchEnd={stopSummoning}
               >
                  <div className="absolute bottom-0 left-0 h-full bg-amber-500/20 transition-all duration-75 ease-linear" style={{ width: `${summonProgress}%` }} />
                  
                  <div className="flex justify-between items-start relative z-10">
                     <Zap size={20} className={summonProgress >= 100 ? 'text-amber-400 animate-pulse' : 'text-white'} />
                     {summonProgress > 0 && <span className="font-mono text-xs text-amber-400">{summonProgress}%</span>}
                  </div>
                  <div className="relative z-10">
                     <p className="font-display text-sm">{summonProgress >= 100 ? 'SIGNAL SENT' : 'HOLD TO SUMMON'}</p>
                     <p className="text-[10px] text-white/40 mt-1">Priority Neural Link</p>
                  </div>
               </div>

               {/* 3. LATE CHECKOUT SLIDER */}
               <div className="p-6 rounded-2xl border bg-white/5 border-white/10 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                     <History size={20} className="text-white" />
                  </div>
                  <div>
                     <p className="font-display text-sm mb-2">Auto-Late Checkout</p>
                     <div className="flex items-center gap-3">
                        <span className="text-[10px] text-white/40">11 AM</span>
                        <input type="range" className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full" />
                        <span className="text-[10px] text-white/40">4 PM</span>
                     </div>
                  </div>
               </div>

                {/* 4. LOCKED PERK */}
               <div className="p-6 rounded-2xl border bg-black/40 border-white/5 opacity-50 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                     <Lock size={14} className="text-white/30" />
                  </div>
                  <p className="font-display text-sm">Free Spa Access</p>
               </div>
            </div>
          </motion.div>
        )}

        {/* 3. WISHLIST */}
        {activeTab === 'wishlist' && (
          <motion.div
            key="wishlist"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
             {wishlistProperties.map((property) => (
                <motion.div key={property.id} variants={itemVariants}>
                   <TiltCard>
                      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer group" onClick={() => navigate(`/property/${property.id}`)}>
                         <div className="relative aspect-[4/3]">
                            <img src={property.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                            <div className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur rounded-full text-white">
                               <Heart size={16} fill="currentColor" className="text-red-500" />
                            </div>
                         </div>
                         <div className="p-4">
                            <h3 className="font-display font-bold">{property.title}</h3>
                            <p className="text-xs text-white/50">{property.location}</p>
                         </div>
                      </div>
                   </TiltCard>
                </motion.div>
             ))}
          </motion.div>
        )}

        {/* 4. SETTINGS (Formerly Neural Core) - UPGRADED */}
        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col lg:flex-row gap-8"
          >
            {/* Sidebar Navigation for Settings */}
            <div className="w-full lg:w-64 flex flex-row lg:flex-col gap-2">
              <button
                onClick={() => setActiveSettingsTab('profile')}
                className={`px-4 py-3 rounded-xl text-left text-sm font-medium transition-all ${activeSettingsTab === 'profile' ? 'bg-white text-black' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
              >
                Profile & Security
              </button>
              <button
                onClick={() => setActiveSettingsTab('neural')}
                className={`px-4 py-3 rounded-xl text-left text-sm font-medium transition-all ${activeSettingsTab === 'neural' ? 'bg-white text-black' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
              >
                AI Preferences
              </button>
              <button
                onClick={() => setActiveSettingsTab('wallet')}
                className={`px-4 py-3 rounded-xl text-left text-sm font-medium transition-all ${activeSettingsTab === 'wallet' ? 'bg-white text-black' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
              >
                Wallet
              </button>
            </div>

            <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md min-h-[500px]">
              
              {/* PROFILE SUB-TAB: COMPREHENSIVE OVERHAUL */}
              {activeSettingsTab === 'profile' && (
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="space-y-12">
                   
                   {/* 1. Identity Management */}
                   <section>
                      <h3 className="font-display text-lg mb-6 flex items-center gap-2"><Sparkles size={16} className="text-blue-400"/> Identity Management</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/40">Display Name</label>
                            <div className="relative">
                               <input type="text" defaultValue={displayUser.name} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-white/40 focus:bg-white/5 outline-none transition-all" />
                               <Edit2 size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/40">Email Address</label>
                            <div className="relative">
                               <input type="text" defaultValue={displayUser.email} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-white/40 focus:bg-white/5 outline-none transition-all" />
                               <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/40">Phone</label>
                            <input type="text" placeholder="+1 (555) 000-0000" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-white/40 focus:bg-white/5 outline-none transition-all" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/40">Home Base</label>
                            <input type="text" placeholder="Tokyo, Japan" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-white/40 focus:bg-white/5 outline-none transition-all" />
                         </div>
                      </div>
                   </section>

                   <div className="h-px w-full bg-white/5" />

                   {/* 2. Security Hub */}
                   <section>
                      <h3 className="font-display text-lg mb-6 flex items-center gap-2"><Shield size={16} className="text-green-400"/> Security Hub</h3>
                      <div className="space-y-4">
                         {/* Password */}
                         <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white/10 rounded-lg"><Key size={18} /></div>
                                <div>
                                  <p className="font-bold text-sm">Password</p>
                                  <p className="text-xs text-white/50">Last changed 3 months ago</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors">Update</button>
                         </div>

                         {/* 2FA */}
                         <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                            <div className="flex items-center gap-4">
                               <div className="p-2 bg-white/10 rounded-lg"><Smartphone size={18} /></div>
                               <div>
                                  <p className="font-bold text-sm">2-Step Verification</p>
                                  <p className="text-xs text-white/50">Add an extra layer of security</p>
                               </div>
                            </div>
                            <button 
                               onClick={() => setTwoFactor(!twoFactor)}
                               className={`w-12 h-6 rounded-full p-1 transition-colors ${twoFactor ? 'bg-green-500' : 'bg-white/10'}`}
                            >
                               <div className={`w-4 h-4 rounded-full bg-white transition-transform ${twoFactor ? 'translate-x-6' : ''}`} />
                            </button>
                         </div>

                         {/* Active Sessions */}
                         <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <p className="font-bold text-sm mb-4">Active Sessions</p>
                            <div className="space-y-3">
                               <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-3">
                                     <Cloud size={14} className="text-white/50" />
                                     <span>MacBook Pro <span className="text-white/30">• San Francisco, US</span></span>
                                  </div>
                                  <span className="text-green-400 text-xs uppercase font-bold">Current</span>
                               </div>
                               <div className="flex items-center justify-between text-sm opacity-50">
                                  <div className="flex items-center gap-3">
                                     <Smartphone size={14} />
                                     <span>iPhone 14 Pro <span className="text-white/30">• Tokyo, JP</span></span>
                                  </div>
                                  <span className="text-xs">2h ago</span>
                               </div>
                            </div>
                         </div>
                      </div>
                   </section>

                   <div className="h-px w-full bg-white/5" />

                   {/* 3. Preferences */}
                   <section>
                      <h3 className="font-display text-lg mb-6 flex items-center gap-2"><Globe size={16} className="text-purple-400"/> Global Preferences</h3>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/40">Currency</label>
                            <select className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none appearance-none cursor-pointer">
                               <option>USD ($)</option>
                               <option>EUR (€)</option>
                               <option>INR (₹)</option>
                               <option>JPY (¥)</option>
                            </select>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/40">Language</label>
                            <select className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none appearance-none cursor-pointer">
                               <option>English (US)</option>
                               <option>Japanese</option>
                               <option>French</option>
                            </select>
                         </div>
                      </div>
                   </section>

                   <div className="h-px w-full bg-white/5" />

                   {/* 4. Danger Zone */}
                   <section>
                      <h3 className="font-display text-lg mb-6 text-red-400 flex items-center gap-2"><AlertCircle size={16}/> Data Controls</h3>
                      <div className="flex gap-4">
                         <button className="flex-1 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-center gap-2 text-sm">
                            <Download size={14} /> Export Personal Data
                         </button>
                         <button className="flex-1 py-3 border border-red-500/30 bg-red-500/10 rounded-xl hover:bg-red-500/20 text-red-400 transition-colors flex items-center justify-center gap-2 text-sm">
                            <Trash2 size={14} /> Delete Account
                         </button>
                      </div>
                   </section>

                </motion.div>
              )}

              {/* NEURAL (AI) SUB-TAB - UPGRADED */}
              {activeSettingsTab === 'neural' && (
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="space-y-8">
                   
                   {/* Bio-Sync Module */}
                   <div className="bg-black/20 p-6 rounded-2xl border border-white/5 flex items-center justify-between">
                      <div>
                         <h3 className="font-display text-sm mb-1 flex items-center gap-2">
                            <Activity size={16} className={bioSyncActive ? "text-green-400" : "text-white/50"} />
                            Bio-Digital Sync
                         </h3>
                         <p className="text-xs text-white/40">Allow Gaya to read stress levels from wearables to adjust itinerary pacing.</p>
                      </div>
                      <button 
                        onClick={() => setBioSyncActive(!bioSyncActive)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${bioSyncActive ? 'bg-green-500' : 'bg-white/10'}`}
                      >
                         <div className={`w-4 h-4 rounded-full bg-white transition-transform ${bioSyncActive ? 'translate-x-6' : ''}`} />
                      </button>
                   </div>
                   
                   {bioSyncActive && (
                      <div className="h-16 flex items-end justify-between gap-1 px-2 pb-2">
                         {[...Array(20)].map((_, i) => (
                            <motion.div 
                              key={i}
                              animate={{ height: [10, Math.random() * 40 + 10, 10] }}
                              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                              className="w-full bg-green-500/20 rounded-t-sm border-t border-green-500/50"
                            />
                         ))}
                      </div>
                   )}

                   <div className="space-y-6">
                      <h3 className="font-display text-sm uppercase tracking-widest text-white/50">Vibe Equalizer</h3>
                      {/* Sliders */}
                      {Object.entries(aiSliders).map(([key, val]) => (
                         <div key={key}>
                           <div className="flex justify-between text-xs uppercase tracking-widest mb-2 text-white/70">
                              <span>Low {key}</span>
                              <span>High {key}</span>
                           </div>
                           <input 
                              type="range" min="0" max="100" 
                              value={val} 
                              onChange={(e) => setAiSliders({...aiSliders, [key as keyof typeof aiSliders]: parseInt(e.target.value)})}
                              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_white]"
                           />
                        </div>
                      ))}
                   </div>

                   {/* Dream Stream */}
                   <div>
                      <h3 className="font-display text-sm uppercase tracking-widest text-white/50 mb-3">Dream Stream (Subconscious)</h3>
                      <div className="flex flex-wrap gap-2">
                         {DREAM_KEYWORDS.map(word => (
                            <button
                              key={word}
                              onClick={() => toggleDreamWord(word)}
                              className={`px-3 py-1 text-xs rounded-full border transition-all ${dreamWords.includes(word) ? 'bg-blue-500/20 border-blue-400 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'bg-white/5 border-white/5 text-white/40 hover:border-white/30'}`}
                            >
                               {word}
                            </button>
                         ))}
                      </div>
                   </div>
                </motion.div>
              )}
              
              {/* WALLET SUB-TAB */}
              {activeSettingsTab === 'wallet' && (
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="space-y-6">
                   <h3 className="font-display text-xl mb-4">Payment Methods</h3>
                   <div className="relative h-56 w-full max-w-md mx-auto perspective-1000 group cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-black rounded-2xl border border-white/10 shadow-2xl overflow-hidden p-6 flex flex-col justify-between transition-transform duration-700 group-hover:rotate-y-12">
                         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                         <div className="flex justify-between items-start z-10">
                            <Zap size={24} className="text-white/50" />
                            <span className="font-display text-xs tracking-[0.3em] text-white/50">GAYA INFINITE</span>
                         </div>
                         <div className="font-mono text-xl tracking-widest z-10">•••• •••• •••• 8842</div>
                         <div className="flex justify-between text-xs z-10 text-white/50">
                            <span>ELENA FISHER</span>
                            <span>09/28</span>
                         </div>
                         {/* Shine Effect */}
                         <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      </div>
                   </div>
                   <MagneticButton className="w-full">
                      <button className="w-full py-3 border border-dashed border-white/20 rounded-xl text-white/50 hover:text-white hover:border-white transition-colors flex items-center justify-center gap-2">
                        <Plus size={16} /> Add New Card
                      </button>
                   </MagneticButton>
                </motion.div>
              )}

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

// --- ENHANCED SUB-COMPONENTS ---

const EnhancedBoardingPass: React.FC<{ booking: any }> = ({ booking }) => {
  const property = MOCK_PROPERTIES.find(p => p.id === booking.propertyId);
  if (!property) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-white/30 transition-all duration-300 relative group">
       {/* Background Image with Overlay */}
       <div className="absolute inset-0 z-0">
          <img src={property.image} className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity grayscale group-hover:grayscale-0 duration-700" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/50" />
       </div>

       <div className="relative z-10 flex flex-col lg:flex-row">
          
          {/* Left: Journey Data */}
          <div className="flex-1 p-8">
             <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-bold uppercase tracking-widest rounded mb-2 inline-block">Confirmed</span>
                  <h3 className="font-display text-3xl font-bold text-white mb-1">{property.title}</h3>
                  <p className="text-white/60 flex items-center gap-2"><MapPin size={14} /> {property.location}</p>
                </div>
                <div className="text-right hidden md:block">
                  <p className="text-[10px] uppercase tracking-widest text-white/40">Booking Ref</p>
                  <p className="font-mono text-lg text-white">{booking.id}</p>
                </div>
             </div>

             {/* Live Context Bar */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/5 p-4 rounded-xl border border-white/5 backdrop-blur-md">
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Check In</p>
                   <p className="font-mono text-sm">{booking.date}</p>
                </div>
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Guests</p>
                   <p className="font-mono text-sm">{booking.guests}</p>
                </div>
                {/* Simulated Weather Widget */}
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1 flex items-center gap-1"><Cloud size={10} /> Forecast</p>
                   <div className="flex items-center gap-2">
                      <Sun size={14} className="text-yellow-400" />
                      <span className="font-mono text-sm">24°C</span>
                   </div>
                </div>
                {/* Simulated Local Time */}
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Local Time</p>
                   <span className="font-mono text-sm">14:02 PM</span>
                </div>
             </div>

             {/* Action Buttons */}
             <div className="flex gap-3 mt-6">
                <button className="px-4 py-2 bg-white text-black rounded-lg text-xs font-bold uppercase hover:bg-gray-200 transition-colors">Manage</button>
                <button className="px-4 py-2 bg-white/10 text-white rounded-lg text-xs font-bold uppercase hover:bg-white/20 transition-colors flex items-center gap-2">
                   <Share2 size={14} /> Share
                </button>
             </div>
          </div>

          {/* Right: QR Code Zone */}
          <div className="w-full lg:w-64 border-t lg:border-t-0 lg:border-l border-white/10 bg-black/40 p-8 flex flex-col items-center justify-center text-center relative">
             <div className="p-3 bg-white rounded-xl mb-4">
                <QRCodeSVG value={booking.id} size={100} />
             </div>
             <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Scan for Access</p>
             <div className="w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

       </div>
    </div>
  );
}

export default UserDashboard;