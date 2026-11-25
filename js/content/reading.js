// Textos de reading con preguntas de comprensión. Todo el contenido es original.
export const READING = [
  {
    id: 'r_first-day', lvl: 1, topic: 'work', title: 'My first day',
    text: `Hi, I'm Laura. Today is my first day at a new job. I work in a small office in the city centre. My team has five people. My boss is called Tom. He is very friendly. I start work at nine and finish at five. I have lunch with my colleagues at one o'clock. I am a little tired, but I am happy.`,
    questions: [
      { q: 'How many people are in Laura\'s team?', options: ['Five', 'Nine', 'One'], answer: 0 },
      { q: 'What time does she finish work?', options: ['At one', 'At nine', 'At five'], answer: 2 },
      { q: 'How does Laura feel?', options: ['Bored and sad', 'Tired but happy', 'Nervous and angry'], answer: 1 },
    ],
  },
  {
    id: 'r_music-routine', lvl: 1, topic: 'music', title: 'Music every day',
    text: `Dani loves music. He listens to songs every morning on the bus. His favourite band plays rock. He doesn't play an instrument, but he sings in the shower. On Saturdays, he goes to concerts with his friends. He learns English words from the lyrics of his favourite songs.`,
    questions: [
      { q: 'When does Dani listen to music?', options: ['On the bus in the morning', 'At work', 'Only at night'], answer: 0 },
      { q: 'Does Dani play an instrument?', options: ['Yes, the guitar', 'No', 'Yes, the piano'], answer: 1 },
      { q: 'How does he learn English words?', options: ['From films', 'From the lyrics', 'From books'], answer: 1 },
    ],
  },
  {
    id: 'r_email-meeting', lvl: 2, topic: 'work', title: 'An email from your manager',
    text: `Subject: Meeting tomorrow\n\nHi all,\n\nJust a quick reminder that we have our weekly meeting tomorrow at 10 a.m. in Room B. Please bring your sales numbers for last month. If you can't come, send me a short update by email before 9 a.m.\n\nThanks,\nSarah`,
    questions: [
      { q: 'Where is the meeting?', options: ['In Sarah\'s office', 'In Room B', 'Online'], answer: 1 },
      { q: 'What should people bring?', options: ['Last month\'s sales numbers', 'Their CV', 'Lunch'], answer: 0 },
      { q: 'What if you can\'t come?', options: ['Call Sarah', 'Do nothing', 'Send an update before 9 a.m.'], answer: 2 },
    ],
  },
  {
    id: 'r_job-ad-cafe', lvl: 2, topic: 'jobs', title: 'Job ad: Barista',
    text: `We're hiring! Part-time barista (20 hours a week)\n\nWe are a busy coffee shop in the city centre. We are looking for a friendly person to join our team.\n\nRequirements:\n• Some experience in a café or restaurant\n• Good communication skills\n• Basic English\n\nWe offer a good salary, free coffee and flexible hours. To apply, send your CV to jobs@example.com.`,
    questions: [
      { q: 'How many hours is the job?', options: ['40 hours a week', '20 hours a week', '20 hours a month'], answer: 1 },
      { q: 'Which is a requirement?', options: ['A university degree', 'Some experience in a café', 'Fluent German'], answer: 1 },
      { q: 'How do you apply?', options: ['By sending your CV', 'By calling the shop', 'In person only'], answer: 0 },
    ],
  },
  {
    id: 'r_job-ad-marketing', lvl: 3, topic: 'jobs', title: 'Job ad: Marketing Assistant',
    text: `Marketing Assistant – Hybrid (Madrid)\n\nAbout the role\nYou will support our marketing team with social media, email campaigns and market research. Reporting to the Marketing Manager, you will work with sales and design to launch new products.\n\nWhat you'll do\n• Create and schedule social media posts\n• Prepare weekly reports on campaign results\n• Help organise events and trade fairs\n\nWhat we're looking for\n• 1–2 years of experience in marketing\n• Fluent English (B2 or higher)\n• Good knowledge of Excel; experience with Canva is a plus\n\nWhat we offer\n• Hybrid model: 3 days in the office, 2 from home\n• Training budget and private health insurance`,
    questions: [
      { q: 'Who is the Marketing Assistant\'s boss?', options: ['The Sales Director', 'The Marketing Manager', 'The CEO'], answer: 1 },
      { q: 'What does "Canva is a plus" mean?', options: ['It is required', 'It is useful but not required', 'It is not allowed'], answer: 1 },
      { q: 'How many days a week are in the office?', options: ['Two', 'Five', 'Three'], answer: 2 },
      { q: 'What level of English do they ask for?', options: ['B2 or higher', 'Basic', 'Not mentioned'], answer: 0 },
    ],
  },
  {
    id: 'r_song-story', lvl: 3, topic: 'music', title: 'The story behind a song',
    text: `Many famous songs started as something small. A singer might hum a tune while walking, record it on her phone, and forget about it for months. Later, she hears it again and realises it could be the chorus of a hit. Songwriters often say that the lyrics come last: first they find a melody that feels right, and then they look for words that fit the rhythm. That's why some lyrics sound strange when you read them without music.`,
    questions: [
      { q: 'According to the text, what often comes first?', options: ['The lyrics', 'The melody', 'The music video'], answer: 1 },
      { q: 'Why can lyrics sound strange when you read them?', options: ['They are written to fit the rhythm', 'They are badly translated', 'They are always sad'], answer: 0 },
      { q: 'What does "hum a tune" mean?', options: ['Write a letter', 'Sing a melody with your mouth closed', 'Play the drums'], answer: 1 },
    ],
  },
  {
    id: 'r_remote-work', lvl: 3, topic: 'work', title: 'Is remote work here to stay?',
    text: `Since 2020, millions of people have started working from home. Many workers say they are more productive and happier without a long commute. However, some managers worry that teams lose contact and that new employees learn more slowly. As a result, many companies now use a hybrid model, where people come to the office two or three days a week. Experts believe this mix will remain the most common option in the coming years.`,
    questions: [
      { q: 'What is one advantage of remote work mentioned?', options: ['No long commute', 'Higher salaries', 'More meetings'], answer: 0 },
      { q: 'What do some managers worry about?', options: ['Office rent', 'Teams losing contact', 'Too many holidays'], answer: 1 },
      { q: 'What do experts believe?', options: ['Everyone will return to the office', 'The hybrid model will remain common', 'Remote work will disappear'], answer: 1 },
    ],
  },
  {
    id: 'r_job-ad-data', lvl: 4, topic: 'jobs', title: 'Job ad: Junior Data Analyst',
    text: `Junior Data Analyst – Fully Remote (EU)\n\nWe're a fast-paced fintech scaling across Europe, and we're looking for a curious self-starter to join our Analytics team.\n\nIn this role you will:\n• Build dashboards that help stakeholders make data-driven decisions\n• Work closely with cross-functional teams (Product, Marketing, Finance)\n• Take ownership of data quality and troubleshoot reporting issues\n\nMust have:\n• Proficiency in SQL and Excel\n• A background in Statistics, Economics or a related field\n• Professional working proficiency in English\n\nNice to have:\n• Hands-on experience with Python or Power BI\n\nWhat's in it for you: a competitive salary range (€32k–38k), a structured onboarding programme and a yearly learning budget.`,
    questions: [
      { q: 'What does "self-starter" describe?', options: ['Someone who needs constant supervision', 'Someone with initiative who works independently', 'A beginner with no experience'], answer: 1 },
      { q: 'Which skill is REQUIRED?', options: ['Python', 'Power BI', 'SQL'], answer: 2 },
      { q: '"Take ownership of data quality" means…', options: ['Buy the data', 'Be responsible for data quality', 'Ignore data errors'], answer: 1 },
      { q: 'What happens when you join?', options: ['A structured onboarding programme', 'A trial without pay', 'A move to the head office'], answer: 0 },
    ],
  },
  {
    id: 'r_feedback-culture', lvl: 4, topic: 'work', title: 'Giving feedback without hurting',
    text: `Giving feedback is one of the hardest skills at work. Many people either avoid it completely or are so direct that colleagues feel attacked. A useful approach is to focus on specific behaviour rather than personality. Instead of saying "You're disorganised", you might say "The report arrived two days after the deadline, and that affected the client presentation." This makes the problem concrete and easier to solve. Nevertheless, timing matters too: feedback given in private, soon after the event, tends to be far more effective than comments made weeks later in front of the whole team.`,
    questions: [
      { q: 'What does the text recommend focusing on?', options: ['Personality', 'Specific behaviour', 'The team\'s opinion'], answer: 1 },
      { q: 'When is feedback most effective?', options: ['In private and soon after', 'In public, weeks later', 'Only in annual reviews'], answer: 0 },
      { q: '"Nevertheless" in the text means…', options: ['Because of this', 'However / even so', 'For example'], answer: 1 },
    ],
  },
  {
    id: 'r_automation', lvl: 5, topic: 'tech', title: 'Automation and the future of jobs',
    text: `The debate over automation tends to swing between two extremes: either machines will render most jobs obsolete, or they will merely free us from tedious tasks. The reality is likely to be more nuanced. Historically, technology has displaced specific tasks rather than entire occupations, and new roles have emerged that would have been unimaginable a generation earlier. Nonetheless, the transition is rarely seamless. Workers whose skills are tied to routine activities may struggle to adapt unless employers and governments invest in retraining. The key question, then, is not whether jobs will change, but who will bear the cost of that change.`,
    questions: [
      { q: 'What does the author think about the two extreme views?', options: ['Both are fully correct', 'The reality is more complex', 'Only the first is correct'], answer: 1 },
      { q: 'Historically, technology has mainly displaced…', options: ['Entire occupations', 'Specific tasks', 'Governments'], answer: 1 },
      { q: 'According to the author, what is the key question?', options: ['Whether jobs will change', 'Who will pay for the transition', 'Which machines are best'], answer: 1 },
    ],
  },
];
