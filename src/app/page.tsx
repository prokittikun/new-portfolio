import About from "@/components/sections/About";
import Awards from "@/components/sections/Awards";
import Contact from "@/components/sections/Contact";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Work from "@/components/sections/Work";
import Writing from "@/components/sections/Writing";
import { getPostsMeta } from "@/lib/content";

export default function Home() {
  const posts = getPostsMeta();
  return (
    <main>
      <Hero />
      <About />
      <Work />
      <Projects />
      <Skills />
      <Awards />
      <Writing posts={posts} />
      <Contact />
    </main>
  );
}
