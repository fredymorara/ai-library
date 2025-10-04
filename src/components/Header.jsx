// src/components/Header.jsx
import React from "react";
import { Button } from "@/components/ui/button"; // Import the Button

export const Header = () => {
  return (
    // Set background to transparent so the DarkVeil shows through
    <header className="bg-transparent">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <a className="block text-teal-300" href="#">
          <span className="sr-only">Home</span>
          <svg className="h-8" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="..." fill="currentColor" /> {/* Truncated SVG path for readability */}
          </svg>
        </a>

        <div className="flex flex-1 items-center justify-end md:justify-between">
          <nav aria-label="Global" className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm">
              {/* Navigation Links */}
              <li><a className="text-gray-300 transition hover:text-white/75" href="#">About</a></li>
              <li><a className="text-gray-300 transition hover:text-white/75" href="#">Services</a></li>
              <li><a className="text-gray-300 transition hover:text-white/75" href="#">Projects</a></li>
              <li><a className="text-gray-300 transition hover:text-white/75" href="#">Blog</a></li>
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            {/* --- UPGRADED BUTTONS --- */}
            <div className="sm:flex sm:gap-4">
              <Button variant="ghost">Login</Button>
              <Button>Register</Button>
            </div>

            <button className="block rounded-sm bg-gray-800 p-2.5 text-gray-300 transition hover:text-white/75 md:hidden">
              <span className="sr-only">Toggle menu</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};