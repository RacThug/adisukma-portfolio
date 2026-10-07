export const site = {
  name: "Adi Sukma",
  /** Legal name, as printed on the CV shipped with this site. */
  fullName: "I Made Adi Sukma Meta",
  role: "Freelance Fullstack Web Developer",
  /** Document title for the home page. Kept short enough for a search result. */
  title: "Adi Sukma · Freelance Fullstack Web Developer in Bali",
  location: "Denpasar, Bali, Indonesia",
  email: "madeadisukmameta@gmail.com",
  linkedin: "https://www.linkedin.com/in/adi-sukma",
  github: "https://github.com/RacThug",
  url: "https://adisukma.dev",
  /**
   * Spoken languages, from the CV in this repo. Distinct from the EN/JA
   * documentation note in `waysOfWorking`.
   */
  languages: ["Indonesian", "English"] as const,
  availability: "Taking freelance projects, remote or around Bali",
  /** One line for the hero pill and the social card. */
  availabilityBadge: "FREELANCE: remote · around Bali",
  description:
    "Freelance fullstack developer in Denpasar, Bali. I build production websites and web apps with Next.js, NestJS, and TypeScript. Taking freelance projects.",
  servicesDescription:
    "Freelance web development from Denpasar, Bali. Production websites and web apps with Next.js, NestJS, TypeScript, and PHP. Remote, or on-site around Bali.",
  tagline: {
    pre: "Building ",
    highlight: "real-world production",
    post: " web apps with Next.js, NestJS & TypeScript, end to end.",
  },
  intro:
    "Freelance fullstack web developer building production web applications end to end: React / Next.js on the front, NestJS / Node.js (and PHP / Symfony) on the back, TypeScript throughout.",
  shortBio:
    "I'm a freelance fullstack web developer based in Denpasar, Bali, with hands-on experience shipping full-scale production web applications. I work across the stack, with React / Next.js on the frontend, NestJS / Node.js (plus PHP / Symfony) on the backend, and TypeScript end to end.",
  longBio: [
    "I'm a freelance fullstack web developer who enjoys turning messy, manual processes into clean, reliable software. Over the past year I've contributed to several production systems, from a compliance platform that automates regulatory document generation to a customized e-commerce store.",
    "My core stack is TypeScript with Next.js / React on the frontend and NestJS / Node.js on the backend, and I'm comfortable in PHP / Symfony environments too. I care about shipping features end to end: understanding the spec, building the frontend and backend, writing tests, and getting it to production.",
    "I graduated in Information Systems from Institut Teknologi dan Bisnis STIKOM Bali. I take freelance projects remotely, and on-site around Denpasar and Bali, across frontend, backend, and fullstack work.",
  ],
  cvPath: "/cv/adi-sukma-cv.pdf",
  cvDownloadName: "CV_I_Made_Adi_Sukma_Meta_2026.pdf",
} as const;
