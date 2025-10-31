// src/components/HeroWithCards.jsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import CardSwap, { Card } from "@/blocks/Components/CardSwap/CardSwap";
import { useAuth, SignUpButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChatCard1, ChatCard2, ChatCard3 } from "@/components/ChatStyledCards";

const GetStartedButton = React.forwardRef((props, ref) => {
  const { afterSignUpUrl, ...rest } = props;
  return <Button ref={ref} size="lg" {...rest}>Get Started</Button>;
});
GetStartedButton.displayName = "GetStartedButton";

export const HeroWithCards = () => {
  const { userId } = useAuth();
  const router = useRouter();

  return (
    <section className="bg-transparent lg:grid lg:h-screen lg:place-content-center">
      <div className="mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 md:grid md:grid-cols-2 md:items-center md:gap-16 lg:px-8 lg:py-32">
        <div className="max-w-prose text-left">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Go Beyond the Catalogue.
            <strong className="text-green-500"> Find the Book You Mean.</strong>
          </h1>
          <p className="mt-4 text-base text-pretty text-gray-300 sm:text-lg/relaxed">
            Our AI-powered assistant understands concepts, topics, and vague ideas to find the exact book you're looking for in the library's collection.
          </p>
          <div className="mt-8 flex gap-4">
            {userId ? (
              <Button size="lg" onClick={() => router.push("/dashboard")}>
                Go to Dashboard
              </Button>
            ) : (
              <SignUpButton mode="modal" afterSignUpUrl="/dashboard">
                <GetStartedButton />
              </SignUpButton>
            )}
            <Link href="https://smartlibraryassistant.streamlit.app/" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="secondary">
                See a Demo
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative h-[400px] w-full mt-12 md:mt-0">
          <CardSwap
            cardDistance={100}
            verticalDistance={150}
            delay={3000}
            pauseOnHover={false}
            skewAmount={7}
            height={500}
            width={450}
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
        </div>
      </div>
    </section>
  );
};