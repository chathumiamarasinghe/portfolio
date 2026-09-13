import { About } from "@/components/About";
import { ArticlesSection } from "@/components/ArticlesSection";
import { Certificates } from "@/components/Certificates";
import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { Navbar } from "@/components/Navbar";
import { OpenSource } from "@/components/OpenSource";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";

export default function Home() {
  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Navbar />
      <main>
        <HeroSection />
        <About />
        <Skills />
        <Projects />
        <OpenSource />
        <Certificates />
        <ArticlesSection />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
