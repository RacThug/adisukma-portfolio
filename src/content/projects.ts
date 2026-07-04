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
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
