import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Data Definitions ──────────────────────────────────────────────────────────

const FACULTIES: Record<string, string[]> = {
  'Faculty of Engineering and Technology': [
    'Computer Engineering', 'Electrical Engineering', 'Civil Engineering',
    'Mechanical Engineering', 'Chemical Engineering', 'Telecommunications Engineering',
  ],
  'Faculty of Science': [
    'Computer Science', 'Biochemistry', 'Physics', 'Mathematics',
    'Chemistry', 'Biology', 'Statistics',
  ],
  'Faculty of Health Sciences': [
    'Nursing', 'Medicine', 'Pharmacy', 'Public Health',
    'Medical Laboratory Science', 'Physiotherapy',
  ],
  'Faculty of Humanities and Social Sciences': [
    'Economics', 'Journalism and Communication', 'Political Science',
    'Sociology', 'History', 'Geography', 'Philosophy',
  ],
  'School of Languages and Translation': [
    'Translation Studies', 'English Studies', 'French Studies', 'Linguistics',
  ],
  'Faculty of Law and Political Science': [
    'Law', 'International Relations', 'Public Administration',
  ],
  'Faculty of Agriculture': [
    'Agriculture', 'Agronomy', 'Animal Science', 'Forestry', 'Soil Science',
  ],
  'School of Education': [
    'Educational Psychology', 'Curriculum Studies', 'Physical Education', 'Early Childhood Education',
  ],
};

const ALL_FACULTIES = Object.keys(FACULTIES);

const FIRST_NAMES = [
  'Acha', 'Epie', 'Tanyi', 'Mbi', 'Nkwain', 'Bih', 'Fon', 'Ache', 'Kum', 'Awah',
  'Ndeh', 'Tiku', 'Fuh', 'Tabi', 'Nfor', 'Lum', 'Ngeh', 'Mbah', 'Che', 'Frika',
  'Samuel', 'Ruth', 'Emmanuel', 'Berenice', 'Victor', 'Priscilla', 'Fritz', 'Brandon',
  'Christabel', 'Fabrice', 'Nji', 'Wache', 'Keng', 'Wum', 'Deh', 'Tah', 'Nge', 'Tita',
  'Agbor', 'Ojong', 'Ekema', 'Ashu', 'Ebot', 'Mbeng', 'Ndukwe', 'Akum', 'Tambe',
  'Neba', 'Ngwa', 'Eko', 'Tabot', 'Ewang', 'Ako', 'Nsoh', 'Chuo', 'Elangwe', 'Ambe',
  'Azinwi', 'Banfogha', 'Beyang', 'Fokam', 'Galabe', 'Gwanmesia', 'Haman', 'Ita',
  'Jiki', 'Kwa', 'Lambi', 'Mfor', 'Ngong', 'Ntube', 'Oben', 'Pefok', 'Quaye', 'Rene',
  'Sama', 'Tchwenko', 'Uche', 'Viyoff', 'Wandji', 'Xaviere', 'Yimfor', 'Zeh',
  'Amina', 'Fatou', 'Chioma', 'Ifeoma', 'Chiamaka', 'Adaeze', 'Ngozi', 'Chidi',
  'Emeka', 'Kenechukwu', 'Tobechukwu', 'Ihechi', 'Uchenna', 'Nnamdi', 'Obinna',
];

const LAST_NAMES = [
  'Neba', 'Ndille', 'Ojong', 'Eke', 'Atabong', 'Verinyuy', 'Lum', 'Ngum', 'Ngwe',
  'Nkeng', 'Mbah', 'Tambe', 'Ngeh', 'Fomum', 'Akum', 'Ashu', 'Ebot', 'Ewang',
  'Agbor', 'Ekema', 'Ndukwe', 'Njikam', 'Mbongo', 'Nkwenti', 'Foncha', 'Galega',
  'Azinwi', 'Biyong', 'Chefor', 'Doh', 'Elango', 'Fonjong', 'Gwanmesia', 'Halle',
  'Itu', 'Jua', 'Kimbi', 'Leke', 'Mengong', 'Ndi', 'Orock', 'Pefok', 'Quallo',
  'Robea', 'Sama', 'Tchoffo', 'Udo', 'Vubo', 'Wanyam', 'Yaba', 'Zeh', 'Awa',
  'Bate', 'Cheka', 'Dinga', 'Ewi', 'Fai', 'Gah', 'Hamadjida', 'Ismaila',
  'Jatau', 'Karmo', 'Larba', 'Manga', 'Nana', 'Oumarou', 'Pebo', 'Ramat',
  'Saidou', 'Tagou', 'Usman', 'Vandi', 'Wase', 'Yaya', 'Zakari',
  'Okonkwo', 'Okafor', 'Eze', 'Nwosu', 'Igwe', 'Obi', 'Chukwu', 'Adeyemi',
  'Olawale', 'Babatunde', 'Adebayo', 'Ogundimu', 'Adesanya', 'Afolabi',
];

const RESOURCE_TITLES: Record<string, string[]> = {
  'Computer Engineering': [
    'Digital Logic Design — Past Paper', 'Microprocessor Systems — Lecture Notes',
    'Embedded Systems Programming', 'Computer Networks — Tutorial Video',
    'VLSI Design Principles', 'Operating Systems Past Exam', 'Computer Architecture Notes',
    'Signal Processing for Engineers', 'Database Systems Design', 'Software Engineering Methods',
    'Real-Time Systems', 'Computer Organization', 'Compiler Design Notes',
    'Mobile Computing — Lecture Series', 'Internet of Things Fundamentals',
    'Wireless Sensor Networks', 'Digital Signal Processing', 'GPU Programming',
    'Computer Security Essentials', 'Distributed Systems Architecture',
  ],
  'Electrical Engineering': [
    'Circuit Analysis — Past Paper 2023', 'Electromagnetic Field Theory',
    'Power Electronics Notes', 'Control Systems Tutorial', 'Electrical Machines',
    'High Voltage Engineering', 'Power Systems Analysis', 'Analog Electronics',
    'Digital Electronics Notes', 'Renewable Energy Systems',
    'Electric Drives', 'Protective Relays', 'Transformers and AC Machines',
    'Signals and Systems', 'Communication Systems Past Paper',
  ],
  'Civil Engineering': [
    'Structural Analysis Notes', 'Geotechnical Engineering', 'Fluid Mechanics Past Paper',
    'Construction Materials', 'Surveying and Geomatics', 'Reinforced Concrete Design',
    'Highway Engineering', 'Environmental Engineering', 'Water Resources Engineering',
    'Bridge Design Principles', 'Soil Mechanics', 'Steel Structures',
  ],
  'Computer Science': [
    'Algorithms and Data Structures', 'Machine Learning Introduction',
    'Artificial Intelligence Past Paper', 'Database Management Systems',
    'Computer Graphics Notes', 'Programming Languages', 'Software Testing',
    'Web Development Fundamentals', 'Cloud Computing', 'Cybersecurity Basics',
    'Natural Language Processing', 'Operating Systems Notes', 'Parallel Computing',
    'Big Data Analytics', 'Deep Learning Fundamentals',
  ],
  'Biochemistry': [
    'Molecular Biology Lecture', 'Metabolic Pathways Notes', 'Enzyme Kinetics',
    'Cell Biology Past Paper', 'Genetics and Genomics', 'Protein Structure',
    'Biochemical Techniques', 'Clinical Biochemistry', 'Immunology Basics',
    'Microbiology Notes', 'Bioinformatics Introduction', 'Biochemistry Lab Manual',
  ],
  'Physics': [
    'Classical Mechanics Notes', 'Quantum Physics Tutorial', 'Thermodynamics Past Paper',
    'Electromagnetism', 'Optics and Photonics', 'Nuclear Physics', 'Solid State Physics',
    'Mathematical Physics', 'Astrophysics Introduction', 'Particle Physics',
  ],
  'Mathematics': [
    'Real Analysis Notes', 'Linear Algebra Past Paper', 'Differential Equations',
    'Abstract Algebra', 'Numerical Methods', 'Complex Analysis', 'Probability Theory',
    'Mathematical Statistics', 'Topology Introduction', 'Graph Theory',
    'Optimization Methods', 'Fourier Analysis',
  ],
  'Chemistry': [
    'Organic Chemistry Notes', 'Inorganic Chemistry Past Paper', 'Physical Chemistry',
    'Analytical Chemistry', 'Spectroscopy Methods', 'Chemical Thermodynamics',
    'Polymer Chemistry', 'Environmental Chemistry', 'Electrochemistry',
  ],
  'Biology': [
    'Cell Biology Notes', 'Ecology and Evolution', 'Anatomy Past Paper',
    'Zoology Fundamentals', 'Botany Notes', 'Genetics Lecture', 'Physiology',
    'Marine Biology', 'Plant Biology', 'Developmental Biology',
  ],
  'Medicine': [
    'Clinical Medicine Notes', 'Pathology Past Paper', 'Pharmacology Lecture',
    'Human Anatomy Atlas', 'Medical Physiology', 'Diagnostic Medicine',
    'Surgery Principles', 'Internal Medicine', 'Paediatrics Notes', 'Obstetrics',
    'Emergency Medicine', 'Neurology Notes', 'Cardiology Fundamentals',
  ],
  'Nursing': [
    'Fundamentals of Nursing', 'Medical-Surgical Nursing Notes', 'Critical Care Nursing',
    'Obstetric Nursing', 'Paediatric Nursing Past Paper', 'Psychiatric Nursing',
    'Community Health Nursing', 'Pharmacology for Nurses', 'Nursing Ethics',
    'Clinical Assessment Skills',
  ],
  'Pharmacy': [
    'Pharmaceutical Chemistry', 'Pharmacology Notes', 'Drug Formulation',
    'Clinical Pharmacy', 'Toxicology Past Paper', 'Pharmacokinetics',
    'Pharmaceutical Microbiology', 'Hospital Pharmacy', 'Herbal Medicine',
  ],
  'Economics': [
    'Microeconomics Past Paper', 'Macroeconomics Lecture', 'Development Economics Notes',
    'International Trade Theory', 'Public Finance', 'Econometrics',
    'Agricultural Economics', 'Labour Economics', 'Monetary Economics',
    'Game Theory', 'Environmental Economics', 'Economic Policy Analysis',
  ],
  'Journalism and Communication': [
    'Media Ethics Notes', 'Broadcast Journalism', 'Print Media Past Paper',
    'Digital Media and Society', 'Public Relations Theory', 'Investigative Journalism',
    'Media Law', 'Photojournalism Techniques', 'Radio and Television',
    'Crisis Communication', 'Social Media Marketing', 'Media Research Methods',
  ],
  'Political Science': [
    'Comparative Government Notes', 'International Relations Theory',
    'African Politics Past Paper', 'Political Thought', 'Public Administration',
    'Democracy and Governance', 'Foreign Policy Analysis', 'Constitutional Law',
    'Political Economy', 'Electoral Systems',
  ],
  'Law': [
    'Constitutional Law Notes', 'Criminal Law Past Paper', 'Contract Law Lecture',
    'Property Law', 'Tort Law', 'Administrative Law', 'International Law',
    'Family Law Notes', 'Evidence Law', 'Commercial Law', 'Human Rights Law',
  ],
  'Translation Studies': [
    'Translation Theory Notes', 'Literary Translation', 'Technical Translation Past Paper',
    'Interpretation Techniques', 'French-English Translation', 'Terminology Management',
    'Conference Interpreting', 'Localisation Studies',
  ],
  'Agriculture': [
    'Crop Production Notes', 'Soil Science Past Paper', 'Animal Husbandry',
    'Agricultural Economics', 'Agronomy Fundamentals', 'Plant Pathology',
    'Irrigation Engineering', 'Farm Management', 'Post-Harvest Technology',
  ],
};

// Well-known working YouTube embed IDs for educational content
const YT_IDS = [
  'FUQSbR6O6CI', 'Vz2i12x51Jg', 'HXV3zeQKqGY', '2-S-w_3i5kM', 'Vn94D3P4-Yc',
  'rfscVS0vtbw', 'ZHqThsGFZ_Y', 'yTyygq_o_Hk', 'xAeiXy8-9Y8', 'kqtD5dpn9C8',
  'l26oaHV7D40', 'eIho2S0ZahI', 'GAvZS1bI9lQ', 'HRIW3CIBSUY', 'JnTa9cnIkSY',
  '9OVtk6G2TnQ', 'RBSGKlAvoiM', 'zOjov-2OZ0E', 'ysEN5RaKOlA', 'OK_JCtrrv-c',
  'pblXmqfl53A', 'i_LwzRVP7bg', 'bBC-nXj3Ng4', 'fKopy74weus', 'TzE6sMIjv28',
  'EhCMt9NZ3jY', 'z7uGtIbm10k', 'SvKlCv6vU8g', 'KNaO0iFRjUI', 'i_LwzRVP7bg',
  'Q9g-cl7FWJA', 'r4foZMDSKas', 'kCc8FmEb1nY', '3s7h2MHQtxc', 'V4D5kGDNKyQ',
];

// Verified accessible PDF URLs
const PDF_URLS = [
  'https://www.cs.yale.edu/homes/aspnes/classes/4650/notes.pdf',
  'https://www.cs.cornell.edu/people/egs/cs614/notes/consistent.pdf',
  'https://www.cs.cornell.edu/courses/cs6180/2015fa/lectures/lecture24.pdf',
  'https://www.cs.cornell.edu/projects/quicksilver/public_pdfs/robust.pdf',
  'https://www.cs.cornell.edu/people/egs/cs614/notes/knowledge.pdf',
  'https://www.cs.cornell.edu/courses/cs6180/2015fa/lectures/lecture24.pdf',
  'https://arxiv.org/pdf/2201.11903',
  'https://arxiv.org/pdf/1706.03762',
  'https://arxiv.org/pdf/1512.03385',
  'https://arxiv.org/pdf/2303.08774',
];

// ─── Helper Functions ────────────────────────────────────────────────────────

function rnd<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function rndInt(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generateMatricule(year: number, seq: number): string {
  return `EP${year}-${String(seq).padStart(4, '0')}`;
}

function generateStudents(count: number) {
  const students = [];
  const usedMatricules = new Set<string>();
  let seq = 1;
  const years = [2023, 2024, 2025, 2026];

  for (let i = 0; i < count; i++) {
    const firstName = rnd(FIRST_NAMES);
    const lastName = rnd(LAST_NAMES);
    const faculty = rnd(ALL_FACULTIES);
    const dept = rnd(FACULTIES[faculty]);
    const year = rnd(years);
    const level = rndInt(1, 5) * 100;

    let matricule: string;
    do {
      matricule = generateMatricule(year, seq++);
    } while (usedMatricules.has(matricule));
    usedMatricules.add(matricule);

    const nameLower = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
    const nameSuffix = String(Math.floor(Math.random() * 999) + 1);

    students.push({
      name: `${firstName} ${lastName}`,
      matricule,
      instEmail: `${nameLower}${nameSuffix}@university.edu`,
      personalEmail: `${nameLower}${nameSuffix}@gmail.com`,
      phone: `+237 6${rndInt(50, 99)} ${rndInt(10, 99)} ${rndInt(10, 99)} ${rndInt(10, 99)}`,
      faculty,
      dept,
      level,
      tuitionStatus: Math.random() > 0.3 ? 'Paid' : 'Overdue',
      medicalStatus: Math.random() > 0.25 ? 'Cleared' : 'Pending',
    });
  }
  return students;
}

function generateResources(count: number) {
  const resources = [];
  const allDepts = ALL_FACULTIES.flatMap(f => FACULTIES[f].map(d => ({ faculty: f, dept: d })));

  for (let i = 0; i < count; i++) {
    const { faculty, dept } = rnd(allDepts);
    const titlePool = RESOURCE_TITLES[dept] || [`${dept} — Study Notes`, `${dept} — Past Paper`, `${dept} — Lecture`];
    const baseTitle = rnd(titlePool);
    const year = rndInt(2019, 2025);
    const type: 'notes' | 'pastpaper' | 'youtube' = rnd(['notes', 'pastpaper', 'youtube', 'notes', 'pastpaper']) as 'notes' | 'pastpaper' | 'youtube';
    const level = rndInt(1, 5) * 100;

    let url: string;
    if (type === 'youtube') {
      url = `https://www.youtube.com/embed/${rnd(YT_IDS)}`;
    } else {
      url = rnd(PDF_URLS);
    }

    resources.push({
      title: `${baseTitle} ${year > 2022 ? `(${year})` : ''}`.trim(),
      description: `${type === 'youtube' ? 'Video lecture' : type === 'pastpaper' ? 'Past examination paper' : 'Comprehensive lecture notes'} for ${dept} students at Level ${level}. Covers core concepts relevant to the ${year} academic year curriculum.`,
      type,
      url,
      faculty,
      dept,
      level,
    });
  }
  return resources;
}

// ─── Main Seed ───────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Clearing old data...');
  await prisma.studentInteraction.deleteMany();
  await prisma.activityFeed.deleteMany();
  await prisma.message.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.student.deleteMany();

  // ── Seed the original hand-crafted students first ──
  console.log('👥 Seeding 10 core students...');
  const coreStudents = [
    { id: 's-001', name: 'Acha Brandon Neba', matricule: 'EP2026-1234', instEmail: 'acha.brandon@university.edu', personalEmail: 'achabrandon10@gmail.com', phone: '+237 677 89 45 12', faculty: 'Faculty of Engineering and Technology', dept: 'Computer Engineering', level: 300, tuitionStatus: 'Paid', medicalStatus: 'Cleared' },
    { id: 's-002', name: 'Epie Ndille Fritz', matricule: 'EP2026-0743', instEmail: 'epie.ndille@university.edu', personalEmail: 'fritzndille@gmail.com', phone: '+237 682 99 00 11', faculty: 'Faculty of Engineering and Technology', dept: 'Computer Engineering', level: 100, tuitionStatus: 'Paid', medicalStatus: 'Pending' },
    { id: 's-003', name: 'Tanyi Samuel Ojong', matricule: 'EP2026-1902', instEmail: 'tanyi.samuel@university.edu', personalEmail: 'samuelojong88@outlook.com', phone: '+237 675 44 21 98', faculty: 'Faculty of Science', dept: 'Computer Science', level: 400, tuitionStatus: 'Overdue', medicalStatus: 'Cleared' },
    { id: 's-004', name: 'Mbi Christabel Eke', matricule: 'EP2026-0312', instEmail: 'mbi.christabel@university.edu', personalEmail: 'christabeleke@gmail.com', phone: '+237 690 12 34 56', faculty: 'Faculty of Health Sciences', dept: 'Nursing', level: 200, tuitionStatus: 'Paid', medicalStatus: 'Cleared' },
    { id: 's-005', name: 'Nkwain Fabrice Atabong', matricule: 'EP2026-2211', instEmail: 'nkwain.fabrice@university.edu', personalEmail: 'fabricenk@yahoo.com', phone: '+237 655 78 90 23', faculty: 'Faculty of Humanities and Social Sciences', dept: 'Economics', level: 200, tuitionStatus: 'Overdue', medicalStatus: 'Pending' },
    { id: 's-006', name: 'Bih Ruth Verinyuy', matricule: 'EP2026-1498', instEmail: 'bih.ruth@university.edu', personalEmail: 'ruthverinyuy@gmail.com', phone: '+237 678 56 78 90', faculty: 'Faculty of Humanities and Social Sciences', dept: 'Journalism and Communication', level: 300, tuitionStatus: 'Paid', medicalStatus: 'Cleared' },
    { id: 's-007', name: 'Fon Emmanuel Lum', matricule: 'EP2026-0089', instEmail: 'fon.emmanuel@university.edu', personalEmail: 'emmanuellum@gmail.com', phone: '+237 699 23 45 67', faculty: 'Faculty of Engineering and Technology', dept: 'Electrical Engineering', level: 300, tuitionStatus: 'Overdue', medicalStatus: 'Pending' },
    { id: 's-008', name: 'Ache Berenice Ngum', matricule: 'EP2026-1777', instEmail: 'ache.berenice@university.edu', personalEmail: 'berengum@outlook.com', phone: '+237 670 98 76 54', faculty: 'Faculty of Science', dept: 'Biochemistry', level: 200, tuitionStatus: 'Paid', medicalStatus: 'Cleared' },
    { id: 's-009', name: 'Kum Victor Ngwe', matricule: 'EP2026-0556', instEmail: 'kum.victor@university.edu', personalEmail: 'victorngwe@gmail.com', phone: '+237 665 34 56 78', faculty: 'Faculty of Health Sciences', dept: 'Medicine', level: 300, tuitionStatus: 'Overdue', medicalStatus: 'Pending' },
    { id: 's-010', name: 'Awah Priscilla Nkeng', matricule: 'EP2026-0945', instEmail: 'awah.priscilla@university.edu', personalEmail: 'prisknkeng@gmail.com', phone: '+237 693 87 65 43', faculty: 'School of Languages and Translation', dept: 'Translation Studies', level: 100, tuitionStatus: 'Paid', medicalStatus: 'Cleared' },
  ];
  for (const s of coreStudents) {
    await prisma.student.upsert({ where: { matricule: s.matricule }, update: {}, create: s });
  }

  // ── Generate bulk students ──
  console.log('👥 Generating 4,990 additional students...');
  const bulkStudents = generateStudents(4990);
  const BATCH = 500;
  for (let i = 0; i < bulkStudents.length; i += BATCH) {
    const batch = bulkStudents.slice(i, i + BATCH);
    await prisma.student.createMany({ data: batch, skipDuplicates: true });
    process.stdout.write(`   Students: ${Math.min(i + BATCH, bulkStudents.length)}/4990\r`);
  }
  console.log('\n✅ Students done.');

  // ── Seed core resources (real URLs) ──
  console.log('📚 Seeding 10 core resources...');
  const coreResources = [
    { id: 'r-001', title: 'EEG311: Embedded Systems — Complete Lecture Notes', description: 'Comprehensive lecture slides covering microcontrollers, assembly programming, interrupt handling, and memory-mapped I/O.', type: 'notes', url: 'https://www.cs.yale.edu/homes/aspnes/classes/4650/notes.pdf', faculty: 'Faculty of Engineering and Technology', dept: 'Electrical Engineering', level: 300 },
    { id: 'r-002', title: 'CEG415: Software Engineering — Consistent States (Cornell)', description: 'Cornell CS paper on consistent global states and distributed system invariants used in software design.', type: 'pastpaper', url: 'https://www.cs.cornell.edu/people/egs/cs614/notes/consistent.pdf', faculty: 'Faculty of Engineering and Technology', dept: 'Computer Engineering', level: 400 },
    { id: 'r-003', title: 'Introduction to Biochemistry — Oregon State Lecture', description: 'Kevin Ahern comprehensive biochemistry lecture from Oregon State covering metabolism and enzyme kinetics.', type: 'youtube', url: 'https://www.youtube.com/embed/FUQSbR6O6CI', faculty: 'Faculty of Science', dept: 'Biochemistry', level: 200 },
    { id: 'r-004', title: 'CSC401: Distributed Systems — Theory & Algorithms (Yale)', description: 'Yale CPSC 4650 lecture notes on wait-free hierarchies, consensus algorithms, and snapshot algorithms.', type: 'notes', url: 'https://www.cs.yale.edu/homes/aspnes/classes/4650/notes.pdf', faculty: 'Faculty of Science', dept: 'Computer Science', level: 400 },
    { id: 'r-005', title: 'Distributed Computing — Asynchronous Models (Cornell)', description: 'Cornell lecture on asynchronous distributed computing, leader election, and consensus.', type: 'notes', url: 'https://www.cs.cornell.edu/courses/cs6180/2015fa/lectures/lecture24.pdf', faculty: 'Faculty of Humanities and Social Sciences', dept: 'Economics', level: 200 },
    { id: 'r-006', title: 'Journalism Ethics — Crash Course Media Literacy', description: 'CrashCourse lecture on media ethics, objectivity, and journalism values in the digital age.', type: 'youtube', url: 'https://www.youtube.com/embed/q-Y-z6HmRgI', faculty: 'Faculty of Humanities and Social Sciences', dept: 'Journalism and Communication', level: 200 },
    { id: 'r-007', title: 'NUR405: Critical Care — Robust Distributed Applications', description: 'Study guide on fault tolerance and robust application design adapted for healthcare systems.', type: 'notes', url: 'https://www.cs.cornell.edu/projects/quicksilver/public_pdfs/robust.pdf', faculty: 'Faculty of Health Sciences', dept: 'Nursing', level: 400 },
    { id: 'r-008', title: 'CEG312: Database Systems — CS50 Full SQL Course (Harvard)', description: 'Harvard CS50 complete database SQL course covering design, normalization, and optimization.', type: 'youtube', url: 'https://www.youtube.com/embed/Vz2i12x51Jg', faculty: 'Faculty of Engineering and Technology', dept: 'Computer Engineering', level: 300 },
    { id: 'r-009', title: 'Translation Theory — Reasoning About Knowledge in Distributed Systems', description: 'Cornell notes on knowledge reasoning applied to formalizing and translating distributed system specifications.', type: 'notes', url: 'https://www.cs.cornell.edu/people/egs/cs614/notes/knowledge.pdf', faculty: 'School of Languages and Translation', dept: 'Translation Studies', level: 100 },
    { id: 'r-010', title: 'MED302: Pediatric Care — Professor Dave Biochemistry Lecture', description: 'Professor Dave Explains biochemistry video covering cell organelles and metabolic pathways for medical students.', type: 'youtube', url: 'https://www.youtube.com/embed/s8rsR_TStaA', faculty: 'Faculty of Health Sciences', dept: 'Medicine', level: 300 },
  ];
  for (const r of coreResources) {
    await prisma.resource.upsert({ where: { id: r.id }, update: {}, create: r as Parameters<typeof prisma.resource.upsert>[0]['create'] });
  }

  // ── Generate bulk resources ──
  console.log('📚 Generating 19,990 additional resources...');
  const bulkResources = generateResources(19990);
  for (let i = 0; i < bulkResources.length; i += BATCH) {
    const batch = bulkResources.slice(i, i + BATCH);
    await prisma.resource.createMany({ data: batch, skipDuplicates: true });
    process.stdout.write(`   Resources: ${Math.min(i + BATCH, bulkResources.length)}/19990\r`);
  }
  console.log('\n✅ Resources done.');

  // ── Seed Tickets ──
  console.log('🎫 Seeding support tickets...');
  const tickets = [
    { id: 't-101', studentMatricule: 'EP2026-0743', subject: 'Tuition Payment Not Reflected on Portal', description: 'I paid my tuition fees on the 10th of June via mobile money but my portal still shows Overdue. Reference: MM-20260610-884762.', status: 'open', date: '2026-06-20' },
    { id: 't-102', studentMatricule: 'EP2026-2211', subject: 'Medical Clearance Documents Submitted — Pending Update', description: 'I submitted my medical examination certificate at the health centre on June 5th. Status still shows Pending.', status: 'open', date: '2026-06-18' },
    { id: 't-103', studentMatricule: 'EP2026-0089', subject: 'Request for Academic Transcript', description: 'I need an official academic transcript for a scholarship application.', status: 'closed', date: '2026-06-10' },
    { id: 't-104', studentMatricule: 'EP2026-0556', subject: 'Lab Registration Not Accessible', description: 'The lab registration portal shows a 403 error whenever I try to register for practical sessions.', status: 'open', date: '2026-06-22' },
    { id: 't-105', studentMatricule: 'EP2026-1498', subject: 'Course Registration Portal Issue', description: 'I cannot select COM204 on my online course registration. It says prerequisite COM102 is missing.', status: 'open', date: '2026-06-24' },
    { id: 't-106', studentMatricule: 'EP2026-1234', subject: 'Missing Grade for CEG301 Final Exam', description: 'My grade for the CEG301 final examination is not appearing on the portal. I sat the exam on June 2nd.', status: 'open', date: '2026-06-15' },
  ];
  for (const t of tickets) {
    await prisma.ticket.upsert({ where: { id: t.id }, update: {}, create: t });
  }

  await prisma.message.createMany({
    skipDuplicates: true,
    data: [
      { ticketId: 't-101', sender: 'student', text: 'I paid my tuition on June 10th but my portal still shows Overdue. Reference: MM-20260610-884762.', date: '2026-06-20 09:14' },
      { ticketId: 't-101', sender: 'admin', text: 'Thank you for reaching out. We have located your transaction and are verifying with our finance team. Please allow 24-48 hours.', date: '2026-06-20 11:30' },
      { ticketId: 't-102', sender: 'student', text: 'I submitted my medical certificate on June 5th at the health centre. Status still shows Pending.', date: '2026-06-18 10:05' },
      { ticketId: 't-103', sender: 'student', text: 'I need an official transcript for a scholarship application. What is the procedure?', date: '2026-06-10 14:20' },
      { ticketId: 't-103', sender: 'admin', text: 'Please visit the Registrar office with a filled transcript request form and two passport photos. Processing takes 5 working days.', date: '2026-06-10 16:00' },
      { ticketId: 't-103', sender: 'student', text: 'Thank you. I will visit the office tomorrow morning.', date: '2026-06-11 09:00' },
      { ticketId: 't-104', sender: 'student', text: 'The lab registration portal keeps showing a 403 error whenever I try to register for practical sessions.', date: '2026-06-22 08:50' },
      { ticketId: 't-104', sender: 'admin', text: 'We are aware of this. The ICT team is working on a fix, expected by end of day.', date: '2026-06-22 10:15' },
      { ticketId: 't-105', sender: 'student', text: 'The system says I am missing COM102 as a prerequisite for COM204, but I passed it last semester.', date: '2026-06-24 11:05' },
      { ticketId: 't-106', sender: 'student', text: 'My CEG301 final exam grade is not showing on my portal. I sat the exam on June 2nd at the main hall.', date: '2026-06-15 14:00' },
      { ticketId: 't-106', sender: 'admin', text: 'Thank you for reporting this. We have escalated it to the Examinations Office. You should see your grade posted within 3 working days.', date: '2026-06-15 16:30' },
    ],
  });

  // ── Campaigns ──
  console.log('📣 Seeding campaigns...');
  await prisma.campaign.createMany({
    skipDuplicates: true,
    data: [
      { id: 'c-001', title: 'End-of-Session Examination Schedule Released', audience: 'All Students', message: 'The end-of-session examination timetable for 2025/2026 has been published. Students should check their individual schedules and confirm venue assignments by June 30th.', sentDate: '2026-06-01', status: 'Sent' },
      { id: 'c-002', title: 'Tuition Payment Deadline Extension — Level 100', audience: 'Level 100', message: 'Following requests from Level 100 students, the tuition payment deadline has been extended to July 15, 2026.', sentDate: '2026-06-05', status: 'Sent' },
      { id: 'c-003', title: 'Compulsory Medical Examination — Health Sciences Faculty', audience: 'Faculty of Health Sciences', message: 'All Faculty of Health Sciences students must complete their annual medical examination at the university health centre before July 10th.', sentDate: '2026-06-08', status: 'Sent' },
      { id: 'c-004', title: 'Library Extended Operating Hours During Exams', audience: 'All Students', message: 'The university library will operate extended hours (7:00 AM – 11:00 PM) during examinations from July 1 to July 31, 2026.', sentDate: '2026-06-12', status: 'Sent' },
      { id: 'c-005', title: 'Engineering Faculty Capstone Project Submission', audience: 'Faculty of Engineering and Technology', message: 'Final-year Engineering students must submit capstone project reports to the Faculty Administrative Office by June 28th. Late submissions attract a 10% penalty per day.', sentDate: '2026-06-15', status: 'Sent' },
    ],
  });

  // ── Activity Feed ──
  console.log('📊 Seeding activity feed...');
  await prisma.activityFeed.createMany({
    skipDuplicates: true,
    data: [
      { id: 'af-001', user: 'Admin (Registry)', action: 'approved medical clearance for Mbi Christabel Eke (EP2026-0312).', time: 'Today at 11:45 AM' },
      { id: 'af-002', user: 'System', action: 'sent "End-of-Session Examination Schedule" campaign to All Students.', time: 'Today at 10:30 AM' },
      { id: 'af-003', user: 'Acha Brandon Neba', action: 'opened a new support ticket: "Missing Grade for CEG301 Final Exam".', time: 'Yesterday at 2:00 PM' },
      { id: 'af-004', user: 'Admin (Finance)', action: 'marked tuition as Paid for Ache Berenice Ngum (EP2026-1777).', time: 'Yesterday at 9:15 AM' },
      { id: 'af-005', user: 'Bih Ruth Verinyuy', action: 'submitted support ticket: "Course Registration Portal Issue".', time: '2 days ago at 11:05 AM' },
      { id: 'af-006', user: 'Admin (Support)', action: 'resolved support ticket #t-103: "Request for Academic Transcript".', time: '2 days ago at 4:00 PM' },
      { id: 'af-007', user: 'System', action: 'broadcast "Library Extended Hours During Exams" to All Students.', time: '3 days ago at 8:00 AM' },
      { id: 'af-008', user: 'Admin (Registry)', action: 'approved medical clearance for Awah Priscilla Nkeng (EP2026-0945).', time: '4 days ago at 3:30 PM' },
    ],
  });

  // ── Generate Student Interactions ──
  console.log('🖱️  Generating 100,000+ student interactions...');
  const INTERACTION_ACTIONS = ['view', 'click', 'download', 'complete', 'search'];
  const INTERACTION_BATCH = 1000;
  const INTERACTION_COUNT = 100000;

  // Get all student IDs and resource IDs
  const allStudents = await prisma.student.findMany({ select: { id: true } });
  const allResources = await prisma.resource.findMany({ select: { id: true } });
  const studentIds = allStudents.map(s => s.id);
  const resourceIds = allResources.map(r => r.id);

  console.log(`   Using ${studentIds.length} students and ${resourceIds.length} resources`);

  let totalInteractions = 0;
  while (totalInteractions < INTERACTION_COUNT) {
    const batch = [];
    const batchSize = Math.min(INTERACTION_BATCH, INTERACTION_COUNT - totalInteractions);

    for (let i = 0; i < batchSize; i++) {
      const action = rnd(INTERACTION_ACTIONS);
      const daysAgo = rndInt(0, 180);
      const hoursAgo = rndInt(0, 23);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);
      createdAt.setHours(createdAt.getHours() - hoursAgo);

      batch.push({
        studentId: rnd(studentIds),
        resourceId: rnd(resourceIds),
        action,
        duration: action === 'view' || action === 'complete' ? rndInt(30, 3600) : null,
        metadata: action === 'search' ? JSON.stringify({ query: rnd(['calculus', 'database', 'network', 'physics', 'nursing', 'economics', 'law', 'translation']) }) : null,
        createdAt,
      });
    }

    await prisma.studentInteraction.createMany({ data: batch });
    totalInteractions += batchSize;
    process.stdout.write(`   Interactions: ${totalInteractions}/${INTERACTION_COUNT}\r`);
  }

  console.log(`\n✅ Seed complete!`);
  console.log(`   → ${await prisma.student.count()} students`);
  console.log(`   → ${await prisma.resource.count()} resources`);
  console.log(`   → ${await prisma.studentInteraction.count()} interactions`);
  console.log(`   → ${await prisma.ticket.count()} tickets`);
  console.log(`   → ${await prisma.campaign.count()} campaigns`);
}

main()
  .catch((e) => { console.error('❌ Seed error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
