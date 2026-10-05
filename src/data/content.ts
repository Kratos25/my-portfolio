// ─────────────────────────────────────────────────────────────
//  Everything personal lives in this file. Edit it, and the
//  whole studio (3D labels, terminal, quick view) updates.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Abhijeet Giri',
  role: 'Software engineer',
  tagline: 'I build fast, careful software for the web — and occasionally rooms like this one.',
  location: 'Somewhere with good Wi-Fi',
  availability: 'Open to new roles from January',
  focus: 'Full-stack web, real-time systems, 3D on the web',
  email: 'abhijeetgiri75@gmail.com',
  github: 'Kratos25',
  links: [
    { label: 'GitHub', href: 'https://github.com/Kratos25' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/abhijeet-giri-242612171?utm_source=share_via&utm_content=profile&utm_medium=member_android' },
  ],
  resumeUrl: '#',
  about: [
    "I'm a software engineer who likes the whole stack: the database schema nobody sees, the API that has to stay fast, and the last 2px of the interface.",
    'Most of my best work happens late at night, at a desk that looks a lot like this one. Coffee helps. So does the duck.',
  ],
}

export type Project = {
  slug: string
  title: string
  year: string
  summary: string
  problem: string
  outcome: string
  stack: string[]
  link?: string
  repo?: string
}

export const projects: Project[] = [
  {
    slug: 'explore-roots',
    title: 'Explore Roots',
    year: '2026',
    summary:
      'Car rental and tour package site for a North East India travel operator.',
    problem:
      'Every booking started as a WhatsApp message with no context — the operator had to ask which vehicle, which package and which dates before quoting anything.',
    outcome:
      'Each Book Now link opens WhatsApp pre-filled with the vehicle, rate and package tier, so enquiries arrive ready to quote. Static pages, ~100 kB first load.',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'JSON-LD', 'sharp'],
    link: 'https://www.exploreroots.in/',
    repo: '#',
  },
  {
    slug: 'white-room-media',
    title: 'White Room Media',
    year: '2026',
    summary:
      'Photography and videography portfolio website for White Room Media, built to showcase creative work across weddings, clubs, DJs, corporate events and fashion shoots.',
    problem:
      'The media portfolio needed a premium online presence that could showcase photography and video work while giving visitors an immersive first impression of the brand.',
    outcome:
      'Built a responsive portfolio experience with an interactive 3D camera showcase on the homepage, Firebase-powered media management, category-based filtering, and fullscreen image and video viewing.',
    stack: [
      'React',
      'Tailwind CSS',
      'Three.js',
      'React Three Fiber',
      'Firebase',
      'Firebase Storage',
      'Firestore',
      'AOS'
    ],
    link: 'https://whiteroommedia.com/',
    repo: '#',
  },
  {
    slug: 'amara-beauty-parlour',
    title: 'Amara Beauty Parlour',
    year: '2026',
    summary:
      'Full-stack beauty salon website with admin panel for a luxury parlour in Kalewadi, Pune.',
    problem:
      'The parlour had no online presence — bookings came through word of mouth and WhatsApp, with no way to manage clients, showcase work or track appointment history.',
    outcome:
      'A complete web presence with online booking, WhatsApp + email notifications, a dynamic gallery and before/after showcase, a full admin panel with customer profiles, booking management, and Supabase-backed CMS — all self-managed without touching code.',
    stack: [
      'Next.js',
      'React',
      'Tailwind CSS',
      'TypeScript',
      'Supabase',
      'PostgreSQL',
      'Supabase Storage',
      'Supabase Auth',
      'EmailJS',
      'JSON-LD',
    ],
    link: 'https://www.amarabeautyparlour.com/',
    repo: '#',
  },
]

export const stack: { shelf: string; books: string[] }[] = [
  { shelf: 'Languages', books: ['TypeScript', 'JavaScript', 'Python', 'SQL'] },
  { shelf: 'Frontend', books: ['React', 'React Native', 'Next.js', 'Three.js', 'Tailwind', 'GSAP'] },
  { shelf: 'Backend', books: ['Node.js', 'PostgreSQL', 'Redis', 'GraphQL', 'REST'] },
  { shelf: 'Tooling', books: ['Docker', 'GitHub Actions', 'Vite', 'Linux', 'RBAC'] },
]

export const experience = [
  { when: '2025 — now', role: 'Full Stack Engineer', org: 'Mahindra Teqo', note: '--.' },
  { when: 'Apr 2024 — Dec 2024', role: 'Data Science Intern', org: 'Mahindra Group', note: 'Worked on AI/ML projects including First Time Resolution(FTR) achieving high accuracy in output also worked on the OCR using OpenCV, Tesseract.' },
  { when: '2023 — 2024', role: 'Founder', org: 'AseoFrames', note: 'Built a frame company and got to learn about the business' },
  { when: '2021 — 2022', role: 'Associate Software Developer', org: 'Qurinom Solutions', note: 'Creation of a business-focused platform resembling Instagram Reels.' },
  { when: '2017 — 2022', role: 'B.Tech, Computer Science', org: 'MIT ADT Loni', note: 'Final-year project on CCTV Anomaly Detection.' },
]

export const githubFallback = { repos: 42, followers: 310, contributionsThisYear: 1187 }
