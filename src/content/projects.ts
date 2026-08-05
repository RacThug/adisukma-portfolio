export interface Project {
  slug: string;
  index: string;
  title: string;
  type: string;
  role: string;
  summary: string;
  problem: string;
  built: string;
  highlights: string[];
  tech: string[];
  /** Subset of tech shown on the home-page card */
  featuredTech: string[];
  /** Public deployment, when the work is not client-confidential */
  liveUrl?: string;
  /** Public source, when the work is not client-confidential */
  repoUrl?: string;
}

export const projects: Project[] = [
  {
    slug: "construction-compliance-platform",
    index: "01",
    title: "Construction Compliance Management System",
    type: "B2B PLATFORM · FULLSTACK",
    role: "Fullstack Developer",
    summary:
      "Monorepo platform that digitizes inspection-survey workflows and auto-generates 8 types of regulatory PDF documents, with role-based access control, SaaS synchronization, and automated backup pipelines.",
    problem:
      "A construction/demolition business needed to meet strict regulatory requirements that traditionally rely on manual paperwork: inspection surveys, work plans, reports, and site signage all filled in by hand.",
    built:
      "Contributed to a monorepo platform that digitizes the inspection-survey workflow and auto-generates 8 types of regulatory PDF documents from structured data. The system manages projects, partner organizations, staff, and worker certifications, with role-based access control, hourly synchronization with an external management SaaS, and automated database/file backup pipelines to cloud storage.",
    highlights: [
      "Automated regulatory document generation (Puppeteer-rendered PDFs), replacing manual paperwork",
      "Role-based access control and admin user management",
      "Scheduled backup jobs with tiered retention",
      "OAuth-based sync with a third-party SaaS",
    ],
    tech: [
      "TypeScript",
      "Next.js 15",
      "React 19",
      "Mantine UI",
      "TanStack Query",
      "NestJS 10",
      "Drizzle ORM",
      "MariaDB",
      "NextAuth (JWT/RBAC)",
      "Puppeteer",
      "Cloudflare R2 / MinIO",
      "Docker",
      "pnpm",
      "Turborepo",
    ],
    featuredTech: ["TypeScript", "Next.js 15", "NestJS 10", "Drizzle ORM", "Puppeteer"],
  },
  {
    slug: "specialty-paper-ecommerce",
    index: "02",
    title: "Specialty-Paper E-Commerce Platform",
    type: "CUSTOMIZED E-COMMERCE · B2C/B2B",
    role: "Web Developer",
    summary:
      "Deeply customized EC-CUBE store with a paper-industry product model, mini-sample ordering, a B2B quotation module, headless-CMS content, and multiple payment gateways.",
    problem:
      "A specialty-paper retailer needed to sell thousands of products online with industry-specific attributes (brand, color, texture, basis weight, eco-friendliness) that a generic store can't express, plus B2B buying behavior like sample orders and quotations.",
    built:
      "Developed on EC-CUBE 4.3 (Symfony / PHP), deeply customizing the core with a paper-industry product model, a mini-sample ordering flow, a B2B quotation (estimate) module, headless-CMS content integration, and admin workflows for bulk CSV import and PDF receipt/delivery-note generation. Integrated credit-card and B2B invoice payment gateways.",
    highlights: [
      "30+ custom domain entities and 75+ database migrations",
      "B2B quotation module on top of the standard cart flow",
      "Headless-CMS integration for editorial content",
      "Multiple payment gateways (card + B2B invoice)",
    ],
    tech: [
      "PHP 8.3",
      "Symfony 6.4",
      "EC-CUBE 4.3",
      "Doctrine ORM",
      "MySQL 8",
      "Twig",
      "Gulp",
      "Webpack 5",
      "Sass",
      "Tailwind CSS 3",
      "Docker",
      "PHPStan",
      "Codeception",
    ],
    featuredTech: ["PHP 8.3", "Symfony 6.4", "EC-CUBE 4.3", "Doctrine ORM", "MySQL 8"],
  },
  {
    slug: "dewasa-ayu-balinese-calendar",
    index: "03",
    title: "Dewasa Ayu: Balinese Auspicious-Day Finder",
    type: "PERSONAL PROJECT · FULLSTACK",
    role: "Solo Developer",
    summary:
      "Monorepo platform that converts any Gregorian date into the full Balinese Wariga calendar and scores it for six categories of Hindu ceremony, with a color-coded month view, nearest-good-date recommendations, and a public REST API.",
    problem:
      "Picking a good day (dewasa ayu) for a Balinese Hindu ceremony means reading the Wariga calendar: Pawukon, ten concurrent Wewaran cycles, Sasih, and Penanggal/Pangelong. Printed calendars show the raw components but not what they mean for a particular ceremony, so the first-pass shortlist is either guesswork or a trip to a Sulinggih for something a calculation can narrow down.",
    built:
      "Built the whole stack solo: a dependency-free TypeScript engine that derives every Balinese calendar component from a date, a rules package where each ceremony is a config object rather than a branch in the engine, a NestJS REST API over the same engine, and a Next.js 16 front end that renders the month grid, the per-date breakdown, and the five nearest good dates. Scores are weighted per ceremony and every factor behind a rating is shown, so a result can be audited rather than taken on faith. The site states plainly that it is a reference, not a replacement for a Sulinggih.",
    highlights: [
      "Dependency-free Wariga engine shared by the web app and the API, unit-tested against published calendars",
      "Ceremony rules live in config objects: a new ceremony is a data change, not an engine change",
      "Transparent scoring, with every factor behind a rating shown and its source cited",
      "Turborepo workspace with Vitest unit tests and a Playwright end-to-end suite",
      "Accessibility as a feature: font scaling, high-contrast mode, WCAG 2.1 AA target",
    ],
    tech: [
      "TypeScript",
      "Next.js 16",
      "React 19",
      "Tailwind CSS v4",
      "Radix UI",
      "Framer Motion",
      "nuqs",
      "NestJS",
      "Prisma",
      "PostgreSQL",
      "Redis",
      "Turborepo",
      "pnpm",
      "Vitest",
      "Playwright",
      "Vercel",
    ],
    featuredTech: ["TypeScript", "Next.js 16", "NestJS", "Turborepo", "Playwright"],
    liveUrl: "https://dewasa-ayu-web.vercel.app",
    repoUrl: "https://github.com/RacThug/dewasa-ayu",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
