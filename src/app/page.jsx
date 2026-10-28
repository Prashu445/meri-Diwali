// src/app/page.jsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DECOR_SPOTS, BHAJAN_TRACKS, CRACKER_CATALOG } from '../data/diwaliData';
import { soundEngine } from '../utils/soundEngine';
import LandingOverlay from '../components/LandingOverlay';
import HUDOverlay from '../components/HUDOverlay';
import BagSidebar from '../components/BagSidebar';
import ShopModal from '../components/ShopModal';
import PujaModal from '../components/PujaModal';
import DinnerModal from '../components/DinnerModal';
import { PhotoModal, DaanPatraModal } from '../components/PhotoAndDaanModals';
import MohallaScene3D from '../components/MohallaScene3D';

export default function MeriDiwaliApp() {
  const [enteredMohalla, setEnteredMohalla] = useState(false);
  const [currentZone, setCurrentZone] = useState('Mohalla Entrance & Courtyard');
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0, z: 7.5 });
  const [teleportTarget, setTeleportTarget] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const virtualKeysRef = useRef({ up: false, down: false, left: false, right: false, jump: false });

  const [soundOn, setSoundOn] = useState(true);
  const [bhajanPlaying, setBhajanPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(2);
  const [volume, setVolume] = useState(0.6);

  const [completedDecorIds, setCompletedDecorIds] = useState([]);
  const [inventory, setInventory] = useState({
    sparkler: { ...CRACKER_CATALOG[1], qty: 3 },
    rocket: { ...CRACKER_CATALOG[4], qty: 2 },
  });
  const [equippedCrackerId, setEquippedCrackerId] = useState('sparkler');
  const [crackersBurstCount, setCrackersBurstCount] = useState(0);
  const [crackerBurstEvent, setCrackerBurstEvent] = useState(null);
  const [pujaCompleted, setPujaCompleted] = useState(false);
  const [dinnerCompleted, setDinnerCompleted] = useState(false);

  const [sanathiState, setSanathiState] = useState({
    active: false,
    timeLeft: 120,
    purifiedCorners: [],
    jumpCount: 0,
    completed: false,
  });

  const [activePrompt, setActivePrompt] = useState(null);
  const [bagOpen, setBagOpen] = useState(false);
  const [activeShop, setActiveShop] = useState(null);
  const [pujaModalOpen, setPujaModalOpen] = useState(false);
  const [dinnerModalOpen, setDinnerModalOpen] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [daanPatraOpen, setDaanPatraOpen] = useState(false);
  const [toastData, setToastData] = useState({
    title: '🪔 Welcome to Meri Diwali Mohalla!',
    sub: 'Use WASD / Arrows to walk, Drag to look, and E to interact.',
  });

  const showToast = (title, sub = '') => {
    setToastData({ title, sub });
  };

  useEffect(() => {
    if (!sanathiState.active || sanathiState.completed) return;
    const timer = setInterval(() => {
      setSanathiState((prev) => {
        if (prev.timeLeft <= 1) return { ...prev, timeLeft: 120 };
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [sanathiState.active, sanathiState.completed]);

  const totalPurchasedCrackers = Object.values(inventory).reduce((sum, i) => sum + i.qty, 0);
  const stepCompletion = {
    decor: completedDecorIds.length === DECOR_SPOTS.length,
    shopping: totalPurchasedCrackers > 1 || crackersBurstCount > 0,
    puja: pujaCompleted,
    sanathi: sanathiState.completed,
    crackers: crackersBurstCount > 0,
    dinner: dinnerCompleted,
  };

  const isAnyModalOpen =
    !enteredMohalla ||
    bagOpen ||
    activeShop !== null ||
    pujaModalOpen ||
    dinnerModalOpen ||
    photoModalOpen ||
    daanPatraOpen;

  const handleTriggerAction = (prompt) => {
    if (!prompt) return;

    if (prompt.type === 'decor') {
      if (!completedDecorIds.includes(prompt.id)) {
        setCompletedDecorIds((prev) => [...prev, prompt.id]);
        showToast(
          `✨ ${prompt.spot?.toastTitle || prompt.label}`,
          prompt.spot?.toastSub || 'Decoration task updated in Progress Tracker.'
        );
      }
      setActivePrompt(null);
    } else if (prompt.type === 'shop') {
      setActiveShop(prompt.shop);
    } else if (prompt.type === 'puja') {
      setPujaModalOpen(true);
    } else if (prompt.type === 'dinner') {
      setDinnerModalOpen(true);
    } else if (prompt.type === 'sanathi_corner') {
      soundEngine.speakHindi('लक्ष्मी घर दरिद्र बाहर!');
      setSanathiState((prev) => ({
        ...prev,
        purifiedCorners: [...prev.purifiedCorners, prompt.id],
      }));
      showToast('🔥 "लक्ष्मी घर दरिद्र बाहर!"', 'Corner purified with burning Sanathi.');
      setActivePrompt(null);
    }
  };

  const handleBuyCracker = (item) => {
    setInventory((prev) => {
      const existing = prev[item.id] || { ...item, qty: 0 };
      return {
        ...prev,
        [item.id]: { ...existing, qty: existing.qty + item.qtyPack },
      };
    });
    setEquippedCrackerId(item.id);
    showToast(`🛍️ Added ${item.qtyPack}x ${item.name}`, 'Open Bag or quick bar to burst!');
  };

  const handleBurstCracker = (crackerId) => {
    const item = inventory[crackerId];
    if (!item || item.qty <= 0) {
      showToast('🧨 Pataka Khatam Ho Gaya!', 'Mohalla Market ki 3 dukaano se aur patake lein!');
      return;
    }

    setCrackerBurstEvent({ type: crackerId, timestamp: Date.now() });
    setCrackersBurstCount((c) => c + 1);

    setInventory((prev) => ({
      ...prev,
      [crackerId]: { ...prev[crackerId], qty: prev[crackerId].qty - 1 },
    }));
    showToast(`🧨 Burst ${item.name}!`, 'Happy Diwali! Aasman jagmaga utha!');
  };

  const handleShareInvite = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('🔗 Invite Link Copied!', 'Share with your friends on WhatsApp & Instagram.');
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#070510] font-sans">
      <MohallaScene3D
        isBlurred={!enteredMohalla}
        isLocked={isAnyModalOpen}
        isRunning={isRunning}
        virtualKeysRef={virtualKeysRef}
        completedDecorIds={completedDecorIds}
        pujaCompleted={pujaCompleted}
        dinnerCompleted={dinnerCompleted}
        sanathiState={sanathiState}
        teleportTarget={teleportTarget}
        crackerBurstEvent={crackerBurstEvent}
        onUpdatePlayerHUD={(pos, zone) => {
          setPlayerPos(pos);
          setCurrentZone(zone);
        }}
        onPromptChange={setActivePrompt}
        onTriggerAction={handleTriggerAction}
        onSanathiJumpAttempt={() => {
          setSanathiState((prev) => {
            const nextCount = prev.jumpCount + 1;
            if (nextCount >= 5) {
              soundEngine.speakHindi('सनाठी की विधि पूर्ण हुई! शुभ दीपावली!');
              showToast('🔥 Sanathi Ritual Complete!', '5 baar jump successful! Shuddhata sampann!');
              return { ...prev, active: false, jumpCount: 5, completed: true };
            } else {
              soundEngine.speakHindi(`Jump ${nextCount} of 5`);
              showToast(`🔥 Fire Jump (${nextCount}/5)`, `Aur ${5 - nextCount} baar jump karein!`);
              return { ...prev, jumpCount: nextCount };
            }
          });
        }}
      />

      {!enteredMohalla && (
        <LandingOverlay
          onEnterMohalla={() => {
            setEnteredMohalla(true);
            soundEngine.init();
            setCurrentTrackIndex(2);
            soundEngine.playAudioTrack(BHAJAN_TRACKS[2].audioUrl, true);
            setBhajanPlaying(true);
          }}
          onOpenDaanPatra={() => setDaanPatraOpen(true)}
          onInviteFriends={handleShareInvite}
        />
      )}

      {enteredMohalla && (
        <HUDOverlay
          currentZone={currentZone}
          soundOn={soundOn}
          onToggleSound={() => {
            const next = !soundOn;
            setSoundOn(next);
            soundEngine.soundOn = next;
            if (!next) soundEngine.stopAudioTrack();
          }}
          bhajanPlaying={bhajanPlaying}
          onToggleBhajan={() => {
            if (bhajanPlaying) {
              soundEngine.stopAudioTrack();
              setBhajanPlaying(false);
            } else {
              soundEngine.playAudioTrack(BHAJAN_TRACKS[currentTrackIndex].audioUrl, true);
              setBhajanPlaying(true);
            }
          }}
          currentTrackIndex={currentTrackIndex}
          onNextTrack={() => {
            const nextIdx = (currentTrackIndex + 1) % BHAJAN_TRACKS.length;
            setCurrentTrackIndex(nextIdx);
            if (bhajanPlaying) {
              soundEngine.playAudioTrack(BHAJAN_TRACKS[nextIdx].audioUrl, true);
            }
          }}
          onPrevTrack={() => {
            const prevIdx = (currentTrackIndex - 1 + BHAJAN_TRACKS.length) % BHAJAN_TRACKS.length;
            setCurrentTrackIndex(prevIdx);
            if (bhajanPlaying) {
              soundEngine.playAudioTrack(BHAJAN_TRACKS[prevIdx].audioUrl, true);
            }
          }}
          volume={volume}
          onVolumeChange={(v) => {
            setVolume(v);
            soundEngine.setVolume(v);
          }}
          bagCount={totalPurchasedCrackers}
          onOpenBag={() => setBagOpen(true)}
          onOpenPhoto={() => setPhotoModalOpen(true)}
          onOpenHelp={() =>
            showToast('🪔 How to Play', 'Walk with WASD/Arrows, Drag to rotate, press E on badges!')
          }
          onOpenDaanPatra={() => setDaanPatraOpen(true)}
          isRunning={isRunning}
          onToggleRun={() => setIsRunning((r) => !r)}
          virtualKeysRef={virtualKeysRef}
          playerPos={playerPos}
          onTeleport={(coords) => setTeleportTarget([...coords])}
          stepCompletion={stepCompletion}
          completedDecorIds={completedDecorIds}
          sanathiState={sanathiState}
          activePrompt={activePrompt}
          onTriggerInteract={() => handleTriggerAction(activePrompt)}
          inventory={inventory}
          onBurstCracker={handleBurstCracker}
          toastData={toastData}
        />
      )}

      <BagSidebar
        isOpen={bagOpen}
        onClose={() => setBagOpen(false)}
        stepCompletion={stepCompletion}
        completedDecorIds={completedDecorIds}
        inventory={inventory}
        equippedCrackerId={equippedCrackerId}
        onSelectCracker={(id) => setEquippedCrackerId(id)}
        onBurstNow={handleBurstCracker}
      />

      <ShopModal
        shop={activeShop}
        onClose={() => setActiveShop(null)}
        onBuyCracker={handleBuyCracker}
      />

      <PujaModal
        isOpen={pujaModalOpen}
        onClose={() => setPujaModalOpen(false)}
        onCompletePuja={() => {
          setPujaCompleted(true);
          setPujaModalOpen(false);
          setSanathiState({
            active: true,
            timeLeft: 120,
            purifiedCorners: [],
            jumpCount: 0,
            completed: false,
          });
          showToast('🔥 Puja Sampann! 120s Sanathi Ritual Unlocked!', 'Walk to 4 house corners and press E.');
        }}
      />

      <DinnerModal
        isOpen={dinnerModalOpen}
        onClose={() => setDinnerModalOpen(false)}
        onFinishDinner={() => {
          setDinnerCompleted(true);
          setDinnerModalOpen(false);
          setPhotoModalOpen(true);
          showToast('🎉 Diwali Celebration Complete!', 'Download your commemorative Diwali certificate.');
        }}
      />

      <PhotoModal
        isOpen={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
        stepCompletion={stepCompletion}
        onInviteFriends={handleShareInvite}
      />
      <DaanPatraModal isOpen={daanPatraOpen} onClose={() => setDaanPatraOpen(false)} />
    </main>
  );
}