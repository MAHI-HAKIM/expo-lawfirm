import About from "@/components/main/Landing/About";
import Blog from "@/components/main/Landing/Blog";
import CaseStudies from "@/components/main/Landing/CaseStudies";
import Contact from "@/components/main/Landing/Contact";
import Faq from "@/components/main/Landing/Faq";
import Hero from "@/components/main/Landing/Hero";
import Services from "@/components/main/Landing/Services";
import Stats from "@/components/main/Landing/Stats";
import Team from "@/components/main/Landing/Team";
import Testimonials from "@/components/main/Landing/Testimonals";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <About />
      <Team />
      <Stats />
      <CaseStudies />
      <Testimonials />
      <Blog />
      <Faq />
      <Contact />
    </>
  );
}
