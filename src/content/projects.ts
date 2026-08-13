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
      "Monorepo platform that converts any Gregorian date into the full Balinese Wariga calendar and scores it for six categories of Hindu ceremony, with a color-coded month view and the five nearest good dates for whichever ceremony is selected.",
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
    summary:
      "Fully prerendered marketing site for a Bali photobooth-rental business, with Indonesian and English served as two separate indexable URL trees and every call to action pointed at one conversion: a WhatsApp booking chat.",
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
