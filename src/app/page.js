// src/app/page.js
"use client"
import DarkVeil from "@/blocks/Backgrounds/DarkVeil/DarkVeil";
import { Header } from "@/components/Header";
import { HeroWithCards } from "@/components/HeroWithCards";
import { FeaturesSection } from "@/components/FeaturesSection";
import { AboutSection } from "@/components/AboutSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen">
      
      <div className="fixed inset-0 z-0">
        <DarkVeil />
      </div>

      <div className="relative z-10">
        <Header />
        <HeroWithCards />
        <FeaturesSection />
        <AboutSection />
        <Footer />
      </div>

    </main>
  );
}