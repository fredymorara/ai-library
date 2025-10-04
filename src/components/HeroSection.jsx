// src/components/HeroSection.jsx
import React from "react";
import { Button } from "@/components/ui/button"; // Import the Button

export const HeroSection = () => {
  return (
    // Make the section background transparent
    <section className="bg-transparent lg:grid lg:h-screen lg:place-content-center">
      <div className="mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 md:grid md:grid-cols-2 md:items-center md:gap-4 lg:px-8 lg:py-32">
        <div className="max-w-prose text-left">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Understand your Library,
            <strong className="text-indigo-400"> unlock its knowledge.</strong>
          </h1>

          <p className="mt-4 text-base text-pretty text-gray-300 sm:text-lg/relaxed">
            Our AI-powered assistant helps you discover the exact book you need, even when you don't know what to look for. Go beyond simple keyword search.
          </p>

          {/* --- UPGRADED BUTTONS --- */}
          <div className="mt-4 flex gap-4 sm:mt-6">
            <Button size="lg">Get Started</Button>
            <Button size="lg" variant="secondary">Learn More</Button>
          </div>
        </div>

        {/* Your SVG Illustration - no changes needed, it will inherit the white text color */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 768"
          className="mx-auto hidden max-w-md text-white md:block"
        >
         {/* ... your full SVG code here ... */}
         <g fill="none" fillRule="evenodd"><g fill="#FF5678"><path d="M555.886..."/></g><g fill="currentColor"><path d="..."/></g></g>
        </svg>
      </div>
    </section>
  );
};
