// src/app/page.js
"use client";
import DarkVeil from "@/blocks/Backgrounds/DarkVeil/DarkVeil"; // Corrected import path
import { Header } from "@/components/Header";           // Your new header
import { HeroSection } from "@/components/HeroSection"; // Your updated hero

export default function Home() {
  return (
    // The main container needs to be relative for the background to sit correctly.
    <main className="relative w-full min-h-screen">
      
      {/* Layer 1: The Animated Background */}
      {/* The `fixed` and `inset-0` classes make it fill the whole screen behind everything */}
      <div className="fixed inset-0 z-0">
        <DarkVeil />
      </div>

      {/* Layer 2: Your Page Content */}
      {/* The `relative z-10` ensures this content is displayed on top of the background */}
      <div className="relative z-10">
        <Header />
        <HeroSection />
        {/* You can add a Features section, Pricing, etc. right here */}
      </div>

    </main>
  );
}