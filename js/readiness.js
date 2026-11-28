// Preparación para el examen: nivel por parte, nota estimada y prioridades.
import { EXAMS, PARTS, partInfo, NOTICES, UOE1, UOE2, UOE3, UOE4, LISTEN, SPEAK_QUESTIONS, WRITING } from './content/exam.js';
import { get, save, today } from './store.js';

export function currentExam() {
  return EXAMS[get().profile?.goal] || null;
}

function expected(theta, lvl) {
  return 1 / (1 + Math.exp(-1.7 * (theta - lvl + 0.25)));
}

// Al empezar, cada parte hereda la estimación de la destreza general relacionada.
// Se guardan todas las partes (aunque el examen no las tenga) por si cambias de examen.
export function ensureParts() {
  const s = get();
  s.parts ||= {};
  s.partN ||= {};
  const a = s.ability;
  const seed = {
    notices: a.reading, uoe1: a.vocab, uoe2: a.grammar, uoe3: a.vocab, uoe4: a.grammar,
    read: a.reading, listen: a.listening, speak: a.speaking, write: (a.grammar + a.vocab) / 2,
  };
  for (const p of Object.keys(PARTS)) if (s.parts[p] == null) { s.parts[p] = Math.max(1, seed[p]); s.partN[p] = 0; }
}

export function updatePart(part, lvl, ok) {
  if (!PARTS[part] || lvl == null) return;
  ensureParts();
  const s = get();
  const n = s.partN[part] || 0;
  const k = 0.06 + 0.3 / (1 + n / 10);
  const th = s.parts[part];
  s.parts[part] = Math.max(1, Math.min(5.95, th + k * ((ok ? 1 : 0) - expected(th, lvl))));
  s.partN[part] = n + 1;
  // Histórico semanal para ver la evolución (útil para el profesor)
  const wk = weekKey();
  s.partHistory ||= {};
  s.partHistory[wk] = { ...(s.partHistory[wk] || {}), [part]: s.parts[part] };
}

function weekKey(d = new Date()) {
  const x = new Date(d);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); // lunes
  return today(x);
}

export function toScale(pct, exam = currentExam()) {
  const pts = exam.scale;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    if (pct <= x1) return Math.round(y0 + ((pct - x0) / (x1 - x0)) * (y1 - y0));
  }
  return pts[pts.length - 1][1];
}

export function gradeFor(score, exam = currentExam()) {
  return exam.grades.find(([min]) => score >= min)[1];
}

export function examParts(exam = currentExam()) {
  return exam ? Object.keys(exam.parts) : [];
}

export function report() {
  const exam = currentExam();
  if (!exam) return null;
  ensureParts();
  const s = get();
  const parts = examParts(exam).map((id) => {
    const pct = expected(s.parts[id], exam.lvl);
    return { ...partInfo(id, exam), pct, score: toScale(pct, exam), n: s.partN[id] || 0 };
  });
  const papers = Object.entries(exam.papers).map(([pid, [name, share]]) => {
    const ps = parts.filter((p) => p.paper === pid);
    const w = ps.reduce((a, p) => a + p.weight, 0);
    const pct = ps.reduce((a, p) => a + p.pct * p.weight, 0) / w;
    return { id: pid, name, share, pct, score: toScale(pct, exam), parts: ps, n: ps.reduce((a, p) => a + p.n, 0) };
  });
  const overallPct = papers.reduce((a, p) => a + p.pct * p.share, 0);
  const overall = Math.round(papers.reduce((a, p) => a + p.score * p.share, 0));
  // Impacto en la nota global de mejorar cada parte
  const target = exam.passPct + 0.15;
  for (const p of parts) {
    const paper = papers.find((x) => x.id === p.paper);
    const share = (p.weight / paper.parts.reduce((a, x) => a + x.weight, 0)) * paper.share;
    p.impact = Math.max(0, target - p.pct) * share;
  }
  // Solo priorizamos partes con datos reales; las demás se marcan como "sin evaluar"
  const priorities = parts.filter((p) => p.pct < exam.passPct + 0.12 && p.n >= 3).sort((a, b) => b.impact - a.impact).slice(0, 3);
  const untested = parts.filter((p) => p.n < 3);
  const strong = parts.filter((p) => p.pct >= target && p.n >= 8);
  const days = s.profile.examDate ? Math.ceil((new Date(s.profile.examDate + 'T09:00') - new Date()) / 86400000) : null;
  const totalAnswers = parts.reduce((a, p) => a + p.n, 0);
  return {
    exam, parts, papers, overall, overallPct, grade: gradeFor(overall, exam), passes: overall >= exam.pass,
    priorities, strong, untested, days, reliable: totalAnswers >= 60, totalAnswers,
  };
}

// Parte en la que más conviene practicar ahora (para la lección diaria).
export function weightedPart(candidates) {
  const r = report();
  if (!r) return null;
  const list = r.parts.filter((p) => candidates.includes(p.id)).map((p) => ({ id: p.id, w: 0.05 + p.impact * 10 }));
  if (!list.length) return null;
  const total = list.reduce((a, b) => a + b.w, 0);
  let x = Math.random() * total;
  for (const it of list) if ((x -= it.w) <= 0) return it.id;
  return list[list.length - 1].id;
}

// Texto para enviar al profesor.
export function reportText() {
  const r = report();
  const s = get();
  if (!r) return '';
  const pct = (x) => Math.round(x * 100) + '%';
  const lines = [
    `Informe de preparación · ${r.exam.name}`,
    `Alumno: ${s.profile.name} · ${new Date().toLocaleDateString('es-ES')}`,
    r.days != null ? `Examen en ${r.days} días` : '',
    `Nota estimada: ${r.overall} (${r.grade}) · aprobado: ${r.exam.pass}${r.reliable ? '' : ' · estimación inicial, pocos datos'}`,
    '',
    ...r.papers.map((p) => `${p.name}: ${p.score} · ${pct(p.pct)}`),
    '',
    'Por partes:',
    ...r.parts.map((p) => `· ${p.name} (${p.short}): ${pct(p.pct)} · ${p.n} respuestas`),
    '',
    `Prioridades: ${r.priorities.map((p) => p.name).join(', ') || 'aún sin datos suficientes'}`,
    r.strong.length ? `Puntos fuertes: ${r.strong.map((p) => p.name).join(', ')}` : '',
  ];
  return lines.filter((l, i) => l !== '' || lines[i - 1] !== '').join('\n');
}

export function availableContent(exam = currentExam()) {
  const id = exam?.id;
  const f = (arr) => arr.filter((x) => x.exam === id);
  return { notices: f(NOTICES), uoe1: f(UOE1), uoe2: f(UOE2), uoe3: f(UOE3), uoe4: f(UOE4), listen: f(LISTEN), speak: f(SPEAK_QUESTIONS), write: f(WRITING) };
}

export function saveWriting(entry) {
  const s = get();
  s.writings ||= [];
  s.writings.push(entry);
  save();
}
