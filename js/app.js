// Pantallas de la app y navegación.
import * as store from './store.js';
import { get, save, SKILLS, SKILL_LABEL, levelLabel, LEVELS } from './store.js';
import * as engine from './engine.js';
import { runLesson } from './lesson.js';
import { PLACEMENT } from './content/placement.js';
import { SAMPLE_TEXTS } from './content/samples.js';
import { renderAnnotated, uniqueTerms, buildTextLesson } from './analyzer.js';
import { speak, canListen, englishVoices, canSpeak } from './speech.js';
import { icon } from './icons.js';
import { escapeHtml } from './text.js';
import * as rd from './readiness.js';
import { EXAMS, partInfo, WRITING, WRITING_CHECKLIST, WRITING_CHECKLIST_A2 } from './content/exam.js';

const root = document.getElementById('app');
const $ = (sel, el = root) => el.querySelector(sel);
const $$ = (sel, el = root) => [...el.querySelectorAll(sel)];

const GOALS = {
  a2key: { label: 'A2 Key (Cambridge)', desc: 'Primer certificado: inglés básico para el día a día', icon: 'target', target: 2, exam: true },
  b1prelim: { label: 'B1 Preliminary (Cambridge)', desc: 'Inglés intermedio: desenvolverte con soltura', icon: 'target', target: 3, exam: true },
  b2first: { label: 'B2 First (Cambridge)', desc: 'Prepararme el examen con su formato y saber cómo voy', icon: 'target', target: 4, exam: true },
  c1adv: { label: 'C1 Advanced (Cambridge)', desc: 'Prepararme el C1 con su formato y saber cómo voy', icon: 'target', target: 5, exam: true },
  work: { label: 'Inglés para trabajar', desc: 'Entender ofertas, entrevistas, reuniones y emails', icon: 'briefcase', target: 4 },
  general: { label: 'Mejorar en general', desc: 'Un poco de todo, a mi ritmo', icon: 'book', target: 4 },
};
const INTERESTS = {
  jobs: 'Ofertas de empleo y LinkedIn', tech: 'Tecnología', travel: 'Viajes', daily: 'Vida diaria',
};
const SKILL_ICON = { vocab: 'cards', grammar: 'puzzle', reading: 'book', listening: 'headphones', speaking: 'mic' };
const SKILL_DESC = {
  vocab: 'Palabras nuevas y repaso espaciado',
  grammar: 'Estructuras con explicación de cada error',
  reading: 'Textos reales: emails, ofertas, artículos',
  listening: 'Entender frases y dictados',
  speaking: 'Pronunciar frases con reconocimiento de voz',
};

// ---------- Navegación ----------
let tab = 'home';
function go(name, ...args) {
  speechSynthesis?.cancel();
  window.scrollTo(0, 0);
  screens[name](...args);
}

function shell(active, html) {
  tab = active;
  root.innerHTML = `
    <div class="screen">${html}</div>
    <nav class="tabbar">
      ${[['home', 'Inicio', 'home'], ['exam', 'Examen', 'target'], ['practice', 'Practicar', 'dumbbell'], ['profile', 'Perfil', 'user']]
        .map(([k, l, ic]) => `<button class="tab ${k === active ? 'active' : ''}" data-tab="${k}">${icon(ic)}<span>${l}</span></button>`).join('')}
    </nav>`;
  $$('[data-tab]').forEach((b) => b.addEventListener('click', () => go(b.dataset.tab)));
}

function startLesson(exercises, title, opts = {}) {
  runLesson(root, exercises, {
    title, ...opts,
    onExit: () => go(tab),
    onFinish: (res) => screens.result(res),
  });
}

// ---------- Componentes ----------
function ring(value, max, size = 84) {
  const r = size / 2 - 7;
  const c = 2 * Math.PI * r;
  const p = Math.min(1, value / max);
  return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-bg"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p)}"/>
  </svg>`;
}

// Posición dentro de la escala A1→C1 (0-100 %)
function levelPct(theta) { return Math.max(0, Math.min(100, ((theta - 1) / 5) * 100)); }

function levelBar(theta, target) {
  return `<div class="lvlbar">
    <div class="lvlbar-fill" style="width:${levelPct(theta)}%"></div>
    ${target ? `<div class="lvlbar-target" style="left:${levelPct(target)}%"></div>` : ''}
  </div>
  <div class="lvlbar-labels">${LEVELS.slice(0, 5).map((l) => `<span>${l}</span>`).join('')}<span>C2</span></div>`;
}

function weekStrip() {
  const s = get();
  const names = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const out = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = store.today(d);
    const done = (s.days[key]?.lessons || 0) > 0;
    out.push(`<div class="day ${done ? 'done' : ''} ${i === 0 ? 'today' : ''}">
      <span>${names[(d.getDay() + 6) % 7]}</span><i>${done ? icon('check') : ''}</i></div>`);
  }
  return `<div class="week">${out.join('')}</div>`;
}

function sheet(html, onMount) {
  const wrap = document.createElement('div');
  wrap.className = 'sheet-wrap';
  wrap.innerHTML = `<div class="sheet" role="dialog">${html}</div>`;
  document.body.appendChild(wrap);
  requestAnimationFrame(() => wrap.classList.add('open'));
  const close = () => { wrap.classList.remove('open'); setTimeout(() => wrap.remove(), 200); };
  wrap.addEventListener('click', (e) => { if (e.target === wrap) close(); });
  onMount?.(wrap, close);
  return close;
}

function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 1800);
}

// ---------- Pantallas ----------
const screens = {
  // ----- Bienvenida y configuración inicial -----
  onboarding(step = 0, draft = {}) {
    const next = (patch) => screens.onboarding(step + 1, { ...draft, ...patch });
    const back = step > 0 ? `<button class="icon-btn" data-back>${icon('back')}</button>` : '<span></span>';
    const dots = `<div class="dots">${[0, 1, 2, 3, 4].map((i) => `<i class="${i <= step ? 'on' : ''}"></i>`).join('')}</div>`;
    const frame = (html) => {
      root.innerHTML = `<div class="onb"><header class="onb-top">${back}${dots}<span></span></header>${html}</div>`;
      $('[data-back]')?.addEventListener('click', () => screens.onboarding(step - 1, draft));
    };

    if (step === 0) {
      frame(`
        <div class="onb-hero">
          <div class="logo">${icon('bolt')}</div>
          <h1>Tu inglés, a tu medida</h1>
          <p>Unos minutos al día de vocabulario, gramática, reading, listening y speaking. La app ajusta la dificultad a tu nivel real y practicas con lo que te interesa: tus canciones, tus ofertas de trabajo…</p>
        </div>
        <div class="onb-bottom"><button class="btn primary block" data-go>Empezar</button></div>`);
      $('[data-go]').addEventListener('click', () => next({}));
    } else if (step === 1) {
      frame(`
        <h2>¿Cómo te llamas?</h2>
        <input class="field" id="name" placeholder="Tu nombre" value="${escapeHtml(draft.name || '')}" autocomplete="given-name">
        <div class="onb-bottom"><button class="btn primary block" data-go disabled>Continuar</button></div>`);
      const inp = $('#name');
      const b = $('[data-go]');
      const upd = () => { b.disabled = !inp.value.trim(); };
      inp.addEventListener('input', upd);
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter' && inp.value.trim()) b.click(); });
      upd();
      setTimeout(() => inp.focus(), 100);
      b.addEventListener('click', () => next({ name: inp.value.trim() }));
    } else if (step === 2) {
      frame(`
        <h2>¿Cuál es tu objetivo?</h2>
        <div class="choices">${Object.entries(GOALS).map(([k, g]) => `
          <button class="choice-card ${draft.goal === k ? 'selected' : ''}" data-k="${k}">
            <span class="cc-icon">${icon(g.icon)}</span>
            <span><b>${g.label}</b><small>${g.desc}</small></span>
          </button>`).join('')}</div>`);
      $$('.choice-card').forEach((b) => b.addEventListener('click', () => next({ goal: b.dataset.k })));
    } else if (step === 3) {
      const sel = new Set(draft.interests || []);
      frame(`
        <h2>¿Con qué te gusta aprender?</h2>
        <p class="muted">Elige todo lo que quieras. Los ejercicios saldrán más de estos temas.</p>
        <div class="chips">${Object.entries(INTERESTS).map(([k, l]) =>
          `<button class="chip ${sel.has(k) ? 'selected' : ''}" data-k="${k}">${l}</button>`).join('')}</div>
        ${GOALS[draft.goal]?.exam ? `<h2 class="mt">¿Cuándo es tu examen?</h2>
        <input type="date" class="field" id="exam-date" value="${draft.examDate || ''}">
        <p class="muted small">Si aún no lo sabes, déjalo vacío. Puedes cambiarlo luego.</p>` : ''}
        <h2 class="mt">¿Cuánto tiempo al día?</h2>
        <div class="chips">${[5, 10, 15, 20].map((m) =>
          `<button class="chip ${(draft.minutes || 10) === m ? 'selected' : ''}" data-min="${m}">${m} min</button>`).join('')}</div>
        <div class="onb-bottom"><button class="btn primary block" data-go>Continuar</button></div>`);
      let minutes = draft.minutes || 10;
      $$('[data-k]').forEach((b) => b.addEventListener('click', () => {
        sel.has(b.dataset.k) ? sel.delete(b.dataset.k) : sel.add(b.dataset.k);
        b.classList.toggle('selected');
      }));
      $$('[data-min]').forEach((b) => b.addEventListener('click', () => {
        $$('[data-min]').forEach((x) => x.classList.remove('selected'));
        b.classList.add('selected');
        minutes = +b.dataset.min;
      }));
      $('[data-go]').addEventListener('click', () => next({ interests: [...sel], minutes, examDate: $('#exam-date')?.value || null }));
    } else if (step === 4) {
      frame(`
        <h2>¿Qué nivel tienes?</h2>
        <p class="muted">Haz un test rápido de 15 preguntas (3 minutos) o empieza desde cero. Da igual si fallas: la app irá ajustando tu nivel según respondas.</p>
        <div class="choices">
          <button class="choice-card" data-p="test"><span class="cc-icon">${icon('target')}</span><span><b>Hacer el test de nivel</b><small>Recomendado</small></span></button>
          <button class="choice-card" data-p="zero"><span class="cc-icon">${icon('plus')}</span><span><b>Empiezo desde cero</b><small>Nivel A1</small></span></button>
        </div>`);
      $$('[data-p]').forEach((b) => b.addEventListener('click', () => {
        finishOnboarding(draft);
        if (b.dataset.p === 'test') screens.placement();
        else { engine.setInitialLevel(1.2); go('home'); }
      }));
    }
  },

  placement(i = 0, answers = []) {
    if (i >= PLACEMENT.length) return placementResult(answers);
    const q = PLACEMENT[i];
    root.innerHTML = `
      <div class="lesson">
        <header class="lesson-top">
          <button class="icon-btn" data-skip-test aria-label="Saltar test">${icon('close')}</button>
          <div class="progress"><div class="progress-fill" style="width:${(i / PLACEMENT.length) * 100}%"></div></div>
        </header>
        <main class="ex-area"><div class="ex">
          <span class="badge">Test de nivel · ${i + 1}/${PLACEMENT.length}</span>
          <h2 class="prompt en">${escapeHtml(q.q).replace('___', '<span class="blank">____</span>')}</h2>
          <div class="options">${q.options.map((o, k) => `<button class="option" data-i="${k}"><span class="key">${k + 1}</span><span>${escapeHtml(o)}</span></button>`).join('')}
            <button class="option idk" data-i="-1"><span class="key">?</span><span>No lo sé</span></button>
          </div>
        </div></main>
      </div>`;
    $$('.option').forEach((b) => b.addEventListener('click', () =>
      screens.placement(i + 1, [...answers, { lvl: q.lvl, ok: +b.dataset.i === q.answer }])));
    $('[data-skip-test]').addEventListener('click', () => placementResult(answers));
  },

  // ----- Inicio -----
  home() {
    const s = get();
    const p = s.profile;
    const goal = GOALS[p.goal] || GOALS.general;
    const theta = store.overallTheta();
    const ds = store.dayStats();
    const goalXp = store.dailyGoal();
    const streak = store.currentStreak();
    const due = engine.dueWords().length;
    const doneToday = ds.lessons > 0;
    shell('home', `
      <header class="topbar">
        <div class="stat flame ${streak ? 'on' : ''}">${icon('flame')}<b>${streak}</b></div>
        <div class="stat xp">${icon('bolt')}<b>${s.xp}</b></div>
        <div class="stat lvl">${levelLabel(theta)}</div>
      </header>
      <h1 class="hello">Hola, ${escapeHtml(p.name)}</h1>

      <section class="card today">
        <div class="today-ring">${ring(ds.xp, goalXp)}<div class="ring-label"><b>${ds.xp}</b><small>/${goalXp} XP</small></div></div>
        <div class="today-body">
          <h3>${ds.xp >= goalXp ? '¡Objetivo diario cumplido!' : doneToday ? 'Sigue así' : 'Tu lección de hoy'}</h3>
          <p class="muted">${s.profile.minutes} min · adaptada a tu nivel y a tu objetivo</p>
          <button class="btn primary" data-daily>${doneToday ? 'Otra lección' : 'Empezar'}</button>
        </div>
      </section>

      ${due ? `<button class="card row-card" data-review>
        <span class="cc-icon warm">${icon('cards')}</span>
        <span><b>${due} palabra${due > 1 ? 's' : ''} por repasar</b><small>El repaso espaciado fija lo que aprendes</small></span>
      </button>` : ''}

      ${examCard() || `<section class="card">
        <div class="card-head"><h3>${icon(goal.icon)} ${goal.label}</h3><span class="pill">${levelLabel(theta)} → ${LEVELS[goal.target - 1]}</span></div>
        ${levelBar(theta, goal.target)}
        <p class="muted small">${goalMessage(theta, goal.target)}</p>
      </section>`}

      <section class="card">
        <h3>Tus destrezas</h3>
        <div class="skills">${SKILLS.map((k) => `
          <button class="skill" data-skill="${k}">
            <span class="skill-ic">${icon(SKILL_ICON[k])}</span>
            <span class="skill-name">${SKILL_LABEL[k]}</span>
            <span class="mini"><i style="width:${levelPct(s.ability[k])}%"></i></span>
            <span class="skill-lvl">${levelLabel(s.ability[k])}</span>
          </button>`).join('')}</div>
      </section>

      <section class="card">
        <div class="card-head"><h3>Esta semana</h3><span class="muted small">Mejor racha: ${s.streak.best} días</span></div>
        ${weekStrip()}
      </section>

      <button class="card row-card" data-texts>
        <span class="cc-icon">${icon('briefcase')}</span>
        <span><b>Entiende ofertas de trabajo</b><small>Pega una oferta de LinkedIn y conviértela en lección</small></span>
      </button>`);
    $('[data-exam]')?.addEventListener('click', () => go('exam'));
    $('[data-daily]').addEventListener('click', () => startLesson(engine.buildDailyLesson(), 'Lección diaria'));
    $('[data-review]')?.addEventListener('click', () => startLesson(engine.buildReviewLesson(), 'Repaso'));
    $('[data-texts]').addEventListener('click', () => go('texts'));
    $$('[data-skill]').forEach((b) => b.addEventListener('click', () =>
      startLesson(engine.buildSkillLesson(b.dataset.skill), SKILL_LABEL[b.dataset.skill])));
  },

  // ----- Practicar por destreza -----
  practice() {
    const s = get();
    const due = engine.dueWords().length;
    const mistakes = engine.mistakesCount();
    shell('practice', `
      <h1 class="title">Practicar</h1>
      <p class="muted">Refuerza una destreza concreta. Tu punto más débil ahora mismo: <b>${SKILL_LABEL[weakest()]}</b>.</p>
      <div class="list">
        ${SKILLS.map((k) => `
          <button class="card row-card" data-skill="${k}">
            <span class="cc-icon">${icon(SKILL_ICON[k])}</span>
            <span class="grow"><b>${SKILL_LABEL[k]}</b><small>${SKILL_DESC[k]}</small>
              <span class="mini"><i style="width:${levelPct(s.ability[k])}%"></i></span></span>
            <span class="pill">${levelLabel(s.ability[k])}</span>
          </button>`).join('')}
        <button class="card row-card" data-review ${due ? '' : 'disabled'}>
          <span class="cc-icon warm">${icon('cards')}</span>
          <span class="grow"><b>Repasar palabras</b><small>${due ? `${due} pendientes hoy` : 'Nada pendiente hoy 🎉'} · ${engine.learnedCount()} aprendidas</small></span>
        </button>
        <button class="card row-card" data-texts>
          <span class="cc-icon">${icon('briefcase')}</span>
          <span class="grow"><b>Ofertas de trabajo y textos</b><small>Pega una oferta o un email y practica con él</small></span>
        </button>
        <button class="card row-card" data-mistakes ${mistakes ? '' : 'disabled'}>
          <span class="cc-icon bad">${icon('retry')}</span>
          <span class="grow"><b>Repasar mis errores</b><small>${mistakes ? `${mistakes} ejercicios fallados` : 'Sin errores pendientes'}</small></span>
        </button>
      </div>
      ${!canListen() ? `<p class="note">Este navegador no reconoce la voz: en speaking te autoevaluarás. En iPhone usa Safari; en Android, Chrome.</p>` : ''}`);
    $$('[data-skill]').forEach((b) => b.addEventListener('click', () =>
      startLesson(engine.buildSkillLesson(b.dataset.skill), SKILL_LABEL[b.dataset.skill])));
    $('[data-review]').addEventListener('click', () => startLesson(engine.buildReviewLesson(), 'Repaso'));
    $('[data-mistakes]').addEventListener('click', () => startLesson(engine.buildMistakesLesson(), 'Errores'));
    $('[data-texts]').addEventListener('click', () => go('texts'));
  },

  // ----- Mis textos -----
  texts() {
    const s = get();
    const list = [...s.texts].sort((a, b) => b.createdAt - a.createdAt);
    const item = (t, sample) => `
      <button class="card row-card" data-open="${t.id}">
        <span class="cc-icon">${icon(t.type === 'job' ? 'briefcase' : 'doc')}</span>
        <span class="grow"><b>${escapeHtml(t.title)}</b><small>${uniqueTerms(t.content).length} expresiones detectadas${sample ? ' · ejemplo' : ''}</small></span>
      </button>`;
    shell('practice', `
      <header class="subbar"><button class="icon-btn" data-back>${icon('back')}</button><h2>Ofertas y textos</h2><span></span></header>
      <p class="muted">Pega cualquier texto en inglés y la app te lo explica y crea ejercicios con él: lectura con traducción al tocar, dictados, pronunciación y repaso de las expresiones.</p>
      <div class="add-row">
        <button class="btn soft" data-new="job">${icon('briefcase')} Oferta de trabajo</button>
        <button class="btn soft" data-new="other">${icon('doc')} Otro texto</button>
      </div>
      <div class="list">
        ${list.map((t) => item(t)).join('')}
        ${SAMPLE_TEXTS.map((t) => item(t, true)).join('')}
      </div>`);
    $$('[data-new]').forEach((b) => b.addEventListener('click', () => screens.editText(b.dataset.new)));
    $('[data-back]').addEventListener('click', () => go('practice'));
    $$('[data-open]').forEach((b) => b.addEventListener('click', () => screens.text(b.dataset.open)));
  },

  editText(type) {
    const placeholders = {
      job: 'Pega aquí la oferta de LinkedIn completa (título, requisitos, qué ofrecen…)',
      song: 'Pega aquí la letra de la canción',
      other: 'Pega aquí un email, un artículo, un post…',
    };
    const titles = { job: 'Nueva oferta de trabajo', song: 'Nueva canción', other: 'Nuevo texto' };
    root.innerHTML = `
      <div class="screen">
        <header class="subbar"><button class="icon-btn" data-back>${icon('back')}</button><h2>${titles[type]}</h2><span></span></header>
        <label class="lbl">Título</label>
        <input class="field" id="t-title" placeholder="${type === 'song' ? 'Canción – Artista' : type === 'job' ? 'Puesto – Empresa' : 'Título'}">
        <label class="lbl">Texto</label>
        <textarea class="field big" id="t-content" placeholder="${placeholders[type]}"></textarea>
        <button class="btn primary block" data-save disabled>Guardar y analizar</button>
      </div>`;
    const ti = $('#t-title'), tc = $('#t-content'), b = $('[data-save]');
    const upd = () => { b.disabled = tc.value.trim().split(/\s+/).length < 5; };
    tc.addEventListener('input', upd);
    $('[data-back]').addEventListener('click', () => go('texts'));
    b.addEventListener('click', () => {
      const s = get();
      const t = { id: 't' + Date.now(), type, title: ti.value.trim() || titles[type], content: tc.value.trim(), createdAt: Date.now() };
      s.texts.push(t);
      save();
      screens.text(t.id);
    });
  },

  text(id) {
    const s = get();
    const t = s.texts.find((x) => x.id === id) || SAMPLE_TEXTS.find((x) => x.id === id);
    if (!t) return go('texts');
    const own = !!s.texts.find((x) => x.id === id);
    const terms = uniqueTerms(t.content);
    const inDeck = (key) => engine.allWords().some((w) => w.en.toLowerCase() === key && s.srs[w.id]);
    root.innerHTML = `
      <div class="screen">
        <header class="subbar">
          <button class="icon-btn" data-back>${icon('back')}</button>
          <h2 class="ellipsis">${escapeHtml(t.title)}</h2>
          ${own ? `<button class="icon-btn" data-del aria-label="Borrar">${icon('trash')}</button>` : '<span></span>'}
        </header>
        <div class="text-actions">
          <button class="btn primary" data-practice>${icon('dumbbell')} Practicar</button>
          <button class="btn soft" data-listen>${icon('play')} Escuchar</button>
        </div>
        <p class="muted small">Toca cualquier palabra para escucharla o guardarla. Las <span class="term demo">expresiones resaltadas</span> tienen traducción.</p>
        <article class="annotated en">${renderAnnotated(t.content)}</article>
        <section class="card">
          <h3>Expresiones clave (${terms.length})</h3>
          <div class="glossary">${terms.map((x) => `
            <div class="g-row">
              <button class="g-say" data-say="${escapeHtml(x.term)}">${icon('speaker')}</button>
              <div class="grow"><b class="en">${escapeHtml(x.key)}</b><small>${escapeHtml(x.es)}</small></div>
              <button class="g-add ${inDeck(x.key) ? 'added' : ''}" data-add="${escapeHtml(x.key)}" data-es="${escapeHtml(x.es)}">${inDeck(x.key) ? icon('check') : icon('plus')}</button>
            </div>`).join('') || '<p class="muted">No he encontrado expresiones de mi glosario. Toca las palabras para añadirlas tú.</p>'}</div>
        </section>
      </div>`;
    $('[data-back]').addEventListener('click', () => go('texts'));
    $('[data-del]')?.addEventListener('click', () => {
      if (!confirm('¿Borrar este texto?')) return;
      s.texts = s.texts.filter((x) => x.id !== id);
      save();
      go('texts');
    });
    $('[data-practice]').addEventListener('click', () => {
      const ex = buildTextLesson(t);
      if (ex.length < 3) return toast('El texto es demasiado corto para crear ejercicios');
      tab = 'texts';
      runLesson(root, ex, {
        title: t.title, textTitle: t.title,
        onExit: () => screens.text(id),
        onFinish: (res) => screens.result(res, () => screens.text(id)),
      });
    });
    let playing = false;
    $('[data-listen]').addEventListener('click', (e) => {
      const b = e.currentTarget;
      if (playing) { speechSynthesis.cancel(); return; }
      playing = true;
      b.innerHTML = `${icon('stop')} Parar`;
      speak(t.content.replace(/[•·]/g, '')).then(() => { playing = false; b.innerHTML = `${icon('play')} Escuchar`; });
    });
    $$('[data-say]').forEach((b) => b.addEventListener('click', () => speak(b.dataset.say)));
    $$('[data-add]').forEach((b) => b.addEventListener('click', () => {
      engine.addCustomWord(b.dataset.add, b.dataset.es, t.title);
      b.classList.add('added');
      b.innerHTML = icon('check');
      toast('Añadida a tu repaso');
    }));
    $('.annotated').addEventListener('click', (e) => {
      const term = e.target.closest('.term');
      const w = e.target.closest('.w');
      if (term) wordSheet(term.textContent, term.dataset.es, t.title, term.dataset.key);
      else if (w) wordSheet(w.dataset.w, '', t.title);
    });
  },

  // ----- Perfil y ajustes -----
  profile() {
    const s = get();
    const p = s.profile;
    const totalDays = Object.values(s.days).filter((d) => d.lessons > 0).length;
    const voices = englishVoices();
    shell('profile', `
      <h1 class="title">${escapeHtml(p.name)}</h1>
      <div class="stats">
        <div><b>${store.currentStreak()}</b><small>Racha</small></div>
        <div><b>${s.xp}</b><small>XP total</small></div>
        <div><b>${engine.learnedCount()}</b><small>Palabras</small></div>
        <div><b>${totalDays}</b><small>Días</small></div>
      </div>

      <section class="card">
        <h3>Nivel estimado por destreza</h3>
        ${SKILLS.map((k) => `
          <div class="lvl-row"><span>${SKILL_LABEL[k]}</span>
            <span class="mini grow"><i style="width:${levelPct(s.ability[k])}%"></i></span>
            <b>${levelLabel(s.ability[k])}</b></div>`).join('')}
        <p class="muted small">Se recalcula con cada respuesta: si aciertas lo difícil sube rápido; si fallas lo fácil, baja.</p>
      </section>

      <section class="card">
        <h3>Objetivo y preferencias</h3>
        <label class="lbl">Objetivo</label>
        <select class="field" id="goal">${Object.entries(GOALS).map(([k, g]) => `<option value="${k}" ${p.goal === k ? 'selected' : ''}>${g.label}</option>`).join('')}</select>
        ${GOALS[p.goal]?.exam ? `<label class="lbl">Fecha del examen</label>
        <input type="date" class="field" id="exam-date" value="${p.examDate || ''}">` : ''}
        <label class="lbl">Minutos al día</label>
        <select class="field" id="minutes">${[5, 10, 15, 20].map((m) => `<option ${p.minutes === m ? 'selected' : ''}>${m}</option>`).join('')}</select>
        <label class="lbl">Intereses</label>
        <div class="chips">${Object.entries(INTERESTS).map(([k, l]) =>
          `<button class="chip ${p.interests.includes(k) ? 'selected' : ''}" data-int="${k}">${l}</button>`).join('')}</div>
      </section>

      <section class="card">
        <h3>Voz</h3>
        <label class="lbl">Velocidad: <span id="rate-v">${s.settings.rate.toFixed(2)}</span></label>
        <input type="range" id="rate" min="0.6" max="1.2" step="0.05" value="${s.settings.rate}">
        ${voices.length ? `<label class="lbl">Voz</label>
        <select class="field" id="voice"><option value="">Automática</option>${voices.map((v) =>
          `<option value="${escapeHtml(v.name)}" ${s.settings.voice === v.name ? 'selected' : ''}>${escapeHtml(v.name)} (${v.lang})</option>`).join('')}</select>` : ''}
        <button class="btn soft" data-test-voice>${icon('speaker')} Probar voz</button>
        ${!canSpeak() ? '<p class="note">Tu navegador no tiene síntesis de voz.</p>' : ''}
      </section>

      <section class="card">
        <h3>Tus datos</h3>
        <p class="muted small">Todo se guarda solo en este dispositivo. Haz copia de seguridad de vez en cuando.</p>
        <div class="add-row">
          <button class="btn soft" data-export>Exportar copia</button>
          <label class="btn soft">Importar copia<input type="file" accept="application/json" id="import" hidden></label>
        </div>
        <button class="btn danger-ghost" data-reset>Borrar todo y empezar de nuevo</button>
      </section>

      <section class="card">
        <h3>Instalar en el móvil</h3>
        <p class="muted small"><b>iPhone (Safari):</b> botón Compartir → «Añadir a pantalla de inicio».<br>
        <b>Android (Chrome):</b> menú ⋮ → «Instalar aplicación».</p>
      </section>`);
    $('#goal').addEventListener('change', (e) => { p.goal = e.target.value; save(); toast('Objetivo actualizado'); go('profile'); });
    $('#exam-date')?.addEventListener('change', (e) => { p.examDate = e.target.value || null; save(); toast('Fecha guardada'); });
    $('#minutes').addEventListener('change', (e) => { p.minutes = +e.target.value; save(); toast('Guardado'); });
    $$('[data-int]').forEach((b) => b.addEventListener('click', () => {
      const k = b.dataset.int;
      p.interests = p.interests.includes(k) ? p.interests.filter((x) => x !== k) : [...p.interests, k];
      b.classList.toggle('selected');
      save();
    }));
    $('#rate').addEventListener('input', (e) => { s.settings.rate = +e.target.value; $('#rate-v').textContent = s.settings.rate.toFixed(2); save(); });
    $('#voice')?.addEventListener('change', (e) => { s.settings.voice = e.target.value || null; save(); speak('Hello! This is my voice.'); });
    $('[data-test-voice]').addEventListener('click', () => speak('Hi! I am looking forward to working with you.'));
    $('[data-export]').addEventListener('click', () => {
      const blob = new Blob([store.exportData()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `ingles-copia-${store.today()}.json`;
      a.click();
    });
    $('#import').addEventListener('change', async (e) => {
      const f = e.target.files[0];
      if (!f) return;
      try { store.importData(await f.text()); toast('Copia restaurada'); go('home'); }
      catch (err) { toast('No se pudo importar: ' + err.message); }
    });
    $('[data-reset]').addEventListener('click', () => {
      if (confirm('Se borrará todo tu progreso de este dispositivo. ¿Seguro?')) { store.reset(); boot(); }
    });
  },

  // ----- Examen: informe de preparación -----
  exam() {
    const exam = rd.currentExam();
    if (!exam) {
      shell('exam', `
        <h1 class="title">Preparar un examen</h1>
        <p class="muted">Elige tu examen y la app entrenará cada parte con su formato real y te dirá cómo de preparado estás.</p>
        <div class="choices">${['a2key', 'b1prelim', 'b2first', 'c1adv'].map((k) => `
          <button class="choice-card" data-pick="${k}"><span class="cc-icon">${icon('target')}</span>
          <span><b>${GOALS[k].label}</b><small>${GOALS[k].desc}</small></span></button>`).join('')}</div>`);
      $$('[data-pick]').forEach((b) => b.addEventListener('click', () => {
        get().profile.goal = b.dataset.pick;
        save();
        go('exam');
      }));
      return;
    }
    const r = rd.report();
    const p = get().profile;
    const pct = (x) => Math.round(x * 100);
    const partRow = (pt) => `
      <button class="part-row" data-part="${pt.id}">
        <span class="grow"><b>${pt.name}</b><small>${pt.short}${pt.n < 5 ? ' · pocas respuestas' : ''}</small>
          <span class="mini ${pt.pct >= 0.6 ? 'good' : pt.pct >= 0.45 ? 'mid' : 'low'}"><i style="width:${pct(pt.pct)}%"></i></span></span>
        <span class="part-pct">${pct(pt.pct)}%</span>
      </button>`;
    shell('exam', `
      <div class="card-head"><h1 class="title">${exam.name}</h1>
        <span class="pill">${r.days == null ? 'Sin fecha' : r.days > 0 ? `Faltan ${r.days} días` : r.days === 0 ? '¡Es hoy!' : 'Examen pasado'}</span></div>
      ${scoreCard(r, true)}
      ${!r.reliable ? `<p class="note">Estimación inicial: aún hay pocas respuestas (${r.totalAnswers}). Se vuelve fiable a partir de ~60 respuestas repartidas entre las partes.</p>` : ''}

      ${r.priorities.length ? `<section class="card">
        <h3>${icon('target')} Dónde poner el foco</h3>
        ${r.priorities.map((pt, i) => `
          <div class="prio">
            <div class="prio-head"><span class="prio-n">${i + 1}</span><b>${pt.name} · ${pt.short}</b><span class="part-pct">${pct(pt.pct)}%</span></div>
            <p class="muted small">${pt.tip}</p>
            <button class="btn soft" data-part="${pt.id}">Practicar ahora</button>
          </div>`).join('')}
        <p class="muted small">Ordenado por lo que más puede subir tu nota: combina tu nivel en cada parte con cuántos puntos vale en el examen.</p>
      </section>` : ''}

      ${r.untested.length ? `<section class="card">
        <h3>${icon('retry')} Aún sin evaluar</h3>
        <p class="muted small">De estas partes todavía no tengo datos suficientes; su nota sale de tu nivel general. Haz un ejercicio de cada una para afinar el informe.</p>
        <div class="chips">${r.untested.map((pt) => `<button class="chip" data-part="${pt.id}">${pt.name}</button>`).join('')}</div>
      </section>` : ''}

      ${r.strong.length ? `<section class="card">
        <h3>${icon('check')} Lo tienes controlado</h3>
        <p class="muted small">${r.strong.map((x) => x.name).join(', ')}. Basta con repasarlo de vez en cuando: dedica ese tiempo a tus prioridades.</p>
      </section>` : ''}

      ${r.papers.map((pp) => `
        <section class="card">
          <div class="card-head"><h3>${pp.name}</h3><span class="pill ${pp.score >= exam.pass ? 'ok' : ''}">${pp.score}</span></div>
          ${pp.parts.map(partRow).join('')}
        </section>`).join('')}

      <section class="card">
        <h3>${icon('user')} Para tu profesor</h3>
        <p class="muted small">Envía este informe a tu profesor para que sepa en qué insistir en clase.</p>
        <button class="btn soft" data-share>Compartir informe</button>
      </section>
      <p class="muted small center">La nota es una estimación orientativa calculada con tus respuestas en la app, no una nota oficial. Writing y Speaking se basan en tu autoevaluación.</p>
      ${!p.examDate ? '<p class="muted small center">Añade la fecha de tu examen en Perfil para ver la cuenta atrás.</p>' : ''}`);
    $$('[data-part]').forEach((b) => b.addEventListener('click', () => practicePart(b.dataset.part)));
    $('[data-share]').addEventListener('click', async () => {
      const text = rd.reportText();
      try {
        if (navigator.share) await navigator.share({ title: `Informe ${exam.name}`, text });
        else { await navigator.clipboard.writeText(text); toast('Informe copiado'); }
      } catch (_) { /* cancelado */ }
    });
  },

  // ----- Writing con autoevaluación -----
  writing() {
    const exam = rd.currentExam();
    const s = get();
    const tasks = WRITING.filter((w) => w.exam === exam.id);
    const done = (s.writings || []).map((w) => w.taskId);
    const task = tasks.find((t) => !done.includes(t.id)) || tasks[(s.writings || []).length % tasks.length];
    const draftKey = 'draft_' + task.id;
    root.innerHTML = `
      <div class="screen">
        <header class="subbar"><button class="icon-btn" data-back>${icon('back')}</button><h2>Writing · ${task.type}</h2><span></span></header>
        <section class="card"><p class="task en">${escapeHtml(task.task).replace(/\n/g, '<br>')}</p>
          <p class="muted small">Escribe entre ${task.min} y ${task.max} palabras.</p></section>
        <details class="card"><summary><b>Frases útiles</b></summary>
          <ul class="phrases en">${task.phrases.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul></details>
        <textarea class="field big en" id="w-text" lang="en" spellcheck="false" placeholder="Escribe aquí tu ${task.type.toLowerCase()} en inglés…">${escapeHtml(s.settings[draftKey] || '')}</textarea>
        <p class="wcount" id="w-count"></p>
        <button class="btn primary block" data-done disabled>He terminado: revisar</button>
        <section class="card" id="w-check" hidden>
          <h3>Revisa tu texto</h3>
          <p class="muted small">Sin IA no puedo corregirlo, pero sí ayudarte a revisarlo como lo haría un examinador. Sé honesto: es para ti.</p>
          ${(exam.lvl <= 2 ? WRITING_CHECKLIST_A2 : WRITING_CHECKLIST).map((c, i) => `<label class="check-row"><input type="checkbox" data-c="${i}"><span>${c}</span></label>`).join('')}
          <button class="btn primary block" data-save>Guardar evaluación</button>
        </section>
      </div>`;
    const ta = $('#w-text'), wc = $('#w-count');
    const count = () => ta.value.trim().split(/\s+/).filter(Boolean).length;
    const upd = () => {
      const n = count();
      wc.textContent = `${n} palabras`;
      wc.className = 'wcount ' + (n >= task.min && n <= task.max ? 'ok' : n > task.max ? 'bad' : '');
      $('[data-done]').disabled = n < 40;
      s.settings[draftKey] = ta.value;
      save();
    };
    ta.addEventListener('input', upd);
    upd();
    $('[data-back]').addEventListener('click', () => go('exam'));
    $('[data-done]').addEventListener('click', () => { $('#w-check').hidden = false; $('#w-check').scrollIntoView({ behavior: 'smooth' }); });
    $('[data-save]').addEventListener('click', () => {
      const n = count();
      const checks = $$('[data-c]').filter((b) => b.checked).length;
      const inRange = n >= task.min && n <= task.max ? 1 : 0;
      const score = (checks + inRange) / ((exam.lvl <= 2 ? WRITING_CHECKLIST_A2 : WRITING_CHECKLIST).length + 1);
      // Cuenta como varias respuestas: una redacción es mucho trabajo
      for (let i = 0; i < 3; i++) rd.updatePart('write', exam.lvl, score >= 0.7);
      rd.saveWriting({ taskId: task.id, type: task.type, text: ta.value, words: n, score, date: store.today() });
      delete s.settings[draftKey];
      store.addXp(15);
      store.completeLesson();
      save();
      toast(`Guardado · ${Math.round(score * 100)}% de los criterios`);
      go('exam');
    });
  },

  // ----- Resultado de lección -----
  result(res, after) {
    const pct = Math.round(res.accuracy * 100);
    const streak = store.currentStreak();
    const s = get();
    const mins = Math.floor(res.seconds / 60), secs = res.seconds % 60;
    root.innerHTML = `
      <div class="result">
        <div class="result-hero">
          <div class="burst">${icon('check')}</div>
          <h1>${pct >= 90 ? '¡Lección perfecta!' : pct >= 70 ? '¡Lección completada!' : '¡Buen esfuerzo!'}</h1>
          <p class="muted">${escapeHtml(res.title)}</p>
        </div>
        <div class="result-stats">
          <div class="rs xp">${icon('bolt')}<b>+${res.xp}</b><small>XP</small></div>
          <div class="rs acc">${icon('target')}<b>${pct}%</b><small>Aciertos</small></div>
          <div class="rs time">${icon('play')}<b>${mins}:${String(secs).padStart(2, '0')}</b><small>Tiempo</small></div>
        </div>
        <div class="card streak-card">${icon('flame')}<span><b>${streak} día${streak === 1 ? '' : 's'} de racha</b><small>${streak > 1 ? '¡No la rompas mañana!' : 'Vuelve mañana para seguir sumando'}</small></span></div>
        ${res.changes.length ? `<div class="card"><h3>Tu nivel se ha ajustado</h3>${res.changes.map((c) => `
          <div class="lvl-row"><span>${SKILL_LABEL[c.k]}</span><span class="mini grow"><i style="width:${levelPct(s.ability[c.k])}%"></i></span>
          <b class="${c.d > 0 ? 'up' : 'down'}">${c.d > 0 ? '▲' : '▼'} ${levelLabel(s.ability[c.k])}</b></div>`).join('')}</div>` : ''}
        <button class="btn primary block" data-continue>Continuar</button>
      </div>`;
    $('[data-continue]').addEventListener('click', () => (after ? after() : go('home')));
  },
};

// ---------- Examen: tarjetas y práctica por partes ----------
function scoreCard(r, big = false) {
  const [min, max] = [r.exam.scale[0][1], r.exam.scale[r.exam.scale.length - 1][1]];
  const pos = (v) => Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100));
  const gap = r.exam.pass - r.overall;
  return `<div class="score ${big ? 'big' : ''}">
    <div class="score-top"><div><span class="score-n">${r.overall}</span><span class="score-of">nota estimada</span></div>
      <span class="pill ${r.passes ? 'ok' : 'warn'}">${r.grade}</span></div>
    <div class="scorebar"><i style="width:${pos(r.overall)}%"></i><b style="left:${pos(r.exam.pass)}%" title="Aprobado"></b></div>
    <div class="scorebar-labels"><span>${min}</span><span style="left:${pos(r.exam.pass)}%">Aprobado ${r.exam.pass}</span><span>${max}</span></div>
    <p class="small ${r.passes ? 'okc' : ''}">${r.passes ? '¡Hoy aprobarías! Sigue consolidando para ir con margen.' : `Te faltan unos <b>${gap}</b> puntos para aprobar.`}</p>
  </div>`;
}

function examCard() {
  const r = rd.report();
  if (!r) return '';
  return `<button class="card exam-card" data-exam>
    <div class="card-head"><h3>${icon('target')} ${r.exam.name}</h3>
      <span class="pill">${r.days == null ? 'Ver informe' : r.days > 0 ? `Faltan ${r.days} días` : 'Ver informe'}</span></div>
    ${scoreCard(r)}
    <p class="muted small">${r.priorities.length
      ? `Prioridad ahora: <b>${r.priorities.slice(0, 2).map((x) => x.name).join(' · ')}</b>`
      : 'Haz tus lecciones diarias y detectaré dónde tienes que poner el foco.'}</p>
  </button>`;
}

function practicePart(part) {
  if (part === 'write') return screens.writing();
  const ex = engine.buildPartLesson(part);
  if (!ex.length) return toast('Aún no hay ejercicios de esta parte');
  tab = 'exam';
  runLesson(root, ex, {
    title: (({ name, short }) => `${name} · ${short}`)(partInfo(part, rd.currentExam())),
    onExit: () => go('exam'),
    onFinish: (res) => screens.result(res, () => go('exam')),
  });
}

// ---------- Ayudantes ----------
function finishOnboarding(d) {
  const s = get();
  s.profile = { name: d.name, goal: d.goal || 'general', interests: d.interests || [], minutes: d.minutes || 10, examDate: d.examDate || null, createdAt: Date.now() };
  save();
}

function placementResult(answers) {
  // Nivel = último nivel en el que aciertas al menos 2 de 3, sin saltos.
  let theta = 1;
  for (let l = 1; l <= 5; l++) {
    const qs = answers.filter((a) => a.lvl === l);
    if (!qs.length) break;
    const ok = qs.filter((a) => a.ok).length;
    if (ok >= 2) theta = l + (ok === 3 ? 0.7 : 0.4);
    else { if (ok === 1) theta = Math.max(theta, l - 0.2); break; }
  }
  theta = Math.min(5.8, Math.max(1.1, theta));
  engine.setInitialLevel(theta);
  const goal = GOALS[get().profile.goal];
  root.innerHTML = `
    <div class="result">
      <div class="result-hero">
        <div class="burst big-level">${levelLabel(theta)}</div>
        <h1>Tu nivel de partida: ${levelLabel(theta)}</h1>
        <p class="muted">${goalMessage(theta, goal.target)}</p>
      </div>
      <div class="card">${levelBar(theta, goal.target)}</div>
      <p class="muted small center">Es una estimación inicial. Con cada ejercicio la app afina tu nivel en cada destreza por separado.</p>
      <button class="btn primary block" data-go>Ir a mi primera lección</button>
    </div>`;
  $('[data-go]').addEventListener('click', () => go('home'));
}

function goalMessage(theta, target) {
  const gap = target + 0.5 - theta;
  if (gap <= 0) return `Ya estás en el nivel de tu objetivo (${LEVELS[target - 1]}). ¡A consolidarlo!`;
  // Estimación orientativa: ~1 nivel MCER cada 4 meses practicando a diario
  const months = Math.max(1, Math.round(gap * 4));
  return `Te faltan unos ${months} mes${months > 1 ? 'es' : ''} de práctica diaria para ${LEVELS[target - 1]} (estimación orientativa).`;
}

function weakest() {
  const a = get().ability;
  return SKILLS.reduce((w, k) => (a[k] < a[w] ? k : w), SKILLS[0]);
}

function wordSheet(word, es, source, key) {
  const k = (key || word).toLowerCase().replace(/[’]/g, "'");
  sheet(`
    <div class="ws-head">
      <button class="btn-audio" data-say>${icon('speaker')}</button>
      <h2 class="en">${escapeHtml(word)}</h2>
    </div>
    ${es ? `<p class="ws-es">${escapeHtml(es)}</p>` : `
      <label class="lbl">¿Qué significa? (escríbelo para guardarla)</label>
      <input class="field" id="ws-es" placeholder="Traducción">
      <a class="link" target="_blank" rel="noopener" href="https://www.wordreference.com/es/translation.asp?tranword=${encodeURIComponent(k)}">Buscar en WordReference ↗</a>`}
    <button class="btn primary block" data-save>${icon('plus')} Añadir a mi repaso</button>`,
  (wrap, close) => {
    const say = () => speak(word);
    say();
    wrap.querySelector('[data-say]').addEventListener('click', say);
    wrap.querySelector('[data-save]').addEventListener('click', () => {
      const tr = es || wrap.querySelector('#ws-es').value.trim();
      if (!tr) { wrap.querySelector('#ws-es').focus(); return; }
      engine.addCustomWord(k, tr, source);
      close();
      toast('Añadida a tu repaso');
    });
  });
}

// ---------- Arranque ----------
function boot() {
  const p = get().profile;
  if (p) {
    // Migración desde versiones anteriores
    if (p.goal === 'b2') p.goal = 'b2first';
    if (!GOALS[p.goal]) p.goal = 'general';
    p.interests = (p.interests || []).filter((i) => INTERESTS[i]);
    get().texts = get().texts.filter((t) => t.type !== 'song');
    save();
  }
  if (!p) screens.onboarding(0);
  else go('home');
}
boot();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
