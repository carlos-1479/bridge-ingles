// Voz: síntesis (escuchar) y reconocimiento (hablar) con las APIs del navegador.
import { get } from './store.js';

let voices = [];
function loadVoices() {
  voices = (window.speechSynthesis?.getVoices() || []).filter((v) => v.lang.startsWith('en'));
}
if ('speechSynthesis' in window) {
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
}

export function englishVoices() { loadVoices(); return voices; }

function pickVoice() {
  const wanted = get().settings.voice;
  if (wanted) {
    const v = voices.find((x) => x.name === wanted);
    if (v) return v;
  }
  // Preferimos voces de alta calidad en inglés de EE. UU. o Reino Unido.
  const rank = (v) =>
    (/(premium|enhanced|natural|neural)/i.test(v.name) ? 4 : 0) +
    (/Google|Samantha|Daniel|Karen|Serena|Ava|Allison/i.test(v.name) ? 2 : 0) +
    (v.lang === 'en-US' || v.lang === 'en-GB' ? 1 : 0);
  return [...voices].sort((a, b) => rank(b) - rank(a))[0];
}

export function canSpeak() { return 'speechSynthesis' in window; }

export function speak(text, { slow = false } = {}) {
  if (!canSpeak()) return Promise.resolve();
  speechSynthesis.cancel();
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice();
    if (v) u.voice = v;
    u.lang = v?.lang || 'en-US';
    u.rate = (get().settings.rate || 0.95) * (slow ? 0.65 : 1);
    u.onend = resolve;
    u.onerror = resolve;
    speechSynthesis.speak(u);
  });
}

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
export function canListen() { return !!Recognition; }

// Devuelve una lista de transcripciones alternativas.
export function listen({ onStart } = {}) {
  return new Promise((resolve, reject) => {
    if (!Recognition) return reject(new Error('unsupported'));
    speechSynthesis?.cancel();
    const r = new Recognition();
    r.lang = 'en-US';
    r.interimResults = false;
    r.maxAlternatives = 5;
    r.continuous = false;
    let done = false;
    r.onstart = () => onStart?.();
    r.onresult = (e) => {
      done = true;
      const alts = [];
      for (const res of e.results) for (const alt of res) alts.push(alt.transcript);
      resolve(alts);
    };
    r.onerror = (e) => { done = true; reject(new Error(e.error || 'error')); };
    r.onend = () => { if (!done) resolve([]); };
    r.start();
    listen.stop = () => r.stop();
  });
}
