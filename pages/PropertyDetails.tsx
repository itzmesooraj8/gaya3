import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Star, ShieldCheck, Check, Info } from 'lucide-react';
import MagneticButton from '../components/ui/MagneticButton';
import { MOCK_PROPERTIES, ADDONS } from '../constants';

const PropertyDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = MOCK_PROPERTIES.find(p => p.id === id) || MOCK_PROPERTIES[0];
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const { scrollY } = useScroll();
  const imageScale = useTransform(scrollY, [0, 500], [1, 0.8]);
  const imageOpacity = useTransform(scrollY, [0, 500], [1, 0.5]);
  const textY = useTransform(scrollY, [0, 400], [100, -50]);

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId]
    );
  };

  const calculateTotal = () => {
    const addonsTotal = selectedAddons.reduce((acc, id) => {
      const addon = ADDONS.find(a => a.id === id);
      return acc + (addon ? addon.price : 0);
    }, 0);
    return property.price + addonsTotal;
  };

  return (
    <div className="min-h-screen pb-20">
      <button 
        onClick={() => navigate(-1)}
        className="fixed top-8 left-8 z-40 p-3 bg-black/20 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/20 transition-colors"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Scrollytelling Hero */}
      <div className="h-[80vh] w-full relative overflow-hidden flex items-center justify-center">
        <motion.div 
          style={{ scale: imageScale, opacity: imageOpacity }}
          className="absolute inset-0 z-0"
        >
           <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-black/40" />
        </motion.div>
        
        <motion.div 
          style={{ y: textY }}
          className="relative z-10 text-center px-4"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-6xl md:text-8xl font-bold tracking-tighter mb-4"
          >
            {property.title}
          </motion.h1>
          <div className="flex justify-center gap-4 text-white/80">
            <span className="px-3 py-1 border border-white/30 rounded-full text-sm backdrop-blur-sm">{property.location}</span>
            <span className="px-3 py-1 border border-white/30 rounded-full text-sm backdrop-blur-sm flex items-center gap-1"><Star size={12} fill="currentColor" /> {property.rating}</span>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 -mt-20 relative z-20">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          <div className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
            <h2 className="font-display text-2xl mb-6">THE EXPERIENCE</h2>
            <p className="text-lg text-white/70 leading-relaxed font-light mb-8">
              {property.description}
            </p>
            
            <h3 className="font-bold text-sm text-white/50 uppercase tracking-widest mb-4">Features</h3>
            <div className="flex flex-wrap gap-3">
              {property.features.map(feat => (
                <div key={feat} className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/5">
                  <ShieldCheck size={16} className="text-green-400" />
                  <span className="text-sm">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 360 Viewer Placeholder */}
          <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 group">
             <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                <p className="text-white/50 group-hover:text-white transition-colors">360° Interactive View Loading...</p>
             </div>
             {/* Simulate a panoramic strip */}
             <div className="absolute inset-0 bg-[url('https://picsum.photos/1200/400')] opacity-30 bg-cover bg-center" />
          </div>
        </div>

        {/* Checkout Flow */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white/5 backdrop-blur-2xl border border-white/10 p-6 rounded-3xl">
            <h3 className="font-display text-xl mb-6">CURATE YOUR STAY</h3>
            
            {/* Add-ons */}
            <div className="space-y-3 mb-8">
              {ADDONS.map(addon => (
                <div 
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedAddons.includes(addon.id) 
                      ? 'bg-white/10 border-white/40' 
                      : 'bg-transparent border-white/5 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{addon.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold">{addon.name}</p>
                      <p className="text-xs text-white/50">₹{addon.price}</p>
                    </div>
                  </div>
                  {selectedAddons.includes(addon.id) && <Check size={16} className="text-green-400" />}
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-6 mb-6 space-y-2">
              <div className="flex justify-between text-white/60">
                <span>Base Price</span>
                <span>₹{property.price.toLocaleString()}</span>
              </div>
              {selectedAddons.length > 0 && (
                 <div className="flex justify-between text-green-400 text-sm">
                   <span>Add-ons</span>
                   <span>+ ₹{(calculateTotal() - property.price).toLocaleString()}</span>
                 </div>
              )}
              <div className="flex justify-between text-2xl font-bold mt-4">
                <span>Total</span>
                <span>₹{calculateTotal().toLocaleString()}</span>
              </div>
            </div>

            <MagneticButton className="w-full">
              <button className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                RESERVE NOW
              </button>
            </MagneticButton>
            
            <button className="w-full py-3 mt-3 text-white/50 text-sm hover:text-white transition-colors flex items-center justify-center gap-2">
               Request Custom Quote <Info size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
