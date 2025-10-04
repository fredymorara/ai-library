// src/components/HeroWithCards.jsx
import React from "react";
import { Button } from "@/components/ui/button"; // For our upgraded buttons
import CardSwap, { Card } from "@/blocks/Components/CardSwap/CardSwap"; // The animated cards

export const HeroWithCards = () => {
  return (
    // The main container for the hero section, transparent to show the background
    <section className="bg-transparent lg:grid lg:h-screen lg:place-content-center">
      
      {/* This div creates the two-column layout on medium screens and up */}
      <div className="mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 md:grid md:grid-cols-2 md:items-center md:gap-16 lg:px-8 lg:py-32">
        
        {/* --- Column 1: Your Text Content --- */}
        <div className="max-w-prose text-left">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Go Beyond the Catalogue.
            <strong className="text-indigo-400"> Find the Book You Mean.</strong>
          </h1>

          <p className="mt-4 text-base text-pretty text-gray-300 sm:text-lg/relaxed">
            Our AI-powered assistant understands concepts, topics, and vague ideas to find the exact book you're looking for in the library's collection.
          </p>

          {/* Using the cleaner, more consistent Shadcn Buttons */}
          <div className="mt-8 flex gap-4">
            <Button size="lg">Get Started</Button>
            <Button size="lg" variant="secondary">See a Demo</Button>
          </div>
        </div>

        {/* --- Column 2: The Animated Card Showcase --- */}
        {/* The `mt-12 md:mt-0` adds space on mobile but removes it on desktop */}
        <div className="relative h-[400px] w-full mt-12 md:mt-0">
          <CardSwap
            cardDistance={100}
            verticalDistance={150}
            delay={3000}
            pauseOnHover={true}
            skewAmount={7}
            height={400}
            width={550}
            easing="linear"
          >
            {/* Card 1: Vague Topic Search */}
            <Card>
              <div className="p-4">
                <div className="mb-3 rounded-lg bg-indigo-600 p-3 text-white">
                  <p className="font-semibold">User:</p>
                  <p>Do you have any books about the military tactics of ancient Rome?</p>
                </div>
                <div className="rounded-lg bg-gray-700 p-3 text-gray-200">
                  <p className="font-semibold">Assistant:</p>
                  <p>Absolutely! You might be interested in "The Roman Army: The Greatest War Machine of the Ancient World. This books really dives deep into "........................</p>
                </div>
              </div>
            </Card>

            {/* Card 2: Conceptual Search */}
            <Card>
               <div className="p-4">
                <div className="mb-3 rounded-lg bg-indigo-600 p-3 text-white">
                  <p className="font-semibold">User:</p>
                  <p>I need a good introduction to artificial intelligence.</p>
                </div>
                <div className="rounded-lg bg-gray-700 p-3 text-gray-200">
                  <p className="font-semibold">Assistant:</p>
                  <p>Of course. A great starting point in our library is "Artificial Intelligence: A Modern Approach" It is written by ............................</p>
                </div>
              </div>
            </Card>

            {/* Card 3: Author Search */}
            <Card>
              <div className="p-4">
                <div className="mb-3 rounded-lg bg-indigo-600 p-3 text-white">
                  <p className="font-semibold">User:</p>
                  <p>Show me books by Bill Bryson.</p>
                </div>
                <div className="rounded-lg bg-gray-700 p-3 text-gray-200">
                  <p className="font-semibold">Assistant:</p>
                  <p>We have "A Short History of Nearly Everything" by Bill Bryson. It's a fantastic book about the history of science. Another one you can look at .................................</p>
                </div>
              </div>
            </Card>
          </CardSwap>
        </div>
      </div>
    </section>
  );
};