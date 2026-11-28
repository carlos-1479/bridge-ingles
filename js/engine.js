// Motor adaptativo: estima tu nivel en cada destreza, elige ejercicios a tu medida
// y programa el repaso espaciado del vocabulario.
import { VOCAB } from './content/vocab.js';
import { SENTENCES } from './content/sentences.js';
import { GRAMMAR } from './content/grammar.js';
import { READING } from './content/reading.js';
import { get, save, today, SKILLS } from './store.js';
import { shuffle, tiles } from './text.js';
import { UOE1, UOE2, UOE3, UOE4, LISTEN, SPEAK_QUESTIONS, NOTICES, PARTS, partInfo } from './content/exam.js';
import { currentExam, updatePart, weightedPart, ensureParts } from './readiness.js';

// ---------- Nivel (modelo tipo Elo / Rasch simplificado) ----------
// Un ítem de nivel L lo acierta ~60 % alguien con habilidad θ = L.
export function expected(theta, lvl) {
  return 1 / (1 + Math.exp(-1.7 * (theta - lvl + 0.25)));
}

export function updateAbility(skill, lvl, ok) {
  if (lvl == null || !SKILLS.includes(skill)) return;
  const s = get();
  const n = s.answers[skill] || 0;
  const k = 0.06 + 0.3 / (1 + n / 12); // aprende rápido al principio, luego se estabiliza
  const theta = s.ability[skill];
  s.ability[skill] = Math.max(1, Math.min(5.95, theta + k * ((ok ? 1 : 0) - expected(theta, lvl))));
  s.answers[skill] = n + 1;
}

// ---------- Intereses y objetivo ----------
const GOAL_TOPICS = {
  b2: { work: 1.2, jobs: 1.2, connectors: 1.4 },
  work: { work: 2, jobs: 2, tech: 1.4 },
  travel: { travel: 2.5, daily: 1.5 },
  general: {},
};
const INTEREST_TOPICS = {
  jobs: ['jobs', 'work'], tech: ['tech'],
  travel: ['travel'], daily: ['daily', 'feelings'],
};

function topicWeight(topic) {
  const p = get().profile || {};
  let w = GOAL_TOPICS[p.goal]?.[topic] || 1;
  for (const i of p.interests || []) if (INTEREST_TOPICS[i]?.includes(topic)) w *= 1.8;
  return w;
}

// Elige n ítems: cerca de tu nivel (un poco por encima), de temas que te interesan,
// priorizando los nuevos y los que fallaste.
function pick(pool, theta, n, { exclude = new Set() } = {}) {
  const s = get();
  const now = today();
  const target = theta + 0.2;
  const scored = pool
    .filter((it) => !exclude.has(it.id))
    .map((it) => {
      const st = s.items[it.id];
      const dist = Math.abs(it.lvl - target);
      let w = Math.exp(-dist * dist * 1.4) * topicWeight(it.topic);
      if (!st) w *= 1.6;
      else if (st.last === now) w *= 0.1;
      else if (st.ok < st.seen) w *= 1.4;
      else w *= 0.6;
      return { it, w: w + 1e-6 };
    });
  const out = [];
  while (out.length < n && scored.length) {
    const total = scored.reduce((a, b) => a + b.w, 0);
    let r = Math.random() * total;
    let idx = 0;
    while (idx < scored.length - 1 && (r -= scored[idx].w) > 0) idx++;
    out.push(scored[idx].it);
    scored.splice(idx, 1);
  }
  return out;
}

function distractors(pool, item, key, n, sameTopic = true) {
  const val = item[key];
  const cands = pool.filter((x) => x[key] !== val && x.id !== item.id);
  const near = cands.filter((x) => (!sameTopic || x.topic === item.topic) && Math.abs((x.lvl || 3) - (item.lvl || 3)) <= 1);
  const src = near.length >= n ? near : cands;
  return shuffle(src).slice(0, n).map((x) => x[key]);
}

function choice(correct, others) {
  const options = shuffle([correct, ...others]);
  return { options, answer: options.indexOf(correct) };
}

// ---------- Repaso espaciado (Leitner) ----------
const INTERVALS = [0, 1, 2, 4, 7, 15, 30, 60]; // días por caja

function addDays(day, n) {
  const d = new Date(day + 'T12:00');
  d.setDate(d.getDate() + n);
  return today(d);
}

export function allWords() {
  const custom = get().customWords.map((w) => ({ ...w, lvl: null, topic: 'custom', ex: w.ex || '' }));
  return [...VOCAB, ...custom];
}

export function dueWords() {
  const s = get();
  const now = today();
  const byId = new Map(allWords().map((w) => [w.id, w]));
  return Object.entries(s.srs)
    .filter(([id, r]) => r.due <= now && byId.has(id))
    .sort((a, b) => a[1].box - b[1].box || a[1].due.localeCompare(b[1].due))
    .map(([id]) => byId.get(id));
}

export function learnedCount() {
  return Object.values(get().srs).filter((r) => r.box >= 3).length;
}

function updateSrs(wordId, ok) {
  const s = get();
  const r = s.srs[wordId] || { box: 0, due: today(), seen: 0, ok: 0 };
  r.seen += 1;
  if (ok) { r.ok += 1; r.box = Math.min(INTERVALS.length - 1, r.box + 1); }
  else r.box = Math.max(1, Math.floor(r.box / 2));
  r.due = addDays(today(), ok ? INTERVALS[r.box] : 0);
  s.srs[wordId] = r;
}

export function addCustomWord(en, es, source) {
  const s = get();
  const id = 'c_' + en.toLowerCase().replace(/[^a-z]+/g, '-');
  const known = VOCAB.find((v) => v.en.toLowerCase() === en.toLowerCase());
  if (known) {
    if (!s.srs[known.id]) s.srs[known.id] = { box: 0, due: today(), seen: 0, ok: 0 };
    save();
    return known.id;
  }
  if (!s.customWords.find((w) => w.id === id)) s.customWords.push({ id, en, es, source });
  if (!s.srs[id]) s.srs[id] = { box: 0, due: today(), seen: 0, ok: 0 };
  save();
  return id;
}

// ---------- Generadores de ejercicios ----------
function vocabExercise(w, isNew) {
  const s = get();
  const pool = allWords();
  const box = s.srs[w.id]?.box || 0;
  const base = { skill: 'vocab', lvl: w.lvl, itemId: w.id, wordId: w.id };
  const ex = w.ex ? `<div class="hint">“${w.ex}”</div>` : '';
  if (isNew) {
    return { ...base, kind: 'choice', badge: 'Palabra nueva', audio: w.en, autoplay: true,
      prompt: `¿Qué significa <b class="en">${w.en}</b>?${ex}`,
      ...choice(w.es, distractors(pool, w, 'es', 3)), solution: `${w.en} = ${w.es}` };
  }
  const modes = box >= 2 ? ['en-es', 'es-en', 'listen', 'type'] : ['en-es', 'es-en', 'listen'];
  const mode = modes[Math.floor(Math.random() * modes.length)];
  if (mode === 'es-en') {
    return { ...base, kind: 'choice', prompt: `¿Cómo se dice <b>${w.es}</b> en inglés?`,
      ...choice(w.en, distractors(pool, w, 'en', 3)), speakOptions: true, solution: `${w.es} = ${w.en}` };
  }
  if (mode === 'listen') {
    return { ...base, kind: 'choice', audio: w.en, autoplay: true, audioOnly: true,
      prompt: 'Escucha y elige la palabra que oyes',
      ...choice(w.en, distractors(pool, w, 'en', 3)), solution: `${w.en} = ${w.es}` };
  }
  if (mode === 'type') {
    return { ...base, kind: 'type', prompt: `Escribe en inglés: <b>${w.es}</b>`,
      answers: [w.en], solution: w.en, placeholder: 'En inglés…' };
  }
  return { ...base, kind: 'choice', audio: w.en, prompt: `¿Qué significa <b class="en">${w.en}</b>?${ex}`,
    ...choice(w.es, distractors(pool, w, 'es', 3)), solution: `${w.en} = ${w.es}` };
}

function matchExercise(words) {
  return { kind: 'match', skill: 'vocab', lvl: null, itemId: null,
    prompt: 'Une cada palabra con su significado',
    pairs: words.map((w) => ({ en: w.en, es: w.es, wordId: w.id })) };
}

function grammarExercise(g) {
  const opts = g.options.map((o) => o);
  const correct = opts[g.answer];
  const sh = shuffle(opts);
  return { kind: 'choice', skill: 'grammar', lvl: g.lvl, itemId: g.id, badge: g.topic,
    prompt: `Completa la frase:<div class="sentence en">${g.prompt.replace('___', '<span class="blank">____</span>')}</div>`,
    options: sh, answer: sh.indexOf(correct), explain: g.explain,
    solution: g.prompt.replace('___', correct), speakSolution: true };
}

function orderExercise(sn) {
  const t = tiles(sn.en);
  let sh = shuffle(t);
  if (sh.join(' ') === t.join(' ') && t.length > 1) sh = [...t.slice(1), t[0]];
  return { kind: 'order', skill: 'grammar', lvl: sn.lvl, itemId: sn.id + '#order',
    prompt: `Traduce ordenando las palabras:<div class="sentence">${sn.es}</div>`,
    tiles: sh, answer: sn.en, solution: sn.en, audio: sn.en };
}

function listenChoiceExercise(sn) {
  return { kind: 'choice', skill: 'listening', lvl: sn.lvl, itemId: sn.id + '#lc',
    audio: sn.en, autoplay: true, audioOnly: true, prompt: 'Escucha. ¿Qué significa?',
    ...choice(sn.es, distractors(SENTENCES, sn, 'es', 2, false)), solution: `${sn.en} — ${sn.es}`, canSkip: 'audio' };
}

function dictationExercise(sn) {
  return { kind: 'type', skill: 'listening', lvl: sn.lvl + 0.3, itemId: sn.id + '#dict',
    audio: sn.en, autoplay: true, audioOnly: true, prompt: 'Escribe lo que oyes',
    answers: [sn.en], solution: sn.en, placeholder: 'Escribe en inglés…', canSkip: 'audio' };
}

function readChoiceExercise(sn) {
  return { kind: 'choice', skill: 'reading', lvl: sn.lvl, itemId: sn.id + '#rc',
    prompt: `¿Qué significa esta frase?<div class="sentence en">${sn.en}</div>`,
    ...choice(sn.es, distractors(SENTENCES, sn, 'es', 2, false)), solution: sn.es, audio: sn.en };
}

function speakExercise(sn) {
  return { kind: 'speak', skill: 'speaking', lvl: sn.lvl, itemId: sn.id + '#speak',
    text: sn.en, es: sn.es, canSkip: 'mic' };
}

function readingExercise(r) {
  return { kind: 'reading', skill: 'reading', lvl: r.lvl, itemId: r.id, title: r.title,
    text: r.text, questions: r.questions };
}

// ---------- Construcción de lecciones ----------
const SIZE = { 5: 8, 10: 12, 15: 16, 20: 20 };

function newWords(n) {
  const s = get();
  const pool = VOCAB.filter((w) => !s.srs[w.id]);
  return pick(pool, s.ability.vocab, n);
}

function sentenceExercises(skill, n, used) {
  const s = get();
  const theta = s.ability[skill === 'grammar' ? 'grammar' : skill];
  const suffix = { listening: '#lc', speaking: '#speak', reading: '#rc', grammar: '#order' }[skill];
  const pool = SENTENCES.map((x) => ({ ...x, id: x.id })).filter((x) => !used.has(x.id));
  // Las estadísticas se guardan con sufijo, así que las consultamos con un alias.
  const withStats = pool.map((x) => ({ ...x, _sid: x.id + suffix }));
  const picked = pick(withStats.map((x) => ({ ...x, id: x._sid })), theta, n)
    .map((x) => SENTENCES.find((y) => y.id + suffix === x.id));
  picked.forEach((x) => used.add(x.id));
  return picked.map((sn) => {
    if (skill === 'speaking') return speakExercise(sn);
    if (skill === 'reading') return readChoiceExercise(sn);
    if (skill === 'grammar') return orderExercise(sn);
    // listening: dictado cuando la frase está por debajo de tu nivel
    return sn.lvl <= theta - 0.3 && Math.random() < 0.6 ? dictationExercise(sn) : listenChoiceExercise(sn);
  });
}

function grammarExercises(n) {
  return pick(GRAMMAR, get().ability.grammar, n).map(grammarExercise);
}

function readingPassage() {
  const s = get();
  const recent = (id) => {
    const st = s.items[id];
    if (!st?.last) return false;
    return (new Date(today()) - new Date(st.last)) / 86400000 < 7;
  };
  const pool = READING.filter((r) => !recent(r.id));
  const [r] = pick(pool.length ? pool : READING, s.ability.reading, 1);
  return r ? readingExercise(r) : null;
}

function weakestSkill() {
  const a = get().ability;
  return SKILLS.reduce((w, k) => (a[k] < a[w] ? k : w), SKILLS[0]);
}

export function buildDailyLesson() {
  if (currentExam()) return buildExamDaily();
  const s = get();
  const size = SIZE[s.profile?.minutes] || 12;
  const used = new Set();
  const goal = s.profile?.goal;

  // 1) Vocabulario: repasos pendientes + palabras nuevas
  const due = dueWords().slice(0, size >= 12 ? 3 : 2);
  const fresh = newWords(size >= 12 ? 2 : 1);
  const vocab = [...fresh.map((w) => vocabExercise(w, true)), ...due.map((w) => vocabExercise(w, false))];

  // 2) Reparto del resto según objetivo y punto débil
  const weights = { grammar: 2.5, listening: 2.5, speaking: 1.5, reading: 1.5 };
  if (goal === 'work') { weights.speaking += 0.5; weights.reading += 0.5; }
  if (goal === 'b2') { weights.grammar += 0.5; weights.reading += 0.5; }
  if (goal === 'travel') { weights.listening += 1; weights.speaking += 0.5; }
  const weak = weakestSkill();
  if (weights[weak] != null) weights[weak] += 1;

  let remaining = size - vocab.length;
  const withPassage = size >= 12;
  if (withPassage) remaining -= 3; // un texto de reading equivale a ~3 ejercicios
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  const counts = {};
  for (const k of Object.keys(weights)) counts[k] = Math.floor((weights[k] / total) * remaining);
  let assigned = Object.values(counts).reduce((a, b) => a + b, 0);
  const order = Object.keys(weights).sort((a, b) => weights[b] - weights[a]);
  for (let i = 0; assigned < remaining; i++, assigned++) counts[order[i % order.length]]++;
  // Como mucho 2 de speaking por lección corta (cansa hablar mucho seguido)
  const maxSpeak = size >= 16 ? 3 : 2;
  if (counts.speaking > maxSpeak) { counts.listening += counts.speaking - maxSpeak; counts.speaking = maxSpeak; }

  const gCount = counts.grammar;
  const ex = {
    grammar: [...grammarExercises(Math.ceil(gCount * 0.6)), ...sentenceExercises('grammar', Math.floor(gCount * 0.4), used)],
    listening: sentenceExercises('listening', counts.listening, used),
    speaking: sentenceExercises('speaking', counts.speaking, used),
    reading: sentenceExercises('reading', counts.reading, used),
  };

  // 3) Orden: calentamiento con vocabulario, mezcla, texto de reading en el centro, speaking al final
  const middle = shuffle([...ex.grammar, ...ex.listening, ...ex.reading]);
  const lesson = [...vocab.slice(0, 2), ...middle.slice(0, Math.ceil(middle.length / 2))];
  if (withPassage) { const p = readingPassage(); if (p) lesson.push(p); }
  lesson.push(...vocab.slice(2), ...middle.slice(Math.ceil(middle.length / 2)));
  // repartimos el speaking para que no vaya todo junto
  ex.speaking.forEach((sp, i) => lesson.splice(Math.min(lesson.length, 3 + i * 4), 0, sp));
  return lesson.filter(Boolean);
}

export function buildSkillLesson(skill) {
  const used = new Set();
  if (skill === 'vocab') {
    const due = dueWords().slice(0, 6);
    const fresh = newWords(Math.max(2, 8 - due.length));
    const list = [...fresh.map((w) => vocabExercise(w, true)), ...shuffle(due).map((w) => vocabExercise(w, false))];
    const known = [...fresh, ...due].slice(0, 4);
    if (known.length >= 3) list.push(matchExercise(known));
    return list;
  }
  if (skill === 'grammar') return shuffle([...grammarExercises(6), ...sentenceExercises('grammar', 4, used)]);
  if (skill === 'reading') {
    const p = readingPassage();
    return [...sentenceExercises('reading', 3, used), p].filter(Boolean);
  }
  return sentenceExercises(skill, skill === 'speaking' ? 8 : 10, used);
}

export function buildReviewLesson() {
  const due = dueWords().slice(0, 12);
  if (!due.length) return [];
  const list = shuffle(due).map((w) => vocabExercise(w, false));
  if (due.length >= 4) list.push(matchExercise(shuffle(due).slice(0, 4)));
  return list;
}

// Errores recientes: ítems fallados en los últimos días.
export function buildMistakesLesson() {
  const s = get();
  const wrong = Object.entries(s.items).filter(([, st]) => st.ok < st.seen && st.lastWrong).map(([id]) => id);
  const used = new Set();
  const out = [];
  for (const id of shuffle(wrong).slice(0, 10)) {
    const g = GRAMMAR.find((x) => x.id === id);
    if (g) { out.push(grammarExercise(g)); continue; }
    const k = UOE4.find((x) => x.id === id);
    if (k) { out.push(kwtExercise(k)); continue; }
    const [sid, suffix] = id.split('#');
    const sn = SENTENCES.find((x) => x.id === sid);
    if (!sn || used.has(sid)) continue;
    used.add(sid);
    if (suffix === 'speak') out.push(speakExercise(sn));
    else if (suffix === 'order') out.push(orderExercise(sn));
    else if (suffix === 'dict') out.push(dictationExercise(sn));
    else if (suffix === 'rc') out.push(readChoiceExercise(sn));
    else out.push(listenChoiceExercise(sn));
  }
  return out;
}

export function mistakesCount() {
  return Object.entries(get().items)
    .filter(([id, st]) => st.ok < st.seen && st.lastWrong && /^(g_|s_|u4_)/.test(id)).length;
}

// ---------- Ejercicios con formato de examen ----------
// Elige ítems priorizando los no vistos y los fallados, y luego los más antiguos.
function pickFresh(pool, n, statId = (x) => x.id) {
  const s = get();
  const score = (x) => {
    const st = s.items[statId(x)];
    if (!st) return 3 + Math.random();
    if (st.lastWrong) return 2 + Math.random();
    return Math.random() * (st.last === today() ? 0.1 : 1);
  };
  return pool.map((x) => ({ x, w: score(x) })).sort((a, b) => b.w - a.w).slice(0, n).map((o) => o.x);
}

const CLOZE_POOL = { uoe1: UOE1, uoe2: UOE2, uoe3: UOE3 };
const CLOZE_MODE = { uoe1: 'mc', uoe2: 'open', uoe3: 'wf' };

function badgeOf(part) {
  const i = partInfo(part, currentExam());
  return `${i.name} · ${i.short}`;
}

function clozeExercise(part, gapsToAsk) {
  const exam = currentExam();
  if (!part || !CLOZE_POOL[part]) return null;
  const pool = CLOZE_POOL[part].filter((t) => t.exam === exam.id);
  const s = get();
  // El texto con más huecos sin ver o fallados
  const [t] = pickFresh(pool, 1, (x) => {
    const ids = x.gaps.map((_, i) => `${x.id}#${i}`);
    const pend = ids.find((id) => !s.items[id] || s.items[id].lastWrong);
    return pend || ids[0];
  });
  if (!t) return null;
  let active = t.gaps.map((_, i) => i);
  if (gapsToAsk && gapsToAsk < active.length) {
    const pref = active.filter((i) => !s.items[`${t.id}#${i}`] || s.items[`${t.id}#${i}`].lastWrong);
    active = shuffle(pref.length >= gapsToAsk ? pref : active).slice(0, gapsToAsk).sort((a, b) => a - b);
  }
  return { kind: 'cloze', mode: CLOZE_MODE[part], part, skill: PARTS[part].skill, lvl: t.lvl,
    itemId: t.id, title: t.title, text: t.text, gaps: t.gaps, active, badge: badgeOf(part) };
}

export function kwtExercise(k) {
  return { kind: 'kwt', part: 'uoe4', skill: 'grammar', lvl: k.lvl, itemId: k.id, ...k,
    badge: badgeOf('uoe4'), solution: `${k.before} ${k.answers[0]} ${k.after}` };
}

function noticeExercise(n) {
  return { kind: 'choice', part: 'notices', skill: 'reading', lvl: n.lvl, itemId: n.id, badge: badgeOf('notices'),
    prompt: `¿Qué dice este texto?<div class="notice en">${n.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br>')}</div>`,
    ...choice(n.options[0], n.options.slice(1)), solution: n.options[0] };
}

function examListenExercise(l) {
  return { kind: 'choice', part: 'listen', skill: 'listening', lvl: l.lvl, itemId: l.id,
    badge: `Listening · ${currentExam().name}`, audio: l.script, autoplay: true, audioOnly: true,
    prompt: l.q, ...choice(l.options[0], l.options.slice(1)), canSkip: 'audio',
    solution: l.options[0], explain: 'Transcripción: ' + l.script };
}

function speakFreeExercise(q) {
  return { kind: 'speakfree', part: 'speak', skill: 'speaking', lvl: q.lvl, itemId: q.id,
    badge: 'Speaking · Part 1', question: q.q, canSkip: 'mic' };
}

function examReading() {
  const exam = currentExam();
  const pool = READING.filter((r) => r.lvl >= exam.lvl - 1 && r.lvl <= exam.lvl);
  const [r] = pickFresh(pool, 1);
  return r ? { ...readingExercise(r), part: 'read', lvl: Math.max(r.lvl, exam.lvl - 0.5) } : null;
}

function forExam(pool) { const id = currentExam().id; return pool.filter((x) => x.exam === id); }

function buildExamDaily() {
  ensureParts();
  const s = get();
  const size = SIZE[s.profile?.minutes] || 12;
  const long = size >= 12;
  const due = dueWords().slice(0, long ? 2 : 1);
  const fresh = newWords(1);
  const out = [...fresh.map((w) => vocabExercise(w, true)), ...due.map((w) => vocabExercise(w, false))];

  const exam = currentExam();
  const cloze = clozeExercise(weightedPart(['uoe1', 'uoe2', 'uoe3']), long ? 4 : 3);
  if (cloze) out.push(cloze);
  // B2/C1: transformaciones. A2/B1: avisos y mensajes cortos (Reading 1)
  const kwts = exam.parts.uoe4
    ? pickFresh(forExam(UOE4), long ? 2 : 1).map(kwtExercise)
    : pickFresh(forExam(NOTICES), long ? 2 : 1).map(noticeExercise);
  out.push(kwts[0]);
  out.push(...pickFresh(forExam(LISTEN), long ? 2 : 1).map(examListenExercise));
  if (long) { const r = examReading(); if (r) out.push(r); }
  else out.push(...sentenceExercises('reading', 1, new Set()));
  if (kwts[1]) out.push(kwts[1]);
  out.push(...pickFresh(forExam(SPEAK_QUESTIONS), 1).map(speakFreeExercise));
  if (size >= 15) {
    // Refuerzo extra en la parte que más nota te puede dar
    const extra = weightedPart(['uoe1', 'uoe2', 'uoe3', 'uoe4', 'notices', 'listen']);
    if (extra === 'uoe4') out.push(...pickFresh(forExam(UOE4), 2).map(kwtExercise));
    else if (extra === 'notices') out.push(...pickFresh(forExam(NOTICES), 2).map(noticeExercise));
    else if (extra === 'listen') out.push(...pickFresh(forExam(LISTEN), 2).map(examListenExercise));
    else { const c = clozeExercise(extra, 4); if (c) out.push(c); }
    out.push(...sentenceExercises('speaking', 1, new Set()));
  }
  return out.filter(Boolean);
}

export function buildPartLesson(part) {
  ensureParts();
  if (CLOZE_POOL[part]) return [clozeExercise(part)].filter(Boolean);
  if (part === 'uoe4') return pickFresh(forExam(UOE4), 6).map(kwtExercise);
  if (part === 'notices') return pickFresh(forExam(NOTICES), 6).map(noticeExercise);
  if (part === 'listen') return pickFresh(forExam(LISTEN), 6).map(examListenExercise);
  if (part === 'speak') return [...pickFresh(forExam(SPEAK_QUESTIONS), 3).map(speakFreeExercise), ...sentenceExercises('speaking', 2, new Set())];
  if (part === 'read') {
    const a = examReading();
    const rest = READING.filter((r) => r.id !== a?.itemId && r.lvl >= currentExam().lvl - 1 && r.lvl <= currentExam().lvl);
    const [b] = pickFresh(rest, 1);
    return [a, b && { ...readingExercise(b), part: 'read', lvl: Math.max(b.lvl, currentExam().lvl - 0.5) }].filter(Boolean);
  }
  return [];
}

// ---------- Registrar resultados ----------
export function applyResult(ex, ok, { lvl, itemId } = {}) {
  const s = get();
  const L = lvl ?? ex.lvl;
  updateAbility(ex.skill, L, ok);
  if (ex.part) updatePart(ex.part, L, ok);
  const id = itemId ?? ex.itemId;
  if (id) {
    const st = s.items[id] || { seen: 0, ok: 0, last: null, lastWrong: false };
    st.seen += 1;
    if (ok) st.ok += 1;
    st.last = today();
    st.lastWrong = !ok;
    s.items[id] = st;
  }
  if (ex.wordId) updateSrs(ex.wordId, ok);
  save();
}

export function applyMatchResult(pairs, mistakesByWord) {
  for (const p of pairs) {
    const ok = !mistakesByWord[p.wordId];
    if (p.wordId) updateSrs(p.wordId, ok);
  }
  save();
}

// Para el test de nivel inicial.
export function setInitialLevel(theta) {
  const s = get();
  for (const k of SKILLS) s.ability[k] = theta;
  // En España el speaking y el listening suelen ir algo por detrás del nivel escrito.
  s.ability.speaking = Math.max(1, theta - 0.4);
  s.ability.listening = Math.max(1, theta - 0.3);
  save();
}
