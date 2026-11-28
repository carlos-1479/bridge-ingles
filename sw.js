// Service worker: guarda la app para que funcione sin conexión.
// Sube la versión cada vez que cambies archivos para que el móvil descargue la nueva.
const VERSION = 'bridge-v2';
const FILES = [
  './', './index.html', './manifest.webmanifest', './css/app.css',
  './js/app.js', './js/store.js', './js/engine.js', './js/lesson.js', './js/speech.js',
  './js/text.js', './js/analyzer.js', './js/icons.js',
  './js/content/vocab.js', './js/content/sentences.js', './js/content/grammar.js',
  './js/content/reading.js', './js/content/placement.js', './js/content/glossary.js',
  './js/content/samples.js', './js/content/exam.js', './js/readiness.js',
  './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Primero la red (para ver cambios al momento), y si no hay conexión, la copia guardada.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true })),
  );
});
