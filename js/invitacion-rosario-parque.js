const card = document.getElementById('card');
const cat = document.getElementById('cat');
const message = document.getElementById('message');
const yesBtn = document.getElementById('yesBtn');
const surpriseBtn = document.getElementById('surpriseBtn');
const stars = document.getElementById('stars');
const musicBtn = document.getElementById('musicBtn');
const catBubble = document.getElementById('catBubble');

let audioContext;
let masterGain;
let isPlaying = false;
let melodyTimeouts = [];
let accepted = false;
let bubbleTimeout;

for (let i = 0; i < 40; i++) {
  const star = document.createElement('span');
  star.className = 'star';
  star.style.left = Math.random() * 100 + '%';
  star.style.top = Math.random() * 100 + '%';
  star.style.animationDelay = Math.random() * 3 + 's';
  star.style.opacity = Math.random();
  stars.appendChild(star);
}

function launchHearts(count = 12) {
  const symbols = ['*', '+', 'o', '~'];

  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = 18 + Math.random() * 64 + '%';
    heart.style.bottom = 54 + Math.random() * 44 + 'px';
    heart.style.animationDelay = Math.random() * 0.45 + 's';
    card.appendChild(heart);
    setTimeout(() => heart.remove(), 2600);
  }
}

function showCatBubble(text) {
  catBubble.textContent = text;
  catBubble.classList.add('visible');
  catBubble.setAttribute('aria-hidden', 'false');
  clearTimeout(bubbleTimeout);
  bubbleTimeout = setTimeout(() => {
    catBubble.classList.remove('visible');
    catBubble.setAttribute('aria-hidden', 'true');
  }, 2800);
}

function createNote(freq, start, duration, type = 'sine', volume = 0.04) {
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(start);
  osc.stop(start + duration + 0.03);
}

function playMelodyLoop() {
  if (!isPlaying) return;

  const now = audioContext.currentTime + 0.05;
  const notes = [523.25, 659.25, 783.99, 659.25, 698.46, 783.99, 880.0, 783.99, 659.25, 587.33, 523.25, 659.25];
  const bass = [261.63, 329.63, 392.0, 349.23];
  const step = 0.32;

  notes.forEach((freq, index) => {
    createNote(freq, now + index * step, 0.24, 'triangle', 0.03);
  });

  bass.forEach((freq, index) => {
    createNote(freq, now + index * (step * 3), 0.55, 'sine', 0.018);
  });

  const totalMs = notes.length * step * 1000;
  const loopTimeout = setTimeout(playMelodyLoop, totalMs - 120);
  melodyTimeouts.push(loopTimeout);
}

async function startMusic(forceMessage = false) {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.8;
    masterGain.connect(audioContext.destination);
  }

  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  if (isPlaying) return;

  isPlaying = true;
  musicBtn.classList.add('active');
  musicBtn.setAttribute('aria-pressed', 'true');
  musicBtn.setAttribute('aria-label', 'Desactivar musica');
  playMelodyLoop();

  if (forceMessage && accepted) {
    message.textContent = 'Ahora si: gatito cerca, musica suave y una salida bonita contigo.';
  }
}

function stopMusic() {
  isPlaying = false;
  melodyTimeouts.forEach((timeout) => clearTimeout(timeout));
  melodyTimeouts = [];
  musicBtn.classList.remove('active');
  musicBtn.setAttribute('aria-pressed', 'false');
  musicBtn.setAttribute('aria-label', 'Activar musica');
}

async function toggleMusic() {
  try {
    if (isPlaying) {
      stopMusic();
      message.textContent = accepted ? 'La musica quedo en pausa, pero el plan bonito sigue en pie.' : '';
    } else {
      await startMusic(true);
    }
  } catch {
    stopMusic();
  }
}

yesBtn.addEventListener('click', () => {
  accepted = true;
  cat.classList.add('approach');
  card.classList.add('accepted');
  message.textContent = 'Entonces ya tengo el mejor plan: tu, yo, una caminata y una tarde bonita en el parque.';
  showCatBubble('miau miau, sii vamos al parque');
  launchHearts(18);
});

surpriseBtn.addEventListener('click', () => {
  cat.classList.remove('approach');
  card.classList.remove('accepted');
  accepted = false;
  message.textContent = 'Sorpresa oficial del gatito: vino a decirte algo bonito.';
  showCatBubble('miau miau, te amooo muchoo, miau');
  launchHearts(10);
});

musicBtn.addEventListener('click', toggleMusic);

window.addEventListener('load', async () => {
  try {
    await startMusic(false);
  } catch {
    stopMusic();
  }
});
