/**
 * Celestial Audio Engine: Pure Piano Interstellar "Cornfield Chase" by Hans Zimmer
 * 
 * Delivers the pure, acoustic solo piano rendition of "Cornfield Chase":
 * - Pure Solo Piano: zero ambient noise, zero synths, zero organ, zero clock ticks.
 * - Studio-mastered high-fidelity acoustic piano recording (AAC / WAV format).
 * - Smooth volume fading, seamless looping, and immediate touch responsiveness.
 */

class CelestialAudioEngine {
  constructor() {
    this.isPlaying = false;
    this.volume = 0.5;
    this.listeners = [];
    this.fadeInterval = null;

    // Dedicated HTML5 audio element
    this.audio = new Audio();
    this.audio.loop = true;
    this.audio.preload = "auto";

    // Detect format support and cache-bust
    const cacheBuster = Date.now();
    const canPlayM4a = !!(this.audio.canPlayType && (
      this.audio.canPlayType('audio/mp4; codecs="mp4a.40.2"').replace(/no/, '') ||
      this.audio.canPlayType('audio/x-m4a').replace(/no/, '') ||
      this.audio.canPlayType('audio/aac').replace(/no/, '')
    ));

    const sourceUrl = canPlayM4a
      ? `audio/cornfield_chase_pure_piano.m4a?v=${cacheBuster}`
      : `audio/cornfield_chase_pure_piano.wav?v=${cacheBuster}`;

    this.audio.src = sourceUrl;
    this.audio.volume = this.volume;

    // Synchronize UI with audio events
    this.audio.addEventListener("play", () => {
      this.isPlaying = true;
      this.notifyState();
    });

    this.audio.addEventListener("pause", () => {
      this.isPlaying = false;
      this.notifyState();
    });

    this.audio.addEventListener("ended", () => {
      this.isPlaying = false;
      this.notifyState();
    });

    this.audio.addEventListener("error", (e) => {
      console.warn("Primary audio source failed, attempting fallback:", e);
      // Fallback to wav if m4a fails
      if (!this.audio.src.includes(".wav")) {
        this.audio.src = `audio/cornfield_chase_pure_piano.wav?v=${Date.now()}`;
        if (this.isPlaying) {
          this.audio.play().catch(() => {});
        }
      }
    });
  }

  init() {
    // Already initialized in constructor
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (this.fadeInterval) clearInterval(this.fadeInterval);

    // Smooth fade in
    this.audio.volume = 0.001;
    const playPromise = this.audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          this.notifyState();

          // Gentle fade in over 400ms
          let currentVol = 0.001;
          const targetVol = this.volume;
          const step = Math.max(0.01, (targetVol - currentVol) / 16);

          this.fadeInterval = setInterval(() => {
            currentVol = Math.min(targetVol, currentVol + step);
            this.audio.volume = currentVol;
            if (currentVol >= targetVol) {
              clearInterval(this.fadeInterval);
              this.fadeInterval = null;
            }
          }, 25);
        })
        .catch((err) => {
          console.warn("Audio autoplay blocked until user gesture:", err);
        });
    }
  }

  pause() {
    if (this.fadeInterval) clearInterval(this.fadeInterval);

    // Smooth fade out over 300ms before pausing
    let currentVol = this.audio.volume;
    const step = Math.max(0.01, currentVol / 12);

    this.fadeInterval = setInterval(() => {
      currentVol = Math.max(0.0, currentVol - step);
      this.audio.volume = currentVol;
      if (currentVol <= 0.001) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
        this.audio.pause();
        this.isPlaying = false;
        this.notifyState();
      }
    }, 25);
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.audio && !this.fadeInterval) {
      this.audio.volume = this.volume;
    }
  }

  onStateChange(callback) {
    this.listeners.push(callback);
  }

  notifyState() {
    this.listeners.forEach((cb) => cb(this.isPlaying));
  }
}

// Global singleton instance
window.celestialAudio = new CelestialAudioEngine();
