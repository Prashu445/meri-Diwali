// src/utils/soundEngine.js
class DiwaliSoundEngine {
  constructor() {
    this.soundOn = true;
    this.volume = 0.25; // 🪔 Default volume lowered to 25% for soothing background temple feel
    this.currentAudio = null;
    this.aartiAudio = null;
    this.currentUtterance = null;
    this.voices = [];

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  loadVoices() {
    if ('speechSynthesis' in window) {
      this.voices = window.speechSynthesis.getVoices() || [];
    }
  }

  init() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
    }
  }

  playAudioTrack(url, loop = true) {
    if (!this.soundOn) return;
    this.stopAudioTrack();
    try {
      this.currentAudio = new Audio(url);
      this.currentAudio.volume = this.volume; // 25% soothing volume
      this.currentAudio.loop = loop;
      this.currentAudio.play().catch((e) => console.log('Audio play error:', e));
    } catch (err) {
      console.log('Audio error:', err);
    }
  }

  stopAudioTrack() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
  }

  playAartiAudio(url, onEnded) {
    if (!this.soundOn) return;
    this.stopAartiAudio();
    try {
      this.aartiAudio = new Audio(url);
      this.aartiAudio.volume = this.volume;
      this.aartiAudio.play().catch((e) => console.log('Aarti play error:', e));
      this.aartiAudio.onended = () => {
        if (onEnded) onEnded();
      };
    } catch (err) {
      console.log('Aarti error:', err);
    }
  }

  stopAartiAudio() {
    if (this.aartiAudio) {
      this.aartiAudio.pause();
      this.aartiAudio = null;
    }
  }

  setVolume(val) {
    this.volume = val;
    if (this.currentAudio) this.currentAudio.volume = val;
    if (this.aartiAudio) this.aartiAudio.volume = val;
  }

  playBell() {}
  playChime() {}
  playCrackerBurst() {}
  startBhajan() {}
  stopBhajan() {
    this.stopAudioTrack();
  }

  speakHindi(text, pitch = 0.7, rate = 0.9) {
    if (typeof window === 'undefined' || !this.soundOn) return;
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();

        if (!this.voices || this.voices.length === 0) {
          this.loadVoices();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = pitch;
        utterance.rate = rate;
        utterance.lang = 'hi-IN';

        if (this.voices && this.voices.length > 0) {
          const selectedVoice = this.voices.find(
            (v) => v.lang.includes('hi') || v.lang.includes('IN') || v.name.toLowerCase().includes('male')
          );
          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }
        }

        utterance.onerror = (e) => console.log('Speech synthesis error event:', e);

        this.currentUtterance = utterance;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.log('Speech synthesis exception:', err);
      }
    }
  }
}

export const soundEngine = new DiwaliSoundEngine();