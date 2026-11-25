# Bridge · Tu inglés a medida

App web (PWA) para aprender inglés cada día desde el móvil. Sin servidor ni cuentas: todo se guarda en el propio dispositivo.

## Arrancar en el ordenador

```bash
python3 -m http.server 5173
```

Abre http://localhost:5173

## Estructura

- `js/content/` → contenido: vocabulario, frases, gramática, textos de reading, test de nivel y glosario para analizar ofertas/canciones. Para añadir material basta con añadir líneas a estos archivos.
- `js/engine.js` → motor adaptativo: nivel por destreza (modelo tipo Elo), selección de ejercicios según nivel/objetivo/intereses y repaso espaciado (Leitner).
- `js/analyzer.js` → convierte un texto pegado (oferta de LinkedIn, letra de canción…) en glosario y ejercicios.
- `js/lesson.js` → reproductor de lecciones y tipos de ejercicio.
- `js/app.js` → pantallas.
- `sw.js` → funcionamiento sin conexión. **Sube `VERSION` cada vez que cambies archivos.**

## Limitaciones conocidas

- El micrófono (speaking) solo funciona en HTTPS o en `localhost`. Para usarlo en el móvil hay que publicarla (GitHub Pages, Netlify…).
- El reconocimiento de voz depende del navegador: Chrome en Android y Safari en iPhone. Si no está disponible, el speaking pasa a autoevaluación.
- Sin IA: el análisis de textos usa un glosario fijo (~300 expresiones). Las palabras que no reconoce las puedes añadir tú con tu traducción.
