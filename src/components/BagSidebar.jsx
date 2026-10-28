// src/components/BagSidebar.jsx
import React from 'react';
import { X, CheckCircle2, Circle, Sparkles, Flame } from 'lucide-react';
import { JOURNEY_STEPS } from '../data/diwaliData';

export default function BagSidebar({
  isOpen,
  onClose,
  stepCompletion,
  completedDecorIds,
  inventory,
  equippedCrackerId,
  onSelectCracker,
  onBurstNow,
}) {
  if (!isOpen) return null;

  const inventoryItems = Object.values(inventory).filter((item) => item.qty > 0);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-950/95 border-l border-amber-500/40 text-amber-50 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl backdrop-blur-xl">
      <div>
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-4">
          <div>
            <h2 className="text-xl font-black text-amber-400 flex items-center gap-2">
              🛍️ Diwali Jhola (Bag & Progress)
            </h2>
            <p className="text-xs text-amber-200/70 mt-0.5">
              Jo task pura ho jata hai wo dobara nahi dikhta (Refresh page to replay).
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-400" /> Purchased Pataka Inventory
          </h3>

          {inventoryItems.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/20 text-xs text-amber-200/70">
              Abhi aapke jhole mein koi pataka nahi hai. Mohalla Market ki 3 dukaano par jaakar <b>E</b> dabayein aur patake kharidein!
            </div>
          ) : (
            <div className="space-y-2">
              {inventoryItems.map((item) => {
                const isEquipped = equippedCrackerId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      isEquipped
                        ? 'bg-amber-500/20 border-amber-400'
                        : 'bg-slate-900 border-amber-500/25'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="text-sm font-bold text-amber-100">{item.name}</div>
                        <div className="text-xs text-amber-300">Quantity: {item.qty}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onSelectCracker(item.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-200"
                      >
                        {isEquipped ? 'Equipped' : 'Equip'}
                      </button>
                      <button
                        onClick={() => {
                          onBurstNow(item.id);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-rose-600 text-white text-xs font-bold shadow"
                      >
                        🧨 Phodo!
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> 6-Step Diwali Celebration Checklist
          </h3>

          <div className="space-y-2.5">
            {JOURNEY_STEPS.map((st) => {
              const done = stepCompletion[st.id];
              return (
                <div
                  key={st.id}
                  className={`p-3 rounded-xl border flex items-start gap-3 ${
                    done
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-900/80 border-amber-500/20 text-amber-100'
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-amber-400/60 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="text-xs font-bold">{st.title}</div>
                    <div className="text-[11px] opacity-80 mt-0.5">{st.hi}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-amber-500/20 text-xs text-amber-300/80 flex items-center justify-between">
        <span>Decor Spots Completed: {completedDecorIds.length}/7</span>
        <span>Happy Diwali 🪔</span>
      </div>
    </div>
  );
}