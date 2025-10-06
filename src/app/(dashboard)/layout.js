// src/app/(dashboard)/layout.js
"use client";

import React, { useState } from "react";
import Image from "next/image"; // Import the Next.js Image component for the logo
import { UserButton } from "@clerk/nextjs";
import { DashboardNav } from "@/components/DashboardNav";
import Particles from "@/blocks/Backgrounds/Particles/Particles";
import Shuffle from "@/blocks/TextAnimations/Shuffle/Shuffle";
import SplitText from "@/blocks/TextAnimations/SplitText/SplitText";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelRightClose } from "lucide-react";
import { usePathname } from "next/navigation";

// A helper object to store our subtitles
const pageSubtitles = {
  "/dashboard": "An overview of your library's stats.",
  "/onboarding": "Sync your book collection with the AI.",
  "/snippets": "Integrate the assistant into your website.",
  "/settings": "Manage your account and preferences.",
};

export default function DashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const getPageTitle = () => {
    const path = pathname.split("/").pop();
    if (!path || path === "dashboard") return "Dashboard";
    return path.charAt(0).toUpperCase() + path.slice(1);
  };
  
  const subtitle = pageSubtitles[pathname] || "Manage your Smart Library.";

  return (
    <div className="relative min-h-screen text-white bg-black">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Particles
          particleColors={['#B1FF00', '#7FFF00']}
          particleCount={1000}
          particleSpread={10}
          speed={0.2}
          particleBaseSize={200}
          alphaParticles={true}
          mouseInteraction={false}
        />
      </div>

      <div className="relative z-10 grid min-h-screen w-full transition-all duration-300"
           style={{ gridTemplateColumns: isCollapsed ? '80px 1fr' : '280px 1fr' }}
      >
        
        <div className="border-r border-gray-800 bg-black/50 backdrop-blur-md flex flex-col">
          <div className="flex h-[60px] items-center border-b border-gray-800 px-6">
            <a href="/" className="flex items-center gap-2 font-semibold">
              
              {/* --- THIS IS THE FIX for Logo / Shuffle Title --- */}
              {isCollapsed ? (
                // When collapsed, show the logo
                <Image src="/next.svg" alt="Logo" width={24} height={24} />
              ) : (
                // When expanded, show the animated Shuffle text
                <Shuffle
                  text="Smart Library"
                  shuffleDirection="right"
                  duration={0.5}
                  ease="power3.out"
                  triggerOnHover={true}
                  respectReducedMotion={true}
                />
              )}

            </a>
          </div>
          <div className="flex-1 p-4">
            <DashboardNav isCollapsed={isCollapsed} />
          </div>
          <div className="mt-auto p-4 border-t border-gray-800">
            <Button variant="ghost" className="w-full justify-center" onClick={() => setIsCollapsed(!isCollapsed)}>
              {isCollapsed ? <PanelRightClose className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col">
          <header className="flex h-[60px] items-center justify-between gap-4 border-b border-gray-800 bg-black/50 backdrop-blur-md px-6">
            
            {/* --- THIS IS THE FIX for Title and Subtitle --- */}
            <div>
              <SplitText
                text={getPageTitle()}
                className="text-2xl font-semibold text-white"
                from={{ opacity: 0, y: 20 }}
                to={{ opacity: 1, y: 0 }}
                stagger={0.05}
              />
              <p className="text-xs text-gray-400">{subtitle}</p>
            </div>

            <UserButton afterSignOutUrl="/" />
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}