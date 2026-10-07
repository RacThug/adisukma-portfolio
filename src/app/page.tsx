import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { Nav } from "@/components/nav";
import { site } from "@/content/site";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Faq } from "@/components/sections/hiring";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { homeJsonLd } from "@/lib/structured-data";
import profilePhoto from "@/assets/profile-photo.png";

export default function Home() {
  return (
    <>
      <JsonLd data={homeJsonLd(`${site.url}${profilePhoto.src}`)} />
      <Nav />
      <main className="flex-1">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
