// src/components/HUDOverlay.jsx
import React from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  ShoppingBag,
  Camera,
  HelpCircle,
  Play,
  Pause,
  SkipForward,
  SkipBack,
} from 'lucide-react';
import { JOURNEY_STEPS, BHAJAN_TRACKS, CRACKER_CATALOG } from '../data/diwaliData';

export default function HUDOverlay({
  currentZone,
  soundOn,
  onToggleSound,
  bhajanPlaying,
  onToggleBhajan,
  currentTrackIndex,
  onNextTrack,
  onPrevTrack,
  volume,
  onVolumeChange,
  bagCount,
  onOpenBag,
  onOpenPhoto,
  onOpenHelp,
  onOpenDaanPatra,
  isRunning,
  onToggleRun,
  virtualKeysRef,
  playerPos,
  onTeleport,
  stepCompletion,
  completedDecorIds,
  sanathiState,
  activePrompt,
  onTriggerInteract,
  inventory,
  onBurstCracker,
  toastData,
}) {
  const currentStepObj =
    JOURNEY_STEPS.find((s) => !stepCompletion[s.id]) || JOURNEY_STEPS[JOURNEY_STEPS.length - 1];
  const currentTrack = BHAJAN_TRACKS[currentTrackIndex];
  const completedStepsCount = Object.values(stepCompletion).filter(Boolean).length;

  const setVKey = (key, val) => {
    if (virtualKeysRef?.current) {
      virtualKeysRef.current[key] = val;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 md:p-5 select-none font-sans">
      {/* TOP BAR */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-2 pointer-events-auto">
          <div className="flex items-center gap-2">
            <div className="px-3.5 py-1.5 rounded-full bg-[#1a1325]/95 border border-amber-500/50 text-amber-400 font-bold text-sm shadow-lg">
              मेरी <span className="italic font-serif text-amber-100">Diwali.</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-[#1a1325]/95 border border-amber-500/40 text-amber-200 text-xs font-semibold flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              • {currentZone}
            </div>
          </div>

          <div className="w-80 p-3 rounded-2xl bg-[#161020]/95 border border-amber-500/50 text-amber-100 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-amber-400 font-black">
              <span>DIWALI JOURNEY GUIDE ({completedStepsCount}/6)</span>
              <button onClick={onOpenBag} className="underline hover:text-amber-200">
                Full List &rarr;
              </button>
            </div>

            <div className="mt-1 flex items-center justify-between gap-2">
              <div>
                <div className="text-xs font-black text-amber-100">{currentStepObj.title}</div>
                <div className="text-[10px] text-amber-200/75 mt-0.5">
                  Rangoli: {completedDecorIds.includes('rangoli_main') ? 'Done' : 'Pending'} · Diyas: ({completedDecorIds.filter((i) => i.startsWith('diya_')).length}/6)
                </div>
              </div>
              <button
                onClick={onOpenBag}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-[10px]"
              >
                Checklist &rarr;
              </button>
            </div>
          </div>

          {sanathiState.active && !sanathiState.completed && (
            <div className="w-80 p-3 rounded-2xl bg-red-950/95 border-2 border-orange-500 text-amber-100 shadow-2xl animate-pulse">
              <div className="flex items-center justify-between font-black text-xs text-orange-300">
                <span>🔥 SANATHI RITUAL (HUKKA-PATI)</span>
                <span className="text-base text-white font-mono">{sanathiState.timeLeft}s</span>
              </div>
              <div className="text-[11px] mt-1 text-amber-200">
                {sanathiState.purifiedCorners.length < 4
                  ? `Ghar ke 4 kono mein jaakar E dabayein (${sanathiState.purifiedCorners.length}/4): "लक्ष्मी घर दरिद्र बाहर"`
                  : 'Sabhi kone shuddh! Courtyard Fire ke paas SPACE / JUMP dabayein!'}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onToggleSound}
              className="px-3.5 py-1.5 rounded-full bg-[#1a1325]/95 hover:bg-slate-900 border border-amber-500/40 text-amber-200 text-xs font-semibold flex items-center gap-1.5 shadow-lg"
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-rose-400" />}
              🎵 {soundOn ? 'Sound on' : 'Muted'}
            </button>

            <button
              onClick={onToggleBhajan}
              className="px-3.5 py-1.5 rounded-full bg-[#1a1325]/95 hover:bg-slate-900 border border-amber-500/40 text-amber-200 text-xs font-semibold flex items-center gap-1.5 shadow-lg"
            >
              <Music className="w-3.5 h-3.5 text-amber-400" />
              ▶️ Bhajans
            </button>

            <button
              onClick={onOpenBag}
              className="px-3.5 py-1.5 rounded-full bg-[#2a1a1d]/95 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/50 text-amber-200 text-xs font-bold flex items-center gap-1.5 shadow-lg transition"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              🛍️ Bag {bagCount}
            </button>

            <button
              onClick={onOpenPhoto}
              className="px-3.5 py-1.5 rounded-full bg-[#1a1325]/95 hover:bg-slate-900 border border-amber-500/40 text-amber-200 text-xs font-semibold flex items-center gap-1.5 shadow-lg"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              📷 Photo
            </button>

            <button
              onClick={onOpenHelp}
              className="px-3.5 py-1.5 rounded-full bg-[#1a1325]/95 hover:bg-slate-900 border border-amber-500/40 text-amber-200 text-xs font-semibold flex items-center gap-1.5 shadow-lg"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              ? Help
            </button>

            <button
              onClick={onOpenDaanPatra}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg"
            >
              🪔 Daan patra
            </button>
          </div>

          {toastData && (
            <div className="w-72 p-3 rounded-2xl bg-[#271815]/95 border border-amber-500/60 text-amber-100 shadow-2xl">
              <div className="text-xs font-black text-amber-300">{toastData.title}</div>
              <div className="text-[11px] text-amber-100/80 mt-0.5">{toastData.sub}</div>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        {/* Bottom-Left: D-Pad & Run */}
        <div className="pointer-events-auto flex flex-col items-center gap-2">
          <div className="p-2 rounded-2xl bg-[#161020]/95 border border-amber-500/40 grid grid-cols-3 gap-1 shadow-xl">
            <div />
            <button
              onMouseDown={() => setVKey('up', true)}
              onMouseUp={() => setVKey('up', false)}
              onMouseLeave={() => setVKey('up', false)}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-200 text-xs font-bold flex items-center justify-center"
            >
              ▲
            </button>
            <div />
            <button
              onMouseDown={() => setVKey('left', true)}
              onMouseUp={() => setVKey('left', false)}
              onMouseLeave={() => setVKey('left', false)}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-200 text-xs font-bold flex items-center justify-center"
            >
              ◀
            </button>
            <button
              onMouseDown={() => setVKey('down', true)}
              onMouseUp={() => setVKey('down', false)}
              onMouseLeave={() => setVKey('down', false)}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-200 text-xs font-bold flex items-center justify-center"
            >
              ▼
            </button>
            <button
              onMouseDown={() => setVKey('right', true)}
              onMouseUp={() => setVKey('right', false)}
              onMouseLeave={() => setVKey('right', false)}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-200 text-xs font-bold flex items-center justify-center"
            >
              ▶
            </button>
            <button
              onClick={() => setVKey('jump', true)}
              className="col-span-3 mt-0.5 py-1 rounded-lg bg-amber-950/90 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase"
            >
              JUMP
            </button>
          </div>

          <button
            onClick={onToggleRun}
            className={`px-4 py-2 rounded-full font-black text-xs border transition shadow-lg ${
              isRunning
                ? 'bg-amber-500 text-slate-950 border-amber-300'
                : 'bg-[#161020]/95 text-amber-200 border-amber-500/40'
            }`}
          >
            🏃 {isRunning ? 'RUN ON' : 'RUN OFF'}
          </button>
        </div>

        {/* Bottom-Center: Always Visible Quick Pataka Bar */}
        <div className="pointer-events-auto flex flex-col items-center gap-2">
          {activePrompt && (
            <button
              onClick={onTriggerInteract}
              className="px-7 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs md:text-sm shadow-[0_0_25px_rgba(245,158,11,0.7)] transition hover:scale-105"
            >
              {activePrompt.label}
            </button>
          )}

          <div className="px-4 py-2 rounded-2xl bg-[#161020]/95 border-2 border-amber-500/70 flex flex-wrap items-center gap-2 shadow-2xl backdrop-blur-md">
            <span className="text-xs font-black text-amber-400 mr-1">🔥 Quick Pataka:</span>
            {CRACKER_CATALOG.map((c) => {
              const qty = inventory[c.id]?.qty || 0;
              return (
                <button
                  key={c.id}
                  onClick={() => onBurstCracker(c.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold border transition ${
                    qty > 0
                      ? 'bg-amber-500/30 border-amber-400 text-amber-100 hover:bg-amber-500 hover:text-slate-950 shadow'
                      : 'bg-slate-900/90 border-slate-700 text-slate-400 hover:border-amber-500/40'
                  }`}
                >
                  {c.icon} {c.shortName} ({qty})
                </button>
              );
            })}
          </div>

          <div className="px-5 py-1.5 rounded-full bg-[#161020]/95 border border-amber-500/30 text-amber-200/90 text-[10px] font-bold tracking-wider uppercase shadow-lg">
            WASD / ARROWS · DRAG TO LOOK · SPACE TO JUMP · <span className="text-amber-400">E TO INTERACT</span>
          </div>
        </div>

        {/* Bottom-Right: Radio & Map */}
        <div className="pointer-events-auto flex flex-col gap-2.5 w-60">
          <div className="p-3 rounded-2xl bg-[#161020]/95 border border-amber-500/40 text-amber-100 shadow-2xl">
            <div className="text-[10px] font-bold tracking-widest uppercase text-amber-400 flex items-center justify-between">
              <span>📻 DIWALI RADIO · BHAJAN</span>
            </div>
            <div className="text-xs font-black text-amber-100 truncate mt-1">{currentTrack.title}</div>
            <div className="text-[10px] text-amber-300/70 truncate">{currentTrack.artist}</div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1.5">
                <button onClick={onPrevTrack} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700">
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onToggleBhajan}
                  className="p-1.5 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400"
                >
                  {bhajanPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button onClick={onNextTrack} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700">
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-20 accent-amber-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#161020]/95 border border-amber-500/40 text-amber-100 shadow-2xl">
            <div className="text-[10px] font-bold tracking-widest uppercase text-amber-400 flex items-center justify-between mb-1.5">
              <span>🗺️ MOHALLA MAP</span>
              <span className="text-[9px] text-amber-200/70">Click zone</span>
            </div>

            <div className="relative w-full h-24 rounded-xl bg-[#0d0914] border border-amber-500/30 overflow-hidden">
              <div
                className="absolute bg-amber-900/40 border border-amber-500/60 rounded text-[8px] flex items-center justify-center text-amber-200 font-bold"
                style={{ left: '24%', top: '10%', width: '52%', height: '42%' }}
              >
                Ghar
              </div>

              <button
                onClick={() => onTeleport([-10, 0, 11.2])}
                className="absolute px-1 py-0.5 rounded bg-red-900/80 border border-red-400 text-[8px] text-amber-100"
                style={{ left: '6%', top: '70%' }}
              >
                Shop 1
              </button>
              <button
                onClick={() => onTeleport([0, 0, 13.2])}
                className="absolute px-1 py-0.5 rounded bg-amber-900/80 border border-amber-400 text-[8px] text-amber-100"
                style={{ left: '40%', top: '76%' }}
              >
                Shop 2
              </button>
              <button
                onClick={() => onTeleport([10, 0, 11.2])}
                className="absolute px-1 py-0.5 rounded bg-purple-900/80 border border-purple-400 text-[8px] text-amber-100"
                style={{ left: '72%', top: '70%' }}
              >
                Shop 3
              </button>

              <div
                className="absolute w-3 h-3 rounded-full bg-emerald-400 border-2 border-white shadow"
                style={{
                  left: `${Math.min(90, Math.max(6, ((playerPos.x + 18) / 36) * 100))}%`,
                  top: `${Math.min(90, Math.max(6, ((playerPos.z + 5) / 24) * 100))}%`,
                }}
              />
            </div>

            <div className="grid grid-cols-3 gap-1 mt-2 text-[9px]">
              <button onClick={() => onTeleport([0, 0, 6.8])} className="py-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 font-bold">Ground</button>
              <button onClick={() => onTeleport([0, 4.05, 2.2])} className="py-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 font-bold">1st Floor</button>
              <button onClick={() => onTeleport([0, 7.85, 2.0])} className="py-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 font-bold">Rooftop</button>
              <button onClick={() => onTeleport([-2.7, 0, -1.0])} className="py-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 font-bold">Puja</button>
              <button onClick={() => onTeleport([2.7, 0, -0.6])} className="py-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 font-bold">Dining</button>
              <button onClick={() => onTeleport([0, 0, 12.0])} className="py-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 font-bold">Market</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}