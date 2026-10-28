// src/components/PhotoAndDaanModals.jsx
import React, { useState } from 'react';
import { X, Download, Share2, ExternalLink, Heart } from 'lucide-react';

const INSTAGRAM_URL = 'https://instagram.com/apna_insta_username_yahan_likhein';
const QR_IMAGE_PATH = '/qr.png';

export function PhotoModal({ isOpen, onClose, stepCompletion, onInviteFriends }) {
  const [userName, setUserName] = useState('Prashant Kumar');

  if (!isOpen) return null;

  const completedCount = Object.values(stepCompletion).filter(Boolean).length;

  const handleDownloadPostcard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 650;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 1000, 650);
    grad.addColorStop(0, '#110d1f');
    grad.addColorStop(0.5, '#3b1c12');
    grad.addColorStop(1, '#070510');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1000, 650);

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 10;
    ctx.strokeRect(30, 30, 940, 590);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 45, 910, 560);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 34px serif';
    ctx.textAlign = 'center';
    ctx.fillText('🪔 SHUBH DEEPAWALI CERTIFICATE 🪔', 500, 110);

    ctx.fillStyle = '#fde68a';
    ctx.font = 'italic 22px sans-serif';
    ctx.fillText('Meri Diwali - Virtual 3D Mohalla Celebration', 500, 155);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(250, 190);
    ctx.lineTo(750, 190);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '20px sans-serif';
    ctx.fillText('This Certificate of Honor is proudly presented to', 500, 240);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 40px serif';
    ctx.fillText(userName || 'Diwali Celebrant', 500, 300);

    ctx.fillStyle = '#fed7aa';
    ctx.font = '20px sans-serif';
    ctx.fillText(`For successfully completing all ${completedCount}/6 Diwali Traditions & Rituals`, 500, 360);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '16px sans-serif';
    ctx.fillText('✨ Rangoli, Diyas, Market Shopping, Lakshmi-Ganesh Puja, Sanathi & Family Dinner ✨', 500, 420);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '15px sans-serif';
    ctx.fillText('Verified Virtual Celebration Experience · 2026', 500, 500);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 18px serif';
    ctx.fillText('Ghar Wali Diwali ❤️', 500, 535);

    const link = document.createElement('a');
    link.download = `${userName || 'Diwali'}-Certificate.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md font-sans select-none">
      <div className="w-full max-w-xl rounded-3xl bg-slate-950 border-2 border-amber-500/70 text-amber-50 p-6 shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
          <h2 className="text-xl font-black text-amber-400">
            🏆 Diwali Celebration Certificate
          </h2>
          <button onClick={onClose} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-amber-950/80 via-slate-900 to-indigo-950 border-2 border-amber-400/60 text-center shadow-xl">
          <div className="text-xs text-amber-300 font-bold uppercase tracking-widest">
            ✨ Enter Your Name for Certificate ✨
          </div>

          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Apna Naam Yahan Likhein"
            className="mt-3 w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-amber-500/50 text-amber-200 text-center font-bold text-base focus:outline-none focus:border-amber-400 shadow-inner"
          />

          <div className="text-3xl font-black text-amber-400 mt-3 font-serif">
            मेरी <span className="italic text-amber-100">Diwali.</span>
          </div>
          <p className="text-xs text-amber-100/90 mt-1">
            Aapne apne parivaar ke sath <b>{completedCount}/6</b> Diwali ki paramparayein puri ki hain!
          </p>

          <button
            onClick={handleDownloadPostcard}
            className="mt-5 w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl transition transform hover:scale-[1.01]"
          >
            <Download className="w-4 h-4" /> Download Certificate (PNG)
          </button>
        </div>

        <div className="mt-4 p-4 rounded-2xl bg-orange-950/40 border border-orange-400/40">
          <div className="text-xs font-black text-orange-300 uppercase tracking-wider">
            🌅 Coming Soon: Virtual 3D Chhath Puja Website
          </div>
          <p className="text-[11px] text-amber-100/80 mt-1">
            Updates ke liye Instagram par follow karein aur doston ke sath share karein:
          </p>

          <div className="flex flex-wrap items-center gap-2.5 mt-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Follow on Instagram
            </a>
            <button
              onClick={onInviteFriends}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-200 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Share2 className="w-3.5 h-3.5" /> Doston ko bulao · Invite
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export function DaanPatraModal({ isOpen, onClose }) {
  const [imgError, setImgError] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md font-sans select-none">
      <div className="w-full max-w-md rounded-3xl bg-slate-950 border-2 border-amber-500/70 text-amber-50 p-6 shadow-2xl text-center">
        
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
          <h2 className="text-lg font-black text-amber-400">🪔 Developer Daan Patra</h2>
          <button onClick={onClose} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-amber-100/90 mt-4 leading-relaxed">
          Agar aapko ye virtual Diwali experience pasand aaya ho, toh developer ko support karein! Aapka sahyog agle <b>Virtual 3D Chhath Puja</b> project ko banane mein madad karega. 🙏
        </p>

        <div className="my-5 mx-auto w-56 h-56 rounded-2xl bg-white p-3 flex flex-col items-center justify-center shadow-xl border-4 border-amber-400 overflow-hidden">
          {!imgError ? (
            <img
              src={QR_IMAGE_PATH}
              alt="Developer QR Code"
              onError={() => setImgError(true)}
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <div className="w-full h-full border-2 border-dashed border-slate-800 rounded-lg flex flex-col items-center justify-center text-slate-900 p-2">
              <div className="text-3xl">📱</div>
              <div className="text-xs font-black mt-1">QR Photo Nahi Mili</div>
              <div className="text-[10px] text-slate-600 mt-1">
                Apni QR photo ka naam <b>qr.png</b> rakh kar <b>public</b> folder mein dalein.
              </div>
            </div>
          )}
        </div>

        <div className="mb-2">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white text-xs font-bold shadow-md transition"
          >
            <ExternalLink className="w-4 h-4" /> Follow Developer on Instagram
          </a>
        </div>

        <div className="text-[11px] text-amber-300 flex items-center justify-center gap-1 border-t border-amber-500/20 pt-3">
          Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> · Shubh Deepawali!
        </div>

      </div>
    </div>
  );
}