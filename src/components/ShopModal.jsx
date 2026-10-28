// src/components/ShopModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Volume2, ShoppingBag } from 'lucide-react';
import { CRACKER_CATALOG } from '../data/diwaliData';
import { soundEngine } from '../utils/soundEngine';

export default function ShopModal({ shop, onClose, onBuyCracker }) {
  const [lastBoughtMsg, setLastBoughtMsg] = useState('');

  // 🌟 FIX: Jaise hi nayi dukaan khulegi, purana message clear hoga aur dukaandar khud bolega
  useEffect(() => {
    if (shop) {
      setLastBoughtMsg(''); // Purani dukaan ki baat bhool jao
      
      // Dukaan khulte hi dukaandar ka swagat auto-play hoga
      const greetingToSpeak = shop.speechGreeting || shop.greeting;
      soundEngine.speakHindi(greetingToSpeak, 0.6, 0.9);
    }
  }, [shop]);

  if (!shop) return null;

  const handleSpeakGreeting = () => {
    soundEngine.speakHindi(lastBoughtMsg || shop.speechGreeting || shop.greeting, 0.6, 0.9);
  };

  const handleRequestItem = (item) => {
    onBuyCracker(item);
    const reply = `${item.qtyPack} ${item.name} de diye!`;
    setLastBoughtMsg(reply);
    soundEngine.playChime();
    soundEngine.speakHindi(reply, 0.6, 0.9);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans select-none">
      <div className="w-full max-w-lg rounded-3xl bg-slate-950 border-2 border-amber-500/60 text-amber-50 p-6 shadow-2xl">
        <div className="flex items-start justify-between border-b border-amber-500/30 pb-4">
          <div className="flex items-center gap-3">
            <div
              onClick={handleSpeakGreeting}
              className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-3xl shadow-inner cursor-pointer hover:scale-105 transition"
              title="Click to hear dialogue"
            >
              {shop.avatar}
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase">
                Diwali Pataka Market
              </span>
              <h2 className="text-xl font-black text-amber-400 mt-0.5">{shop.name}</h2>
              <p className="text-xs text-amber-200/80">Dukaandar: {shop.owner}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 p-3.5 rounded-2xl bg-amber-950/50 border border-amber-500/40 flex items-center justify-between gap-3 shadow-inner">
          <div className="text-xs md:text-sm text-amber-100 font-medium italic">
            &ldquo;{lastBoughtMsg || shop.greeting}&rdquo;
          </div>
          <button
            onClick={handleSpeakGreeting}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 hover:bg-amber-400 transition shadow"
          >
            <Volume2 className="w-3.5 h-3.5" /> Suniye
          </button>
        </div>

        <div className="mt-4 space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {CRACKER_CATALOG.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-2xl bg-slate-900 border border-amber-500/25 flex items-center justify-between hover:border-amber-400 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="text-sm font-bold text-amber-100">{item.name}</div>
                  <div className="text-[11px] text-amber-300/80">&ldquo;{item.hindiReq}&rdquo;</div>
                </div>
              </div>

              <button
                onClick={() => handleRequestItem(item)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs flex items-center gap-1.5 hover:scale-105 transition shadow"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> +{item.qtyPack} Lein
              </button>
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-200 text-xs font-bold transition"
          >
            Dukaan Se Bahar Aayein
          </button>
        </div>
      </div>
    </div>
  );
}