// src/app/page.js
"use client"; // Ensure this is a client component
import DarkVeil from "@/blocks/Backgrounds/DarkVeil/DarkVeil";
import { Header } from "@/components/Header";
import { HeroWithCards } from "@/components/HeroWithCards"; // <-- Import your new, combined hero

export default function Home() {
  return (
    <main className="relative w-full min-h-screen">
      
      {/* Layer 1: The Animated Background */}
      <div className="fixed inset-0 z-0">
        <DarkVeil />
      </div>

      {/* Layer 2: Your Page Content */}
      <div className="relative z-10">
        <Header />
        <HeroWithCards /> {/* <-- Use the new component here */}
        {/* 
          You can now delete the old HeroSection.jsx and ChatShowcase.jsx files 
          if you want to keep your project clean. 
        */}
      </div>

    </main>
  );
}