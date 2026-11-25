// Ejercicios de gramática. El hueco se marca con ___
// { lvl, topic, prompt, options, answer (índice), explain }
const raw = [
  [1, 'to be', 'She ___ my manager.', ['is', 'are', 'am'], 0, 'He / she / it → is.'],
  [1, 'to be', 'We ___ in the meeting room.', ['is', 'am', 'are'], 2, 'We / you / they → are.'],
  [1, 'present simple', 'He ___ in a bank.', ['work', 'works', 'working'], 1, 'En presente simple, 3ª persona singular añade -s.'],
  [1, 'present simple', '___ you like rock music?', ['Do', 'Does', 'Are'], 0, 'Preguntas con I/you/we/they → Do.'],
  [1, 'there is/are', 'There ___ two emails for you.', ['is', 'are', 'be'], 1, 'Plural → there are.'],
  [1, 'can', 'I ___ speak a little English.', ['can', 'cans', 'can to'], 0, 'Can no lleva -s ni "to".'],
  [1, 'prepositions', 'The meeting is ___ Monday.', ['in', 'on', 'at'], 1, 'Días de la semana → on.'],
  [1, 'prepositions', 'I start work ___ 9 o\'clock.', ['at', 'on', 'in'], 0, 'Horas → at.'],

  [2, 'past simple', 'Yesterday I ___ an email to the client.', ['send', 'sent', 'sended'], 1, 'Send es irregular: send → sent.'],
  [2, 'past simple', '___ you go to the interview?', ['Did', 'Do', 'Were'], 0, 'Preguntas en pasado simple → Did + verbo base.'],
  [2, 'present continuous', 'Right now, I ___ on a new project.', ['work', 'am working', 'worked'], 1, 'Acción en curso ahora → am/is/are + -ing.'],
  [2, 'comparatives', 'This job is ___ than my old one.', ['more good', 'better', 'gooder'], 1, 'Good → better → the best.'],
  [2, 'comparatives', 'London is ___ expensive than Madrid.', ['more', 'most', 'much'], 0, 'Adjetivos largos → more + adjetivo + than.'],
  [2, 'going to', 'I ___ apply for that job next week.', ['am going to', 'go to', 'going'], 0, 'Planes futuros → be going to + verbo.'],
  [2, 'countable', 'How ___ experience do you have?', ['many', 'much', 'lot'], 1, 'Experience (incontable) → how much.'],
  [2, 'present perfect', 'I ___ never been to New York.', ['have', 'has', 'am'], 0, 'I/you/we/they → have + participio.'],
  [2, 'prepositions', 'I\'m interested ___ this position.', ['on', 'in', 'for'], 1, 'Interested in.'],

  [3, 'present perfect', 'I ___ here since 2021.', ['work', 'have worked', 'am working'], 1, 'Desde un momento hasta ahora → present perfect (since/for).'],
  [3, 'present perfect vs past', 'We ___ the contract last Tuesday.', ['have signed', 'signed', 'sign'], 1, 'Momento terminado y concreto (last Tuesday) → past simple.'],
  [3, 'first conditional', 'If you ___ the report today, I\'ll review it tonight.', ['send', 'will send', 'sent'], 0, '1er condicional: If + presente, will + verbo.'],
  [3, 'second conditional', 'If I ___ fluent, I would work abroad.', ['am', 'were', 'will be'], 1, '2º condicional: If + pasado (were), would + verbo.'],
  [3, 'passive', 'The new office ___ last year.', ['built', 'was built', 'has build'], 1, 'Pasiva en pasado → was/were + participio.'],
  [3, 'modals', 'You ___ wear a suit. It\'s optional.', ['mustn\'t', 'don\'t have to', 'can\'t'], 1, 'Don\'t have to = no es necesario. Mustn\'t = prohibido.'],
  [3, 'gerund/infinitive', 'I\'m looking forward to ___ you.', ['meet', 'meeting', 'to meet'], 1, 'Look forward to + -ing.'],
  [3, 'gerund/infinitive', 'She decided ___ the offer.', ['accepting', 'to accept', 'accept'], 1, 'Decide + to + verbo.'],
  [3, 'relative clauses', 'The candidate ___ we hired speaks four languages.', ['who', 'which', 'what'], 0, 'Personas → who (o that).'],
  [3, 'used to', 'I ___ work in a restaurant, but now I work in IT.', ['use to', 'used to', 'was used to'], 1, 'Hábitos pasados → used to + verbo.'],
  [3, 'phrasal verbs', 'Can you ___ the meeting? I\'m sick.', ['call off', 'call on', 'call up'], 0, 'Call off = cancelar.'],

  [4, 'third conditional', 'If we ___ earlier, we would have caught the train.', ['left', 'had left', 'would leave'], 1, '3er condicional: If + had + participio, would have + participio.'],
  [4, 'reported speech', 'She said she ___ the report the day before.', ['finishes', 'had finished', 'has finished'], 1, 'En estilo indirecto el pasado retrocede a past perfect.'],
  [4, 'passive', 'Candidates ___ to submit a CV in English.', ['are required', 'require', 'are requiring'], 0, 'Fórmula típica de ofertas: are required to = deben.'],
  [4, 'wish', 'I wish I ___ more time to practise.', ['have', 'had', 'will have'], 1, 'Wish + pasado para deseos sobre el presente.'],
  [4, 'modals of deduction', 'He isn\'t answering. He ___ be in a meeting.', ['must', 'can', 'should'], 0, 'Must be = seguro que está (deducción).'],
  [4, 'modals of deduction', 'She ___ have seen my email; she didn\'t reply.', ['can\'t', 'mustn\'t', 'shouldn\'t'], 0, 'Can\'t have + participio = es imposible que haya…'],
  [4, 'linkers', '___ the delay, we delivered on time.', ['Although', 'Despite', 'However'], 1, 'Despite + sustantivo. Although + frase completa.'],
  [4, 'linkers', 'The pay is good. ___, the hours are long.', ['Despite', 'Although', 'However'], 2, 'However va al inicio de frase seguido de coma.'],
  [4, 'present perfect continuous', 'I ___ for this job for three months.', ['have been looking', 'am looking', 'looked'], 0, 'Acción que empezó en el pasado y sigue → have been + -ing.'],
  [4, 'phrasal verbs', 'We need to ___ the costs before the review.', ['cut down on', 'cut off', 'cut in'], 0, 'Cut down on = reducir.'],
  [4, 'job ads', 'Experience with Salesforce is a ___ but not essential.', ['plus', 'must', 'require'], 0, '"Is a plus" = suma puntos, no es obligatorio.'],

  [5, 'inversion', 'Not only ___ late, but he also forgot the slides.', ['he was', 'was he', 'he is'], 1, 'Not only al inicio → inversión (was he).'],
  [5, 'inversion', '___ I known, I would have called you.', ['If', 'Had', 'Have'], 1, 'Had I known = If I had known (más formal).'],
  [5, 'mixed conditional', 'If I had studied engineering, I ___ a different job now.', ['would have', 'would have had', 'had'], 0, 'Condicional mixto: pasado → consecuencia en el presente.'],
  [5, 'subjunctive', 'It is essential that every employee ___ the training.', ['completes', 'complete', 'completed'], 1, 'Subjuntivo formal: essential that + verbo base.'],
];

export const GRAMMAR = raw.map(([lvl, topic, prompt, options, answer, explain], i) => ({
  id: 'g_' + topic.replace(/[^a-z]+/gi, '-') + '_' + prompt.toLowerCase().replace(/[^a-z]+/g, '').slice(0, 24),
  lvl, topic, prompt, options, answer, explain,
}));
