// Utilidades de texto: normalizar, comparar respuestas escritas y habladas.
const CONTRACTIONS = [
  [/\bi'm\b/g, 'i am'], [/\byou're\b/g, 'you are'], [/\bwe're\b/g, 'we are'],
  [/\bthey're\b/g, 'they are'], [/\bhe's\b/g, 'he is'], [/\bshe's\b/g, 'she is'],
  [/\bit's\b/g, 'it is'], [/\bthat's\b/g, 'that is'], [/\bwhat's\b/g, 'what is'],
  [/\bthere's\b/g, 'there is'], [/\bcan't\b/g, 'cannot'], [/\bcan not\b/g, 'cannot'],
  [/\bwon't\b/g, 'will not'], [/\bdon't\b/g, 'do not'], [/\bdoesn't\b/g, 'does not'],
  [/\bdidn't\b/g, 'did not'], [/\bisn't\b/g, 'is not'], [/\baren't\b/g, 'are not'],
  [/\bwasn't\b/g, 'was not'], [/\bweren't\b/g, 'were not'], [/\bhaven't\b/g, 'have not'],
  [/\bhasn't\b/g, 'has not'], [/\bwouldn't\b/g, 'would not'], [/\bshouldn't\b/g, 'should not'],
  [/\bcouldn't\b/g, 'could not'], [/\bi've\b/g, 'i have'], [/\byou've\b/g, 'you have'],
  [/\bwe've\b/g, 'we have'], [/\bthey've\b/g, 'they have'], [/\bi'll\b/g, 'i will'],
  [/\byou'll\b/g, 'you will'], [/\bwe'll\b/g, 'we will'], [/\bthey'll\b/g, 'they will'],
  [/\bi'd\b/g, 'i would'], [/\byou'd\b/g, 'you would'], [/\bwe'd\b/g, 'we would'],
  [/\blet's\b/g, 'let us'], [/\bgonna\b/g, 'going to'], [/\bwanna\b/g, 'want to'],
];

const NUMBERS = {
  zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6',
  seven: '7', eight: '8', nine: '9', ten: '10', eleven: '11', twelve: '12',
};

export function normalize(s) {
  let t = s.toLowerCase().replace(/[’‘`´]/g, "'").replace(/[“”]/g, '"');
  for (const [re, rep] of CONTRACTIONS) t = t.replace(re, rep);
  t = t.replace(/a\.m\./g, 'am').replace(/p\.m\./g, 'pm');
  t = t.replace(/[^a-z0-9' ]+/g, ' ').replace(/'/g, '').replace(/\s+/g, ' ').trim();
  return t.split(' ').map((w) => NUMBERS[w] || w).join(' ');
}

export function words(s) {
  const n = normalize(s);
  return n ? n.split(' ') : [];
}

export function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

// Compara lo escrito con las respuestas válidas. Tolera pequeñas erratas.
export function checkTyped(input, answers) {
  const a = normalize(input);
  if (!a) return { ok: false, typo: false };
  let best = Infinity;
  for (const ans of answers) {
    const b = normalize(ans);
    if (a === b) return { ok: true, typo: false };
    best = Math.min(best, levenshtein(a, b) / Math.max(1, b.length));
  }
  if (best <= 0.08) return { ok: true, typo: true };
  return { ok: false, typo: false };
}

// Alinea las palabras dichas con la frase objetivo (subsecuencia común más larga).
// Devuelve las palabras objetivo marcadas como acertadas o no, y una puntuación 0-1.
export function speechScore(target, said) {
  const t = words(target);
  const s = words(said);
  const close = (x, y) => x === y || (x.length > 3 && levenshtein(x, y) <= 1);
  const dp = Array.from({ length: t.length + 1 }, () => new Array(s.length + 1).fill(0));
  for (let i = t.length - 1; i >= 0; i--) {
    for (let j = s.length - 1; j >= 0; j--) {
      dp[i][j] = close(t[i], s[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const hit = new Array(t.length).fill(false);
  let i = 0, j = 0;
  while (i < t.length && j < s.length) {
    if (close(t[i], s[j])) { hit[i] = true; i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  const score = t.length ? hit.filter(Boolean).length / t.length : 0;
  return { score, hit, targetWords: t };
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

// Separa una frase en "fichas" para el ejercicio de ordenar.
export function tiles(sentence) {
  return sentence.replace(/[.!?]+$/, '').split(/\s+/).filter(Boolean);
}
