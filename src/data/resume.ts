export type Work = {
  company: string;
  short: string;
  href: string;
  badge: string;
  location: string;
  title: string;
  logoUrl: string;
  start: string;
  end: string;
  bullets: string[];
  stack: string[];
};

export type Project = {
  slug: string;
  title: string;
  dates: string;
  description: string;
  tagline: string;
  technologies: string[];
  links: { label: string; href: string }[];
  image: string;
  accent: string;
};

export type Competition = {
  title: string;
  result: string;
  dates: string;
  location: string;
  description: string;
  image: string;
};

export const DATA = {
  name: "Kittikun Buntoyut",
  firstName: "Kittikun",
  lastName: "Buntoyut",
  handle: "prokittikun",
  url: "https://www.kittikun.dev",
  role: "Software Engineer",
  location: "Bangkok, Thailand",
  timezone: "Asia/Bangkok",
  motto: "No Boundary, Make Tomorrow Better than Today",
  summary:
    "Computer Science graduate from Kasetsart University, working full-time as a Software Engineer. I enjoy working across the whole stack, from shaping the data model to polishing the last pixel, and I care about building things that stay reliable as they grow.",
  about: [
    "I'm a software engineer from Thailand who likes the whole stack: designing schemas, wiring up queues, shipping UIs and then trying to break all of it with load and security tests.",
    "My path started at programming competitions in vocational college and continued through a CS degree at Kasetsart. Along the way I picked up a habit of learning in public, writing up what I figure out so the next person has an easier time.",
  ],
  avatarUrl: "/portrait-stairs.jpg",
  contact: {
    email: "pro.kittikun.2546@gmail.com",
    social: [
      { name: "GitHub", url: "https://github.com/prokittikun" },
      { name: "LinkedIn", url: "https://www.linkedin.com/in/prokittikun/" },
      { name: "Instagram", url: "https://www.instagram.com/_pro.kittikun/" },
      { name: "Medium", url: "https://medium.com/@pro.kittikun.2546" },
    ],
  },
  stats: [
    { value: 5, suffix: "+", label: "Years building software, since my first internship in 2021" },
    { value: 7, suffix: "", label: "Projects featured here" },
    { value: 7, suffix: "", label: "Competitions, hackathons and CTFs" },
    { value: 3, suffix: "", label: "Podium finishes, including a 1st place" },
  ],
  skills: {
    Languages: ["TypeScript", "JavaScript", "Go", "Java", "SQL", "Dart"],
    Frontend: ["React", "Next.js", "Vue.js", "Angular", "Flutter", "Tailwind CSS"],
    Backend: ["Node.js", "NestJS", "Express", "tRPC", "Prisma", "Sequelize", "RabbitMQ"],
    "AI & Data": ["Mastra AI", "Supabase", "ClickHouse", "PostgreSQL", "MySQL", "MongoDB", "Redis"],
    "DevOps & QA": ["Docker", "Kubernetes", "AWS", "GitHub Actions", "Playwright", "k6", "Grafana", "Trivy"],
  } as Record<string, string[]>,
  work: [
    {
      company: "Orange Cap Innovative Co., Ltd.",
      short: "Orange Cap",
      href: "https://www.orangecapinnovative.com/",
      badge: "Full-time",
      location: "Bangkok, Thailand",
      title: "Software Engineer",
      logoUrl: "/experience/orangecap.png",
      start: "Apr 2026",
      end: "Present",
      bullets: [
        "Built an AI customer support agent for WhatsApp/Facebook Messenger using TypeScript, Mastra AI, Supabase, and ClickHouse, with semantic search, LLM-based response evaluation, and escalation routing, cutting manual support workload by 90%.",
        "Built an Innovation Management System (IMS) for student project tracking, evaluations, grading, and approvals using Next.js, TypeScript, MongoDB. Ran automated tests with Playwright and built k6 load testing (600+ concurrent users) with Grafana dashboards, plus OWASP Top 10 security testing.",
        "Built inventory and procurement features (stock issuance, replenishment, adjustments, physical counts) for a dental clinic management platform, integrated with ERP; supported PR/PO/GR workflows using Vue.js, Node.js/Express, MySQL, with unit tests for core logic.",
        "Integrated LINE Login and Messaging API into a clinical case-management platform, enabling physicians to link LINE accounts and receive notifications for case mentions and consultant invitations.",
        "Built internal HR systems (self-assessments, manager evaluations, employee/asset management) using Next.js, TypeScript, MongoDB.",
        "Technical Assistant for external workshops on AI-assisted web development and branding/CI fundamentals.",
      ],
      stack: [
        "TypeScript",
        "Mastra AI",
        "Supabase",
        "ClickHouse",
        "Next.js",
        "MongoDB",
        "Playwright",
        "k6",
        "Grafana",
        "Vue.js",
        "Express",
        "MySQL",
        "LINE API",
      ],
    },
    {
      company: "SkillLane Technology Public Co., Ltd.",
      short: "SkillLane",
      href: "https://www.skilllane.com/",
      badge: "Internship",
      location: "Bangkok, Thailand",
      title: "Software Engineer",
      logoUrl: "/experience/skilllane.png",
      start: "Jun 2025",
      end: "Oct 2025",
      bullets: [
        "Collaborated in an Agile team with daily scrums, sprint planning, and sprint demos to deliver B2B e-learning platform features for enterprise clients using Next.js, Ant Design, and Redux-Saga with Atomic Design Methodology.",
        "Developed full-stack applications with a NestJS and TypeScript backend following Clean Architecture, integrated MongoDB for storage and RabbitMQ for messaging, and implemented CI/CD with GitHub Actions and Trivy security scanning for Docker images.",
        "Designed and tested Kubernetes liveness probes integrated with health check APIs to automatically recover services during dependency failures, running controlled experiments to validate resilience when services lose connectivity to RabbitMQ.",
      ],
      stack: ["Next.js", "Ant Design", "Redux-Saga", "NestJS", "MongoDB", "RabbitMQ", "GitHub Actions", "Trivy", "Kubernetes"],
    },
    {
      company: "Siam IT Networking (Thailand) Co., Ltd.",
      short: "Siam IT",
      href: "https://siamit.co.th/",
      badge: "Part-time",
      location: "Surat Thani, Thailand",
      title: "Software Engineer",
      logoUrl: "/experience/siamit.png",
      start: "Sep 2021",
      end: "Dec 2021",
      bullets: [
        "Developed a hospital mobile app (Angular/Ionic) with an e-commerce system for in-hospital convenience products.",
        "Implemented bilingual support (i18n) for a Thai Food mobile app using Angular/Ionic, improving accessibility for international users.",
      ],
      stack: ["Angular", "Ionic", "i18n"],
    },
    {
      company: "Siam IT Networking (Thailand) Co., Ltd.",
      short: "Siam IT",
      href: "https://siamit.co.th/",
      badge: "Internship",
      location: "Surat Thani, Thailand",
      title: "Software Engineer",
      logoUrl: "/experience/siamit.png",
      start: "May 2021",
      end: "Aug 2021",
      bullets: [
        "Developed a dynamic marketing report website for a food delivery application using Angular, improving data visualization and strategic decision-making.",
        "Built a subscription-based stock trading alert platform using Angular, NestJS, and MongoDB with Socket.IO for real-time buy/sell signals, with monthly and annual subscription models.",
      ],
      stack: ["Angular", "NestJS", "MongoDB", "Socket.IO"],
    },
  ] satisfies Work[],
  education: {
    school: "Kasetsart University",
    href: "https://www.ku.ac.th",
    degree: "B.Sc. Computer Science",
    logoUrl: "/kulogo.png",
    start: "Jun 2022",
    end: "Mar 2026",
  },
  projects: [
    {
      slug: "notification-amqp",
      title: "Notification AMQP",
      dates: "Aug 2025",
      tagline: "Queue-driven email delivery",
      description:
        "A personal project to explore Clean Architecture, NestJS, RabbitMQ, and asynchronous email processing with @nestjs-modules/mailer. Features message queuing, dead letter queues for error handling, and queue monitoring for reliable delivery.",
      technologies: ["NestJS", "TypeScript", "RabbitMQ", "Nodemailer"],
      links: [
        { label: "Client source", href: "https://github.com/prokittikun/notification-amqp-client" },
        { label: "Service source", href: "https://github.com/prokittikun/notification-amqp" },
      ],
      image: "/thumbnail/notification.png",
      accent: "#ff6a2b",
    },
    {
      slug: "badbuddy",
      title: "BadmintonBuddy",
      dates: "Oct 2024",
      tagline: "Badminton meetups, sorted",
      description:
        "A web app for organizing badminton meetups: create events, invite players, and manage court bookings. (Coursework: 01418471 Software Design and Development)",
      technologies: ["Next.js", "TypeScript", "tRPC", "Go", "Tailwind CSS", "Mantine UI", "Docker"],
      links: [{ label: "Source", href: "https://github.com/prokittikun/badbuddy" }],
      image: "/thumbnail/badmintonbuddy.png",
      accent: "#3ddc97",
    },
    {
      slug: "buildwise",
      title: "BuildWise",
      dates: "Jun – Oct 2024",
      tagline: "Construction planning & BOQ",
      description:
        "Plans and manages construction work, including BOQ preparation and quotation generation. Centralizes materials, jobs, suppliers, companies, and clients to cut human error and streamline the workflow. (Coursework: 01418321 System Analysis and Design)",
      technologies: ["Next.js", "TypeScript", "Go", "PostgreSQL", "Tailwind CSS", "Mantine UI", "Docker", "Puppeteer"],
      links: [
        { label: "Frontend source", href: "https://github.com/prokittikun/construction-planner" },
        { label: "Backend source", href: "https://github.com/prokittikun/boonkosang-construction-be" },
      ],
      image: "/thumbnail/buildwise.png",
      accent: "#ffc53d",
    },
    {
      slug: "rcpanda",
      title: "RC Panda",
      dates: "Apr 2024",
      tagline: "Game platform & top-ups",
      description:
        "A web platform for the Raycity game on the Panda server: player account management, TrueWallet top-up, admin tools, and an analytics dashboard that supports monetization.",
      technologies: ["Next.js", "TypeScript", "tRPC", "SQL Server", "Prisma", "Tailwind CSS", "Next UI", "Cloudflare"],
      links: [],
      image: "/thumbnail/rcpanda.png",
      accent: "#7c5cff",
    },
    {
      slug: "campfin",
      title: "Campfin",
      dates: "Dec 2023 – Mar 2024",
      tagline: "Find your camping crew",
      description:
        "A mobile app to post trips, join existing ones, and chat with other participants. Supports authentication and makes it easy to coordinate with fellow campers. (Coursework: 01418342 Mobile Application)",
      technologies: ["Flutter", "Dart", "NestJS", "Firebase", "PostgreSQL", "Prisma", "Docker"],
      links: [
        { label: "Frontend source", href: "https://github.com/CS342-Mobile-Application/Campfin/tree/develop" },
        { label: "Backend source", href: "https://github.com/prokittikun/MOBILE-CAMPFIN-BACKEND" },
      ],
      image: "/thumbnail/campfin.png",
      accent: "#2bb3ff",
    },
    {
      slug: "kutalks",
      title: "KU Talks",
      dates: "Nov – Dec 2023",
      tagline: "Registration for KU's 80th",
      description:
        "Registration management system for the KU-HUM Academic Talk Series, celebrating the 80th anniversary of Kasetsart University.",
      technologies: ["Next.js", "TypeScript", "tRPC", "NextAuth", "Prisma", "PostgreSQL", "Ant Design", "Nodemailer"],
      links: [{ label: "Website", href: "https://kutalks.ku.ac.th" }],
      image: "/thumbnail/kutalks.png",
      accent: "#00c48c",
    },
    {
      slug: "kusd",
      title: "KU SD",
      dates: "Apr – Dec 2023",
      tagline: "Student org approvals, online",
      description:
        "Streamlines document handling and project approvals for student organizations at Kasetsart University through one centralized online system.",
      technologies: ["Next.js", "TypeScript", "tRPC", "PostgreSQL", "Tailwind CSS", "Mantine UI", "Docker"],
      links: [{ label: "Website", href: "https://saku.sa.ku.ac.th/" }],
      image: "/thumbnail/kusd.png",
      accent: "#ff4d8d",
    },
  ] satisfies Project[],
  competitions: [
    {
      title: "ExxonMobil Bootcathon 2024",
      result: "Analytics / ML track",
      dates: "Jun 2024",
      location: "Bangkok",
      description:
        "Analyzed data and used ML tools hands-on to surface insights for improving future sales performance.",
      image: "/thumbnail/exxon.png",
    },
    {
      title: "RTARF Cyber Warrior Contest 2023",
      result: "Top 16 / 40 teams",
      dates: "Jul 2023",
      location: "Bangkok",
      description:
        "University-level Capture the Flag competition with 40 teams from 14+ universities. Reached the Top 16 as a team of three.",
      image: "/thumbnail/rtarf.png",
    },
    {
      title: "HACKaTHAILAND 2023",
      result: "Final 500 teams",
      dates: "Jul 2023",
      location: "Bangkok",
      description:
        "Built a blockchain system to securely share patient records across hospitals.",
      image: "/thumbnail/hackathailand.png",
    },
    {
      title: "AFTP National Programming (30th)",
      result: "Honorable mention · 6th",
      dates: "Feb 2022",
      location: "Phrae",
      description:
        "National-level computer programming competition among the top 15 regional teams in Thailand.",
      image: "/thumbnail/aft.png",
    },
    {
      title: "AFTP Southern Programming (32nd)",
      result: "1st runner-up",
      dates: "Feb 2022",
      location: "Trang",
      description:
        "Southern Thailand vocational skills competition in computer programming.",
      image: "/thumbnail/aft.png",
    },
    {
      title: "AFTP Southern Programming (31st)",
      result: "1st place",
      dates: "Mar 2021",
      location: "Nakhon Si Thammarat",
      description:
        "Won the Southern Thailand vocational skills competition in computer programming.",
      image: "/thumbnail/aft.png",
    },
    {
      title: "NECTEC R Cheewa Inno Camp 2020",
      result: "1st runner-up",
      dates: "Nov 2020",
      location: "Surat Thani",
      description:
        "Built a KidBright IoT flood warning system that monitors water levels and alerts via LINE Notify, competing against 10+ vocational colleges.",
      image: "/thumbnail/nectec.png",
    },
  ] satisfies Competition[],
};

export const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Stack" },
  { id: "awards", label: "Awards" },
  { id: "writing", label: "Writing" },
  { id: "contact", label: "Contact" },
] as const;
