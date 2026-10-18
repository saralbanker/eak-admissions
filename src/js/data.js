/**
 * Content for the admissions page. Everything the render layer needs lives here,
 * so copy/fee/date changes never require touching markup or logic.
 * All statistics, fees and dates are sample content for this demo.
 */
(function () {
  const EAK = (window.EAK = window.EAK || {});

  EAK.data = {
    school: {
      name: 'EAK International School',
      session: '2027–28',
      phoneDisplay: '1800-123-2027',
      phoneTel: '+9118001232027',
      whatsapp: '919876543210',
      email: 'admissions@eakschool.example',
      address: 'Knowledge Park Avenue, Sector 42',
      hours: 'Mon – Sat, 9:30 AM – 3:30 PM',
      prospectusUrl: 'assets/EAK-Prospectus-2027-28.pdf',
    },

    /* ---------------------------------------------------------- 04 Highlights */
    stats: [
      { value: '25+', label: 'Years of Academic Excellence', icon: 'award' },
      { value: '12,500+', label: 'Global Alumni Network', icon: 'users' },
      { value: '180+', label: 'Experienced Faculty Members', icon: 'book' },
      { value: '35+', label: 'Sports, Clubs & Co-Curriculars', icon: 'trophy' },
    ],

    /* ------------------------------------------------------- 02 Why choose us */
    whyUs: [
      {
        icon: 'users',
        title: 'Experienced & Caring Faculty',
        text: 'Postgraduate educators trained in experiential pedagogy with a 15:1 student-teacher ratio for personalised mentorship.',
      },
      {
        icon: 'award',
        title: 'Proven Academic Results',
        text: '100% board pass record for 12 consecutive years, with over 65% of graduating seniors scoring above 90% aggregate.',
      },
      {
        icon: 'laptop',
        title: 'Technology-Enabled Learning',
        text: 'Interactive smart boards, AI & robotics workshops, coding from Grade 3, and real-time parent progress portals.',
      },
      {
        icon: 'heart',
        title: 'Holistic Development',
        text: 'Dedicated hours for performing arts, Model UN, debate, financial literacy, and community leadership programmes.',
      },
      {
        icon: 'trophy',
        title: 'Championship Sports Ecosystem',
        text: 'Professional coaching across swimming, athletics, cricket, basketball, and indoor chess on our 12-acre green campus.',
      },
      {
        icon: 'shield',
        title: '24×7 Safe & Verified Campus',
        text: '300+ HD CCTV cameras, RFID attendance alerts, background-verified staff, and GPS-tracked AC school buses.',
      },
    ],

    /* ------------------------------------------------------ 03 Academic programs */
    programs: [
      {
        grades: 'Grades 1 – 5',
        ages: 'Ages 6 – 10 yrs',
        title: 'Primary Wing',
        grade: 'primary',
        cta: 'Enquire for Primary',
        text: 'Inquiry-based learning that builds foundational numeracy, bilingual communication, curiosity, and social skills.',
        points: [
          'Activity-driven phonics & math labs',
          'No-heavy-bag policy for Grades 1–2',
          'Visual arts, storytelling & nature walks',
        ],
      },
      {
        grades: 'Grades 6 – 8',
        ages: 'Ages 11 – 13 yrs',
        title: 'Middle School',
        grade: 'middle',
        cta: 'Enquire for Middle',
        text: 'Transitioning learners to analytical thinking, scientific experimentation, coding, and collaborative project work.',
        points: [
          'Dedicated STEM, Robotics & Coding modules',
          'Third language options (French / Sanskrit)',
          'Olympiad foundation & public speaking',
        ],
      },
      {
        grades: 'Grades 9 – 10',
        ages: 'Ages 14 – 15 yrs',
        title: 'Secondary School',
        grade: 'secondary',
        cta: 'Enquire for Secondary',
        text: 'Rigorous academic preparation for board examinations balanced with aptitude discovery and leadership habits.',
        points: [
          'Intensive board exam & NTSE mentoring',
          'Advanced Physics, Chemistry & Bio practicals',
          'Psychometric stream & career counselling',
        ],
      },
      {
        grades: 'Grades 11 – 12',
        ages: 'Ages 16 – 17 yrs',
        title: 'Senior Secondary',
        grade: 'senior',
        cta: 'Enquire for Sr. Secondary',
        text: 'Specialised streams in Science, Commerce, and Humanities preparing students for top Indian and global universities.',
        points: [
          'Science, Commerce & Humanities streams',
          'Integrated JEE / NEET / CUET / SAT guidance',
          'University portfolio & internship cell',
        ],
      },
    ],

    /* ------------------------------------------------------------ 05 Facilities */
    facilities: [
      {
        img: 'classroom',
        video: 'assets/video/optimized/classroom.mp4',
        w: 800,
        h: 450,
        alt: 'Bright classroom with rows of desks facing a green board',
        title: 'Ergonomic Smart Classrooms',
        text: 'Climate-controlled, sunlit classrooms equipped with 4K interactive panels and digital learning modules.',
      },
      {
        img: 'labs',
        video: 'assets/video/optimized/labs.mp4',
        w: 800,
        h: 533,
        alt: 'Laboratory glassware and a pipette on a science lab bench',
        title: 'Science, AI & Computer Labs',
        text: 'Dedicated Physics, Chemistry, Biology, high-speed Mac/PC computing, and 3D-printing Robotics innovation labs.',
      },
      {
        img: 'library',
        video: 'assets/video/optimized/library.mp4',
        w: 800,
        h: 533,
        alt: 'Floor-to-ceiling library shelves filled with books',
        title: 'Central Library & Kindle Zone',
        text: 'Over 25,000 print volumes, international journals, and digital research terminals for quiet study.',
      },
      {
        img: 'sports',
        video: 'assets/video/optimized/sports.mp4',
        w: 800,
        h: 522,
        alt: 'Basketball dropping through a hoop in an indoor court',
        title: 'Olympic Sports Complex',
        text: '400m synthetic track, half-Olympic swimming pool, synthetic tennis/basketball courts, and an indoor badminton arena.',
      },
      {
        img: 'transport',
        video: 'assets/video/optimized/transport.mp4',
        w: 800,
        h: 533,
        alt: 'Modern air-conditioned coach bus parked at sunset',
        title: 'GPS-Enabled AC Transport',
        text: 'Fleet of 45+ air-conditioned buses with live parent tracking app, onboard CCTV, and trained female attendants.',
      },
      {
        img: 'cafeteria',
        video: 'assets/video/optimized/cafeteria.mp4',
        w: 800,
        h: 600,
        alt: 'Spacious, naturally lit dining hall with wooden tables',
        title: 'Medical Infirmary & Hygienic Cafeteria',
        text: 'Full-time qualified nurses with hospital tie-ups alongside a nutritionist-curated vegetarian school cafeteria.',
      },
    ],

    /* -------------------------------------------------------- 06 Admission steps */
    steps: [
      {
        icon: 'search',
        title: 'Enquiry',
        text: 'Submit the online enquiry form or schedule a guided campus tour with our admissions counsellor.',
      },
      {
        icon: 'file',
        title: 'Application',
        text: 'Complete the registration form online or at the admission desk along with required documents.',
      },
      {
        icon: 'pencil',
        title: 'Assessment / Interaction',
        text: 'Friendly interaction for primary grades and a baseline readiness assessment for Grades 6 to 12.',
      },
      {
        icon: 'award',
        title: 'Selection',
        text: 'Receive the official admission offer letter via email and SMS within 5 working days of interaction.',
      },
      {
        icon: 'cap',
        title: 'Enrollment',
        text: "Confirm your child's seat by paying the admission fee before the deadline and receive the welcome kit.",
      },
    ],

    /* ---------------------------------------------------------- 07 Key dates
     * start / end are ISO dates (local). `activeUntil` keeps a milestone "open"
     * after it starts (e.g. the portal stays open until the deadline).         */
    dates: [
      { id: 'open', label: 'Application Portal Opens', start: '2026-10-15', activeUntil: '2026-12-15' },
      { id: 'deadline', label: 'Application Submission Deadline (Phase 1)', start: '2026-12-15' },
      { id: 'interaction', label: 'Student Interaction & Readiness Assessment', start: '2027-01-09', end: '2027-01-17' },
      { id: 'result', label: 'Admission Result & Offer Announcement', start: '2027-01-25' },
      { id: 'enrol', label: 'Fee Payment & Final Enrollment Deadline', start: '2027-02-15' },
    ],

    /* ------------------------------------------------------ 08 Required documents */
    documents: [
      { id: 'birth', title: 'Birth Certificate', text: 'Municipal or government-issued copy (mandatory for all grades).' },
      { id: 'records', title: 'Previous School Records', text: "Last 2 years' academic report cards and original Transfer Certificate (TC)." },
      { id: 'photos', title: 'Passport-Size Photographs', text: '4 recent colour photographs of the student and 2 of each parent.' },
      { id: 'address', title: 'Address Proof', text: 'Aadhaar Card, Passport, Utility Bill, or Registered Rental Agreement.' },
      { id: 'parent-id', title: 'Parent / Guardian ID Proof', text: 'Self-attested copy of PAN Card, Aadhaar Card, or Passport.' },
    ],

    /* -------------------------------------------------------------- 09 Fees */
    fees: [
      {
        id: 'primary',
        grades: 'Grade 1 – 5',
        wing: 'Primary Wing',
        tuition: 45000,
        admission: 8000,
        breakdown: [
          ['Academic tuition', 36000],
          ['Activity, arts & sports', 5000],
          ['Digital learning & labs', 4000],
        ],
      },
      {
        id: 'middle',
        grades: 'Grade 6 – 8',
        wing: 'Middle School',
        tuition: 58000,
        admission: 10000,
        breakdown: [
          ['Academic tuition', 45000],
          ['STEM, robotics & labs', 7000],
          ['Activity, arts & sports', 6000],
        ],
      },
      {
        id: 'senior',
        grades: 'Grade 9 – 12',
        wing: 'Secondary & Senior Secondary',
        tuition: 72000,
        admission: 12000,
        breakdown: [
          ['Academic tuition', 54000],
          ['Science labs & career cell', 10000],
          ['Activity, arts & sports', 8000],
        ],
      },
    ],
    /* Indicative add-on rates, used only by the fee estimator. */
    feeAddOns: {
      transport: [
        { id: 'none', label: 'No transport', amount: 0 },
        { id: 'near', label: 'Up to 5 km', amount: 12000 },
        { id: 'mid', label: '5 – 10 km', amount: 16000 },
        { id: 'far', label: '10 km +', amount: 20000 },
      ],
      meals: 18000,
      uniform: 6500,
    },

    /* ------------------------------------------------------- 10 Testimonials */
    testimonials: [
      {
        name: 'Mrs. Ananya Deshmukh',
        role: 'Mother of Ira (Grade 5)',
        initials: 'AD',
        rating: 5,
        text: 'Moving our daughter to EAK International in Grade 3 was the best decision we made. Her confidence in public speaking and love for science experiments have grown tremendously.',
      },
      {
        name: 'Mr. Vikramaditya Nair',
        role: 'Father of Rohan (Grade 9)',
        initials: 'VN',
        rating: 5,
        text: 'The balance between rigorous board preparation and sports at EAK is unmatched. The teachers know every student personally and keep parents updated through the app.',
      },
      {
        name: 'Dr. Meera & Dr. Kunal Verma',
        role: 'Parents of Aarav (Grade 11 – Science)',
        initials: 'MV',
        rating: 5,
        text: 'From GPS-tracked buses to the robotics lab and career guidance cell in Grade 11, EAK truly delivers a safe, modern, and future-ready environment.',
      },
    ],

    /* ------------------------------------------------------------------ 11 FAQ */
    faqs: [
      {
        q: 'Which classes are accepting applications for the 2027–28 academic session?',
        a: 'Applications are open for Grades 1 to 12, including Science, Commerce and Humanities streams in Grade 11. Seats in Grades 10 and 12 are limited lateral-entry places, offered strictly on transfer cases and merit.',
      },
      {
        q: 'What does the entrance assessment or interaction involve?',
        a: 'For Grades 1 to 5, we conduct an informal, stress-free child and parent interaction to understand readiness. For Grades 6 to 12, students take a short baseline proficiency assessment in English, Mathematics, and Integrated Science.',
      },
      {
        q: 'How can we schedule a guided campus visit before applying?',
        a: 'Click any "Schedule a Visit" or "Book a Campus Visit" button on this page to pick your preferred date and time slot. Campus tours are conducted Monday through Saturday between 9:30 AM and 3:30 PM.',
      },
      {
        q: "What if we don't have the original Transfer Certificate (TC) at the time of application?",
        a: 'You may apply using the birth certificate and latest mid-term/annual report card. The original Transfer Certificate from the previous school can be submitted up to 15 days before the new session commences in April 2027.',
      },
      {
        q: 'Can the annual tuition fee be paid in installments?',
        a: 'Yes, the annual fee can be paid in four equal quarterly installments (April, July, October, and January) via our online parent portal with zero convenience fee.',
      },
      {
        q: 'What is the minimum age for admission to Grade 1?',
        a: 'Children must have completed 6 years of age on or before 31 March 2027. For higher grades, admission follows the age bands listed under Academic Programs.',
      },
    ],

    /* --------------------------------------------------- Enquiry dialog modes
     * date: false | 'optional' | 'required'; slot: show a time-slot picker.   */
    intents: {
      apply: {
        title: 'Apply for 2027–28',
        badge: 'Application',
        lead: 'Share a few details to start your application. Our admissions desk will confirm next steps within 24 working hours.',
        dateLabel: 'Preferred Interaction Date (optional)',
        date: 'optional',
        slot: false,
        submit: 'Submit Application',
      },
      visit: {
        title: 'Schedule a Campus Visit',
        badge: 'Campus Visit',
        lead: 'Pick a date and slot for a guided tour. Tours run Monday to Saturday, 9:30 AM – 3:30 PM.',
        dateLabel: 'Preferred Visit Date',
        date: 'required',
        slot: true,
        submit: 'Book My Visit',
      },
      talk: {
        title: 'Talk to Our Admissions Team',
        badge: 'Callback',
        lead: 'Tell us how to reach you and a counsellor will call back within 24 working hours.',
        date: false,
        slot: false,
        submit: 'Request a Callback',
      },
      fee: {
        title: 'Request Fee Breakdown',
        badge: 'Fee Enquiry',
        lead: 'We will email the detailed fee schedule, instalment plan and scholarship criteria.',
        date: false,
        slot: false,
        submit: 'Send Me the Fee Details',
      },
      enquire: {
        title: 'Admission Enquiry',
        badge: 'Enquiry',
        lead: 'Fill out the details below and our admissions desk will get back to you shortly.',
        date: false,
        slot: false,
        submit: 'Submit Enquiry',
      },
    },
    visitSlots: ['9:30 AM – 11:00 AM', '11:00 AM – 12:30 PM', '12:30 PM – 2:00 PM', '2:00 PM – 3:30 PM'],
    grades: [
      { value: 'primary', label: 'Grades 1–5 (Primary)' },
      { value: 'middle', label: 'Grades 6–8 (Middle)' },
      { value: 'secondary', label: 'Grades 9–10 (Secondary)' },
      { value: 'senior', label: 'Grades 11–12 (Senior Secondary)' },
    ],
  };
})();
