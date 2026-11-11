import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { GamesCatalog } from "@/components/GamesCatalog";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { NewsSection } from "@/components/NewsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="w-full pt-20 bg-surface flex-1">
        <Hero />
        <GamesCatalog />
        <About />
        <Services />
        <NewsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
