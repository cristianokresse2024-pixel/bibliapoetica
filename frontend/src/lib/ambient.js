// Som ambiente contínuo e suave gerado via Web Audio API — SEM anúncios, sem rede.
// Um "pad" de adoração: acordes lentos e etéreos que evoluem devagar.

let ctx = null;
let master = null;
let nodes = [];
let running = false;
let lfoTimer = null;

// Acorde base (frequências em Hz) — Dó maior com nona, sonoridade contemplativa
const CHORDS = [
  [130.81, 164.81, 196.00, 261.63], // C E G C
  [146.83, 174.61, 220.00, 293.66], // D F A D
  [164.81, 196.00, 246.94, 329.63], // E G B E
  [174.61, 220.00, 261.63, 349.23], // F A C F
];

function makeVoice(freq) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  // leve detune para textura
  osc.detune.value = (Math.random() - 0.5) * 8;
  gain.gain.value = 0;
  osc.connect(gain);
  gain.connect(master);
  osc.start();
  return { osc, gain };
}

export function startAmbient(volume = 0.35) {
  if (running) return;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    master = ctx.createGain();
    master.gain.value = 0;
    // reverb-ish: filtro passa-baixa para suavizar
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1400;
    master.connect(lp);
    lp.connect(ctx.destination);

    nodes = CHORDS[0].map(makeVoice);
    running = true;

    // fade in master
    const now = ctx.currentTime;
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(volume, now + 3);

    let chordIdx = 0;
    const applyChord = () => {
      if (!running) return;
      const chord = CHORDS[chordIdx % CHORDS.length];
      const t = ctx.currentTime;
      nodes.forEach((v, i) => {
        v.osc.frequency.linearRampToValueAtTime(chord[i], t + 4);
        // envelope suave por voz
        v.gain.gain.linearRampToValueAtTime(0.25 + Math.random() * 0.1, t + 3);
      });
      chordIdx++;
    };
    applyChord();
    lfoTimer = setInterval(applyChord, 9000); // troca de acorde a cada 9s
  } catch (e) {
    running = false;
  }
}

export function stopAmbient() {
  if (!running) return;
  try {
    clearInterval(lfoTimer);
    const now = ctx.currentTime;
    master.gain.linearRampToValueAtTime(0, now + 1.5);
    const toStop = nodes;
    setTimeout(() => {
      toStop.forEach((v) => { try { v.osc.stop(); } catch {} });
    }, 1700);
  } catch {}
  running = false;
  nodes = [];
}

export function setAmbientVolume(v) {
  if (running && master) {
    try { master.gain.linearRampToValueAtTime(v, ctx.currentTime + 0.3); } catch {}
  }
}
