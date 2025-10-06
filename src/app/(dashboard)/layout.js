// src/app/(dashboard)/layout.js
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { DashboardNav } from "@/components/DashboardNav";
import Particles from "@/blocks/Backgrounds/Particles/Particles";
import Shuffle from "@/blocks/TextAnimations/Shuffle/Shuffle";
import SplitText from "@/blocks/TextAnimations/SplitText/SplitText";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelRightClose } from "lucide-react";
import { usePathname } from "next/navigation";
// --- FOOTER IS REMOVED FROM HERE ---

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
  
  const title = getPageTitle();
  const subtitle = pageSubtitles[pathname] || "Manage your Smart Library.";

  return (
    <div className="relative min-h-screen text-white bg-black">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Particles
          particleColors={['#B1FF00', '#98FF98']}
          particleCount={2000} particleSpread={10} speed={0.2}
          particleBaseSize={100} alphaParticles={true}
          moveParticlesOnHover={true}
        />
      </div>

      <div className="relative z-10 grid min-h-screen w-full transition-all duration-300"
           style={{ gridTemplateColumns: isCollapsed ? '80px 1fr' : '280px 1fr' }}
      >
        <div className="border-r border-gray-800 bg-black/50 backdrop-blur-md flex flex-col">
          <div className="flex h-[60px] items-center border-b border-gray-800 px-6">
            <a href="/" className="flex items-center gap-2 font-semibold">
              {isCollapsed ? (
                <Image src="/next.svg" alt="Logo" width={24} height={24} />
              ) : (
                <Shuffle text="Smart Library" className="text-lg font-bold text-white" />
              )}
            </a>
          </div>
          <div className="flex-1 p-4">
            <DashboardNav isCollapsed={isCollapsed} />
          </div>
          <div className="mt-auto p-4 border-t border-gray-800">
            <Button 
              variant="outline"
              className="w-full justify-center bg-transparent text-gray-400 hover:bg-gray-800 hover:text-white"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <PanelRightClose className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </div>
        </div>

        {/* --- THIS IS THE CORRECTED LAYOUT --- */}
        {/* It no longer contains the footer */}
        <div className="flex flex-col h-screen">
          <header className="flex h-[60px] items-center justify-between gap-4 border-b border-gray-800 bg-black/50 backdrop-blur-md px-6 flex-shrink-0">
            <div>
              <SplitText text={title} className="text-2xl font-semibold text-white" />
              {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
            </div>
            <UserButton afterSignOutUrl="/" />
          </header>
          {/* This main area is the single scrollable container for the page content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}