/* 
a singelton sound effect manager 
to control sound effects
 */

export class SoundEffectManager {
  static volume = 0.7;
  static muted = false;
  static cache = {};

  static loadSound({ key, path }) {
    const sound = new Audio(path);
    sound.preload = "auto";
    this.cache = {
      ...this.cache,
      [key]: sound,
    };
  }

  static playSound(key) {
    const sound = this.cache[key];
    if (!sound) return;
    const soundClone = sound.cloneNode(true);
    soundClone.volume = this.muted ? 0 : this.volume;
    soundClone.currentTime = 0;
    soundClone.play();
  }

  static toggleMute() {
    this.muted = !this.muted;
  }

  static setMuted(muted) {
    this.muted = muted;
  }

  static setVolume(volume) {
    this.volume = Math.min(volume, 1);
  }
}
