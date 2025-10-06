// src/components/DashboardNav.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // For icon tooltips
import { LayoutDashboard, FileUp, Code, Settings } from "lucide-react";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Onboarding", href: "/onboarding", icon: FileUp },
  { name: "Snippets", href: "/snippets", icon: Code },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const DashboardNav = ({ isCollapsed }) => {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <nav className="grid items-start gap-2">
        {links.map((link) => (
          isCollapsed ? (
            <Tooltip key={link.name} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link href={link.href}>
                  <Button
                    variant={pathname === link.href ? "default" : "ghost"}
                    className="w-full justify-center"
                    size="icon"
                  >
                    <link.icon className="h-4 w-4" />
                    <span className="sr-only">{link.name}</span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{link.name}</TooltipContent>
            </Tooltip>
          ) : (
            <Link key={link.name} href={link.href}>
              <Button
                variant={pathname === link.href ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <link.icon className="mr-2 h-4 w-4" />
                {link.name}
              </Button>
            </Link>
          )
        ))}
      </nav>
    </TooltipProvider>
  );
};