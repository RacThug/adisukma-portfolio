export interface Project {
  slug: string;
  index: string;
  title: string;
  type: string;
  role: string;
  contribution: string;
  /** A simplified flow of the documented product, not a screenshot or full architecture. */
  workflow: { title: string; description: string }[];
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
    contribution:
      "Contributed as a fullstack developer to a shared inspection-survey and regulatory-document platform, working across the frontend and backend.",
    workflow: [
      { title: "Capture inspections", description: "Structured project and inspection-survey data replaces handwritten inputs." },
      { title: "Generate documents", description: "Puppeteer renders 8 types of regulatory PDF documents from that data." },
      { title: "Support operations", description: "SaaS synchronization and scheduled backups support the platform's ongoing use." },
    ],
    summary:
      "Digitizes inspection surveys and generates 8 types of regulatory PDF documents from structured data, replacing manual paperwork.",
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
    contribution:
      "Developed EC-CUBE customizations for the paper-industry product model, sample ordering, B2B quotations, admin workflows, and payment integrations.",
    workflow: [
      { title: "Find the right paper", description: "A custom product model expresses brand, color, texture, and basis weight." },
      { title: "Sample or quote", description: "Mini-sample ordering and B2B quotations support buying decisions." },
      { title: "Place an order", description: "Card and B2B invoice gateways support payment, with PDF delivery notes and receipts." },
    ],
    summary:
      "Adapts EC-CUBE to specialty-paper retail with a custom product model, sample orders, B2B quotations, and card or invoice payments.",
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
    contribution:
      "Built the calendar engine, configurable ceremony rules, and Next.js interface solo. The deployed app runs the engine in-process; the repository's NestJS REST service is not yet deployed.",
    workflow: [
      { title: "Choose a ceremony", description: "Select from six ceremony categories and browse a Gregorian month." },
      { title: "Calculate and score", description: "The TypeScript engine derives Wariga components; ceremony rules weigh each factor." },
      { title: "Compare dates", description: "See the five nearest good dates and the factors behind each rating." },
    ],
    summary:
      "Helps shortlist dates for six Balinese Hindu ceremony categories, showing the five nearest good dates and the factors behind each rating.",
    problem:
      "Picking a good day (dewasa ayu) for a Balinese Hindu ceremony means reading the Wariga calendar: Pawukon, ten concurrent Wewaran cycles, Sasih, and Penanggal/Pangelong. Printed calendars show the raw components but not what they mean for a particular ceremony, so the first-pass shortlist is either guesswork or a trip to a Sulinggih for something a calculation can narrow down.",
    built:
      "Built the whole stack solo: a dependency-free TypeScript engine that derives every Balinese calendar component from a date, a rules package where each ceremony is a config object rather than a branch in the engine, and a Next.js 16 front end that renders the month grid, the per-date breakdown, and the five nearest good dates. The deployed site runs the engine in-process; the repo also carries a NestJS service that exposes the same engine over REST for third-party consumers, which is not yet deployed. Scores are weighted per ceremony and every factor behind a rating is shown, so a result can be audited rather than taken on faith. The site states plainly that it is a reference, not a replacement for a Sulinggih.",
    highlights: [
      "Dependency-free Wariga engine, cross-checked against an independent Balinese-date library across a 20-year range",
      "Ceremony rules live in config objects: a new ceremony is a data change, not an engine change",
      "Transparent scoring, with every factor behind a rating shown in the UI rather than just a verdict",
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
  {
    slug: "mebo-photobooth-site",
    index: "04",
    title: "Mebo Photobooth: Bilingual Local-Business Site",
    type: "CLIENT SITE · FRONTEND & SEO",
    role: "Solo Developer",
    contribution:
      "Built and deployed the site solo, including separate Indonesian and English routes, typed content, structured data, and progressively enhanced motion and lightbox behavior.",
    workflow: [
      { title: "Find a local service", description: "Indonesian and English pages target their own search terms on separate URLs." },
      { title: "Explore the offer", description: "Prerendered pages present the photobooth business in each visitor's language." },
      { title: "Start a booking chat", description: "Calls to action open a prefilled WhatsApp conversation." },
    ],
    summary:
      "Gives a Bali photobooth business separate Indonesian and English search pages, with one booking path through WhatsApp.",
    problem:
      "The business sells through Instagram and WhatsApp, so nothing it publishes is reachable from a search for \"sewa photobooth Bali\". It also sells into two markets at once: local Indonesian customers, and the destination-wedding traffic that searches in English. One page in one language would miss half the demand, and two languages behind a toggle would leave one of them unindexable.",
    built:
      "Built the site solo on Next.js 16, every route prerendered at build time. Indonesian sits at / and English at /en as independent URLs rather than a toggle, targeting different keywords rather than translating each other, with hreflang linking only genuinely corresponding pages. All copy is typed content in one module per locale, so a missing field fails the build instead of rendering an empty section, and LocalBusiness, Offer and FAQPage JSON-LD are generated from that same content. Every section is a Server Component: the two client components render null and attach behaviour from the outside by data attribute, so adding motion or a lightbox never converts a section to a client component. Deployed on Vercel under the business's own domain, with a host-matched header keeping the *.vercel.app copies out of the index so only the canonical host is crawled.",
    highlights: [
      "Two locales as two indexable URL trees, each aimed at its own market instead of translating the other",
      "One conversion path: every call to action opens a prefilled WhatsApp chat, tagged with a single data attribute",
      "Server Components throughout: the two client components render null and attach behaviour by data attribute",
      "Animation that cannot break the page: hidden start states come from JavaScript rather than CSS, and the LCP hero is never animated",
      "GSAP ships in a lazy chunk, so it stays off the initial payload and reduced-motion visitors never download it",
      "LocalBusiness, Offer and FAQPage structured data generated from the same typed content the page renders",
      "Image size ladder and allowed qualities trimmed to the widths the layout actually requests",
    ],
    tech: [
      "TypeScript",
      "Next.js 16",
      "React 19",
      "Tailwind CSS v4",
      "GSAP / ScrollTrigger",
      "next/image",
      "JSON-LD",
      "Vercel",
    ],
    featuredTech: ["TypeScript", "Next.js 16", "Tailwind CSS v4", "GSAP", "Vercel"],
    liveUrl: "https://mebophotobooth.biz.id",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
