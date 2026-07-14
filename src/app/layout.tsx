import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AskAdi } from "@/components/chat/ask-adi";
import { site } from "@/content/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${site.role} (Next.js · NestJS · TypeScript)`,
    template: `%s · ${site.name}`,
  },
  description:
    "Fullstack web developer in Bali building production web apps with Next.js, NestJS, and TypeScript. Open to frontend, backend, and fullstack roles.",
  keywords: [
    "fullstack developer",
    "web developer",
    "Next.js",
    "NestJS",
    "React",
    "TypeScript",
    "Node.js",
    "PHP",
    "Symfony",
    "Bali",
    "Indonesia",
    "remote developer",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${site.name} · ${site.role}`,
    description:
      "Fullstack web developer in Bali building production web apps with Next.js, NestJS, and TypeScript.",
    url: site.url,
    siteName: site.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · ${site.role}`,
    description:
      "Fullstack web developer in Bali building production web apps with Next.js, NestJS, and TypeScript.",
  },
};

const themeInit = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t="dark";document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {/*
          The chat panel sets `inert` on this wrapper while it is open, which is
          what makes its `aria-modal` an honest claim rather than an assertion.
          The launcher and panel live outside it so they stay reachable.
        */}
        <div id="site-root" className="flex min-h-full flex-1 flex-col">
          {children}
        </div>
        <AskAdi />
      </body>
    </html>
  );
}
