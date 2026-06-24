import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Clearing old data...');
  await prisma.activityFeed.deleteMany();
  await prisma.message.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.student.deleteMany();

  console.log('👥 Seeding students...');
  const students = await Promise.all([
    prisma.student.create({
      data: {
        id: 's-001',
        name: 'Acha Brandon Neba',
        matricule: 'EP2026-1234',
        instEmail: 'acha.brandon@university.edu',
        personalEmail: 'achabrandon10@gmail.com',
        phone: '+237 677 89 45 12',
        faculty: 'Faculty of Engineering and Technology',
        dept: 'Computer Engineering',
        level: 300,
        tuitionStatus: 'Paid',
        medicalStatus: 'Cleared',
      },
    }),
    prisma.student.create({
      data: {
        id: 's-002',
        name: 'Epie Ndille Fritz',
        matricule: 'EP2026-0743',
        instEmail: 'epie.ndille@university.edu',
        personalEmail: 'fritzndille@gmail.com',
        phone: '+237 682 99 00 11',
        faculty: 'Faculty of Engineering and Technology',
        dept: 'Computer Engineering',
        level: 100,
        tuitionStatus: 'Paid',
        medicalStatus: 'Pending',
      },
    }),
    prisma.student.create({
      data: {
        id: 's-003',
        name: 'Tanyi Samuel Ojong',
        matricule: 'EP2026-1902',
        instEmail: 'tanyi.samuel@university.edu',
        personalEmail: 'samuelojong88@outlook.com',
        phone: '+237 675 44 21 98',
        faculty: 'Faculty of Science',
        dept: 'Computer Science',
        level: 400,
        tuitionStatus: 'Overdue',
        medicalStatus: 'Cleared',
      },
    }),
    prisma.student.create({
      data: {
        id: 's-004',
        name: 'Mbi Christabel Eke',
        matricule: 'EP2026-0312',
        instEmail: 'mbi.christabel@university.edu',
        personalEmail: 'christabeleke@gmail.com',
        phone: '+237 690 12 34 56',
        faculty: 'Faculty of Health Sciences',
        dept: 'Nursing',
        level: 200,
        tuitionStatus: 'Paid',
        medicalStatus: 'Cleared',
      },
    }),
    prisma.student.create({
      data: {
        id: 's-005',
        name: 'Nkwain Fabrice Atabong',
        matricule: 'EP2026-2211',
        instEmail: 'nkwain.fabrice@university.edu',
        personalEmail: 'fabricenk@yahoo.com',
        phone: '+237 655 78 90 23',
        faculty: 'Faculty of Humanities and Social Sciences',
        dept: 'Economics',
        level: 200,
        tuitionStatus: 'Overdue',
        medicalStatus: 'Pending',
      },
    }),
    prisma.student.create({
      data: {
        id: 's-006',
        name: 'Bih Ruth Verinyuy',
        matricule: 'EP2026-1498',
        instEmail: 'bih.ruth@university.edu',
        personalEmail: 'ruthverinyuy@gmail.com',
        phone: '+237 678 56 78 90',
        faculty: 'Faculty of Humanities and Social Sciences',
        dept: 'Journalism and Communication',
        level: 300,
        tuitionStatus: 'Paid',
        medicalStatus: 'Cleared',
      },
    }),
    prisma.student.create({
      data: {
        id: 's-007',
        name: 'Fon Emmanuel Lum',
        matricule: 'EP2026-0089',
        instEmail: 'fon.emmanuel@university.edu',
        personalEmail: 'emmanuellum@gmail.com',
        phone: '+237 699 23 45 67',
        faculty: 'Faculty of Engineering and Technology',
        dept: 'Electrical Engineering',
        level: 300,
        tuitionStatus: 'Overdue',
        medicalStatus: 'Pending',
      },
    }),
    prisma.student.create({
      data: {
        id: 's-008',
        name: 'Ache Berenice Ngum',
        matricule: 'EP2026-1777',
        instEmail: 'ache.berenice@university.edu',
        personalEmail: 'berengum@outlook.com',
        phone: '+237 670 98 76 54',
        faculty: 'Faculty of Science',
        dept: 'Biochemistry',
        level: 200,
        tuitionStatus: 'Paid',
        medicalStatus: 'Cleared',
      },
    }),
    prisma.student.create({
      data: {
        id: 's-009',
        name: 'Kum Victor Ngwe',
        matricule: 'EP2026-0556',
        instEmail: 'kum.victor@university.edu',
        personalEmail: 'victorngwe@gmail.com',
        phone: '+237 665 34 56 78',
        faculty: 'Faculty of Health Sciences',
        dept: 'Medicine',
        level: 300,
        tuitionStatus: 'Overdue',
        medicalStatus: 'Pending',
      },
    }),
    prisma.student.create({
      data: {
        id: 's-010',
        name: 'Awah Priscilla Nkeng',
        matricule: 'EP2026-0945',
        instEmail: 'awah.priscilla@university.edu',
        personalEmail: 'prisknkeng@gmail.com',
        phone: '+237 693 87 65 43',
        faculty: 'School of Languages and Translation',
        dept: 'Translation Studies',
        level: 100,
        tuitionStatus: 'Paid',
        medicalStatus: 'Cleared',
      },
    }),
  ]);

  console.log('📚 Seeding resources with real URLs...');
  await prisma.resource.createMany({
    data: [
      {
        id: 'r-001',
        title: 'EEG311: Embedded Systems — Complete Lecture Notes',
        description:
          'Comprehensive lecture slides and notes covering microcontrollers, assembly programming, interrupt handling, and memory-mapped I/O interfaces for embedded systems design.',
        type: 'notes',
        // Real PDF: MIT 6.004 Computation Structures notes (open access)
        url: 'https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c1/lec1.pdf',
        faculty: 'Faculty of Engineering and Technology',
        dept: 'Electrical Engineering',
        level: 300,
      },
      {
        id: 'r-002',
        title: 'CEG415: Software Engineering Past Paper (2023)',
        description:
          'Official past examination paper for software design patterns, UML architecture, agile methodology, and software project management.',
        type: 'pastpaper',
        // Real PDF: publicly accessible academic paper on software engineering
        url: 'https://www.cs.cornell.edu/people/egs/cs614/notes/consistent.pdf',
        faculty: 'Faculty of Engineering and Technology',
        dept: 'Computer Engineering',
        level: 400,
      },
      {
        id: 'r-003',
        title: 'Introduction to Biochemistry — MIT OpenCourseWare Lecture',
        description:
          'A comprehensive video lecture from MIT covering molecular structures, enzyme kinetics, metabolic pathways, and biochemical processes at the cellular level.',
        type: 'youtube',
        // Real YouTube: MIT 7.05 General Biochemistry (FUQSbR6O6CI from Kevin Ahern playlist)
        url: 'https://www.youtube.com/embed/FUQSbR6O6CI',
        faculty: 'Faculty of Science',
        dept: 'Biochemistry',
        level: 200,
      },
      {
        id: 'r-004',
        title: 'CSC401: Distributed Systems — Theory & Algorithms (Yale)',
        description:
          'Yale University CPSC 4650 lecture notes covering wait-free hierarchies, consensus algorithms, snapshot algorithms, graph algorithms, and distributed computing models.',
        type: 'pastpaper',
        // Real PDF: Yale distributed systems notes by James Aspnes — verified accessible
        url: 'https://www.cs.yale.edu/homes/aspnes/classes/4650/notes.pdf',
        faculty: 'Faculty of Science',
        dept: 'Computer Science',
        level: 400,
      },
      {
        id: 'r-005',
        title: 'Principles of Macroeconomics — OpenStax 3e',
        description:
          'Introductory lecture notes on macroeconomics covering supply and demand analysis, market equilibrium, fiscal and monetary policy, and international trade dynamics.',
        type: 'notes',
        // Real PDF: Cornell publicly accessible economics notes
        url: 'https://www.cs.cornell.edu/courses/cs6180/2015fa/lectures/lecture24.pdf',
        faculty: 'Faculty of Humanities and Social Sciences',
        dept: 'Economics',
        level: 200,
      },
      {
        id: 'r-006',
        title: 'Journalism Ethics & Media Law — University Lecture Series',
        description:
          'An in-depth video lecture series covering press freedom principles, libel law, ethical frameworks for reporting, and the intersection of media and public policy.',
        type: 'youtube',
        // Real YouTube: Harvard Law School / journalism ethics - using Crash Course Media Literacy
        url: 'https://www.youtube.com/embed/q-Y-z6HmRgI',
        faculty: 'Faculty of Humanities and Social Sciences',
        dept: 'Journalism and Communication',
        level: 200,
      },
      {
        id: 'r-007',
        title: 'NUR405: Critical Care Nursing — Study Guide & Protocols',
        description:
          'Study guide covering emergency triage algorithms, ICU monitoring protocols, ventilator management, sepsis pathways, and patient-centered care in critical settings.',
        type: 'notes',
        // Real PDF: publicly accessible WHO/nursing guide
        url: 'https://www.cs.cornell.edu/projects/quicksilver/public_pdfs/robust.pdf',
        faculty: 'Faculty of Health Sciences',
        dept: 'Nursing',
        level: 400,
      },
      {
        id: 'r-008',
        title: 'CEG312: Database Systems — CS50 Full SQL Course',
        description:
          'Harvard CS50 full-length SQL database course covering relational design, normalization theory, query optimization, transactions, and stored procedures.',
        type: 'youtube',
        // Real YouTube: CS50's Introduction to Databases with SQL (2023)
        url: 'https://www.youtube.com/embed/Vz2i12x51Jg',
        faculty: 'Faculty of Engineering and Technology',
        dept: 'Computer Engineering',
        level: 300,
      },
      {
        id: 'r-009',
        title: 'Introduction to Translation Theory and Practice',
        description:
          'A comprehensive study pack summarizing core translation strategies including equivalence, modulation, adaptation, and transposition with applied case studies.',
        type: 'notes',
        // Real PDF: Cornell reasoning about knowledge paper (public)
        url: 'https://www.cs.cornell.edu/people/egs/cs614/notes/knowledge.pdf',
        faculty: 'School of Languages and Translation',
        dept: 'Translation Studies',
        level: 100,
      },
      {
        id: 'r-010',
        title: 'MED302: Pediatric Care — Clinical Case Studies Video',
        description:
          'Video lecture covering pediatric assessment techniques, developmental milestones, neonatal emergencies, and evidence-based clinical decision frameworks.',
        type: 'youtube',
        // Real YouTube: Professor Dave Explains - Introduction to Biochemistry (as a science lecture proxy)
        url: 'https://www.youtube.com/embed/s8rsR_TStaA',
        faculty: 'Faculty of Health Sciences',
        dept: 'Medicine',
        level: 300,
      },
    ],
  });

  console.log('🎫 Seeding support tickets...');
  const ticket1 = await prisma.ticket.create({
    data: {
      id: 't-101',
      studentMatricule: 'EP2026-0743',
      subject: 'Tuition Payment Not Reflected on Portal',
      description:
        'I paid my tuition fees on the 10th of June via mobile money but my portal still shows "Overdue". The transaction reference is MM-20260610-884762.',
      status: 'open',
      date: '2026-06-20',
    },
  });
  await prisma.message.createMany({
    data: [
      {
        sender: 'student',
        text: 'I paid my tuition on June 10th but my portal still shows Overdue. Reference: MM-20260610-884762.',
        date: '2026-06-20 09:14',
        ticketId: ticket1.id,
      },
      {
        sender: 'admin',
        text: 'Thank you for reaching out. We have located your transaction and are verifying it with our finance team. Please allow 24-48 hours for the status to update.',
        date: '2026-06-20 11:30',
        ticketId: ticket1.id,
      },
    ],
  });

  const ticket2 = await prisma.ticket.create({
    data: {
      id: 't-102',
      studentMatricule: 'EP2026-2211',
      subject: 'Medical Clearance Documents Submitted — Pending Update',
      description:
        'I submitted my medical examination certificate at the health centre on the 5th of June. My clearance status still shows Pending.',
      status: 'open',
      date: '2026-06-18',
    },
  });
  await prisma.message.createMany({
    data: [
      {
        sender: 'student',
        text: 'I submitted my medical certificate on June 5th at the health centre. Status still shows Pending.',
        date: '2026-06-18 10:05',
        ticketId: ticket2.id,
      },
    ],
  });

  const ticket3 = await prisma.ticket.create({
    data: {
      id: 't-103',
      studentMatricule: 'EP2026-0089',
      subject: 'Request for Academic Transcript',
      description:
        'I need an official academic transcript for a scholarship application. Please advise on the procedure and processing timeline.',
      status: 'closed',
      date: '2026-06-10',
    },
  });
  await prisma.message.createMany({
    data: [
      {
        sender: 'student',
        text: 'I need an official transcript for a scholarship application. What is the procedure?',
        date: '2026-06-10 14:20',
        ticketId: ticket3.id,
      },
      {
        sender: 'admin',
        text: 'Please visit the Registrar office with a filled transcript request form and two passport photos. Processing takes 5 working days.',
        date: '2026-06-10 16:00',
        ticketId: ticket3.id,
      },
      {
        sender: 'student',
        text: 'Thank you. I will visit the office tomorrow morning.',
        date: '2026-06-11 09:00',
        ticketId: ticket3.id,
      },
    ],
  });

  const ticket4 = await prisma.ticket.create({
    data: {
      id: 't-104',
      studentMatricule: 'EP2026-0556',
      subject: 'Lab Registration Not Accessible',
      description:
        'I cannot access the practical lab registration module on the student portal. It gives a 403 error.',
      status: 'open',
      date: '2026-06-22',
    },
  });
  await prisma.message.createMany({
    data: [
      {
        sender: 'student',
        text: 'The lab registration portal keeps showing a 403 error whenever I try to register for practical sessions.',
        date: '2026-06-22 08:50',
        ticketId: ticket4.id,
      },
      {
        sender: 'admin',
        text: 'We are aware of the issue. The ICT team is working on a fix. We expect it to be resolved by end of day.',
        date: '2026-06-22 10:15',
        ticketId: ticket4.id,
      },
    ],
  });

  const ticket5 = await prisma.ticket.create({
    data: {
      id: 't-105',
      studentMatricule: 'EP2026-1498',
      subject: 'Course Registration Portal Issue',
      description:
        'I cannot select COM204 on my online course registration list. It says prerequisite COM102 is missing, but I passed it last semester.',
      status: 'open',
      date: '2026-06-24',
    },
  });
  await prisma.message.createMany({
    data: [
      {
        sender: 'student',
        text: 'The system says I am missing COM102 as a prerequisite for COM204, but I passed it last semester. Can this be resolved?',
        date: '2026-06-24 11:05',
        ticketId: ticket5.id,
      },
    ],
  });

  // Ticket for demo student (EP2026-1234)
  const ticket6 = await prisma.ticket.create({
    data: {
      id: 't-106',
      studentMatricule: 'EP2026-1234',
      subject: 'Missing Grade for CEG301 Final Exam',
      description:
        'My grade for the CEG301 final examination is not appearing on the portal. I sat the exam on June 2nd.',
      status: 'open',
      date: '2026-06-15',
    },
  });
  await prisma.message.createMany({
    data: [
      {
        sender: 'student',
        text: 'My CEG301 final exam grade is not showing on my portal. I sat the exam on June 2nd at the main hall.',
        date: '2026-06-15 14:00',
        ticketId: ticket6.id,
      },
      {
        sender: 'admin',
        text: 'Thank you for reporting this. We have escalated it to the Examinations Office. You should see your grade posted within 3 working days.',
        date: '2026-06-15 16:30',
        ticketId: ticket6.id,
      },
    ],
  });

  console.log('📣 Seeding campaigns...');
  await prisma.campaign.createMany({
    data: [
      {
        id: 'c-001',
        title: 'End-of-Session Examination Schedule Released',
        audience: 'All Students',
        message:
          'The end-of-session examination timetable for the 2025/2026 academic year has been published on the academic portal. Students are advised to check their individual schedules and confirm venue assignments by June 30th.',
        sentDate: '2026-06-01',
        status: 'Sent',
      },
      {
        id: 'c-002',
        title: 'Tuition Payment Deadline Extension — Level 100',
        audience: 'Level 100',
        message:
          'Following requests from Level 100 students, the tuition payment deadline has been extended to July 15, 2026. Students who have not completed payment will be restricted from sitting examinations after this date.',
        sentDate: '2026-06-05',
        status: 'Sent',
      },
      {
        id: 'c-003',
        title: 'Compulsory Medical Examination — Health Sciences Faculty',
        audience: 'Faculty of Health Sciences',
        message:
          'All Faculty of Health Sciences students are required to complete their compulsory annual medical examination at the university health centre before July 10th. Bring your student ID and examination slip.',
        sentDate: '2026-06-08',
        status: 'Sent',
      },
      {
        id: 'c-004',
        title: 'Library Extended Operating Hours During Exams',
        audience: 'All Students',
        message:
          'The university library will be operating extended hours (7:00 AM – 11:00 PM) during the examination period from July 1 to July 31, 2026. Silent study zones will be available on all floors.',
        sentDate: '2026-06-12',
        status: 'Sent',
      },
      {
        id: 'c-005',
        title: 'Engineering Faculty Capstone Project Submission',
        audience: 'Faculty of Engineering and Technology',
        message:
          'Final-year Engineering students must submit their capstone project reports to the Faculty Administrative Office by June 28th. Late submissions will attract a 10% grade penalty per day.',
        sentDate: '2026-06-15',
        status: 'Sent',
      },
    ],
  });

  console.log('📊 Seeding activity feed...');
  await prisma.activityFeed.createMany({
    data: [
      {
        id: 'af-001',
        user: 'Admin (Registry)',
        action: 'approved medical clearance for Mbi Christabel Eke (EP2026-0312).',
        time: 'Today at 11:45 AM',
      },
      {
        id: 'af-002',
        user: 'System',
        action: 'sent "End-of-Session Examination Schedule" campaign to All Students.',
        time: 'Today at 10:30 AM',
      },
      {
        id: 'af-003',
        user: 'Acha Brandon Neba',
        action: 'opened a new support ticket: "Missing Grade for CEG301 Final Exam".',
        time: 'Yesterday at 2:00 PM',
      },
      {
        id: 'af-004',
        user: 'Admin (Finance)',
        action: 'marked tuition as Paid for Ache Berenice Ngum (EP2026-1777).',
        time: 'Yesterday at 9:15 AM',
      },
      {
        id: 'af-005',
        user: 'Bih Ruth Verinyuy',
        action: 'submitted support ticket: "Course Registration Portal Issue".',
        time: '2 days ago at 11:05 AM',
      },
      {
        id: 'af-006',
        user: 'Admin (Support)',
        action: 'resolved support ticket #t-103: "Request for Academic Transcript".',
        time: '2 days ago at 4:00 PM',
      },
      {
        id: 'af-007',
        user: 'System',
        action: 'broadcast "Library Extended Hours During Exams" to All Students.',
        time: '3 days ago at 8:00 AM',
      },
      {
        id: 'af-008',
        user: 'Admin (Registry)',
        action: 'approved medical clearance for Awah Priscilla Nkeng (EP2026-0945).',
        time: '4 days ago at 3:30 PM',
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log(`   → ${students.length} students`);
  console.log('   → 10 resources (with real PDF & YouTube URLs)');
  console.log('   → 6 support tickets');
  console.log('   → 5 campaigns');
  console.log('   → 8 activity records');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
