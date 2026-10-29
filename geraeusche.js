// Selbst gebaute Gruselgeräusche mit der Web-Audio-Schnittstelle des Browsers.
// Das sind keine echten Spielgeräusche, sondern nachgemachte.

let ctx = null;
function audio() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function rauschen(dauer) {
  const a = audio();
  const puffer = a.createBuffer(1, a.sampleRate * dauer, a.sampleRate);
  const daten = puffer.getChannelData(0);
  for (let i = 0; i < daten.length; i++) daten[i] = Math.random() * 2 - 1;
  const quelle = a.createBufferSource();
  quelle.buffer = puffer;
  return quelle;
}

// Zombie: tiefes, wackeliges Stöhnen
function zombieGeraeusch() {
  const a = audio();
  const t = a.currentTime;
  const ton = a.createOscillator();
  const wackeln = a.createOscillator();
  const wackelStaerke = a.createGain();
  const laut = a.createGain();
  const filter = a.createBiquadFilter();

  ton.type = "sawtooth";
  ton.frequency.setValueAtTime(110, t);
  ton.frequency.linearRampToValueAtTime(80, t + 1.4);
  wackeln.frequency.value = 6;
  wackelStaerke.gain.value = 8;
  wackeln.connect(wackelStaerke).connect(ton.frequency);

  filter.type = "lowpass";
  filter.frequency.value = 600;

  laut.gain.setValueAtTime(0, t);
  laut.gain.linearRampToValueAtTime(0.35, t + 0.2);
  laut.gain.linearRampToValueAtTime(0, t + 1.5);

  ton.connect(filter).connect(laut).connect(a.destination);
  ton.start(t); wackeln.start(t);
  ton.stop(t + 1.6); wackeln.stop(t + 1.6);
}

// Creeper: erst zischen, dann BUMM
function creeperGeraeusch() {
  const a = audio();
  const t = a.currentTime;

  const zisch = rauschen(1.5);
  const zischFilter = a.createBiquadFilter();
  zischFilter.type = "highpass";
  zischFilter.frequency.value = 3000;
  const zischLaut = a.createGain();
  zischLaut.gain.setValueAtTime(0.05, t);
  zischLaut.gain.linearRampToValueAtTime(0.3, t + 1.4);
  zischLaut.gain.setValueAtTime(0, t + 1.5);
  zisch.connect(zischFilter).connect(zischLaut).connect(a.destination);
  zisch.start(t);

  const bumm = rauschen(1.5);
  const bummFilter = a.createBiquadFilter();
  bummFilter.type = "lowpass";
  bummFilter.frequency.setValueAtTime(1200, t + 1.5);
  bummFilter.frequency.exponentialRampToValueAtTime(80, t + 2.8);
  const bummLaut = a.createGain();
  bummLaut.gain.setValueAtTime(0, t);
  bummLaut.gain.setValueAtTime(0.9, t + 1.5);
  bummLaut.gain.exponentialRampToValueAtTime(0.001, t + 3);
  bumm.connect(bummFilter).connect(bummLaut).connect(a.destination);
  bumm.start(t + 1.5);
}

// Skelett: klappernde Knochen
function skelettGeraeusch() {
  const a = audio();
  const t = a.currentTime;
  for (let i = 0; i < 8; i++) {
    const start = t + i * 0.09 + Math.random() * 0.03;
    const klick = rauschen(0.05);
    const filter = a.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1800 + Math.random() * 1500;
    filter.Q.value = 8;
    const laut = a.createGain();
    laut.gain.setValueAtTime(0.8, start);
    laut.gain.exponentialRampToValueAtTime(0.001, start + 0.05);
    klick.connect(filter).connect(laut).connect(a.destination);
    klick.start(start);
  }
}

// Enderman: "Wuuup" beim Teleportieren
function endermanGeraeusch() {
  const a = audio();
  const t = a.currentTime;
  const ton = a.createOscillator();
  const laut = a.createGain();
  ton.type = "triangle";
  ton.frequency.setValueAtTime(900, t);
  ton.frequency.exponentialRampToValueAtTime(150, t + 0.5);
  laut.gain.setValueAtTime(0, t);
  laut.gain.linearRampToValueAtTime(0.4, t + 0.05);
  laut.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
  ton.connect(laut).connect(a.destination);
  ton.start(t);
  ton.stop(t + 0.65);
}
