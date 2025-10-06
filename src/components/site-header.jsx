// src/components/site-header.jsx
"use client";
import { UserButton } from "@clerk/nextjs";
import SplitText from "@/blocks/TextAnimations/SplitText/SplitText";

// This component now accepts a title and subtitle
export function SiteHeader({ title, subtitle }) {
  return (
    <header className="flex h-[60px] items-center justify-between gap-4 border-b border-gray-800 bg-black/50 backdrop-blur-md px-6">
      <div>
        <SplitText
          text={title}
          className="text-2xl font-semibold text-white"
          from={{ opacity: 0, y: 20 }}
          to={{ opacity: 1, y: 0 }}
          stagger={0.05}
        />
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
      <UserButton afterSignOutUrl="/" />
    </header>
  );
}