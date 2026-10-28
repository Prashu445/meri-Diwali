// src/components/PujaModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Sparkles, Lock, Flame } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export default function PujaModal({ isOpen, onClose, onCompletePuja }) {
  const [litDiyas, setLitDiyas] = useState([false, false, false, false, false]);
  const [flowerShowerCount, setFlowerShowerCount] = useState(0);
  const [fallingPetals, setFallingPetals] = useState([]);
  const [aartiAngle, setAartiAngle] = useState(0);
  const [aartiProgress, setAartiProgress] = useState(0);
  const [isAartiPlaying, setIsAartiPlaying] = useState(false);
  const [bhogOffered, setBhogOffered] = useState([false, false, false]);

  const allDiyasLit = litDiyas.every(Boolean);
  const pushpanjaliDone = flowerShowerCount >= 3;
  const aartiDone = aartiProgress >= 100;
  const allBhogDone = bhogOffered.every(Boolean);
  const isPujaFullyDone = allDiyasLit && pushpanjaliDone && aartiDone && allBhogDone;

  // Continuous rotation as long as Aarti modal is open or playing
  useEffect(() => {
    const interval = setInterval(() => {
      setAartiAngle((prev) => prev + 0.08); // Continuous rotation speed
      if (isAartiPlaying) {
        setAartiProgress((prev) => Math.min(100, prev + 0.8));
      }
    }, 40);
    return () => clearInterval(interval);
  }, [isAartiPlaying]);

  if (!isOpen) return null;

  const handleLightDiya = (idx) => {
    if (litDiyas[idx]) return;
    const updated = [...litDiyas];
    updated[idx] = true;
    setLitDiyas(updated);
  };

  const handleShowerFlowers = () => {
    setFlowerShowerCount((c) => c + 1);
    const batch = Array.from({ length: 14 }).map((_, i) => ({
      id: Date.now() + i,
      left: 15 + Math.random() * 70,
      emoji: i % 2 === 0 ? '🌼' : '🌺',
    }));
    setFallingPetals(batch);
    setTimeout(() => setFallingPetals([]), 1600);
  };

  const handleStartAarti = () => {
    if (isAartiPlaying) return;
    setIsAartiPlaying(true);
    soundEngine.playAartiAudio('/audio/aarti.mp3', () => {
      setAartiProgress(100);
      setIsAartiPlaying(false);
    });
  };

  const handleOfferBhog = (idx) => {
    if (bhogOffered[idx]) return;
    const updated = [...bhogOffered];
    updated[idx] = true;
    setBhogOffered(updated);
  };

  const radiusX = 120;
  const radiusY = 50;
  const thaliX = Math.cos(aartiAngle) * radiusX;
  const thaliY = Math.sin(aartiAngle) * radiusY;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md font-sans select-none">
      <div className="w-full max-w-3xl rounded-3xl bg-gradient-to-b from-amber-950 via-slate-950 to-slate-950 border-2 border-amber-400/70 text-amber-50 p-6 shadow-2xl overflow-hidden">
        
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
          <div>
            <h2 className="text-2xl font-black text-amber-400 flex items-center gap-2">
              🛕 Shri Lakshmi-Ganesh Pujan & Aarti
              {isAartiPlaying && <span className="text-xs px-2.5 py-0.5 rounded bg-red-600 text-white animate-pulse">🔒 Aarti Locked</span>}
            </h2>
            <p className="text-xs text-amber-200/80">
              Aarti thali continuous gol-gol ghoom rahi hai.
            </p>
          </div>

          {!isAartiPlaying ? (
            <button onClick={onClose} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-200">
              <X className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-950 border border-red-500 text-red-300 text-xs font-bold">
              <Lock className="w-3.5 h-3.5" /> Aarti in Progress...
            </div>
          )}
        </div>

        <div className="relative mt-4 h-80 rounded-2xl bg-gradient-to-b from-red-950/90 via-amber-950/80 to-slate-900 border-2 border-amber-500/50 flex flex-col items-center justify-center overflow-hidden shadow-inner">
          <div className="absolute top-0 inset-x-0 py-1 bg-amber-500/20 border-b border-amber-400/30 text-center text-xs tracking-widest text-amber-300 font-semibold">
            ✨ Shubh Deepawali · Om Shreem Maha Lakshmyai Namah ✨
          </div>

          {fallingPetals.map((p) => (
            <div key={p.id} className="absolute top-8 text-2xl animate-bounce pointer-events-none" style={{ left: `${p.left}%` }}>
              {p.emoji}
            </div>
          ))}

          <div className="flex items-center gap-12 z-10 mt-4">
            <div className="flex flex-col items-center p-2 rounded-2xl bg-amber-500/15 border border-amber-400/50 shadow-lg">
              <div className="w-24.5 h-28 rounded-xl overflow-hidden bg-slate-900 border border-amber-400/40 flex items-center justify-center shadow-md">
                <img src="/ganesh.png" alt="Ganesh Ji" className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; }} />
              </div>
              <div className="text-xs font-black text-amber-300 mt-1">Shri Ganesh Ji</div>
            </div>

            <div className="flex flex-col items-center p-2 rounded-2xl bg-rose-500/15 border border-amber-400/50 shadow-lg">
              <div className="w-24.5 h-28 rounded-xl overflow-hidden bg-slate-900 border border-amber-400/40 flex items-center justify-center shadow-md">
                <img src="/lakshmi.png" alt="Lakshmi Ji" className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; }} />
              </div>
              <div className="text-xs font-black text-amber-300 mt-1">Maa Lakshmi Ji</div>
            </div>
          </div>

          {/* Continuous Orbiting Aarti Thali */}
          <div
            style={{ transform: `translate(${thaliX}px, ${thaliY}px)` }}
            className="absolute z-35 w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 via-yellow-500 to-orange-600 border-4 border-amber-100 shadow-[0_0_35px_rgba(251,191,36,0.95)] flex flex-col items-center justify-center select-none transition-transform duration-75 pointer-events-none"
          >
            <div className="relative flex items-center justify-center">
              <Flame className="w-6 h-6 text-red-600 fill-amber-300 animate-bounce" />
              <span className="absolute -top-3 text-[10px]">🪔</span>
            </div>
            <span className="text-[8px] font-black text-slate-950 uppercase tracking-tighter">Aarti Thali</span>
          </div>

          <div className="flex items-center gap-3 mt-4 z-10">
            {litDiyas.map((isLit, i) => (
              <button
                key={i}
                onClick={() => handleLightDiya(i)}
                className={`px-3 py-1 rounded-xl border text-xs font-bold transition ${
                  isLit ? 'bg-amber-500/30 border-amber-300 text-amber-200 scale-105 shadow' : 'bg-slate-900/80 border-amber-500/30 text-amber-400/70 hover:border-amber-400'
                }`}
              >
                {isLit ? '🪔 Lit' : `🪔 Diya #${i + 1}`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 mt-2 z-10 text-xs">
            {['🟡 Motichoor Ladoo', '💎 Kaju Katli', '🥣 Kesar Kheer'].map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleOfferBhog(idx)}
                className={`px-3 py-1 rounded-lg border font-semibold ${
                  bhogOffered[idx] ? 'bg-emerald-900/60 border-emerald-400 text-emerald-200' : 'bg-slate-900/70 border-amber-500/30 text-amber-200 hover:bg-slate-800'
                }`}
              >
                {bhogOffered[idx] ? `✓ ${item}` : `+ ${item}`}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <button
            onClick={handleShowerFlowers}
            className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-amber-500/40 flex items-center justify-between text-left transition"
          >
            <div>
              <div className="text-xs font-bold text-amber-300">1. Pushpanjali (Phool Barsayein)</div>
              <div className="text-[11px] text-amber-100/70">Phool chadhayein ({Math.min(3, flowerShowerCount)}/3)</div>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs">🌼 Shower</span>
          </button>

          <button
            onClick={handleStartAarti}
            className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-amber-500/40 flex items-center justify-between text-left transition"
          >
            <div>
              <div className="text-xs font-bold text-amber-300">2. Aarti Audio & Visual ({Math.round(aartiProgress)}%)</div>
              <div className="text-[11px] text-amber-100/70">{isAartiPlaying ? 'Aarti chal rahi hai...' : 'Click to Start Aarti'}</div>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-orange-500 text-slate-950 font-black text-xs">🪔 Start Aarti</span>
          </button>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-amber-500/30 pt-4">
          <div className="text-xs text-amber-200">
            {isPujaFullyDone ? '✨ Aarti sampann! Ab aap puja samapt kar sakte hain.' : 'Sabhi steps pure karein aur Aarti chalayein.'}
          </div>

          <button
            disabled={!isPujaFullyDone || isAartiPlaying}
            onClick={() => {
              soundEngine.stopAartiAudio();
              onCompletePuja();
            }}
            className={`px-6 py-3 rounded-2xl font-black text-xs md:text-sm flex items-center gap-2 transition ${
              isPujaFullyDone && !isAartiPlaying
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-lg hover:scale-105'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Puja Samapt Karein &rarr;
          </button>
        </div>

      </div>
    </div>
  );
}