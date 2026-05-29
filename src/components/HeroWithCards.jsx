// src/components/HeroWithCards.jsx
"use client";

import React from "react";
import CardSwap, { Card } from "@/blocks/Components/CardSwap/CardSwap";
import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { ChatCard1, ChatCard2, ChatCard3 } from "@/components/ChatStyledCards";

const CustomCTA = React.forwardRef(({ onClick, children, ...rest }, ref) => (
  <button 
    ref={ref}
    onClick={onClick}
    {...rest}
    className="group relative flex items-center gap-3 rounded-full bg-white pl-6 pr-2 py-2 text-sm font-semibold text-black transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] hover:bg-white/90"
  >
    {children}
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
      <ArrowRight weight="bold" className="h-4 w-4 text-black" />
    </div>
  </button>
));
CustomCTA.displayName = "CustomCTA";

const GetStartedButton = React.forwardRef((props, ref) => {
  const { afterSignUpUrl, ...rest } = props;
  return <CustomCTA ref={ref} {...rest}>Start Building</CustomCTA>;
});
GetStartedButton.displayName = "GetStartedButton";

export const HeroWithCards = () => {
  const router = useRouter();

  return (
    <section className="relative z-10 flex min-h-[100dvh] w-full items-center bg-transparent">
      <div className="mx-auto w-full max-w-screen-xl px-4 py-24 sm:px-6 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-40">
        
        <motion.div 
          initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
          className="max-w-prose mx-auto text-center lg:mx-0 lg:text-left"
        >
          <span className="mb-6 inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-[0.2em] text-white/70 uppercase backdrop-blur-md">
            The Prototype
          </span>
          
          <h1 className="text-5xl font-bold tracking-tighter text-white sm:text-6xl lg:text-7xl leading-[1.05]">
            Go Beyond <br className="hidden lg:block" /> the Catalogue.
          </h1>
          
          <p className="mt-6 mx-auto max-w-[50ch] text-lg leading-relaxed text-white/60 lg:mx-0">
            Our AI-powered assistant understands concepts, topics, and vague ideas to find the exact book you're looking for in the library's collection.
          </p>
          
          <div className="mt-10 flex justify-center gap-4 lg:justify-start">
            <SignedIn>
              <CustomCTA onClick={() => router.push("/dashboard")}>
                Go to Dashboard
              </CustomCTA>
            </SignedIn>
            <SignedOut>
              <SignUpButton mode="modal" afterSignUpUrl="/dashboard">
                <GetStartedButton />
              </SignUpButton>
            </SignedOut>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 32, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1], delay: 0.2 }}
          className="relative mt-16 h-[480px] w-full hidden lg:block"
        >
          <CardSwap
            cardDistance={80}
            verticalDistance={100}
            delay={3000}
            pauseOnHover={false}
            skewAmount={7}
            height={440}
            width={360}
            easing="linear"
          >
            <Card>
              <ChatCard1 />
            </Card>
            <Card>
              <ChatCard2 />
            </Card>
            <Card>
              <ChatCard3 />
            </Card>
          </CardSwap>
        </motion.div>

      </div>
    </section>
  );
};