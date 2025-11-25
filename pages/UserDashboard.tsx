
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Sparkles, MapPin, Settings, LogOut, CreditCard, 
  Heart, User as UserIcon, Star, Calendar, Users, 
  Plane, Compass, Zap 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TiltCard from '../components/ui/TiltCard';
import MagneticButton from '../components/ui/MagneticButton';
import { MOCK_BOOKINGS, MOCK_PROPERTIES } from '../constants';
import { useAuth } from '../contexts/AuthContext';

// --- TYPES & MOCKS ---
type Tab = 'journeys' | 'wishlist' | 'settings';

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('journeys');

  // Fallback mock user if context isn't ready (per requirements)
  const displayUser = user || {
    id: 'mock-1',
    name: 'Elena Fisher',
    email: 'elena@nomad.com',
    role: 'user',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Elena',
    memberStatus: 'Platinum'
  };

  const upcomingBookings = MOCK_BOOKINGS.filter(b => b.status === 'UPCOMING');
  const pastBookings = MOCK_BOOKINGS.filter(b => b.status === 'COMPLETED');
  // Mock wishlist slice
  const wishlistProperties = [MOCK_PROPERTIES[1], MOCK_PROPERTIES[3], MOCK_PROPERTIES[0]];

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
    },
    exit: { opacity: 0, y: 20 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen pt-32 px-4 md:px-12 max-w-7xl mx-auto pb-24 font-body">
      
      {/* --- COMMAND CENTER HEADER --- */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-16 group"
      >
        {/* Ambient Glow Behind */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-teal-500/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-1000" />
        
        <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
            
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full p-[2px] bg-gradient-to-tr from-white/50 to-transparent">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-black relative z-10">
                  <img src={displayUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>
              {/* Breathing Glow */}
              <div className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse" />
              <div className="absolute bottom-0 right-0 bg-black/80 backdrop-blur-md border border-white/20 text-yellow-400 p-2 rounded-full">
                <Star size={18} fill="currentColor" />
              </div>
            </div>

            {/* Info */}
            <div className="text-center md:text-left flex-1 space-y-4">
              <div>
                <div className="flex flex-col md:flex-row items-center gap-4 justify-center md:justify-start">
                  <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white">
                    {displayUser.name}
                  </h1>
                  <span className="px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-display tracking-widest uppercase text-white/80">
                    {displayUser.memberStatus || 'Member'}
                  </span>
                </div>
                <p className="text-white/40 font-light text-lg mt-1">{displayUser.email}</p>
              </div>

              {/* Stats Grid */}
              <div className="flex items-center justify-center md:justify-start gap-8 md:gap-12 pt-4">
                <div>
                  <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest mb-1">
                    <Sparkles size={12} /> Vibe Score
                  </div>
                  <div className="font-display text-2xl">4.9</div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest mb-1">
                    <Compass size={12} /> Sanctuaries
                  </div>
                  <div className="font-display text-2xl">{pastBookings.length + upcomingBookings.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- NAVIGATION TABS --- */}
      <div className="flex justify-center md:justify-start gap-12 mb-12 border-b border-white/10 pb-1">
        {(['journeys', 'wishlist', 'settings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="relative py-4 group"
          >
            <span className={`font-display text-sm md:text-lg tracking-widest uppercase transition-colors duration-300 ${activeTab === tab ? 'text-white' : 'text-white/30 group-hover:text-white/60'}`}>
              My {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </span>
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTabGlow"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" 
              />
            )}
          </button>
        ))}
      </div>

      {/* --- TAB CONTENT --- */}
      <AnimatePresence mode="wait">
        
        {/* 1. MY JOURNEYS */}
        {activeTab === 'journeys' && (
          <motion.div
            key="journeys"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-16"
          >
            {/* UPCOMING */}
            <section>
              <h3 className="font-display text-xl text-white/50 mb-8 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                In The Stars (Upcoming)
              </h3>
              <div className="space-y-8">
                {upcomingBookings.length > 0 ? (
                  upcomingBookings.map((booking) => (
                    <motion.div key={booking.id} variants={itemVariants}>
                      <BoardingPass booking={booking} />
                    </motion.div>
                  ))
                ) : (
                  <div className="p-12 rounded-3xl border border-dashed border-white/10 text-center text-white/30 font-display">
                    No upcoming voyages manifested.
                  </div>
                )}
              </div>
            </section>

            {/* PAST */}
            <section>
              <h3 className="font-display text-xl text-white/30 mb-8">Memory Archives (Past)</h3>
              <div className="space-y-4 opacity-60 hover:opacity-100 transition-opacity duration-500">
                {pastBookings.map((booking) => (
                  <motion.div key={booking.id} variants={itemVariants}>
                    <PastJourneyRow booking={booking} />
                  </motion.div>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {/* 2. WISHLIST */}
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
              <motion.div key={property.id} variants={itemVariants} className="relative group">
                <TiltCard className="h-full">
                  <div className="relative h-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer" onClick={() => navigate(`/property/${property.id}`)}>
                    <div className="aspect-[4/5] relative">
                      <img src={property.image} alt={property.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                      
                      {/* Floating Info */}
                      <div className="absolute bottom-0 left-0 p-6 w-full">
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-xs text-white/50 mb-1 flex items-center gap-1"><MapPin size={10} /> {property.location}</p>
                            <h3 className="font-display text-lg font-bold leading-tight">{property.title}</h3>
                          </div>
                          <div className="text-right">
                             <p className="font-display text-sm">₹{property.price.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
                {/* Remove Button */}
                <button className="absolute top-4 right-4 z-20 p-3 bg-black/40 backdrop-blur-md rounded-full text-white/50 hover:text-red-500 hover:bg-white transition-all transform hover:scale-110 border border-white/10">
                  <Heart size={16} fill="currentColor" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* 3. SETTINGS */}
        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            {/* Left: Profile Form */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                <h3 className="font-display text-xl mb-6 flex items-center gap-2">
                  <Settings size={20} className="text-white/50" /> Identity
                </h3>
                <div className="space-y-6">
                  <div className="group">
                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-white transition-colors">Full Name</label>
                    <input type="text" defaultValue={displayUser.name} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:bg-white/10 focus:border-white/30 transition-all font-body" />
                  </div>
                  <div className="group">
                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-white transition-colors">Digital ID (Email)</label>
                    <input type="email" defaultValue={displayUser.email} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:bg-white/10 focus:border-white/30 transition-all font-body" />
                  </div>
                  <div className="pt-4">
                     <MagneticButton className="w-fit">
                       <button className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">SAVE CHANGES</button>
                     </MagneticButton>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Wallet & Logout */}
            <motion.div variants={itemVariants} className="space-y-8">
              
              {/* Visual Credit Card */}
              <div className="relative h-64 w-full perspective-1000 group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-black rounded-3xl border border-white/10 shadow-2xl overflow-hidden transform transition-transform duration-500 group-hover:rotate-y-3 group-hover:scale-[1.02]">
                  {/* Glass Sheen */}
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
                  <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
                  
                  <div className="relative z-10 p-8 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-8 rounded bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center">
                        <div className="w-8 h-5 border border-white/20 rounded-[2px]" />
                      </div>
                      <span className="font-display text-white/30 tracking-[0.2em] text-sm">GAYA INFINITE</span>
                    </div>

                    <div className="font-mono text-2xl tracking-[0.2em] text-white/80 drop-shadow-lg">
                      •••• •••• •••• 8842
                    </div>

                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] uppercase text-white/30 mb-1">Card Holder</p>
                        <p className="font-display text-sm tracking-wide">{displayUser.name.toUpperCase()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase text-white/30 mb-1">Expires</p>
                        <p className="font-mono text-sm">09/28</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logout */}
              <MagneticButton className="w-full">
                <button 
                  onClick={handleLogout}
                  className="w-full py-4 bg-red-500/5 border border-red-500/20 text-red-400 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  <LogOut size={18} /> DISCONNECT
                </button>
              </MagneticButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const BoardingPass: React.FC<{ booking: any }> = ({ booking }) => {
  const property = MOCK_PROPERTIES.find(p => p.id === booking.propertyId);
  if (!property) return null;

  return (
    <div className="flex flex-col lg:flex-row bg-white/5 border border-white/10 rounded-3xl overflow-hidden group hover:border-white/20 transition-all duration-300">
      
      {/* Left: Journey Info */}
      <div className="flex-1 p-6 lg:p-8 flex flex-col md:flex-row gap-6 relative">
        <div className="w-full md:w-48 h-48 md:h-auto rounded-2xl overflow-hidden relative">
          <img src={property.image} alt={property.title} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
        </div>
        
        <div className="flex-1 flex flex-col justify-between py-2">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-display text-white/40 tracking-widest">FLIGHT: G-304</span>
              <span className="px-2 py-0.5 rounded border border-green-500/30 text-green-400 text-[10px] uppercase tracking-wider bg-green-500/10">Confirmed</span>
            </div>
            <h3 className="font-display text-2xl font-bold mb-2">{property.title}</h3>
            <p className="text-white/50 text-sm flex items-center gap-2"><MapPin size={14} /> {property.location}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 p-4 bg-white/5 rounded-xl border border-white/5">
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1 flex items-center gap-1"><Calendar size={10} /> Check In</p>
              <p className="font-mono text-sm">{booking.date}</p>
            </div>
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1 flex items-center gap-1"><Users size={10} /> Guests</p>
              <p className="font-mono text-sm">{booking.guests} Adults</p>
            </div>
          </div>
        </div>
      </div>

      {/* Perforation Line (CSS Dashed) */}
      <div className="hidden lg:flex flex-col items-center justify-center relative w-8">
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 border-l-2 border-dashed border-white/20 h-full" />
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-black rounded-full" />
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-black rounded-full" />
      </div>

      {/* Horizontal Perforation for Mobile */}
      <div className="lg:hidden w-full h-8 relative flex items-center justify-center">
         <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-white/20 w-full" />
         <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-black rounded-full" />
         <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-black rounded-full" />
      </div>

      {/* Right: QR Code */}
      <div className="w-full lg:w-72 bg-white/5 p-8 flex flex-col items-center justify-center text-center relative">
        <div className="bg-white p-3 rounded-xl mb-4 shadow-lg group-hover:scale-105 transition-transform duration-300">
          <QRCodeSVG value={`GAYA-BOOKING-${booking.id}`} size={100} level="M" />
        </div>
        <p className="font-display text-xs text-white/50 tracking-widest mb-1">SCAN FOR ACCESS</p>
        <p className="font-mono text-[10px] text-white/30">{booking.id}</p>
      </div>
    </div>
  );
};

const PastJourneyRow: React.FC<{ booking: any }> = ({ booking }) => {
  const property = MOCK_PROPERTIES.find(p => p.id === booking.propertyId);
  if (!property) return null;

  return (
    <div className="flex items-center gap-6 p-4 rounded-2xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all">
      <div className="w-16 h-16 rounded-lg overflow-hidden grayscale">
        <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1">
        <h4 className="font-display text-sm font-bold">{property.title}</h4>
        <p className="text-xs text-white/40">{booking.date}</p>
      </div>
      <div className="text-right">
        <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-wider text-white/30">Completed</span>
      </div>
    </div>
  );
};

export default UserDashboard;
    