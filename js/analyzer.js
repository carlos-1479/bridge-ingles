// Convierte un texto pegado (oferta de trabajo, letra de canción, email…) en material de estudio.
import { GLOSSARY } from './content/glossary.js';
import { VOCAB } from './content/vocab.js';
import { get } from './store.js';
import { shuffle, tiles, escapeHtml } from './text.js';

// Diccionario combinado: glosario + vocabulario de la app + tus palabras.
function dictionary() {
  const d = new Map(Object.entries(GLOSSARY));
  for (const v of VOCAB) if (!d.has(v.en.toLowerCase())) d.set(v.en.toLowerCase(), v.es);
  for (const w of get().customWords) d.set(w.en.toLowerCase(), w.es);
  return d;
}

const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Encuentra expresiones conocidas, primero las más largas, sin solaparse.
export function findTerms(text) {
  const dict = dictionary();
  const lower = text.toLowerCase().replace(/[’]/g, "'");
  const taken = new Array(text.length).fill(false);
  const found = [];
  const keys = [...dict.keys()].sort((a, b) => b.length - a.length);
  for (const key of keys) {
    const re = new RegExp(`(^|[^a-z'])(${escRe(key)})(?=$|[^a-z'])`, 'g');
    let m;
    while ((m = re.exec(lower))) {
      const start = m.index + m[1].length;
      const end = start + key.length;
      if (taken.slice(start, end).some(Boolean)) continue;
      for (let i = start; i < end; i++) taken[i] = true;
      found.push({ start, end, term: text.slice(start, end), key, es: dict.get(key) });
    }
  }
  return found.sort((a, b) => a.start - b.start);
}

// HTML del texto con las expresiones resaltadas y cada palabra pulsable.
export function renderAnnotated(text) {
  const terms = findTerms(text);
  let html = '';
  let pos = 0;
  const plain = (chunk) =>
    escapeHtml(chunk).replace(/[A-Za-z][A-Za-z'’-]*/g, (w) => `<span class="w" data-w="${w}">${w}</span>`);
  for (const t of terms) {
    html += plain(text.slice(pos, t.start));
    html += `<span class="term" data-key="${escapeHtml(t.key)}" data-es="${escapeHtml(t.es)}">${escapeHtml(t.term)}</span>`;
    pos = t.end;
  }
  html += plain(text.slice(pos));
  return html.replace(/\n/g, '<br>');
}

// Lista única de expresiones encontradas, para el glosario del texto.
export function uniqueTerms(text) {
  const seen = new Map();
  for (const t of findTerms(text)) if (!seen.has(t.key)) seen.set(t.key, t);
  return [...seen.values()];
}

export function splitSentences(text) {
  return text
    .split(/\n+|(?<=[.!?])\s+/)
    .map((s) => s.replace(/^[\s•\-–*·]+/, '').trim())
    .filter((s) => {
      const n = s.split(/\s+/).length;
      return n >= 4 && n <= 22 && /[a-z]/i.test(s);
    });
}

// Crea una lección a partir del texto.
export function buildTextLesson(textObj) {
  const text = textObj.content;
  const terms = uniqueTerms(text);
  const sentences = splitSentences(text);
  const dict = dictionary();
  const allEs = [...new Set([...dict.values()])];
  const lesson = [];
  const meaningPool = terms.length >= 4 ? terms.map((t) => t.es) : allEs;

  // Priorizamos expresiones largas (más específicas del texto) y las que aún no sabes.
  const srs = get().srs;
  const known = (key) => {
    const v = VOCAB.find((x) => x.en.toLowerCase() === key);
    return v && srs[v.id]?.box >= 3;
  };
  const ranked = shuffle(terms)
    .filter((t) => t.key.length > 3)
    .sort((a, b) => (known(a.key) - known(b.key)) || (b.key.split(' ').length - a.key.split(' ').length));

  // 1) Significado de expresiones
  for (const t of ranked.slice(0, 5)) {
    const others = shuffle(meaningPool.filter((e) => e !== t.es)).slice(0, 3);
    const options = shuffle([t.es, ...others]);
    lesson.push({ kind: 'choice', skill: 'vocab', lvl: null, itemId: null, badge: 'De tu texto',
      audio: t.term, prompt: `¿Qué significa <b class="en">${escapeHtml(t.term)}</b>?`,
      options, answer: options.indexOf(t.es), solution: `${t.term} = ${t.es}`, termToSave: t });
  }

  // 2) Huecos en frases del propio texto
  const termKeys = terms.map((t) => t.key);
  const gapCands = shuffle(sentences).map((s) => {
    const lower = s.toLowerCase();
    // La frase debe tener contexto suficiente además de la expresión (no vale un título)
    const k = termKeys
      .filter((key) => key.length > 3 && s.split(/\s+/).length - key.split(/\s+/).length >= 3)
      .find((key) => new RegExp(`(^|[^a-z])${escRe(key)}($|[^a-z])`).test(lower));
    return k ? { s, key: k } : null;
  }).filter(Boolean).slice(0, 3);
  for (const { s, key } of gapCands) {
    const re = new RegExp(`(^|[^a-z])(${escRe(key)})(?=$|[^a-z])`, 'i');
    const m = s.match(re);
    const original = m[2];
    const at = m.index + m[1].length;
    const gapped = escapeHtml(s.slice(0, at)) + '<span class="blank">____</span>' + escapeHtml(s.slice(at + original.length));
    const others = shuffle(termKeys.filter((k) => k !== key && k.length > 3)).slice(0, 2);
    while (others.length < 2) others.push(shuffle(Object.keys(GLOSSARY)).find((k) => k !== key && !others.includes(k)));
    const options = shuffle([original.toLowerCase(), ...others]);
    lesson.push({ kind: 'choice', skill: 'reading', lvl: null, itemId: null, badge: 'De tu texto',
      prompt: `Completa con la expresión correcta:<div class="sentence en">${gapped}</div>`,
      options, answer: options.indexOf(original.toLowerCase()), solution: s, speakSolution: true });
  }

  // 3) Listening, speaking y ordenar con frases del texto
  const short = shuffle(sentences.filter((s) => s.split(/\s+/).length <= 14));
  const [d1, d2, sp1, sp2, ord] = short;
  if (d1) lesson.push({ kind: 'type', skill: 'listening', lvl: null, itemId: null, audio: d1, autoplay: true,
    audioOnly: true, prompt: 'Escucha esta frase de tu texto y escríbela', answers: [d1], solution: d1, canSkip: 'audio' });
  if (sp1) lesson.push({ kind: 'speak', skill: 'speaking', lvl: null, itemId: null, text: sp1, es: '', canSkip: 'mic' });
  if (ord && ord.split(/\s+/).length <= 11) {
    const t = tiles(ord);
    lesson.push({ kind: 'order', skill: 'grammar', lvl: null, itemId: null, audio: ord,
      prompt: 'Escucha y ordena la frase', listenFirst: true, tiles: shuffle(t), answer: ord, solution: ord });
  }
  if (d2) lesson.push({ kind: 'type', skill: 'listening', lvl: null, itemId: null, audio: d2, autoplay: true,
    audioOnly: true, prompt: 'Escribe lo que oyes', answers: [d2], solution: d2, canSkip: 'audio' });
  if (sp2) lesson.push({ kind: 'speak', skill: 'speaking', lvl: null, itemId: null, text: sp2, es: '', canSkip: 'mic' });

  return lesson;
}
