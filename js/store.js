// Estado de la app guardado en el propio móvil (localStorage).
const KEY = 'bridge-english-v1';

export const SKILLS = ['vocab', 'grammar', 'reading', 'listening', 'speaking'];
export const SKILL_LABEL = {
  vocab: 'Vocabulario', grammar: 'Gramática', reading: 'Reading',
  listening: 'Listening', speaking: 'Speaking',
};
export const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export function levelLabel(theta) {
  return LEVELS[Math.max(0, Math.min(5, Math.floor(theta) - 1))];
}

export function today(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function daysBetween(a, b) {
  return Math.round((new Date(b + 'T12:00') - new Date(a + 'T12:00')) / 86400000);
}

function fresh() {
  return {
    version: 1,
    profile: null, // { name, goal, target, interests[], minutes, createdAt }
    ability: { vocab: 1.5, grammar: 1.5, reading: 1.5, listening: 1.5, speaking: 1.5 },
    answers: { vocab: 0, grammar: 0, reading: 0, listening: 0, speaking: 0 },
    xp: 0,
    streak: { count: 0, last: null, best: 0 },
    days: {}, // 'YYYY-MM-DD' → { xp, lessons, correct, total }
    srs: {}, // wordId → { box, due, seen, ok }
    items: {}, // itemId → { seen, ok, last }
    customWords: [], // { id, en, es, source }
    texts: [], // { id, type, title, content, createdAt }
    settings: { rate: 0.95, voice: null },
  };
}

let state = load();

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && s.version === 1) return { ...fresh(), ...s };
  } catch (_) { /* estado corrupto → empezar de cero */ }
  return fresh();
}

export function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function get() { return state; }

export function reset() {
  state = fresh();
  save();
}

export function exportData() { return JSON.stringify(state, null, 2); }

export function importData(json) {
  const s = JSON.parse(json);
  if (!s || s.version !== 1) throw new Error('Archivo no válido');
  state = { ...fresh(), ...s };
  save();
}

export function dayStats(day = today()) {
  return state.days[day] || { xp: 0, lessons: 0, correct: 0, total: 0 };
}

// Objetivo diario de XP según los minutos elegidos.
export function dailyGoal() {
  return ({ 5: 20, 10: 40, 15: 60, 20: 80 })[state.profile?.minutes] || 40;
}

export function addXp(n) {
  const d = today();
  const ds = dayStats(d);
  ds.xp += n;
  state.days[d] = ds;
  state.xp += n;
  save();
}

export function recordAnswer(ok) {
  const d = today();
  const ds = dayStats(d);
  ds.total += 1;
  if (ok) ds.correct += 1;
  state.days[d] = ds;
}

// La racha cuenta cuando completas al menos una lección en el día.
export function completeLesson() {
  const d = today();
  const ds = dayStats(d);
  ds.lessons += 1;
  state.days[d] = ds;
  const s = state.streak;
  if (s.last !== d) {
    s.count = s.last && daysBetween(s.last, d) === 1 ? s.count + 1 : 1;
    s.last = d;
    s.best = Math.max(s.best, s.count);
  }
  save();
}

// Racha visible: si ayer no se practicó, se ha perdido.
export function currentStreak() {
  const s = state.streak;
  if (!s.last) return 0;
  return daysBetween(s.last, today()) <= 1 ? s.count : 0;
}

export function overallTheta() {
  const a = state.ability;
  return SKILLS.reduce((sum, k) => sum + a[k], 0) / SKILLS.length;
}
