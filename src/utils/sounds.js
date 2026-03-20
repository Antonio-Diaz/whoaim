let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function beep(freq = 800, duration = 0.08, vol = 0.12, type = 'square') {
  try {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (_) {
    // silently ignore
  }
}

export function playCrtFlicker() {
  try {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();

    // White noise burst — CRT static
    const bufLen = Math.floor(ctx.sampleRate * 0.18);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.25 * Math.exp(-i / (bufLen * 0.4));
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    src.connect(g);
    g.connect(ctx.destination);
    src.start();

    // Low CRT thud
    beep(55, 0.12, 0.25, 'sawtooth');
    setTimeout(() => beep(40, 0.08, 0.15, 'sawtooth'), 60);
  } catch (_) {}
}

export const sounds = {
  click: () => beep(600, 0.05, 0.08, 'square'),
  open: () => {
    beep(440, 0.07, 0.1, 'square');
    setTimeout(() => beep(660, 0.07, 0.1, 'square'), 70);
  },
  close: () => beep(300, 0.08, 0.1, 'square'),
  error: () => {
    beep(220, 0.1, 0.15, 'sawtooth');
    setTimeout(() => beep(180, 0.12, 0.15, 'sawtooth'), 120);
  },
  startup: () => {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => beep(freq, 0.25, 0.14, 'sine'), i * 200);
    });
  },
};

let hddInterval = null;

export function startHddSound() {
  hddInterval = setInterval(() => {
    beep(70 + Math.random() * 50, 0.025, 0.04, 'sawtooth');
  }, 120 + Math.random() * 180);
}

export function stopHddSound() {
  if (hddInterval) {
    clearInterval(hddInterval);
    hddInterval = null;
  }
}
