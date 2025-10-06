// src/components/app-sidebar.jsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LayoutDashboard, FileUp, Code, Settings, PanelLeftClose, PanelRightClose } from "lucide-react";
import Shuffle from "@/blocks/TextAnimations/Shuffle/Shuffle";
import Image from "next/image";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Onboarding", href: "/onboarding", icon: FileUp },
  { name: "Snippets", href: "/snippets", icon: Code },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside 
      className="border-r border-gray-800 bg-black/50 backdrop-blur-md flex flex-col transition-all duration-300"
      style={{ width: isCollapsed ? '80px' : '280px' }}
    >
      <div className="flex h-[60px] items-center border-b border-gray-800 px-6">
        <a href="/" className="flex items-center gap-2 font-semibold text-white">
          {isCollapsed ? (
            <Image src="/next.svg" alt="Logo" width={24} height={24} />
          ) : (
            <Shuffle
              text="Smart Library"
              className="text-lg font-bold"
              shuffleDirection="right"
              duration={0.5}
              triggerOnHover={true}
            />
          )}
        </a>
      </div>
      
      <TooltipProvider>
        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return isCollapsed ? (
              <Tooltip key={link.name} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link href={link.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className="w-full justify-center"
                      size="icon"
                    >
                      <link.icon className="h-5 w-5" />
                      <span className="sr-only">{link.name}</span>
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{link.name}</TooltipContent>
              </Tooltip>
            ) : (
              <Link key={link.name} href={link.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.name}
                </Button>
              </Link>
            );
          })}
        </nav>
      </TooltipProvider>

      <div className="mt-auto p-4 border-t border-gray-800">
        <Button variant="outline" className="w-full justify-center" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <PanelRightClose className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
    </aside>
  );
}