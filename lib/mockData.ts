export interface Student {
  id: string;
  name: string;
  displayName: string;
  branch: string;
  batchYear: string;
  hometown: string;
  bio: string;
  photoUrl: string;
  instagramHandle?: string;
  clubs: string[];
  funFact: string;
}

export interface Club {
  id: string;
  name: string;
  category: string;
  description: string;
  logoEmoji: string;
  instagramHandle?: string;
  joinLink?: string;
  memberCount: number;
  tags: string[];
}

export const BRANCHES = ['CSE', 'ECE', 'AIDE'];
export const BATCH_YEARS = ['2027', '2028', '2029'];
export const CLUB_CATEGORIES = ['Technical', 'Cultural', 'Sports', 'Social', 'Literary', 'Music'];

const BRANCH_COLORS: Record<string, string> = {
  CSE: 'badge-blue',
  ECE: 'badge-purple',
  AIDE: 'badge-warm',
};

export function getBranchColor(branch: string): string {
  return BRANCH_COLORS[branch] ?? 'badge-green';
}

export const MOCK_STUDENTS: Student[] = [
  {
    id: '1',
    name: 'Aarav Mehta',
    displayName: 'Aarav',
    branch: 'CSE',
    batchYear: '2028',
    hometown: 'Mumbai',
    bio: 'Competitive programmer by day, chai philosopher by night. I love building random projects and arguing about tabs vs spaces. Currently breaking production servers for fun.',
    photoUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aarav&backgroundColor=b6e3f4',
    instagramHandle: 'aarav.codes',
    clubs: ['Coding Club', 'Robotics Club'],
    funFact: 'I can solve a Rubik\'s cube in under 2 minutes.'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    displayName: 'Priya',
    branch: 'ECE',
    batchYear: '2028',
    hometown: 'Delhi',
    bio: 'Electronics enthusiast obsessed with IoT gadgets. When not soldering circuits, I\'m sketching UI designs or hunting for the best street food around campus.',
    photoUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Priya&backgroundColor=ffdfbf',
    instagramHandle: 'priya.ece',
    clubs: ['Electronics Society', 'Design Studio'],
    funFact: 'I built a smart plant watering system for my mom\'s garden.'
  },
  {
    id: '3',
    name: 'Rohan Singh',
    displayName: 'Rohan',
    branch: 'ME',
    batchYear: '2027',
    hometown: 'Jaipur',
    bio: 'Mechanical wizard who believes every problem can be fixed with enough WD-40. Formula Student team member. Loves Rajasthani folk music and pretends to understand thermodynamics.',
    photoUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Rohan&backgroundColor=c0aede',
    instagramHandle: 'rohan_mech',
    clubs: ['Formula Student', 'Music Society'],
    funFact: 'I can change a car tyre in 45 seconds flat.'
  },
  {
    id: '4',
    name: 'Sneha Patel',
    displayName: 'Sneha',
    branch: 'IT',
    batchYear: '2028',
    hometown: 'Ahmedabad',
    bio: 'Full-stack developer who loves turning caffeine into code. I volunteer at local NGOs and run a small Instagram page teaching Python to high school kids. Ask me about React.',
    photoUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sneha&backgroundColor=d1d4f9',
    instagramHandle: 'sneha.dev',
    clubs: ['Coding Club', 'NSS'],
    funFact: 'I have read every Harry Potter book at least 7 times.'
  },
  {
    id: '5',
    name: 'Karan Gupta',
    displayName: 'Karan',
    branch: 'CE',
    batchYear: '2027',
    hometown: 'Lucknow',
    bio: 'Civil engineer by degree, photographer by heart. I document construction sites through my lens and make surprisingly aesthetic Instagram reels about buildings.',
    photoUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Karan&backgroundColor=b6e3f4',
    instagramHandle: 'karan.construct',
    clubs: ['Photography Club', 'NSS'],
    funFact: 'I have visited 18 states in India, all for architectural photography.'
  },
  {
    id: '6',
    name: 'Ananya Krishnan',
    displayName: 'Ananya',
    branch: 'BT',
    batchYear: '2028',
    hometown: 'Chennai',
    bio: 'Biotech nerd who dreams of CRISPR-ing diseases out of existence. Part-time Carnatic singer and full-time coffee addict. Also writes science fiction short stories.',
    photoUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ananya&backgroundColor=ffdfbf',
    instagramHandle: 'ananya.bio',
    clubs: ['Biotech Society', 'Music Society', 'Literary Club'],
    funFact: 'I once accidentally grew a surprisingly beautiful fungus in the lab.'
  },
  {
    id: '7',
    name: 'Dev Thakur',
    displayName: 'Dev',
    branch: 'EE',
    batchYear: '2029',
    hometown: 'Chandigarh',
    bio: 'Power systems enthusiast by day, Valorant strategist by night. I\'m passionate about renewable energy and have a weird obsession with Tesla coils.',
    photoUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Dev&backgroundColor=c0aede',
    instagramHandle: 'dev_electrical',
    clubs: ['Electronics Society', 'Gaming Club'],
    funFact: 'I built a working Jacob\'s Ladder for the science fair in class 11.'
  },
  {
    id: '8',
    name: 'Ishita Roy',
    displayName: 'Ishita',
    branch: 'CSE',
    batchYear: '2027',
    hometown: 'Kolkata',
    bio: 'Machine learning researcher in the making. I cry over training loss curves and laugh at NaN errors. When not training models, I\'m either dancing Bharatanatyam or reading Bengali literature.',
    photoUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ishita&backgroundColor=d1d4f9',
    instagramHandle: 'ishita.ml',
    clubs: ['AI/ML Club', 'Dance Club'],
    funFact: 'I can write basic Python blindfolded (tried it once as a dare).'
  },
  {
    id: '9',
    name: 'Arjun Nair',
    displayName: 'Arjun',
    branch: 'ME',
    batchYear: '2028',
    hometown: 'Kochi',
    bio: 'CAD design geek and football fanatic. I design mechanical parts for fun and spend weekends playing 5-a-side. Huge fan of spicy Kerala food and terrible puns.',
    photoUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Arjun&backgroundColor=b6e3f4',
    instagramHandle: 'arjun.nair',
    clubs: ['Formula Student', 'Sports Club'],
    funFact: 'I can name every FIFA World Cup winner since 1930.'
  },
  {
    id: '10',
    name: 'Meera Joshi',
    displayName: 'Meera',
    branch: 'ECE',
    batchYear: '2029',
    hometown: 'Pune',
    bio: 'Embedded systems lover who talks to microcontrollers more than people. I run a study group for freshers every semester and mentor high school girls in STEM.',
    photoUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Meera&backgroundColor=ffdfbf',
    instagramHandle: 'meera.ece',
    clubs: ['Robotics Club', 'NSS'],
    funFact: 'My first Arduino project was a completely unnecessary automatic pillow fan.'
  },
  {
    id: '11',
    name: 'Sahil Kapoor',
    displayName: 'Sahil',
    branch: 'IT',
    batchYear: '2027',
    hometown: 'Amritsar',
    bio: 'UX designer and coffee shop hunter. I believe every app deserves a gorgeous design and every chai deserves a biscuit. Also co-founded the college\'s first design workshop.',
    photoUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sahil&backgroundColor=c0aede',
    instagramHandle: 'sahil.designs',
    clubs: ['Design Studio', 'Entrepreneurship Cell'],
    funFact: 'I have a spreadsheet ranking every chai stall within 2 km of campus.'
  },
  {
    id: '12',
    name: 'Lavanya Reddy',
    displayName: 'Lavanya',
    branch: 'CSE',
    batchYear: '2029',
    hometown: 'Hyderabad',
    bio: 'Cybersecurity enthusiast who loves CTF challenges and ethical hacking. I play chess competitively and believe that patience is the greatest superpower.',
    photoUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Lavanya&backgroundColor=d1d4f9',
    instagramHandle: 'lavanya.sec',
    clubs: ['Coding Club', 'Chess Club'],
    funFact: 'I once stayed up 48 hours straight to finish a hackathon — and won.'
  },
  {
    id: '13',
    name: 'Yash Dubey',
    displayName: 'Yash',
    branch: 'CE',
    batchYear: '2028',
    hometown: 'Bhopal',
    bio: 'Structural engineer who secretly wants to be a chef. I cook elaborate Madhya Pradesh dishes in a rice cooker in my hostel room. Don\'t tell the warden.',
    photoUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Yash&backgroundColor=b6e3f4',
    instagramHandle: 'yash.civil',
    clubs: ['NSS', 'Culinary Club'],
    funFact: 'I have a secret recipe for dal baati churma that\'s been in my family for 3 generations.'
  },
  {
    id: '14',
    name: 'Tarini Bose',
    displayName: 'Tarini',
    branch: 'BT',
    batchYear: '2027',
    hometown: 'Bhubaneswar',
    bio: 'Plant biotechnology researcher who also paints watercolors. I find the same patterns in cell structures and abstract art. Odissi dancer, bookworm, and occasional stand-up comedian.',
    photoUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Tarini&backgroundColor=ffdfbf',
    instagramHandle: 'tarini.art',
    clubs: ['Biotech Society', 'Dance Club', 'Fine Arts Club'],
    funFact: 'I performed Odissi at a national youth festival and came back to submit a lab report the same night.'
  },
  {
    id: '15',
    name: 'Nikhil Verma',
    displayName: 'Nikhil',
    branch: 'EE',
    batchYear: '2028',
    hometown: 'Varanasi',
    bio: 'Power electronics nerd who loves mixing tabla beats in his free time. I\'m equally passionate about spirituality, quantum mechanics, and cricket. Go Team India!',
    photoUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Nikhil&backgroundColor=c0aede',
    instagramHandle: 'nikhil.beats',
    clubs: ['Music Society', 'Sports Club'],
    funFact: 'I can play 3 musical instruments but still can\'t parallel park.'
  },
  {
    id: '16',
    name: 'Diya Menon',
    displayName: 'Diya',
    branch: 'ECE',
    batchYear: '2027',
    hometown: 'Thiruvananthapuram',
    bio: 'VLSI design enthusiast who moonlights as a quiz master. I\'ve won 12 quizzes in the past year, mostly about geography and film. Also obsessed with crosswords.',
    photoUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Diya&backgroundColor=d1d4f9',
    instagramHandle: 'diya.ece',
    clubs: ['Electronics Society', 'Quiz Club'],
    funFact: 'I can recite capitals of all 195 countries in under 4 minutes.'
  },
  {
    id: '17',
    name: 'Akshat Malhotra',
    displayName: 'Akshat',
    branch: 'CSE',
    batchYear: '2028',
    hometown: 'Gurugram',
    bio: 'Blockchain developer and startup dreamer. I\'ve built 3 side projects (2 failed spectacularly, 1 might actually work). Always looking for co-founders and good biryani.',
    photoUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Akshat&backgroundColor=b6e3f4',
    instagramHandle: 'akshat.web3',
    clubs: ['Entrepreneurship Cell', 'Coding Club'],
    funFact: 'I once mined cryptocurrency on the college Wi-Fi. It paid for exactly 1.5 meals.'
  },
  {
    id: '18',
    name: 'Shriya Agarwal',
    displayName: 'Shriya',
    branch: 'ME',
    batchYear: '2029',
    hometown: 'Agra',
    bio: 'Thermal engineering enthusiast and classical singer. I love Hindustani classical music and think fluid dynamics is secretly beautiful. Also a passionate Kathak dancer.',
    photoUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Shriya&backgroundColor=ffdfbf',
    instagramHandle: 'shriya.mech',
    clubs: ['Music Society', 'Dance Club'],
    funFact: 'I sang at the Taj Mahotsav festival last year in front of 5000 people.'
  },
  {
    id: '19',
    name: 'Kabir Chaudhary',
    displayName: 'Kabir',
    branch: 'IT',
    batchYear: '2027',
    hometown: 'Indore',
    bio: 'Backend engineer by trade, poet by soul. I write Urdu couplets in my notes app between debugging sessions. Masala chai and Sufi music are my coding fuel.',
    photoUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Kabir&backgroundColor=c0aede',
    instagramHandle: 'kabir.writes',
    clubs: ['Literary Club', 'Coding Club'],
    funFact: 'I have a handwritten notebook of over 200 original Urdu couplets.'
  },
  {
    id: '20',
    name: 'Riya Shah',
    displayName: 'Riya',
    branch: 'EE',
    batchYear: '2029',
    hometown: 'Surat',
    bio: 'Smart grid researcher who is also obsessed with origami. I believe the elegance of paper folding and circuit design come from the same mathematical soul.',
    photoUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Riya&backgroundColor=d1d4f9',
    instagramHandle: 'riya.origami',
    clubs: ['Electronics Society', 'Fine Arts Club'],
    funFact: 'I have folded over 1000 origami cranes. Legend says they grant a wish.'
  },
];

export const MOCK_CLUBS: Club[] = [
  {
    id: 'c1',
    name: 'Coding Club',
    category: 'Technical',
    description: 'Build, hack, and ship. Weekly coding sessions, competitive programming contests, and hackathons. From beginners to ICPC hopefuls — everyone welcome.',
    logoEmoji: '💻',
    instagramHandle: 'parichay_codingclub',
    joinLink: '#',
    memberCount: 142,
    tags: ['DSA', 'Web Dev', 'Competitive'],
  },
  {
    id: 'c2',
    name: 'Robotics Club',
    category: 'Technical',
    description: 'We build robots, drones, and autonomous systems. Participate in national robocon events and learn embedded systems, 3D printing, and computer vision.',
    logoEmoji: '🤖',
    instagramHandle: 'parichay_robotics',
    joinLink: '#',
    memberCount: 78,
    tags: ['Arduino', 'ROS', 'Hardware'],
  },
  {
    id: 'c3',
    name: 'AI/ML Club',
    category: 'Technical',
    description: 'Exploring artificial intelligence and machine learning. Paper reading sessions, Kaggle competitions, and workshops on PyTorch, TensorFlow, and data science.',
    logoEmoji: '🧠',
    instagramHandle: 'parichay_aiml',
    joinLink: '#',
    memberCount: 95,
    tags: ['Deep Learning', 'NLP', 'Kaggle'],
  },
  {
    id: 'c4',
    name: 'Music Society',
    category: 'Cultural',
    description: 'From Carnatic to EDM, classical to folk — our music society celebrates all genres. Perform at college fests, jam sessions, and inter-college competitions.',
    logoEmoji: '🎵',
    instagramHandle: 'parichay_music',
    joinLink: '#',
    memberCount: 110,
    tags: ['Vocals', 'Instruments', 'Fusion'],
  },
  {
    id: 'c5',
    name: 'Dance Club',
    category: 'Cultural',
    description: 'Classical, contemporary, hip-hop, folk — we celebrate movement in all forms. Perform at national youth festivals and represent the college across India.',
    logoEmoji: '💃',
    instagramHandle: 'parichay_dance',
    joinLink: '#',
    memberCount: 88,
    tags: ['Classical', 'Hip-hop', 'Bollywood'],
  },
  {
    id: 'c6',
    name: 'Photography Club',
    category: 'Literary',
    description: 'Lens artists capturing campus life, nature, and stories. Monthly photowalks, darkroom workshops, and an annual gallery exhibition. DSLR or phone — all welcome.',
    logoEmoji: '📷',
    instagramHandle: 'parichay_photo',
    joinLink: '#',
    memberCount: 65,
    tags: ['Portrait', 'Street', 'Editing'],
  },
  {
    id: 'c7',
    name: 'NSS',
    category: 'Social',
    description: 'National Service Scheme — dedicated to community outreach, village development camps, blood donation drives, and environmental initiatives. Serve before self.',
    logoEmoji: '🌱',
    instagramHandle: 'parichay_nss',
    joinLink: '#',
    memberCount: 200,
    tags: ['Community', 'Environment', 'Health'],
  },
  {
    id: 'c8',
    name: 'Entrepreneurship Cell',
    category: 'Technical',
    description: 'The startup launchpad of our college. We host investor talks, business plan competitions, and mentor student-led ventures. Idea to IPO — we have your back.',
    logoEmoji: '🚀',
    instagramHandle: 'parichay_ecell',
    joinLink: '#',
    memberCount: 120,
    tags: ['Startups', 'Pitching', 'Mentorship'],
  },
  {
    id: 'c9',
    name: 'Literary Club',
    category: 'Literary',
    description: 'For the readers, writers, debaters, and storytellers. Weekly book discussions, creative writing workshops, and the college magazine — Akshar. Words have power.',
    logoEmoji: '📚',
    instagramHandle: 'parichay_lit',
    joinLink: '#',
    memberCount: 72,
    tags: ['Poetry', 'Debate', 'Fiction'],
  },
  {
    id: 'c10',
    name: 'Sports Club',
    category: 'Sports',
    description: 'Representing the college in cricket, football, basketball, badminton, and athletics. Also organizes the annual inter-branch sports tournament — Pratispardha.',
    logoEmoji: '⚽',
    instagramHandle: 'parichay_sports',
    joinLink: '#',
    memberCount: 185,
    tags: ['Cricket', 'Football', 'Athletics'],
  },
];

export function getStudentById(id: string): Student | undefined {
  return MOCK_STUDENTS.find(s => s.id === id);
}

export function searchStudents(query: string, branch?: string, batch?: string, hometown?: string): Student[] {
  return MOCK_STUDENTS.filter(s => {
    const matchesQuery = !query || 
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.displayName.toLowerCase().includes(query.toLowerCase()) ||
      s.hometown.toLowerCase().includes(query.toLowerCase()) ||
      s.branch.toLowerCase().includes(query.toLowerCase());
    const matchesBranch = !branch || s.branch === branch;
    const matchesBatch = !batch || s.batchYear === batch;
    const matchesHometown = !hometown || s.hometown.toLowerCase().includes(hometown.toLowerCase());
    return matchesQuery && matchesBranch && matchesBatch && matchesHometown;
  });
}
