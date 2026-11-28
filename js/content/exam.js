// Contenido con el formato de los exámenes Cambridge A2 Key, B1 Preliminary, B2 First y C1 Advanced.
// Todo es material original: mismo tipo de tarea, no preguntas oficiales.
// En los textos, {n} marca el hueco n (empezando en 1).

// Partes que la app sabe entrenar. Cada examen elige cuáles tiene y cómo se llaman.
export const PARTS = {
  notices: { skill: 'reading', name: 'Reading 1', short: 'Avisos y mensajes cortos',
    tip: 'Pregúntate quién escribe, para quién y qué quiere. Cuidado con must, only, unless, until.' },
  uoe1: { skill: 'vocab', name: 'Use of English 1', short: 'Multiple-choice cloze',
    tip: 'Fíjate en colocaciones y en la preposición que va detrás del hueco (deal WITH, run THE RISK…).' },
  uoe2: { skill: 'grammar', name: 'Use of English 2', short: 'Open cloze',
    tip: 'Casi siempre falta una palabra gramatical: preposición, artículo, pronombre relativo o conector.' },
  uoe3: { skill: 'vocab', name: 'Use of English 3', short: 'Word formation',
    tip: 'Decide primero qué categoría pide el hueco (sustantivo, adjetivo, adverbio) y si es negativa o plural.' },
  uoe4: { skill: 'grammar', name: 'Use of English 4', short: 'Key word transformations',
    tip: 'No cambies la palabra clave y comprueba que la frase significa exactamente lo mismo.' },
  read: { skill: 'reading', name: 'Reading', short: 'Comprensión de textos',
    tip: 'Lee primero las preguntas y busca en el texto la idea, no la misma palabra: suelen usar sinónimos.' },
  write: { skill: null, name: 'Writing', short: 'Email, essay, historia…',
    tip: 'Responde a todos los puntos de la tarea, organiza en párrafos y usa conectores.' },
  listen: { skill: 'listening', name: 'Listening', short: 'Extractos y preguntas',
    tip: 'Lee la pregunta antes del audio y desconfía de la opción que repite palabras exactas: suele ser una trampa.' },
  speak: { skill: 'speaking', name: 'Speaking', short: 'Entrevista y opinión',
    tip: 'No contestes con una frase: da una respuesta, una razón y un ejemplo.' },
};

// scale: % de aciertos → escala Cambridge (aproximación orientativa).
// passPct: % aproximado para aprobar. papers: pruebas y su peso en la nota final.
// parts: [paper, peso dentro de la prueba, nombre en este examen, descripción]
export const EXAMS = {
  a2key: {
    id: 'a2key', name: 'A2 Key', lvl: 2, pass: 120, passPct: 0.7,
    scale: [[0, 82], [0.45, 100], [0.7, 120], [0.8, 133], [0.85, 140], [1, 150]],
    grades: [[140, 'Grade A (nivel B1)'], [133, 'Grade B'], [120, 'Grade C'], [100, 'Nivel A1'], [0, 'Por debajo de A1']],
    papers: { rw: ['Reading & Writing', 0.5], listening: ['Listening', 0.25], speaking: ['Speaking', 0.25] },
    parts: {
      notices: ['rw', 6, 'Reading 1', 'Avisos y mensajes cortos'],
      read: ['rw', 12, 'Reading 2–3', 'Textos y preguntas'],
      uoe1: ['rw', 6, 'Reading 4', 'Multiple-choice cloze'],
      uoe2: ['rw', 6, 'Reading 5', 'Open cloze'],
      write: ['rw', 15, 'Writing 6–7', 'Email corto e historia'],
      listen: ['listening', 1, 'Listening', 'Mensajes y conversaciones cortas'],
      speak: ['speaking', 1, 'Speaking', 'Preguntas personales'],
    },
  },
  b1prelim: {
    id: 'b1prelim', name: 'B1 Preliminary', lvl: 3, pass: 140, passPct: 0.7,
    scale: [[0, 102], [0.45, 120], [0.7, 140], [0.8, 153], [0.85, 160], [1, 170]],
    grades: [[160, 'Grade A (nivel B2)'], [153, 'Grade B'], [140, 'Grade C'], [120, 'Nivel A2'], [0, 'Por debajo de A2']],
    papers: { reading: ['Reading', 0.25], writing: ['Writing', 0.25], listening: ['Listening', 0.25], speaking: ['Speaking', 0.25] },
    parts: {
      notices: ['reading', 5, 'Reading 1', 'Avisos y mensajes cortos'],
      read: ['reading', 20, 'Reading 2–4', 'Textos y comprensión'],
      uoe1: ['reading', 6, 'Reading 5', 'Multiple-choice cloze'],
      uoe2: ['reading', 6, 'Reading 6', 'Open cloze'],
      write: ['writing', 1, 'Writing', 'Email y artículo o historia'],
      listen: ['listening', 1, 'Listening', 'Extractos y conversaciones'],
      speak: ['speaking', 1, 'Speaking', 'Entrevista y opinión'],
    },
  },
  b2first: {
    id: 'b2first', name: 'B2 First', lvl: 4, pass: 160, passPct: 0.6,
    scale: [[0, 102], [0.45, 140], [0.6, 160], [0.75, 173], [0.8, 180], [1, 190]],
    grades: [[180, 'Grade A (nivel C1)'], [173, 'Grade B'], [160, 'Grade C'], [140, 'Nivel B1'], [0, 'Por debajo de B1']],
    papers: { rue: ['Reading & Use of English', 0.25], writing: ['Writing', 0.25], listening: ['Listening', 0.25], speaking: ['Speaking', 0.25] },
    parts: {
      uoe1: ['rue', 8, 'Use of English 1', 'Multiple-choice cloze'],
      uoe2: ['rue', 8, 'Use of English 2', 'Open cloze'],
      uoe3: ['rue', 8, 'Use of English 3', 'Word formation'],
      uoe4: ['rue', 12, 'Use of English 4', 'Key word transformations'],
      read: ['rue', 34, 'Reading', 'Comprensión de textos'],
      write: ['writing', 1, 'Writing', 'Essay, email, artículo…'],
      listen: ['listening', 1, 'Listening', 'Extractos y preguntas'],
      speak: ['speaking', 1, 'Speaking', 'Entrevista y opinión'],
    },
  },
  c1adv: {
    id: 'c1adv', name: 'C1 Advanced', lvl: 5, pass: 180, passPct: 0.6,
    scale: [[0, 122], [0.45, 160], [0.6, 180], [0.75, 193], [0.8, 200], [1, 210]],
    grades: [[200, 'Grade A (nivel C2)'], [193, 'Grade B'], [180, 'Grade C'], [160, 'Nivel B2'], [0, 'Por debajo de B2']],
    papers: { rue: ['Reading & Use of English', 0.25], writing: ['Writing', 0.25], listening: ['Listening', 0.25], speaking: ['Speaking', 0.25] },
    parts: {
      uoe1: ['rue', 8, 'Use of English 1', 'Multiple-choice cloze'],
      uoe2: ['rue', 8, 'Use of English 2', 'Open cloze'],
      uoe3: ['rue', 8, 'Use of English 3', 'Word formation'],
      uoe4: ['rue', 12, 'Use of English 4', 'Key word transformations'],
      read: ['rue', 36, 'Reading', 'Comprensión de textos'],
      write: ['writing', 1, 'Writing', 'Essay, propuesta, informe…'],
      listen: ['listening', 1, 'Listening', 'Extractos y preguntas'],
      speak: ['speaking', 1, 'Speaking', 'Entrevista y debate'],
    },
  },
};

// Información de una parte dentro de un examen concreto.
export function partInfo(id, exam) {
  const base = PARTS[id];
  const p = exam?.parts?.[id];
  if (!p) return { id, ...base };
  return { id, ...base, paper: p[0], weight: p[1], name: p[2], short: p[3] };
}

// ---------- Reading 1: avisos y mensajes cortos (A2 / B1) ----------
// [examen, texto, opciones (la primera es la correcta)]
const notices = [
  ['a2key', 'SWIMMING POOL\nChildren under 8 must be with an adult at all times.', ['Young children cannot swim alone.', 'Adults cannot use the pool.', 'The pool is only for children.']],
  ['a2key', 'Hi Tom, the football match is cancelled because of the rain. We\'ll play next Saturday instead. – Mike', ['The match will happen next week.', 'Tom must bring an umbrella.', 'Mike is not playing football any more.']],
  ['a2key', 'LIBRARY\nBooks must be returned within 14 days.', ['You can keep books for two weeks.', 'The library is closed for 14 days.', 'You can buy books here.']],
  ['a2key', 'Mum, I\'ve taken the car to the garage. Can you pick me up from there at 6? Love, Sara', ['Sara wants her mum to collect her.', 'Sara will drive home at 6.', 'Sara\'s mum is at the garage.']],
  ['a2key', 'SALE\nAll shoes half price – this weekend only', ['Shoes are cheaper for two days.', 'The shop is closed this weekend.', 'You can buy two pairs for the price of one.']],
  ['a2key', 'Dear students, the English class on Thursday will be in Room 12, not Room 5.', ['The class is in a different room.', 'There is no class on Thursday.', 'Room 5 is for English classes.']],
  ['a2key', 'CAFÉ\nPlease pay at the counter before you sit down.', ['You pay before you find a table.', 'You can pay at your table.', 'There are no tables in the café.']],
  ['a2key', 'Jack – your phone was in my bag! I\'ll give it to you at school tomorrow. Emma', ['Emma has Jack\'s phone.', 'Jack lost Emma\'s bag.', 'Emma will phone Jack tomorrow.']],
  ['b1prelim', 'Gym members: from 1 June, the gym will open at 6 a.m. on weekdays, an hour earlier than now.', ['Members will be able to start exercising earlier on weekdays.', 'The gym will close an hour earlier from June.', 'The gym will only be open on weekdays.']],
  ['b1prelim', 'Hi Ana, the restaurant\'s fully booked at 8, but they can fit us in at 7.30 if we\'re happy to sit outside. Let me know. Joe', ['Joe needs Ana to agree to an earlier time and an outdoor table.', 'Joe has booked a table inside for 8.', 'The restaurant has no tables outside.']],
  ['b1prelim', 'Lost property will be kept at reception for one month. After that, it will be given to charity.', ['Unclaimed items will be donated after a month.', 'You must collect lost items within a week.', 'Reception sells lost property to charity shops.']],
  ['b1prelim', 'Students who wish to change course must speak to their tutor before the end of the first week of term.', ['There is a deadline for asking to change course.', 'Tutors decide which course students take.', 'Students can change course at any time.']],
  ['b1prelim', 'Due to building work, the car park will be closed until further notice. Staff are advised to use public transport.', ['It is not known when the car park will reopen.', 'Staff must pay to use public transport.', 'The car park will reopen next week.']],
  ['b1prelim', 'Tickets for the concert are non-refundable, but they can be transferred to another person up to 24 hours before the event.', ['You can give your ticket to someone else, but you cannot get your money back.', 'You can get a refund until the day before the concert.', 'Tickets cannot be used by anyone else.']],
  ['b1prelim', 'Max – the printer\'s out of ink again. I\'ve ordered some more but it won\'t arrive till Monday, so print anything urgent at the library. Sam', ['Sam is suggesting where Max can print before Monday.', 'Max needs to order more ink.', 'The library printer is not working.']],
  ['b1prelim', 'Applications received after the closing date will not be considered, regardless of experience.', ['Late applications will be rejected.', 'Experienced applicants can apply late.', 'The closing date may be extended.']],
];
export const NOTICES = notices.map(([exam, text, options]) => ({
  id: 'n_' + text.toLowerCase().replace(/[^a-z]+/g, '').slice(0, 30),
  exam, lvl: exam === 'a2key' ? 2 : 3, text, options,
}));

// ---------- Use of English 1: multiple-choice cloze ----------
export const UOE1 = [
  {
    id: 'u1_a2_eye', exam: 'a2key', lvl: 2, title: 'The London Eye',
    text: `The London Eye is a very big wheel next to the River Thames. It {1} in 2000 and it is now one of the most popular tourist {2} in the city. A trip on the wheel takes {3} thirty minutes. From the top, you can see many famous buildings, and on a clear day you can see for {4} forty kilometres. It is a good idea to buy your ticket online because it is {5} than at the ticket office. Many people also {6} photos to show their friends.`,
    gaps: [
      { options: ['opened', 'made', 'did'], answer: 0 },
      { options: ['attractions', 'visits', 'trips'], answer: 0 },
      { options: ['about', 'close', 'next'], answer: 0 },
      { options: ['up to', 'until', 'since'], answer: 0 },
      { options: ['cheaper', 'poorer', 'less'], answer: 0 },
      { options: ['take', 'make', 'do'], answer: 0 },
    ],
  },
  {
    id: 'u1_a2_guitar', exam: 'a2key', lvl: 2, title: 'My new hobby',
    text: `Last year I {1} to learn the guitar. I {2} lessons every Tuesday with a teacher who lives near my house. At first it was very difficult and my fingers hurt a {3}! But I practised every day and slowly I got {4}. Now I can play about ten songs. Next month I am going to play in a small concert at my school. I'm a bit nervous, but my teacher says I am {5} for it. I hope my family will {6} to watch me.`,
    gaps: [
      { options: ['decided', 'thought', 'looked'], answer: 0 },
      { options: ['have', 'make', 'give'], answer: 0 },
      { options: ['lot', 'many', 'much'], answer: 0 },
      { options: ['better', 'best', 'good'], answer: 0 },
      { options: ['ready', 'able', 'good'], answer: 0 },
      { options: ['come', 'visit', 'arrive'], answer: 0 },
    ],
  },
  {
    id: 'u1_b1_coffee', exam: 'b1prelim', lvl: 3, title: 'Working in a coffee shop',
    text: `Working in a coffee shop is often a student's first job. It can be hard work, especially at busy times, but it also has several {1}. You learn how to {2} with customers, some of whom can be quite demanding, and you get used to working {3} pressure. Many employers {4} this kind of experience because it shows that you are reliable and can work in a team. Of course, the pay is not usually very high, so most students do it {5} a few hours a week while they {6} their studies.`,
    gaps: [
      { options: ['advantages', 'profits', 'gains', 'winnings'], answer: 0 },
      { options: ['deal', 'handle', 'manage', 'treat'], answer: 0 },
      { options: ['under', 'in', 'with', 'on'], answer: 0 },
      { options: ['value', 'price', 'cost', 'rate'], answer: 0 },
      { options: ['for', 'during', 'since', 'along'], answer: 0 },
      { options: ['continue', 'follow', 'persist', 'remain'], answer: 0 },
    ],
  },
  {
    id: 'u1_b1_hiking', exam: 'b1prelim', lvl: 3, title: 'A weekend in the mountains',
    text: `Last weekend my friends and I went hiking in the mountains. We had {1} to leave early on Saturday, but Dan's alarm didn't go off, so we didn't {2} off until ten. The weather forecast had {3} sunshine, but by the afternoon it was raining heavily. Luckily, we found a small hut where we could {4} shelter. We spent the evening playing cards and telling stories, and in the end it {5} out to be one of the best trips we've ever had. We've already started making {6} for the next one.`,
    gaps: [
      { options: ['planned', 'thought', 'wished', 'considered'], answer: 0 },
      { options: ['set', 'get', 'put', 'go'], answer: 0 },
      { options: ['promised', 'said', 'told', 'announced'], answer: 0 },
      { options: ['take', 'make', 'do', 'have'], answer: 0 },
      { options: ['turned', 'came', 'ended', 'worked'], answer: 0 },
      { options: ['plans', 'ideas', 'projects', 'programmes'], answer: 0 },
    ],
  },
  {
    id: 'u1_b2_home', exam: 'b2first', lvl: 4, title: 'Working from home',
    text: `When Anna started working from home, she thought it would be easy to stay focused. However, she soon {1} that the fridge, the sofa and her phone were constant distractions. To {2} with the problem, she decided to set up a small office in the spare room. She also began to {3} a strict routine: she starts at nine, takes a short break every two hours and {4} off her laptop at six. 'It made a huge {5},' she says. 'I get more done, and I no longer feel guilty in the evenings.' Experts agree that clear limits are {6} for remote workers. Without them, work tends to {7} into every part of the day, and people {8} the risk of burning out.`,
    gaps: [
      { options: ['realised', 'knew', 'meant', 'reminded'], answer: 0 },
      { options: ['deal', 'solve', 'fix', 'treat'], answer: 0 },
      { options: ['follow', 'do', 'carry', 'obey'], answer: 0 },
      { options: ['switches', 'takes', 'puts', 'gets'], answer: 0 },
      { options: ['difference', 'effect', 'result', 'outcome'], answer: 0 },
      { options: ['essential', 'compulsory', 'obliged', 'urgent'], answer: 0 },
      { options: ['spread', 'arrive', 'reach', 'join'], answer: 0 },
      { options: ['run', 'do', 'make', 'put'], answer: 0 },
    ],
  },
  {
    id: 'u1_b2_adults', exam: 'b2first', lvl: 4, title: 'Learning a language as an adult',
    text: `Many adults believe they are too old to learn a new language, but research suggests this is largely a {1}. While children may {2} a better accent, adults often make faster progress at the beginning because they can {3} on their knowledge of grammar and their study skills. The key is to {4} a habit: twenty minutes every day is far more {5} than three hours once a week. It also helps to {6} the language to your real interests, such as your job or your hobbies. Above all, learners should not be {7} by mistakes. Making errors is a natural {8} of the process.`,
    gaps: [
      { options: ['myth', 'lie', 'story', 'fault'], answer: 0 },
      { options: ['achieve', 'succeed', 'reach', 'win'], answer: 0 },
      { options: ['draw', 'pull', 'take', 'bring'], answer: 0 },
      { options: ['form', 'do', 'take', 'get'], answer: 0 },
      { options: ['effective', 'capable', 'skilful', 'qualified'], answer: 0 },
      { options: ['connect', 'join', 'attach', 'unite'], answer: 0 },
      { options: ['put off', 'let down', 'held up', 'taken in'], answer: 0 },
      { options: ['part', 'piece', 'side', 'bit'], answer: 0 },
    ],
  },
  {
    id: 'u1_c1_fourday', exam: 'c1adv', lvl: 5, title: 'The four-day week',
    text: `The idea of a four-day working week has {1} momentum in recent years. Supporters argue that it boosts productivity and helps companies {2} talented staff. Critics, on the other hand, {3} doubt on whether the model can work in every sector. Trials in several countries have produced {4} results: most firms reported that output did not {5}, while employees said they felt less stressed. Nevertheless, the scheme is not without its {6}. Some managers found it hard to {7} that customers were always looked after, and a few companies {8} the trial early.`,
    gaps: [
      { options: ['gained', 'won', 'earned', 'collected'], answer: 0 },
      { options: ['retain', 'remain', 'preserve', 'sustain'], answer: 0 },
      { options: ['cast', 'raise', 'lay', 'set'], answer: 0 },
      { options: ['encouraging', 'hopeful', 'optimistic', 'confident'], answer: 0 },
      { options: ['suffer', 'harm', 'damage', 'hurt'], answer: 0 },
      { options: ['drawbacks', 'faults', 'failures', 'lacks'], answer: 0 },
      { options: ['ensure', 'assure', 'insure', 'secure'], answer: 0 },
      { options: ['abandoned', 'resigned', 'retired', 'deserted'], answer: 0 },
    ],
  },
];

// ---------- Use of English 2: open cloze ----------
export const UOE2 = [
  {
    id: 'u2_a2_email', exam: 'a2key', lvl: 2, title: 'An email from Lucy',
    text: `Hi Ben, how {1} you? I'm writing to tell you about my new flat. It's very nice and it's near {2} centre of town. There {3} two bedrooms, so you can come and stay! I moved here {4} Saturday. My new neighbours are very friendly and one of {5} has a dog. Can you come {6} visit me next month? Lucy`,
    gaps: [['are'], ['the'], ['are'], ['on', 'last'], ['them'], ['and', 'to']],
  },
  {
    id: 'u2_a2_beach', exam: 'a2key', lvl: 2, title: 'My favourite place',
    text: `My favourite place is the beach near my grandparents' house. I go there {1} summer with my family. I love swimming in the sea and playing volleyball {2} my cousins. In the evening we often eat at a small restaurant {3} sells fresh fish. The beach is beautiful, {4} it can be very busy in August. I {5} been there many times, but I never get bored. I think it is the best place in the {6}!`,
    gaps: [['every', 'each'], ['with'], ['that', 'which'], ['but'], ['have'], ['world']],
  },
  {
    id: 'u2_b1_cook', exam: 'b1prelim', lvl: 3, title: 'Learning to cook',
    text: `When I left home to go to university, I couldn't cook at {1}. For the first few weeks I lived on pizza and sandwiches, {2} I soon got tired of them. So I decided to teach myself. I started {3} watching videos online and trying simple recipes. Some of my first attempts were terrible, but I didn't give {4}. Now I cook dinner for my flatmates at least twice a week, and they say my curry is the best they've {5} tasted. Cooking has become one of my favourite ways {6} relaxing.`,
    gaps: [['all'], ['but', 'and'], ['by'], ['up'], ['ever'], ['of']],
  },
  {
    id: 'u2_b1_festival', exam: 'b1prelim', lvl: 3, title: 'The town festival',
    text: `Every summer, my town holds a festival that lasts {1} a whole week. People come from all over the region to enjoy the music, food and fireworks. The festival was first organised over fifty years {2}, and it has grown a lot since then. This year, more than twenty bands are going {3} perform on the main stage. If you want to go, it's a good idea to book your accommodation early, {4} hotels fill up quickly. The highlight for most visitors is the parade on the last day, {5} hundreds of people dress up in traditional costumes. Don't miss {6}!`,
    gaps: [['for'], ['ago'], ['to'], ['as', 'because', 'since'], ['when'], ['it']],
  },
  {
    id: 'u2_b2_interview', exam: 'b2first', lvl: 4, title: 'My first job interview',
    text: `I'll never forget my first job interview. I had spent {1} whole weekend preparing, but as {2} as I walked into the room, my mind went blank. The manager, {3} was very kind, offered me a glass of water and told me to take my time. Little {4} little, I started to relax. I explained why I wanted the job and talked about the experience I had gained {5} working in my uncle's shop. {6} the end of the interview, I felt much more confident. A week later, they called to say I had got the job. Since {7}, I have learnt that being nervous is normal; what matters is {8} you handle it.`,
    gaps: [['the'], ['soon'], ['who'], ['by'], ['by', 'while', 'from', 'through', 'when'], ['at', 'by', 'towards'], ['then'], ['how']],
  },
  {
    id: 'u2_b2_lists', exam: 'b2first', lvl: 4, title: 'Why we love lists',
    text: `Have you ever noticed how {1} people enjoy making lists? Psychologists believe there is a good reason {2} this. Writing tasks down frees our brain {3} having to remember everything, which reduces stress. What is {4}, ticking items off gives us a small sense of achievement. {5}, lists can also become a problem. Some people spend so {6} time organising their tasks that they never actually do them. The trick is to keep the list short and to focus on the tasks that really matter, {7} than trying to do everything at {8}.`,
    gaps: [['many', 'much'], ['for'], ['from'], ['more'], ['however', 'nevertheless', 'still'], ['much'], ['rather'], ['once']],
  },
  {
    id: 'u2_c1_curiosity', exam: 'c1adv', lvl: 5, title: 'Curiosity',
    text: `Curiosity is often described as the engine of learning. Children ask hundreds of questions a day, but {1} they grow older, many of them stop. Some researchers believe this is {2} to school systems that reward correct answers rather {3} interesting questions. {4} this is true or not, there is evidence that curious adults learn faster and remember more. In one experiment, participants {5} were curious about a topic were better at recalling unrelated information presented at the same time. It seems that curiosity puts the brain into a state in {6} it is ready to absorb whatever comes {7} way. The good news is that curiosity can be trained, {8} as any other skill can.`,
    gaps: [['as'], ['due', 'down', 'owing'], ['than'], ['whether'], ['who', 'that'], ['which'], ['its'], ['just']],
  },
];

// ---------- Use of English 3: word formation ----------
export const UOE3 = [
  {
    id: 'u3_b2_volunteer', exam: 'b2first', lvl: 4, title: 'Volunteering abroad',
    text: `Every year, thousands of young people decide to spend a few months working {1} abroad. For many of them, the experience is {2}: they learn about other cultures, develop new skills and gain a great deal of {3}. However, organisations warn that not all programmes are {4}. Some charge high fees but offer little {5} once volunteers arrive. Before signing up, it is {6} to read reviews from previous participants and to check the organisation's {7}. With careful {8}, volunteering can be one of the most rewarding things you ever do.`,
    gaps: [
      { stem: 'VOLUNTARY', answers: ['voluntarily'] },
      { stem: 'FORGET', answers: ['unforgettable'] },
      { stem: 'CONFIDENT', answers: ['confidence'] },
      { stem: 'RELY', answers: ['reliable'] },
      { stem: 'SUPERVISE', answers: ['supervision'] },
      { stem: 'ADVICE', answers: ['advisable'] },
      { stem: 'QUALIFY', answers: ['qualifications'] },
      { stem: 'PREPARE', answers: ['preparation'] },
    ],
  },
  {
    id: 'u3_b2_sleep', exam: 'b2first', lvl: 4, title: 'Social media and sleep',
    text: `A recent study has shown a clear {1} between social media use and poor sleep among teenagers. Researchers found that those who checked their phones late at night were {2} more likely to wake up tired. The {3} of the screen is partly to blame, but the main problem seems to be the {4} caused by notifications. Many parents feel {5} when it comes to limiting screen time. Experts recommend setting clear rules and offering {6} alternatives, such as reading or sport. {7}, small changes can make a big difference: even turning off notifications an hour before bed can lead to a noticeable {8}.`,
    gaps: [
      { stem: 'CONNECT', answers: ['connection'] },
      { stem: 'SIGNIFICANT', answers: ['significantly'] },
      { stem: 'BRIGHT', answers: ['brightness'] },
      { stem: 'EXCITE', answers: ['excitement'] },
      { stem: 'HELP', answers: ['helpless'] },
      { stem: 'ATTRACT', answers: ['attractive'] },
      { stem: 'FORTUNATE', answers: ['fortunately'] },
      { stem: 'IMPROVE', answers: ['improvement'] },
    ],
  },
  {
    id: 'u3_c1_ai', exam: 'c1adv', lvl: 5, title: 'Working with AI',
    text: `The {1} of artificial intelligence into the workplace has been met with a mixture of excitement and {2}. Some fear that machines will make many roles {3}, while others see new opportunities. What seems {4} is that the skills employers value are changing. {5}, critical thinking and emotional intelligence are increasingly in demand, as these are areas where machines remain {6} weak. Companies that invest in their {7} are likely to benefit most. In the end, {8} may prove to be the most important skill of all.`,
    gaps: [
      { stem: 'INTRODUCE', answers: ['introduction'] },
      { stem: 'EASY', answers: ['unease', 'uneasiness'] },
      { stem: 'REDUNDANCY', answers: ['redundant'] },
      { stem: 'DENY', answers: ['undeniable'] },
      { stem: 'CREATE', answers: ['creativity'] },
      { stem: 'COMPARE', answers: ['comparatively'] },
      { stem: 'EMPLOY', answers: ['employees', 'staff'] },
      { stem: 'ADAPT', answers: ['adaptability'] },
    ],
  },
];

// ---------- Use of English 4: key word transformations ----------
// [examen, frase 1, palabra clave, antes del hueco, después del hueco, respuestas válidas]
const kwt = [
  ['b2first', 'The last time I saw Maria was three years ago.', 'SEEN', 'I', 'three years.', ["haven't seen Maria for"]],
  ['b2first', 'It wasn\'t necessary for you to bring a present.', 'NEED', 'You', 'a present.', ["didn't need to bring", "needn't have brought"]],
  ['b2first', 'I\'d prefer to stay at home tonight.', 'RATHER', 'I', 'at home tonight.', ['would rather stay']],
  ['b2first', 'People say the company is planning to close the factory.', 'SAID', 'The company', 'planning to close the factory.', ['is said to be']],
  ['b2first', 'Although it was raining, we went for a walk.', 'DESPITE', 'We went for a walk', 'raining.', ['despite it being', 'despite the fact it was']],
  ['b2first', 'Someone stole my bike last night.', 'HAD', 'I', 'last night.', ['had my bike stolen']],
  ['b2first', 'It\'s a pity I didn\'t study harder for the exam.', 'WISH', 'I', 'harder for the exam.', ['wish I had studied']],
  ['b2first', 'Paul is too young to drive a car.', 'ENOUGH', 'Paul', 'drive a car.', ["isn't old enough to"]],
  ['b2first', '\'Don\'t forget to call me,\' my mother said.', 'REMINDED', 'My mother', 'her.', ['reminded me to call']],
  ['b2first', 'We couldn\'t go out because of the storm.', 'PREVENTED', 'The storm', 'out.', ['prevented us from going']],
  ['b2first', 'I\'m sure he didn\'t take your keys.', "CAN'T", 'He', 'your keys.', ["can't have taken"]],
  ['b2first', 'This is the best film I\'ve ever seen.', 'NEVER', 'I', 'a better film.', ['have never seen']],
  ['b2first', 'It took me two hours to finish the report.', 'SPENT', 'I', 'the report.', ['spent two hours finishing', 'spent two hours on', 'spent two hours writing']],
  ['b2first', 'They will announce the results tomorrow.', 'BE', 'The results', 'tomorrow.', ['will be announced']],
  ['b2first', 'I didn\'t go to the party because I was ill.', 'IF', 'I would have gone to the party', 'ill.', ["if I hadn't been"]],
  ['b2first', 'Do you mind if I open the window?', 'OBJECT', 'Do you', 'the window?', ['object to me opening', 'object to my opening']],
  ['c1adv', 'As soon as I arrived, it started to rain.', 'SOONER', 'No', 'it started to rain.', ['sooner had I arrived than']],
  ['c1adv', 'People believe the painting was stolen in 1990.', 'BELIEVED', 'The painting', 'in 1990.', ['is believed to have been stolen']],
  ['c1adv', 'The meeting was cancelled because the manager was ill.', 'CALLED', 'The meeting', 'the manager\'s illness.', ['was called off because of', 'was called off due to', 'was called off owing to']],
  ['c1adv', 'I\'m not used to working at night.', 'ACCUSTOMED', 'I\'m', 'at night.', ['not accustomed to working']],
  ['c1adv', 'There was no way we could have predicted the result.', 'POSSIBLY', 'We', 'the result.', ["couldn't possibly have predicted"]],
  ['c1adv', 'He regrets not taking the job.', 'WISHES', 'He', 'the job.', ['wishes he had taken']],
  ['c1adv', 'The concert was so popular that tickets sold out in minutes.', 'SUCH', 'It', 'that tickets sold out in minutes.', ['was such a popular concert']],
  ['c1adv', 'They made him wait for an hour.', 'MADE', 'He', 'for an hour.', ['was made to wait']],
];
export const UOE4 = kwt.map(([exam, s1, key, before, after, answers]) => ({
  id: 'u4_' + (before + key + after).toLowerCase().replace(/[^a-z]+/g, '').slice(0, 30),
  exam, lvl: exam === 'c1adv' ? 5 : 4, s1, key, before, after, answers,
}));

// ---------- Listening: extractos cortos (los lee la voz del móvil) ----------
// [examen, transcripción, pregunta, opciones (la primera es la correcta)]
const listen = [
  ['a2key', 'The shop opens at nine o\'clock from Monday to Friday, but on Saturday it opens an hour later, at ten.',
    'What time does the shop open on Saturday?', ['At ten', 'At nine', 'At eleven']],
  ['a2key', 'I usually go to work by bus, but today it was raining, so my brother took me in his car.',
    'How did the woman get to work today?', ['By car', 'By bus', 'On foot']],
  ['a2key', 'For my birthday, my parents gave me a new bike. My sister gave me a book, but I haven\'t read it yet.',
    'What did the boy get from his parents?', ['A bike', 'A book', 'A phone']],
  ['a2key', 'The doctor can see you tomorrow afternoon at half past three. Please arrive ten minutes early.',
    'When is the appointment?', ['Tomorrow at 3.30', 'Tomorrow at 3.20', 'Today at 3.30']],
  ['a2key', 'We wanted to go to the beach on Sunday, but it was too cold, so we went to the cinema instead.',
    'Where did they go on Sunday?', ['To the cinema', 'To the beach', 'To a restaurant']],
  ['a2key', 'The T-shirts are twelve pounds each, but if you buy two, you only pay twenty pounds.',
    'How much do two T-shirts cost?', ['Twenty pounds', 'Twelve pounds', 'Twenty-four pounds']],
  ['b1prelim', 'I was going to study medicine, but after working in a hospital for a summer, I realised I preferred working with computers. So now I\'m doing a degree in software engineering.',
    'What is the man studying now?', ['Software engineering', 'Medicine', 'Nursing']],
  ['b1prelim', 'The meeting was planned for Tuesday, but half the team will be at a conference, so we\'ve moved it to Thursday morning.',
    'Why has the meeting been moved?', ['Many people will be away on Tuesday', 'The room is not available', 'The manager is ill']],
  ['b1prelim', 'The flat is lovely and the rent is reasonable. The only problem is that it\'s a long way from the station, so I\'d need to buy a bike.',
    'What is the problem with the flat?', ['Its location', 'The rent', 'The size']],
  ['b1prelim', 'Swimming lessons for adults start next week. They\'re on Monday and Wednesday evenings, and the first lesson is free if you sign up before Friday.',
    'How can you get a free lesson?', ['By registering before Friday', 'By coming on Monday', 'By bringing a friend']],
  ['b1prelim', 'I didn\'t enjoy the film as much as I expected. The actors were great, but it was far too long and the ending was disappointing.',
    'What did the woman like about the film?', ['The acting', 'The length', 'The ending']],
  ['b1prelim', 'If you\'re travelling to the airport, take the express train. It\'s a bit more expensive than the bus, but it only takes twenty minutes and runs every quarter of an hour.',
    'Why does the speaker recommend the train?', ['It is faster', 'It is cheaper', 'It runs all night']],
  ['b2first', 'I was going to take the train to the conference, but there\'s a strike on Thursday, so I\'ve booked a flight instead. It\'s more expensive, but at least I\'ll get there on time.',
    'Why did the woman change her travel plans?', ['Because of a strike', 'Because flights were cheaper', 'Because the conference moved']],
  ['b2first', 'Honestly, I expected the course to be much harder. The teacher explained everything clearly, and the homework was manageable. My only complaint is that the classes started so early in the morning.',
    'What did the speaker dislike about the course?', ['The time of the classes', 'How difficult it was', 'The teacher']],
  ['b2first', 'We were supposed to launch the new website on Monday, but the design team found a few problems with the mobile version. Rather than release something that doesn\'t work properly, we\'ve decided to wait another two weeks.',
    'Why has the launch been delayed?', ['There are problems with the mobile version', 'The design team is on holiday', 'Monday is a public holiday']],
  ['b2first', 'If you\'re interested in volunteering, the best thing to do is come along to our open evening next Wednesday. You don\'t need to sign up in advance, but please bring some form of identification.',
    'What must people do to attend the open evening?', ['Bring identification', 'Register in advance', 'Pay a small fee']],
  ['b2first', 'I\'ve been playing tennis for years, but recently I\'ve taken up running. It\'s not that I\'ve lost interest in tennis. It\'s just much easier to fit a run into my busy schedule.',
    'Why has the speaker started running?', ['It is more convenient', 'He is bored of tennis', 'A doctor recommended it']],
  ['b2first', 'The museum is usually free, but the new photography exhibition costs eight pounds. Students get a fifty percent discount if they show their card at the entrance.',
    'How much does a student pay for the exhibition?', ['Four pounds', 'Eight pounds', 'Nothing']],
  ['b2first', 'I applied for the job mainly because of the salary, to be honest. But what has kept me here for five years is the people. I\'ve never worked with such a supportive team.',
    'What does the speaker value most about the job now?', ['Her colleagues', 'The salary', 'The location']],
  ['c1adv', 'What struck me most about the book wasn\'t the plot, which was fairly predictable, but the way the author managed to make such unlikeable characters so compelling. By the end, I found myself sympathising with people I\'d have avoided in real life.',
    'What impressed the speaker about the book?', ['The way the characters were written', 'The surprising plot', 'The happy ending']],
  ['c1adv', 'People often assume that moving to the countryside will slow life down. In my experience, the opposite was true. Without public transport, everything required planning, and I spent far more time in the car than I ever had in the city.',
    'What does the speaker say about living in the countryside?', ['It was more demanding than expected', 'It was as relaxing as expected', 'It was cheaper than the city']],
  ['c1adv', 'The funding was approved in principle, but with one condition: the team had to demonstrate measurable results within the first six months. Otherwise, the project would be reviewed and possibly shut down.',
    'What was the condition for the funding?', ['Showing results within six months', 'Hiring more staff', 'Reducing costs by half']],
  ['c1adv', 'I\'d always considered myself a confident speaker, so the feedback came as a shock. Apparently, I talked too fast and rarely paused to check whether the audience was following. It was hard to hear, but it\'s made me a much better presenter.',
    'How does the speaker feel about the feedback now?', ['It was useful', 'It was unfair', 'It was confusing']],
];
export const LISTEN = listen.map(([exam, script, q, options], i) => ({
  id: 'l_' + exam + '_' + q.toLowerCase().replace(/[^a-z]+/g, '').slice(0, 24),
  exam, lvl: EXAMS[exam].lvl, script, q, options, answer: 0,
}));

// ---------- Speaking Part 1 (entrevista) ----------
export const SPEAK_QUESTIONS = [
  ['a2key', 'What\'s your name, and where do you live?'],
  ['a2key', 'What do you like doing at the weekend?'],
  ['a2key', 'Tell me about your family.'],
  ['a2key', 'What did you do yesterday evening?'],
  ['a2key', 'What is your favourite food? Why?'],
  ['a2key', 'How do you get to school or work?'],
  ['a2key', 'What do you like about your town?'],
  ['a2key', 'Tell me about your best friend.'],
  ['b1prelim', 'Tell me about a place you would like to visit, and why.'],
  ['b1prelim', 'What do you enjoy doing with your friends?'],
  ['b1prelim', 'Do you prefer watching films at home or at the cinema? Why?'],
  ['b1prelim', 'Tell me about the last time you learnt something new.'],
  ['b1prelim', 'What kind of job would you like to have in the future?'],
  ['b1prelim', 'Is it better to live in a big city or a small town? Why?'],
  ['b1prelim', 'How do you usually spend your holidays?'],
  ['b1prelim', 'Tell me about a person you admire.'],
  ['b2first', 'Where are you from, and what do you like about living there?'],
  ['b2first', 'What do you usually do in your free time?'],
  ['b2first', 'Do you prefer studying alone or with other people? Why?'],
  ['b2first', 'Tell us about a job you would like to do in the future.'],
  ['b2first', 'How important is it for you to speak English well?'],
  ['b2first', 'What did you do last weekend?'],
  ['b2first', 'Would you rather live in a city or in the countryside? Why?'],
  ['b2first', 'Tell us about a teacher who has influenced you.'],
  ['b2first', 'Do you think you spend too much time on your phone?'],
  ['c1adv', 'How do you think technology will change the way people work in the future?'],
  ['c1adv', 'What are the advantages and disadvantages of working from home?'],
  ['c1adv', 'Is it more important to enjoy your job or to earn a good salary?'],
].map(([exam, q]) => ({ id: 'sp_' + q.toLowerCase().replace(/[^a-z]+/g, '').slice(0, 28), exam, lvl: EXAMS[exam].lvl, q }));

// ---------- Writing (autoevaluación con checklist) ----------
export const WRITING = [
  {
    id: 'w_a2_email_cinema', exam: 'a2key', type: 'Email', min: 25, max: 60,
    task: `You want to go to the cinema with your English friend Alex this weekend.

Write an email to Alex. In your email:
• say which film you want to see
• say when you want to go
• say where you will meet

Write 25 words or more.`,
    phrases: ['Hi Alex,', 'Do you want to …?', 'Let\'s meet at …', 'How about Saturday?', 'See you soon!'],
  },
  {
    id: 'w_a2_story_dog', exam: 'a2key', type: 'Story', min: 35, max: 80,
    task: `Write a story.

Last Saturday, a girl called Mia was walking in the park when she found a small dog. It was alone and looked hungry.

Write what happened next. Write 35 words or more.`,
    phrases: ['First, …', 'Then, …', 'After that, …', 'In the end, …', 'She was very happy because …'],
  },
  {
    id: 'w_b1_email_visit', exam: 'b1prelim', type: 'Email', min: 90, max: 120,
    task: `You have received this email from your English friend Chris:

"I'm coming to your town next month for three days! What do you think I should see? Which is better for getting around, the bus or a bike? And can we meet one evening?"

Write your email to Chris, answering all the questions. Write about 100 words.`,
    phrases: ['Great news that you\'re coming!', 'You really should visit …', 'I\'d recommend … because …', 'What about meeting on …?', 'Can\'t wait to see you!'],
  },
  {
    id: 'w_b1_article_day', exam: 'b1prelim', type: 'Article', min: 90, max: 120,
    task: `You see this notice in an English-language magazine:

ARTICLES WANTED! The best day of my life
What happened? Who were you with? Why was it so special?

Write your article. Write about 100 words.`,
    phrases: ['I\'ll never forget the day when …', 'It all started when …', 'What made it so special was …', 'Looking back, …', 'It was definitely the best day of my life.'],
  },
  {
    id: 'w_b1_story_door', exam: 'b1prelim', type: 'Story', min: 90, max: 120,
    task: `Your English teacher has asked you to write a story.

Your story must begin with this sentence:
"When I opened the door, I couldn't believe my eyes."

Write your story. Write about 100 words.`,
    phrases: ['At first, I thought …', 'Suddenly, …', 'I couldn\'t believe that …', 'Just then, …', 'Since that day, …'],
  },
  {
    id: 'w_b2_essay_company', exam: 'b2first', type: 'Essay', min: 140, max: 190,
    task: `In your English class you have been talking about work. Now your teacher has asked you to write an essay.

"Is it better to work for a large company or a small one?"

Notes — write about:
1. career opportunities
2. the working atmosphere
3. ........ (your own idea)`,
    phrases: ['In my view, …', 'On the one hand, … On the other hand, …', 'Another important factor is …', 'For instance, …', 'All things considered, …'],
  },
  {
    id: 'w_b2_email_friend', exam: 'b2first', type: 'Email', min: 140, max: 190,
    task: `You have received this email from your English-speaking friend Sam:

"I'm thinking of spending the summer in Spain to improve my Spanish. Would you recommend doing a course or living with a family? And what should I do in my free time?"

Write your email to Sam.`,
    phrases: ['It was great to hear from you!', 'If I were you, I would …', 'You should definitely …', 'Another option would be to …', 'Let me know what you decide!'],
  },
  {
    id: 'w_b2_essay_tech', exam: 'b2first', type: 'Essay', min: 140, max: 190,
    task: `Your teacher has asked you to write an essay.

"Has technology made our lives less stressful?"

Notes — write about:
1. communication
2. work
3. ........ (your own idea)`,
    phrases: ['It is often said that …', 'Moreover, …', 'However, it could be argued that …', 'As a result, …', 'To sum up, …'],
  },
  {
    id: 'w_c1_essay_health', exam: 'c1adv', type: 'Essay', min: 220, max: 260,
    task: `Your class has watched a discussion about how governments can encourage people to lead healthier lives. Your teacher has asked you to write an essay.

Discuss TWO of the methods below. Explain which method you think is more effective, giving reasons.

• public information campaigns
• taxes on unhealthy food
• free sports facilities`,
    phrases: ['It is widely acknowledged that …', 'A compelling argument in favour of … is that …', 'That said, …', 'This is not to suggest that …', 'On balance, I would argue that …'],
  },
];

export const WRITING_CHECKLIST = [
  'He respondido a todos los puntos de la tarea',
  'He organizado el texto en párrafos (introducción, desarrollo, conclusión)',
  'He usado conectores variados (however, moreover, as a result…)',
  'He usado estructuras variadas (condicionales, pasiva, relativas…)',
  'El tono (formal o informal) es el adecuado para el lector',
  'He revisado ortografía, tiempos verbales y concordancias',
];

export const WRITING_CHECKLIST_A2 = [
  'He respondido a todos los puntos de la tarea',
  'He escrito frases completas y claras',
  'He empezado y terminado bien (Hi…, See you soon…)',
  'He usado conectores sencillos (and, but, because, then…)',
  'He revisado los tiempos verbales y la ortografía',
];

export const SPEAK_CHECKLIST = [
  'He respondido directamente a la pregunta',
  'He dado una razón o un ejemplo',
  'He hablado con varias frases, no una sola',
];
