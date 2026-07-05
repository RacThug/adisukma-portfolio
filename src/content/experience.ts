export interface ExperienceEntry {
  title: string;
  company: string;
  meta: string;
  period: string;
  current?: boolean;
  description: string;
  stack?: string;
}

export const experience: ExperienceEntry[] = [
  {
    title: "Programmer / Web Developer",
    company: "Grune Teknologi Indonesia",
    meta: "Full-time · Hybrid · Denpasar, Bali",
    period: "Jun 2025 - Jul 2026",
    description:
      "Built production web applications end to end, from feature planning through implementation, testing, and delivery. Delivered features across frontend and backend for full-scale platforms including a compliance system with automated document generation and a customized e-commerce store.",
    stack: "TypeScript, Next.js, React, NestJS, Node.js, PHP/Symfony",
  },
  {
    title: "Sourcing Associate",
    company: "Bent Blackstone & Associates Limited",
    meta: "Freelance · On-site · Bali",
    period: "Feb 2025 - May 2025",
    description:
      "Sourced qualified legal candidates across the APAC region and maintained a structured candidate database. Managed and updated the company website across AU, APAC, and UK regions.",
  },
  {
    title: "Front-End & Back-End Web Developer",
    company: "MSIB Kampus Merdeka (Dicoding Indonesia)",
    meta: "Full-time · Remote",
    period: "Feb 2023 - Jul 2023",
    description:
      "Completed an intensive front-end and back-end web development program, building web applications and learning modern JavaScript, HTML/CSS, and backend fundamentals through hands-on projects.",
  },
];

export const education = {
  school: "Institut Teknologi dan Bisnis STIKOM Bali",
  degree: "Bachelor's, Information Systems",
};
