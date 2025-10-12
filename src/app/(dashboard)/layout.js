// src/app/(dashboard)/layout.js
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { DashboardNav } from "@/components/DashboardNav";
import Particles from "@/blocks/Backgrounds/Particles/Particles";
import Shuffle from "@/blocks/TextAnimations/Shuffle/Shuffle";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelRightClose, Menu } from "lucide-react"; // <-- Import Menu icon
import { usePathname } from "next/navigation";
import Link from "next/link";

import ClientOnly from "@/components/utils/ClientOnly";

export default function DashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative min-h-screen text-white bg-black">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Particles
          particleColors={['#B1FF00', '#008000']}
          particleCount={1000}
          particleSpread={10}
          speed={0.2}
          particleBaseSize={200}
          alphaParticles={true}
        />
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 grid min-h-screen w-full transition-all duration-300"
           style={{ gridTemplateColumns: isCollapsed ? '80px 1fr' : '280px 1fr' }}
      >
        
        {/* Sidebar */}
        <div className="border-r border-gray-800 bg-black/50 backdrop-blur-md flex flex-col">
          <div className="flex h-[60px] items-center border-b border-gray-800 px-6">
            {/* --- FIX #3: Sidebar now has a "Menu" title --- */}
            <div className="flex items-center gap-2 font-semibold text-white">
              <Menu className="h-6 w-6" />
              {!isCollapsed && <span className="text-lg">Menu</span>}
            </div>
          </div>
          <div className="flex-1 p-4">
            <DashboardNav isCollapsed={isCollapsed} />
          </div>
          <div className="mt-auto p-4 border-t border-gray-800">
            {/* --- FIX #1: Button now has a green accent --- */}
            <Button 
              variant="outline"
              className="w-full justify-center bg-transparent text-gray-400 hover:bg-gray-800 hover:text-white border-green-500/50 hover:border-green-500" // <-- Green border classes
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <PanelRightClose className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col h-screen">
          <header className="flex h-[60px] items-center justify-between gap-4 border-b border-gray-800 bg-black/50 backdrop-blur-md px-6 flex-shrink-0">
            {/* --- FIX #2: Main title is now in the header --- */}
            <div>
              <Link href="/">
                <Shuffle text="Smart Library Assistant" className="text-2xl font-semibold text-green-500" triggerOnHover={true} />
              </Link>
            </div>
            <ClientOnly>
              <UserButton afterSignOutUrl="/" />
            </ClientOnly>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}