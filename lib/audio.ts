// Synthesized notification sounds via the Web Audio API — no audio files needed.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export async function unlockAudio(): Promise<void> {
  const c = getCtx();
  if (c && c.state === "suspended") await c.resume();
}

function tone(freq: number, start: number, duration: number, gain = 0.25, type: OscillatorType = "sine") {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime + start);
  g.gain.setValueAtTime(0.0001, c.currentTime + start);
  g.gain.exponentialRampToValueAtTime(gain, c.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + duration);
  osc.connect(g).connect(c.destination);
  osc.start(c.currentTime + start);
  osc.stop(c.currentTime + start + duration + 0.05);
}

/** Kitchen "new order" bell */
export function playChime() {
  tone(880, 0, 0.35, 0.3, "sine");
  tone(1318.5, 0.08, 0.4, 0.2, "sine");
}

/** Double chime when an order is marked ready */
export function playDoubleChime() {
  tone(1046.5, 0, 0.3, 0.3);
  tone(1568, 0.12, 0.45, 0.22);
  tone(1046.5, 0.35, 0.3, 0.3);
  tone(1568, 0.47, 0.5, 0.22);
}

/** WhatsApp-style ping */
export function playPing() {
  tone(988, 0, 0.15, 0.28, "triangle");
  tone(1319, 0.09, 0.35, 0.25, "triangle");
}
