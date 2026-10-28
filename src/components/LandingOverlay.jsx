// src/components/LandingOverlay.jsx
import React from 'react';
import { Sparkles, Share2, Heart } from 'lucide-react';

export default function LandingOverlay({ onEnterMohalla, onOpenDaanPatra, onInviteFriends }) {
  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-between p-6 md:p-10 bg-black/60 backdrop-blur-md text-amber-50 select-none font-sans">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="px-4.5 py-2.5 rounded-full bg-slate-950/90 border border-amber-500/50 text-amber-200 text-sm md:text-base font-semibold shadow-2xl backdrop-blur-md">
          🪔 आओ मिलकर दीया जलाएँ
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block tracking-[0.25em] text-xs md:text-sm font-bold text-amber-300">
            HAPPY DIWALI
          </span>
          <button
            onClick={onOpenDaanPatra}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs md:text-sm shadow-xl transition hover:scale-105"
          >
            🪔 Daan patra
          </button>
        </div>
      </div>

      {/* Center Hero Typography & CTAs */}
      <div className="my-auto flex flex-col items-center text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs tracking-widest uppercase mb-6 shadow-lg backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-amber-400" /> Interactive 3D Low-Poly Diwali Experience
        </div>

        <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight text-amber-400 drop-shadow-[0_8px_30px_rgba(245,158,11,0.6)]">
          <span>मेरी </span>
          <span className="font-serif italic text-amber-100">Diwali.</span>
        </h1>

        <p className="mt-4 text-xl md:text-2xl text-amber-100/95 font-medium tracking-wide">
          Ghar chaloge Diwali manane? ❤️
        </p>

        {/* Primary CTA */}
        <button
          onClick={onEnterMohalla}
          className="mt-9 group relative px-11 py-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 shadow-[0_0_40px_rgba(245,158,11,0.7)] hover:scale-105 transition-all duration-300"
        >
          <div className="text-lg md:text-xl font-black tracking-wider">
            ENTER MOHALLA &rarr;
          </div>
          <div className="text-[10px] md:text-xs font-bold tracking-widest uppercase opacity-85 mt-1">
            WALK FREELY · DECORATE · CELEBRATE WITH FAMILY
          </div>
        </button>

        {/* Secondary Invite Button */}
        <button
          onClick={onInviteFriends}
          className="mt-5 inline-flex items-center gap-2 px-7 py-3 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 text-amber-200 text-sm font-semibold shadow-xl backdrop-blur-md transition hover:scale-105"
        >
          <Share2 className="w-4 h-4 text-amber-400" />
          Doston ko bulao · Invite
        </button>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-amber-200/80 gap-3 border-t border-amber-500/25 pt-4">
        <div>WASD / Arrows: Walk · Drag: Rotate Camera · E: Interact · Space: Jump</div>
        <div className="flex items-center gap-1.5 font-medium">
          Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Ghar Wali Diwali
        </div>
      </div>
    </div>
  );
}