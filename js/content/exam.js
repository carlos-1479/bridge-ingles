// Contenido con el formato de los exámenes B2 First y C1 Advanced.
// Todo es material original: mismo tipo de tarea, no preguntas oficiales.
// En los textos, {n} marca el hueco n (empezando en 1).

export const EXAMS = {
  b2first: {
    id: 'b2first', name: 'B2 First', lvl: 4, pass: 160,
    // % de aciertos → escala Cambridge (aproximación orientativa)
    scale: [[0, 102], [0.45, 140], [0.6, 160], [0.75, 173], [0.8, 180], [1, 190]],
    grades: [[180, 'Grade A'], [173, 'Grade B'], [160, 'Grade C'], [140, 'Nivel B1'], [0, 'Por debajo de B1']],
  },
  c1adv: {
    id: 'c1adv', name: 'C1 Advanced', lvl: 5, pass: 180,
    scale: [[0, 122], [0.45, 160], [0.6, 180], [0.75, 193], [0.8, 200], [1, 210]],
    grades: [[200, 'Grade A'], [193, 'Grade B'], [180, 'Grade C'], [160, 'Nivel B2'], [0, 'Por debajo de B2']],
  },
};

// Partes del examen que la app entrena y evalúa.
// weight = puntos aproximados dentro de su prueba (paper).
export const PARTS = {
  uoe1: { paper: 'rue', name: 'Use of English 1', short: 'Multiple-choice cloze', weight: 8, skill: 'vocab',
    tip: 'Fíjate en colocaciones y en la preposición que va detrás del hueco (deal WITH, run THE RISK…).' },
  uoe2: { paper: 'rue', name: 'Use of English 2', short: 'Open cloze', weight: 8, skill: 'grammar',
    tip: 'Casi siempre falta una palabra gramatical: preposición, artículo, pronombre relativo o conector.' },
  uoe3: { paper: 'rue', name: 'Use of English 3', short: 'Word formation', weight: 8, skill: 'vocab',
    tip: 'Decide primero qué categoría pide el hueco (sustantivo, adjetivo, adverbio) y si es negativa o plural.' },
  uoe4: { paper: 'rue', name: 'Use of English 4', short: 'Key word transformations', weight: 12, skill: 'grammar',
    tip: 'No cambies la palabra clave y comprueba que la frase significa exactamente lo mismo.' },
  read: { paper: 'rue', name: 'Reading', short: 'Comprensión de textos', weight: 34, skill: 'reading',
    tip: 'Lee primero las preguntas y busca en el texto la idea, no la misma palabra: suelen usar sinónimos.' },
  write: { paper: 'writing', name: 'Writing', short: 'Essay, email, artículo…', weight: 1, skill: null,
    tip: 'Organiza en párrafos, responde a todos los puntos y usa conectores y estructuras variadas.' },
  listen: { paper: 'listening', name: 'Listening', short: 'Extractos y preguntas', weight: 1, skill: 'listening',
    tip: 'Lee la pregunta antes del audio y desconfía de la opción que repite palabras exactas: suele ser una trampa.' },
  speak: { paper: 'speaking', name: 'Speaking', short: 'Entrevista y opinión', weight: 1, skill: 'speaking',
    tip: 'No contestes con una frase: da una respuesta, una razón y un ejemplo.' },
};

export const PAPERS = {
  rue: 'Reading & Use of English', writing: 'Writing', listening: 'Listening', speaking: 'Speaking',
};

// ---------- Use of English 1: multiple-choice cloze ----------
export const UOE1 = [
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
  exam, lvl: exam === 'c1adv' ? 5 : 4, script, q, options, answer: 0,
}));

// ---------- Speaking Part 1 (entrevista) ----------
export const SPEAK_QUESTIONS = [
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
].map(([exam, q]) => ({ id: 'sp_' + q.toLowerCase().replace(/[^a-z]+/g, '').slice(0, 28), exam, lvl: exam === 'c1adv' ? 5 : 4, q }));

// ---------- Writing (autoevaluación con checklist) ----------
export const WRITING = [
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

export const SPEAK_CHECKLIST = [
  'He respondido directamente a la pregunta',
  'He dado una razón o un ejemplo',
  'He hablado con varias frases, no una sola',
];
