// src/components/DashboardNav.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SquaresFour, FileArrowUp, Code, Gear, Key, BookOpenText } from "@phosphor-icons/react";

const links = [
  { name: "Overview", href: "/dashboard", icon: SquaresFour },
  { name: "Onboarding", href: "/onboarding", icon: FileArrowUp },
  { name: "Snippets", href: "/snippets", icon: Code },
  { name: "API Keys", href: "/settings/api-keys", icon: Key },
  { name: "Documentation", href: "/docs", icon: BookOpenText },
  { name: "Settings", href: "/settings", icon: Gear },
];

export const DashboardNav = ({ isCollapsed }) => {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <nav className="grid items-start gap-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const activeClass = isActive 
            ? "bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]" 
            : "text-white/50 hover:bg-white/5 hover:text-white";
          
          return isCollapsed ? (
            <Tooltip key={link.name} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link href={link.href} className={cn("flex h-10 w-full items-center justify-center rounded-lg transition-all duration-300", activeClass)}>
                  <link.icon weight={isActive ? "fill" : "regular"} className="h-[18px] w-[18px]" />
                  <span className="sr-only">{link.name}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-gray-900 border-white/10 text-white">{link.name}</TooltipContent>
            </Tooltip>
          ) : (
            <Link key={link.name} href={link.href} className={cn("flex h-10 w-full items-center justify-start rounded-lg px-3 text-sm font-medium transition-all duration-300", activeClass)}>
              <link.icon weight={isActive ? "fill" : "regular"} className="mr-3 h-[18px] w-[18px]" />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </TooltipProvider>
  );
};