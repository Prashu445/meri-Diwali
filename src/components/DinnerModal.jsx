// src/components/DinnerModal.jsx
import React, { useState } from 'react';
import { X, Utensils, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { FAMILY_MEMBERS } from '../data/diwaliData';

const DISHES = [
  { id: 'poori_paneer', name: 'Shahi Paneer and Garma-Garam Poori', icon: '🍛🫓' },
  { id: 'chole_pulao', name: 'Pindi Chole and Kesar Pulao', icon: '🥘🍚' },
  { id: 'dahi_bhalla', name: 'Meethi Dahi Bhalla Papdi', icon: '🥣✨' },
  { id: 'mithai_thali', name: 'Kaju Katli and Gulab Jamun', icon: '🍬🍯' },
];

export default function DinnerModal({ isOpen, onClose, onFinishDinner }) {
  const [servedDishes, setServedDishes] = useState([]);
  const [bitesTaken, setBitesTaken] = useState(0);
  const [activeSpeaker, setActiveSpeaker] = useState(FAMILY_MEMBERS[1]);

  if (!isOpen) return null;

  const allServed = servedDishes.length === DISHES.length;
  const dinnerCompleted = allServed && bitesTaken >= 3;

  const handleServeDish = (dish) => {
    if (servedDishes.includes(dish.id)) return;
    setServedDishes((prev) => [...prev, dish.id]);
    soundEngine.playChime();
    soundEngine.speakHindi(`${dish.name} table par paros diya gaya!`, 0.6, 0.9);
  };

  const handleEatTogether = () => {
    const nextBite = bitesTaken + 1;
    setBitesTaken(nextBite);
    const speaker = FAMILY_MEMBERS[nextBite % FAMILY_MEMBERS.length];
    setActiveSpeaker(speaker);
    soundEngine.playChime();
    soundEngine.speakHindi(speaker.speechLine, 0.6, 0.9);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md font-sans select-none">
      <div className="w-full max-w-4xl rounded-3xl bg-slate-950 border-2 border-amber-500/60 text-amber-50 p-6 shadow-2xl overflow-y-auto max-h-[92vh]">
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
          <div>
            <h2 className="text-2xl font-black text-amber-400 flex items-center gap-2">
              🍽️ Parivaar Ke Sath Diwali Bhojan
            </h2>
            <p className="text-xs text-amber-200/80">
              Gol dining table par parivaar ke sath bhojan ka anand lein.
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative mt-5 p-6 rounded-3xl bg-gradient-to-b from-amber-950/70 via-slate-900 to-slate-950 border-2 border-amber-500/50 flex flex-col items-center justify-center min-h-[340px] shadow-2xl overflow-hidden">
          <div className="relative w-72 h-72 rounded-full bg-amber-900/60 border-4 border-amber-500/80 shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center justify-center my-4">
            <div className="absolute inset-4 rounded-full border border-amber-400/30 flex flex-col items-center justify-center text-center p-2 bg-slate-950/50">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">Diwali Dawat</div>
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
                {servedDishes.length === 0 ? (
                  <span className="text-xs text-amber-200/70 italic">Table khali hai. Niche se pakwan parosein!</span>
                ) : (
                  servedDishes.map((dId) => {
                    const dishObj = DISHES.find((d) => d.id === dId);
                    return (
                      <span key={dId} className="px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-400/40 text-xs font-bold text-amber-100 shadow">
                        {dishObj?.icon} {dishObj?.name.split('&')[0]}
                      </span>
                    );
                  })
                )}
              </div>
            </div>

            {FAMILY_MEMBERS.map((member, idx) => {
              const angle = (idx / FAMILY_MEMBERS.length) * 2 * Math.PI - Math.PI / 2;
              const distance = 115;
              const x = Math.cos(angle) * distance;
              const y = Math.sin(angle) * distance;
              const isSpeaking = activeSpeaker?.id === member.id;

              return (
                <div
                  key={member.id}
                  onClick={() => {
                    setActiveSpeaker(member);
                    soundEngine.speakHindi(member.speechLine, 0.6, 0.9);
                  }}
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                  className={`absolute cursor-pointer p-2 rounded-2xl border text-center transition-all duration-300 ${
                    isSpeaking
                      ? 'bg-amber-500/30 border-amber-300 scale-110 shadow-[0_0_20px_rgba(251,191,36,0.8)] z-20'
                      : 'bg-slate-900/90 border-amber-500/30 hover:border-amber-400 z-10'
                  }`}
                >
                  <div className="text-2xl">{member.avatar}</div>
                  <div className="text-[10px] font-black text-amber-300 truncate max-w-[70px]">{member.name}</div>
                </div>
              );
            })}
          </div>

          <div className="w-full max-w-2xl p-3.5 rounded-2xl bg-amber-950/50 border border-amber-600/50 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
            <div className="text-xs text-amber-100 italic">
              💬 <b>{activeSpeaker.name}:</b> &ldquo;{activeSpeaker.line}&rdquo;
            </div>
            <div className="text-xs font-bold text-amber-300 shrink-0">
              Bites: {bitesTaken}/3
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
            Step 1: Gol Dining Table Par Pakwan Parosein ({servedDishes.length}/4)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {DISHES.map((dish) => {
              const isServed = servedDishes.includes(dish.id);
              return (
                <button
                  key={dish.id}
                  onClick={() => handleServeDish(dish)}
                  className={`p-3 rounded-2xl border flex items-center justify-between text-left transition ${
                    isServed ? 'bg-emerald-950/50 border-emerald-400/50 text-emerald-200' : 'bg-slate-900 hover:bg-slate-800 border-amber-500/30 text-amber-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{dish.icon}</span>
                    <span className="text-xs font-bold">{dish.name}</span>
                  </div>
                  <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300">
                    {isServed ? '✓ Served' : '+ Serve'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-amber-500/30 flex flex-wrap items-center justify-between gap-3">
          <button
            disabled={!allServed}
            onClick={handleEatTogether}
            className={`px-6 py-3 rounded-2xl font-black text-xs md:text-sm flex items-center gap-2 transition ${
              allServed ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Utensils className="w-4 h-4" />
            Parivaar Ke Sath Khana Khayein ({Math.min(3, bitesTaken)}/3)
          </button>

          <button
            disabled={!dinnerCompleted}
            onClick={onFinishDinner}
            className={`px-6 py-3 rounded-2xl font-black text-xs md:text-sm flex items-center gap-2 transition ${
              dinnerCompleted ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-xl hover:scale-105' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Grand Diwali Celebration Complete! &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}