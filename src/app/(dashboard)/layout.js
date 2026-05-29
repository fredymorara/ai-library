// src/app/(dashboard)/layout.js
"use client";

import React, { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { DashboardNav } from "@/components/DashboardNav";
import Particles from "@/blocks/Backgrounds/Particles/Particles";
import Shuffle from "@/blocks/TextAnimations/Shuffle/Shuffle";
import { SidebarSimple, List } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import ClientOnly from "@/components/utils/ClientOnly";

export default function DashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative min-h-screen text-white bg-black">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={1000}
          particleSpread={10}
          speed={0.2}
          particleBaseSize={150}
          alphaParticles={true}
        />
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 grid min-h-screen w-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
           style={{ gridTemplateColumns: isCollapsed ? '80px 1fr' : '260px 1fr' }}
      >
        
        {/* Sidebar */}
        <div className="border-r border-white/5 bg-[#050505]/80 backdrop-blur-xl flex flex-col shadow-[1px_0_10px_rgba(0,0,0,0.5)] z-20">
          <div className="flex h-16 items-center border-b border-white/5 px-6">
            <div className="flex items-center gap-3 text-white/80">
              <List weight="bold" className="h-5 w-5" />
              {!isCollapsed && <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Menu</span>}
            </div>
          </div>
          <div className="flex-1 p-3">
            <DashboardNav isCollapsed={isCollapsed} />
          </div>
          <div className="mt-auto p-4 border-t border-white/5">
            <button 
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2 text-sm text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <SidebarSimple weight="duotone" className="h-[18px] w-[18px]" />
              {!isCollapsed && <span>Collapse</span>}
              <span className="sr-only">Toggle sidebar</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col h-screen">
          <header className="flex h-16 items-center justify-between gap-4 border-b border-white/5 bg-transparent px-8 flex-shrink-0">
            <div>
              <Link href="/">
                <Shuffle text="Smart Library Assistant" className="text-xl font-bold tracking-tight text-white/90" triggerOnHover={true} />
              </Link>
            </div>
            <ClientOnly>
              <div className="rounded-full border border-white/10 p-1 bg-white/5">
                <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "h-8 w-8" } }} />
              </div>
            </ClientOnly>
          </header>
          <main className="flex-1 p-6 sm:p-8 lg:p-12 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}