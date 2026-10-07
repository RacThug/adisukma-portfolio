import { education } from "@/content/experience";
import { clientFaq } from "@/content/hiring";
import type { Project } from "@/content/projects";
import { site } from "@/content/site";

const personId = `${site.url}/#person`;
const websiteId = `${site.url}/#website`;
const serviceId = `${site.url}/services#service`;

const knowsAbout = [
  "Next.js",
  "NestJS",
  "TypeScript",
  "React",
  "Node.js",
  "PHP",
  "Symfony",
];

function faqEntities() {
  return clientFaq.map((entry) => ({
    "@type": "Question",
    name: entry.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: entry.answer,
    },
  }));
}

/**
 * Home page graph. `imageUrl` is passed in so this module does not import the
 * portrait: the page already does, and a test can call this without a bundler.
 */
export function homeJsonLd(imageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: site.name,
        alternateName: site.fullName,
        jobTitle: site.role,
        description: site.description,
        email: `mailto:${site.email}`,
        url: site.url,
        image: imageUrl,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Denpasar",
          addressRegion: "Bali",
          addressCountry: "ID",
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: education.school,
        },
        knowsLanguage: [...site.languages],
        knowsAbout,
        sameAs: [site.linkedin, site.github],
        makesOffer: {
          "@type": "Offer",
          "@id": `${site.url}/#offer`,
          url: `${site.url}/services`,
          itemOffered: { "@id": serviceId },
        },
      },
      {
        "@type": "Service",
        "@id": serviceId,
        name: "Website and web app development",
        serviceType: "Freelance web development",
        description: site.servicesDescription,
        url: `${site.url}/services`,
        provider: { "@id": personId },
        areaServed: ["Denpasar", "Bali", "Remote"],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: site.url,
        name: site.name,
        description: site.description,
        inLanguage: "en",
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${site.url}/#profile`,
        url: site.url,
        name: site.title,
        inLanguage: "en",
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
      },
      {
        "@type": "FAQPage",
        "@id": `${site.url}/#faq`,
        url: `${site.url}/#faq`,
        isPartOf: { "@id": websiteId },
        mainEntity: faqEntities(),
      },
    ],
  };
}

export function projectJsonLd(project: Project) {
  const url = `${site.url}/projects/${project.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        name: project.title,
        description: project.seoDescription,
        url,
        inLanguage: "en",
        keywords: project.tech.join(", "),
        about: project.type,
        author: { "@id": personId },
        creator: { "@id": personId },
      },
      breadcrumb([
        { name: "Home", item: site.url },
        { name: "Projects", item: `${site.url}/#projects` },
        { name: project.title, item: url },
      ]),
    ],
  };
}

export function servicesJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${site.url}/services#webpage`,
        url: `${site.url}/services`,
        name: "Freelance Web Development in Bali",
        description: site.servicesDescription,
        inLanguage: "en",
        isPartOf: { "@id": websiteId },
        about: { "@id": serviceId },
        mainEntity: { "@id": serviceId },
      },
      {
        "@type": "Service",
        "@id": serviceId,
        name: "Website and web app development",
        serviceType: "Freelance web development",
        description: site.servicesDescription,
        url: `${site.url}/services`,
        provider: { "@id": personId },
        areaServed: ["Denpasar", "Bali", "Remote"],
      },
      {
        "@type": "FAQPage",
        "@id": `${site.url}/services#faq`,
        url: `${site.url}/services`,
        isPartOf: { "@id": websiteId },
        mainEntity: faqEntities(),
      },
      breadcrumb([
        { name: "Home", item: site.url },
        { name: "Freelance services", item: `${site.url}/services` },
      ]),
    ],
  };
}

function breadcrumb(items: { name: string; item: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  };
}
