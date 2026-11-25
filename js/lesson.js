// Reproductor de lecciones: muestra cada ejercicio, comprueba y da feedback.
import { speak, canListen, canSpeak, listen } from './speech.js';
import { checkTyped, normalize, speechScore, shuffle, escapeHtml } from './text.js';
import { applyResult, applyMatchResult, addCustomWord } from './engine.js';
import { get, addXp, recordAnswer, completeLesson, save, SKILLS } from './store.js';
import { icon } from './icons.js';

const XP_PER_OK = 3;

// ---------- Sonidos y vibración ----------
let audioCtx;
function beep(ok) {
  try {
    audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
    const notes = ok ? [660, 880] : [300, 220];
    notes.forEach((f, i) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.frequency.value = f;
      o.type = 'sine';
      const t = audioCtx.currentTime + i * 0.09;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.15, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.connect(g).connect(audioCtx.destination);
      o.start(t);
      o.stop(t + 0.2);
    });
  } catch (_) { /* sin audio */ }
  if (!ok) navigator.vibrate?.(60);
}

function audioButtons(text, big) {
  if (!canSpeak()) return '';
  return `<div class="audio-row ${big ? 'big' : ''}">
    <button class="btn-audio" data-say="normal" aria-label="Escuchar">${icon('speaker')}</button>
    <button class="btn-audio slow" data-say="slow" aria-label="Escuchar despacio">${icon('turtle')}</button>
  </div>`;
}

function wireAudio(el, text) {
  el.querySelectorAll('[data-say]').forEach((b) =>
    b.addEventListener('click', () => speak(text, { slow: b.dataset.say === 'slow' })));
}

// ---------- Ejercicios ----------
// Cada uno devuelve { check() → {ok, typo?, detail?}, next?() → bool, autoCheck? }
const renderers = {
  choice(ex, el, setReady) {
    el.innerHTML = `
      ${ex.badge ? `<span class="badge">${escapeHtml(ex.badge)}</span>` : ''}
      <h2 class="prompt">${ex.prompt}</h2>
      ${ex.audio ? audioButtons(ex.audio, ex.audioOnly) : ''}
      <div class="options">${ex.options.map((o, i) =>
        `<button class="option" data-i="${i}"><span class="key">${i + 1}</span><span>${escapeHtml(o)}</span></button>`).join('')}</div>`;
    if (ex.audio) wireAudio(el, ex.audio);
    let sel = null;
    el.querySelectorAll('.option').forEach((b) => b.addEventListener('click', () => {
      el.querySelectorAll('.option').forEach((x) => x.classList.remove('selected'));
      b.classList.add('selected');
      sel = +b.dataset.i;
      if (ex.speakOptions) speak(ex.options[sel]);
      setReady(true);
    }));
    if (ex.autoplay && ex.audio) setTimeout(() => speak(ex.audio), 350);
    return {
      check() {
        const ok = sel === ex.answer;
        el.querySelectorAll('.option').forEach((b) => {
          b.disabled = true;
          if (+b.dataset.i === ex.answer) b.classList.add('correct');
          else if (+b.dataset.i === sel) b.classList.add('wrong');
        });
        return { ok };
      },
      key(k) {
        const b = el.querySelector(`.option[data-i="${+k - 1}"]`);
        b?.click();
      },
    };
  },

  type(ex, el, setReady, submit) {
    el.innerHTML = `
      <h2 class="prompt">${ex.prompt}</h2>
      ${ex.audio ? audioButtons(ex.audio, ex.audioOnly) : ''}
      <textarea class="answer-input" rows="3" autocapitalize="sentences" autocomplete="off"
        autocorrect="off" spellcheck="false" lang="en" placeholder="${ex.placeholder || 'Escribe aquí…'}"></textarea>`;
    if (ex.audio) wireAudio(el, ex.audio);
    const ta = el.querySelector('textarea');
    ta.addEventListener('input', () => setReady(ta.value.trim().length > 0));
    ta.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
    if (ex.autoplay && ex.audio) setTimeout(() => speak(ex.audio), 350);
    else setTimeout(() => ta.focus(), 300);
    return {
      check() {
        ta.disabled = true;
        const r = checkTyped(ta.value, ex.answers);
        ta.classList.add(r.ok ? 'correct' : 'wrong');
        return r;
      },
    };
  },

  order(ex, el, setReady) {
    el.innerHTML = `
      <h2 class="prompt">${ex.prompt}</h2>
      ${ex.listenFirst ? audioButtons(ex.audio, true) : ''}
      <div class="order-answer"></div>
      <div class="order-bank">${ex.tiles.map((t, i) => `<button class="tile" data-i="${i}">${escapeHtml(t)}</button>`).join('')}</div>`;
    if (ex.listenFirst) { wireAudio(el, ex.audio); setTimeout(() => speak(ex.audio), 350); }
    const ans = el.querySelector('.order-answer');
    const bank = el.querySelector('.order-bank');
    const chosen = [];
    const refresh = () => setReady(chosen.length > 0);
    bank.addEventListener('click', (e) => {
      const b = e.target.closest('.tile');
      if (!b || b.classList.contains('used')) return;
      b.classList.add('used');
      const c = document.createElement('button');
      c.className = 'tile';
      c.textContent = b.textContent;
      c.dataset.i = b.dataset.i;
      ans.appendChild(c);
      chosen.push(b.dataset.i);
      if (!ex.listenFirst) speak(b.textContent);
      refresh();
    });
    ans.addEventListener('click', (e) => {
      const c = e.target.closest('.tile');
      if (!c || ans.classList.contains('locked')) return;
      bank.querySelector(`.tile[data-i="${c.dataset.i}"]`).classList.remove('used');
      chosen.splice(chosen.indexOf(c.dataset.i), 1);
      c.remove();
      refresh();
    });
    return {
      check() {
        ans.classList.add('locked');
        const built = [...ans.children].map((c) => c.textContent).join(' ');
        const ok = normalize(built) === normalize(ex.answer);
        ans.classList.add(ok ? 'correct' : 'wrong');
        return { ok };
      },
    };
  },

  speak(ex, el, setReady, submit) {
    const supported = canListen();
    el.innerHTML = `
      <h2 class="prompt">${supported ? 'Lee esta frase en voz alta' : 'Repite esta frase en voz alta'}</h2>
      <div class="speak-card">
        ${audioButtons(ex.text)}
        <p class="sentence en speak-target">${escapeHtml(ex.text)}</p>
        ${ex.es ? `<p class="hint">${escapeHtml(ex.es)}</p>` : ''}
      </div>
      ${supported ? `
        <button class="mic" aria-label="Pulsa y habla">${icon('mic')}</button>
        <p class="mic-status muted">Pulsa el micro y habla</p>` : `
        <p class="muted center">Tu navegador no permite reconocer la voz. Escucha, repítelo en voz alta y valóralo tú.</p>
        <div class="self-assess">
          <button class="btn ghost" data-self="0">Me ha costado</button>
          <button class="btn ghost" data-self="1">Lo he dicho bien</button>
        </div>`}`;
    wireAudio(el, ex.text);
    const target = el.querySelector('.speak-target');
    let best = null;
    if (!supported) {
      el.querySelectorAll('[data-self]').forEach((b) => b.addEventListener('click', () => {
        best = { score: +b.dataset.self, self: true };
        submit();
      }));
      setTimeout(() => speak(ex.text), 350);
      return { check: () => ({ ok: best?.score === 1 }) };
    }
    const mic = el.querySelector('.mic');
    const status = el.querySelector('.mic-status');
    let listening = false;
    mic.addEventListener('click', async () => {
      if (listening) { listen.stop?.(); return; }
      listening = true;
      mic.classList.add('on');
      status.textContent = 'Te escucho…';
      try {
        const alts = await listen({ onStart: () => { status.textContent = 'Te escucho… (pulsa para parar)'; } });
        if (!alts.length) { status.textContent = 'No te he oído. Inténtalo otra vez.'; return; }
        const results = alts.map((a) => ({ said: a, ...speechScore(ex.text, a) }));
        const r = results.sort((a, b) => b.score - a.score)[0];
        if (!best || r.score >= best.score) best = r;
        const words = ex.text.replace(/[.!?]+$/, '').split(/\s+/);
        // Coloreamos cada palabra objetivo según si se ha reconocido
        target.innerHTML = words.map((w, i) => `<span class="${best.hit[i] ? 'hit' : 'miss'}">${escapeHtml(w)}</span>`).join(' ');
        const pct = Math.round(best.score * 100);
        status.innerHTML = `He entendido: <i>“${escapeHtml(best.said)}”</i> · <b>${pct}%</b>${pct < 75 ? ' · puedes volver a intentarlo' : ''}`;
        setReady(true);
        if (best.score >= 0.75) setTimeout(submit, 700);
      } catch (e) {
        status.textContent = e.message === 'not-allowed'
          ? 'Necesito permiso para usar el micrófono (ajustes del navegador).'
          : 'No he podido escucharte. Inténtalo de nuevo.';
      } finally {
        listening = false;
        mic.classList.remove('on');
      }
    });
    return {
      check() {
        mic.disabled = true;
        const ok = (best?.score || 0) >= 0.75;
        return { ok, detail: best ? `${Math.round(best.score * 100)}% de la frase reconocida` : '' };
      },
    };
  },

  reading(ex, el, setReady) {
    let q = 0;
    let sel = null;
    el.innerHTML = `
      <span class="badge">Reading · ${escapeHtml(ex.title)}</span>
      <div class="passage">
        <button class="btn-audio small" data-read aria-label="Escuchar el texto">${icon('speaker')}</button>
        <div class="passage-text en">${escapeHtml(ex.text).replace(/\n/g, '<br>')}</div>
      </div>
      <div class="rq"></div>`;
    let playing = false;
    el.querySelector('[data-read]').addEventListener('click', () => {
      if (playing) { speechSynthesis.cancel(); playing = false; return; }
      playing = true;
      speak(ex.text).then(() => { playing = false; });
    });
    const rq = el.querySelector('.rq');
    const showQ = () => {
      sel = null;
      const qq = ex.questions[q];
      rq.innerHTML = `
        <p class="q-count">Pregunta ${q + 1} de ${ex.questions.length}</p>
        <h3 class="prompt small en">${escapeHtml(qq.q)}</h3>
        <div class="options">${qq.options.map((o, i) =>
          `<button class="option" data-i="${i}"><span class="key">${i + 1}</span><span class="en">${escapeHtml(o)}</span></button>`).join('')}</div>`;
      rq.querySelectorAll('.option').forEach((b) => b.addEventListener('click', () => {
        rq.querySelectorAll('.option').forEach((x) => x.classList.remove('selected'));
        b.classList.add('selected');
        sel = +b.dataset.i;
        setReady(true);
      }));
    };
    showQ();
    return {
      check() {
        const qq = ex.questions[q];
        const ok = sel === qq.answer;
        rq.querySelectorAll('.option').forEach((b) => {
          b.disabled = true;
          if (+b.dataset.i === qq.answer) b.classList.add('correct');
          else if (+b.dataset.i === sel) b.classList.add('wrong');
        });
        return { ok, solution: qq.options[qq.answer] };
      },
      next() {
        q++;
        if (q >= ex.questions.length) return false;
        showQ();
        rq.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return true;
      },
      key(k) { rq.querySelector(`.option[data-i="${+k - 1}"]`)?.click(); },
    };
  },

  match(ex, el, setReady, submit) {
    const left = shuffle(ex.pairs);
    const right = shuffle(ex.pairs);
    el.innerHTML = `
      <h2 class="prompt">${ex.prompt}</h2>
      <div class="match">
        <div class="col">${left.map((p) => `<button class="tile big en" data-side="en" data-id="${p.wordId}">${escapeHtml(p.en)}</button>`).join('')}</div>
        <div class="col">${right.map((p) => `<button class="tile big" data-side="es" data-id="${p.wordId}">${escapeHtml(p.es)}</button>`).join('')}</div>
      </div>`;
    const mistakes = {};
    let pickEn = null, pickEs = null, done = 0;
    el.querySelector('.match').addEventListener('click', (e) => {
      const b = e.target.closest('.tile');
      if (!b || b.classList.contains('matched')) return;
      const side = b.dataset.side;
      el.querySelectorAll(`.tile[data-side="${side}"]`).forEach((x) => x.classList.remove('selected'));
      b.classList.add('selected');
      if (side === 'en') { pickEn = b; speak(b.textContent); } else pickEs = b;
      if (pickEn && pickEs) {
        if (pickEn.dataset.id === pickEs.dataset.id) {
          [pickEn, pickEs].forEach((x) => { x.classList.remove('selected'); x.classList.add('matched'); });
          done++;
          if (done === ex.pairs.length) { setReady(true); setTimeout(submit, 400); }
        } else {
          mistakes[pickEn.dataset.id] = true;
          mistakes[pickEs.dataset.id] = true;
          const a = pickEn, c = pickEs;
          [a, c].forEach((x) => x.classList.add('shake'));
          navigator.vibrate?.(40);
          setTimeout(() => [a, c].forEach((x) => x.classList.remove('shake', 'selected')), 450);
        }
        pickEn = pickEs = null;
      }
    });
    return {
      check() {
        applyMatchResult(ex.pairs, mistakes);
        return { ok: Object.keys(mistakes).length === 0, partialOk: true };
      },
    };
  },
};

// ---------- Reproductor ----------
export function runLesson(root, exercises, { title = 'Lección', onExit, onFinish, textTitle } = {}) {
  const queue = exercises.map((e) => ({ ...e }));
  const total = queue.length;
  let idx = 0;
  let doneCount = 0;
  let firstTry = 0, answered = 0, xp = 0;
  const skillsBefore = { ...get().ability };
  const startedAt = Date.now();
  const retried = new Set();
  let ctrl = null;
  let phase = 'answer'; // answer | feedback

  root.innerHTML = `
    <div class="lesson">
      <header class="lesson-top">
        <button class="icon-btn" data-exit aria-label="Salir">${icon('close')}</button>
        <div class="progress"><div class="progress-fill"></div></div>
      </header>
      <main class="ex-area"></main>
      <footer class="checkbar">
        <div class="feedback" hidden></div>
        <div class="checkbar-row">
          <button class="btn ghost skip" hidden></button>
          <button class="btn primary check" disabled>Comprobar</button>
        </div>
      </footer>
    </div>`;
  const area = root.querySelector('.ex-area');
  const bar = root.querySelector('.checkbar');
  const fb = root.querySelector('.feedback');
  const btn = root.querySelector('.check');
  const skipBtn = root.querySelector('.skip');
  const fill = root.querySelector('.progress-fill');

  root.querySelector('[data-exit]').addEventListener('click', () => {
    if (doneCount === 0 || confirm('¿Salir de la lección? Perderás el progreso de esta lección.')) {
      speechSynthesis?.cancel();
      cleanup();
      onExit?.();
    }
  });

  const setReady = (r) => { if (phase === 'answer') btn.disabled = !r; };

  function show() {
    const ex = queue[idx];
    phase = 'answer';
    bar.className = 'checkbar';
    fb.hidden = true;
    btn.textContent = 'Comprobar';
    btn.disabled = true;
    btn.hidden = ex.kind === 'match';
    area.scrollTop = 0;
    area.innerHTML = '<div class="ex"></div>';
    const el = area.firstChild;
    ctrl = renderers[ex.kind](ex, el, setReady, () => { if (!btn.disabled || ex.kind === 'speak' || ex.kind === 'match') doCheck(); });
    skipBtn.hidden = !ex.canSkip;
    skipBtn.textContent = ex.canSkip === 'mic' ? 'Ahora no puedo hablar' : ex.canSkip === 'audio' ? 'Ahora no puedo escuchar' : '';
    fill.style.width = `${(doneCount / (total + retried.size)) * 100}%`;
  }

  skipBtn.addEventListener('click', () => {
    const kind = queue[idx].canSkip;
    speechSynthesis?.cancel();
    // Quitamos el resto de ejercicios del mismo tipo en esta lección
    for (let i = queue.length - 1; i > idx; i--) if (queue[i].canSkip === kind) queue.splice(i, 1);
    queue.splice(idx, 1);
    if (idx >= queue.length) return finish();
    show();
  });

  function doCheck() {
    if (phase !== 'answer') return;
    const ex = queue[idx];
    const r = ctrl.check();
    phase = 'feedback';
    const first = !ex._retry;
    answered++;
    recordAnswer(r.ok);
    if (first) {
      // Los textos de "Mis textos" no tienen nivel: no mueven tu estimación de nivel
      applyResult(ex, r.ok);
      if (r.ok) { firstTry++; xp += XP_PER_OK; }
    } else if (r.ok) {
      xp += 1;
    }
    if (ex.termToSave && !r.ok) addCustomWord(ex.termToSave.key, ex.termToSave.es, textTitle);
    // Los fallos se repiten una vez al final (salvo textos largos, speaking y emparejar)
    if (!r.ok && first && ['choice', 'type', 'order'].includes(ex.kind)) {
      queue.push({ ...ex, _retry: true, autoplay: ex.autoplay });
      retried.add(idx);
    }
    beep(r.ok || r.partialOk);
    const solution = r.solution || ex.solution;
    const title = r.ok ? (r.typo ? '¡Casi perfecto!' : pickPraise()) : ex.kind === 'match' ? '¡Hecho!' : 'Solución correcta:';
    fb.innerHTML = `
      <div class="fb-title">${r.ok || r.partialOk ? icon('check') : icon('x')} ${title}</div>
      ${!r.ok && solution && ex.kind !== 'match' ? `<div class="fb-solution en">${escapeHtml(solution)}
        ${canSpeak() ? `<button class="btn-audio tiny" data-say-solution aria-label="Escuchar">${icon('speaker')}</button>` : ''}</div>` : ''}
      ${r.ok && r.typo ? `<div class="fb-solution en">${escapeHtml(solution)}</div>` : ''}
      ${r.detail ? `<div class="fb-explain">${escapeHtml(r.detail)}</div>` : ''}
      ${ex.explain && (!r.ok || ex.kind === 'choice') ? `<div class="fb-explain">💡 ${escapeHtml(ex.explain)}</div>` : ''}`;
    fb.querySelector('[data-say-solution]')?.addEventListener('click', () => speak(solution));
    if (r.ok && (ex.speakSolution) && solution) speak(solution);
    fb.hidden = false;
    bar.className = 'checkbar ' + (r.ok || r.partialOk ? 'ok' : 'bad');
    btn.hidden = false;
    btn.disabled = false;
    btn.textContent = 'Continuar';
    skipBtn.hidden = true;
  }

  function advance() {
    speechSynthesis?.cancel();
    if (ctrl.next && ctrl.next()) {
      phase = 'answer';
      bar.className = 'checkbar';
      fb.hidden = true;
      btn.textContent = 'Comprobar';
      btn.disabled = true;
      return;
    }
    doneCount++;
    idx++;
    if (idx >= queue.length) return finish();
    show();
  }

  btn.addEventListener('click', () => { if (ctrl) (phase === 'answer' ? doCheck() : advance()); });

  const onKey = (e) => {
    if (e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'Enter' && !btn.disabled) { e.preventDefault(); btn.click(); }
    else if (/^[1-4]$/.test(e.key) && phase === 'answer') ctrl?.key?.(e.key);
  };
  document.addEventListener('keydown', onKey);
  function cleanup() { document.removeEventListener('keydown', onKey); }

  function finish() {
    cleanup();
    const accuracy = answered ? firstTry / Math.max(1, answered - retried.size) : 1;
    const bonus = 10 + (accuracy >= 0.999 && answered > 0 ? 5 : 0);
    xp += bonus;
    addXp(xp);
    completeLesson();
    save();
    const after = get().ability;
    const changes = SKILLS.map((k) => ({ k, d: after[k] - skillsBefore[k] })).filter((c) => Math.abs(c.d) > 0.005);
    onFinish?.({ xp, accuracy, seconds: Math.round((Date.now() - startedAt) / 1000), changes, title });
  }

  if (!queue.length) {
    area.innerHTML = '<div class="ex empty"><p>No hay ejercicios disponibles ahora mismo.</p></div>';
    btn.textContent = 'Volver';
    btn.disabled = false;
    btn.onclick = () => { cleanup(); onExit?.(); };
    return;
  }
  show();
}

const PRAISES = ['¡Correcto!', '¡Genial!', '¡Muy bien!', '¡Perfecto!', '¡Así se hace!', '¡Exacto!'];
function pickPraise() { return PRAISES[Math.floor(Math.random() * PRAISES.length)]; }
