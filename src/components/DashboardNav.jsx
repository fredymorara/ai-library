// src/components/DashboardNav.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SquaresFour, FileArrowUp, Code, Gear, Key, BookOpenText } from "@phosphor-icons/react";
import { motion } from "motion/react";

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
      <nav className="grid items-start gap-1.5">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const activeClass = isActive 
            ? "text-white" 
            : "text-white/40 hover:text-white/90";
          
          return isCollapsed ? (
            <Tooltip key={link.name} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link href={link.href} className={cn("group relative flex h-11 w-full items-center justify-center rounded-xl transition-colors duration-300 outline-none", activeClass)}>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBackgroundCollapsed"
                      className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/15 to-white/5 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <link.icon weight={isActive ? "fill" : "duotone"} className={cn("relative z-10 h-5 w-5 transition-transform duration-300", !isActive && "group-hover:scale-110")} />
                  <span className="sr-only">{link.name}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-[#0a0a0a] border-white/10 text-white/80 font-medium tracking-wide rounded-lg ml-2">{link.name}</TooltipContent>
            </Tooltip>
          ) : (
            <Link key={link.name} href={link.href} className={cn("group relative flex h-[42px] w-full items-center justify-start rounded-xl px-3.5 text-[13px] font-semibold tracking-wide transition-colors duration-300 outline-none", activeClass)}>
              {isActive && (
                <motion.div
                  layoutId="activeNavBackground"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/15 to-white/5 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.03)]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative flex items-center z-10 w-full">
                <link.icon weight={isActive ? "fill" : "duotone"} className={cn("mr-3 h-[18px] w-[18px] transition-transform duration-300", !isActive && "group-hover:-rotate-3 group-hover:scale-110")} />
                {link.name}
              </div>
            </Link>
          );
        })}
      </nav>
    </TooltipProvider>
  );
};